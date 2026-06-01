<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\Business\OrderService;
use App\Services\Business\ReminderService;
use App\Services\Business\ReportService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::updateOrCreate(
            ['email' => 'rina@opsmate.test'],
            ['name' => 'Rina', 'password' => Hash::make('password')],
        );

        $business = Business::firstOrCreate(
            ['owner_id' => $owner->id, 'name' => 'Rina Catering'],
            [
                'category' => 'makanan_minuman',
                'phone' => '08123456789',
                'city' => 'Bandung',
                'description' => 'Catering rumahan untuk acara kantor dan keluarga.',
                'currency' => 'IDR',
            ],
        );
        $business->members()->syncWithoutDetaching([$owner->id => ['role' => 'owner']]);

        $customers = $this->seedCustomers($business);
        $products = $this->seedProducts($business);
        $this->seedOrders($business, $owner, $customers, $products);

        // Derive reminders + today's report from the seeded data.
        app(ReminderService::class)->generateForBusiness($business->fresh());
        app(ReportService::class)->generate($business->fresh());
    }

    /**
     * @return array<string, Customer>
     */
    private function seedCustomers(Business $business): array
    {
        $defs = [
            ['name' => 'Sinta Permata', 'phone' => '081200000001', 'customer_type' => 'vip'],
            ['name' => 'Budi Santoso', 'phone' => '081200000002', 'customer_type' => 'regular'],
            ['name' => 'Maya Lestari', 'phone' => '081200000003', 'customer_type' => 'regular'],
            ['name' => 'Arif Rahman', 'phone' => '081200000004', 'customer_type' => 'inactive', 'last_order_at' => now()->subDays(45)],
            ['name' => 'Dinda Putri', 'phone' => '081200000005', 'customer_type' => 'new'],
        ];

        $customers = [];
        foreach ($defs as $def) {
            $customers[$def['name']] = Customer::updateOrCreate(
                ['business_id' => $business->id, 'name' => $def['name']],
                $def,
            );
        }

        return $customers;
    }

    /**
     * @return array<string, Product>
     */
    private function seedProducts(Business $business): array
    {
        $defs = [
            ['name' => 'Nasi Box Ayam', 'price' => 25000, 'cost_price' => 15000, 'stock' => 40, 'minimum_stock' => 10, 'unit' => 'box'],
            ['name' => 'Paket Hemat', 'price' => 18000, 'cost_price' => 12000, 'stock' => 60, 'minimum_stock' => 15, 'unit' => 'box'],
            ['name' => 'Brownies Coklat', 'price' => 45000, 'cost_price' => 30000, 'stock' => 2, 'minimum_stock' => 5, 'unit' => 'loyang'],
            ['name' => 'Snack Box', 'price' => 15000, 'cost_price' => 9000, 'stock' => 30, 'minimum_stock' => 10, 'unit' => 'box'],
            ['name' => 'Es Teh Manis', 'price' => 5000, 'cost_price' => 2000, 'stock' => 100, 'minimum_stock' => 20, 'unit' => 'cup'],
        ];

        $products = [];
        foreach ($defs as $def) {
            $products[$def['name']] = Product::updateOrCreate(
                ['business_id' => $business->id, 'name' => $def['name']],
                array_merge($def, ['type' => 'product', 'category' => 'makanan', 'is_active' => true]),
            );
        }

        return $products;
    }

    /**
     * @param  array<string, Customer>  $customers
     * @param  array<string, Product>  $products
     */
    private function seedOrders(Business $business, User $owner, array $customers, array $products): void
    {
        // Skip if this business already has orders (idempotent seed).
        if (Order::forBusiness($business->id)->exists()) {
            return;
        }
        $service = app(OrderService::class);

        $plan = [
            ['customer' => 'Sinta Permata', 'payment_status' => 'unpaid', 'status' => 'processing', 'items' => [['Nasi Box Ayam', 10]]],
            ['customer' => 'Budi Santoso', 'payment_status' => 'paid', 'status' => 'completed', 'items' => [['Paket Hemat', 5], ['Es Teh Manis', 5]]],
            ['customer' => 'Maya Lestari', 'payment_status' => 'partial', 'status' => 'new', 'items' => [['Snack Box', 8]]],
            ['customer' => 'Dinda Putri', 'payment_status' => 'paid', 'status' => 'delivered', 'items' => [['Brownies Coklat', 1]]],
            ['customer' => 'Sinta Permata', 'payment_status' => 'unpaid', 'status' => 'new', 'items' => [['Nasi Box Ayam', 3], ['Es Teh Manis', 3]]],
        ];

        foreach ($plan as $row) {
            $items = [];
            foreach ($row['items'] as [$productName, $qty]) {
                $items[] = ['product_id' => $products[$productName]->id, 'quantity' => $qty];
            }

            $service->create($business, $owner, [
                'customer_id' => $customers[$row['customer']]->id,
                'status' => $row['status'],
                'payment_status' => $row['payment_status'],
                'items' => $items,
            ]);
        }
    }
}
