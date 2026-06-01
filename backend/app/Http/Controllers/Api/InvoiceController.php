<?php

namespace App\Http\Controllers\Api;

use App\Enums\InvoiceStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use App\Models\Order;
use App\Services\Business\InvoiceService;
use App\Support\ActiveBusiness;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class InvoiceController extends Controller
{
    public function __construct(private readonly InvoiceService $invoices) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        $query = Invoice::forBusiness($business->id)->with(['customer', 'order']);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return InvoiceResource::collection(
            $query->latest('issue_date')->latest('id')->paginate(20)->withQueryString(),
        );
    }

    public function fromOrder(Request $request, Order $order): InvoiceResource
    {
        $business = ActiveBusiness::forUserOrFail($request->user());
        abort_unless($order->business_id === $business->id, 404, 'Order tidak ditemukan.');

        $invoice = $this->invoices->fromOrder($order);

        return new InvoiceResource($invoice->load(['customer', 'order']));
    }

    public function show(Request $request, Invoice $invoice): InvoiceResource
    {
        $this->authorizeInvoice($request, $invoice);

        return new InvoiceResource($invoice->load(['customer', 'order']));
    }

    public function pdf(Request $request, Invoice $invoice): Response
    {
        $this->authorizeInvoice($request, $invoice);

        $pdf = $this->invoices->renderPdf($invoice);

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "inline; filename=\"{$invoice->invoice_number}.pdf\"",
        ]);
    }

    public function text(Request $request, Invoice $invoice): JsonResponse
    {
        $this->authorizeInvoice($request, $invoice);

        return response()->json(['text' => $this->invoices->toText($invoice)]);
    }

    public function updateStatus(Request $request, Invoice $invoice): InvoiceResource
    {
        $this->authorizeInvoice($request, $invoice);

        $validated = $request->validate([
            'status' => ['required', Rule::enum(InvoiceStatus::class)],
        ]);

        $invoice->update($validated);

        return new InvoiceResource($invoice->load(['customer', 'order']));
    }

    private function authorizeInvoice(Request $request, Invoice $invoice): void
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        abort_unless($invoice->business_id === $business->id, 404, 'Invoice tidak ditemukan.');
    }
}
