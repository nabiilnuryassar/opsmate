<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array{0: User, 1: Business}
     */
    private function userWithBusiness(): array
    {
        $user = User::factory()->create();
        $business = Business::create(['owner_id' => $user->id, 'name' => 'Toko A']);
        $business->members()->attach($user->id, ['role' => 'owner']);

        return [$user, $business];
    }

    private function orderFor(Business $business, float $total = 100000): Order
    {
        $customer = Customer::factory()->for($business)->create();
        $order = Order::factory()->for($business)->create([
            'customer_id' => $customer->id,
            'subtotal' => $total,
            'total' => $total,
        ]);
        $product = Product::factory()->for($business)->create(['name' => 'Kopi', 'price' => $total]);
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => 'Kopi',
            'quantity' => 1,
            'price' => $total,
            'total' => $total,
        ]);

        return $order;
    }

    public function test_generate_invoice_from_order(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $order = $this->orderFor($business, 150000);

        $this->actingAs($user)
            ->postJson("/api/invoices/from-order/{$order->id}")
            ->assertCreated()
            ->assertJsonPath('data.invoice_number', 'INV-0001')
            ->assertJsonPath('data.total', 150000)
            ->assertJsonPath('data.status', 'draft');

        $this->assertDatabaseHas('invoices', [
            'order_id' => $order->id,
            'business_id' => $business->id,
            'total' => 150000,
        ]);
    }

    public function test_generate_is_idempotent_per_order(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $order = $this->orderFor($business);

        $this->actingAs($user)->postJson("/api/invoices/from-order/{$order->id}")->assertCreated();
        $this->actingAs($user)->postJson("/api/invoices/from-order/{$order->id}")->assertSuccessful();

        // Only one invoice exists for the order.
        $this->assertSame(1, Invoice::where('order_id', $order->id)->count());
    }

    public function test_invoice_number_increments_per_business(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $o1 = $this->orderFor($business);
        $o2 = $this->orderFor($business);

        $this->actingAs($user)
            ->postJson("/api/invoices/from-order/{$o1->id}")
            ->assertJsonPath('data.invoice_number', 'INV-0001');
        $this->actingAs($user)
            ->postJson("/api/invoices/from-order/{$o2->id}")
            ->assertJsonPath('data.invoice_number', 'INV-0002');
    }

    public function test_cannot_invoice_another_businesses_order(): void
    {
        [$user] = $this->userWithBusiness();
        [, $otherBusiness] = $this->userWithBusiness();
        $foreignOrder = $this->orderFor($otherBusiness);

        $this->actingAs($user)
            ->postJson("/api/invoices/from-order/{$foreignOrder->id}")
            ->assertNotFound();
    }

    public function test_index_filters_by_status_and_scopes_business(): void
    {
        [$user, $business] = $this->userWithBusiness();
        [, $otherBusiness] = $this->userWithBusiness();
        Invoice::factory()->for($business)->create(['status' => 'draft']);
        Invoice::factory()->for($business)->create(['status' => 'paid']);
        Invoice::factory()->for($otherBusiness)->create(['status' => 'draft']);

        $this->actingAs($user)
            ->getJson('/api/invoices?status=draft')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', 'draft');
    }

    public function test_update_status(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $invoice = Invoice::factory()->for($business)->create(['status' => 'draft']);

        $this->actingAs($user)
            ->patchJson("/api/invoices/{$invoice->id}/status", ['status' => 'sent'])
            ->assertOk()
            ->assertJsonPath('data.status', 'sent');
    }

    public function test_pdf_endpoint_returns_pdf(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $order = $this->orderFor($business);
        $invoice = $this->actingAs($user)
            ->postJson("/api/invoices/from-order/{$order->id}")
            ->json('data.id');

        $response = $this->actingAs($user)->get("/api/invoices/{$invoice}/pdf");

        $response->assertOk();
        $this->assertSame('application/pdf', $response->headers->get('Content-Type'));
        $this->assertStringStartsWith('%PDF', $response->getContent());
    }

    public function test_text_endpoint_returns_whatsapp_text(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $order = $this->orderFor($business, 250000);
        $invoiceId = $this->actingAs($user)
            ->postJson("/api/invoices/from-order/{$order->id}")
            ->json('data.id');

        $this->actingAs($user)
            ->getJson("/api/invoices/{$invoiceId}/text")
            ->assertOk()
            ->assertJsonStructure(['text']);
    }

    public function test_cannot_view_another_businesses_invoice(): void
    {
        [$user] = $this->userWithBusiness();
        [, $otherBusiness] = $this->userWithBusiness();
        $foreign = Invoice::factory()->for($otherBusiness)->create();

        $this->actingAs($user)->getJson("/api/invoices/{$foreign->id}")->assertNotFound();
        $this->actingAs($user)->get("/api/invoices/{$foreign->id}/pdf")->assertNotFound();
    }
}
