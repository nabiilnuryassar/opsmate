<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <style>
        * { font-family: DejaVu Sans, sans-serif; }
        body { color: #0f172a; font-size: 12px; margin: 0; padding: 32px; }
        .row { width: 100%; }
        .row:after { content: ''; display: table; clear: both; }
        .col { float: left; width: 50%; }
        .right { text-align: right; }
        h1 { color: #0f766e; font-size: 22px; margin: 0; }
        .muted { color: #64748b; }
        .label { color: #94a3b8; font-size: 10px; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-top: 24px; }
        th { text-align: left; border-bottom: 2px solid #e2e8f0; padding: 8px 4px; color: #64748b; font-size: 11px; }
        td { padding: 8px 4px; border-bottom: 1px solid #f1f5f9; }
        .totals { margin-top: 16px; width: 50%; float: right; }
        .totals td { border: none; padding: 4px; }
        .total-row td { border-top: 2px solid #e2e8f0; font-weight: bold; font-size: 14px; color: #0f766e; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #ccfbf1; color: #115e59; font-size: 11px; }
    </style>
</head>
<body>
    <div class="row">
        <div class="col">
            <h1>{{ $invoice->business->name }}</h1>
            @if($invoice->business->address)
                <p class="muted">{{ $invoice->business->address }}</p>
            @endif
            @if($invoice->business->phone)
                <p class="muted">{{ $invoice->business->phone }}</p>
            @endif
        </div>
        <div class="col right">
            <p class="label">Invoice</p>
            <p style="font-size: 16px; font-weight: bold;">{{ $invoice->invoice_number }}</p>
            <p class="muted">Tanggal: {{ $invoice->issue_date->format('d M Y') }}</p>
            @if($invoice->due_date)
                <p class="muted">Jatuh tempo: {{ $invoice->due_date->format('d M Y') }}</p>
            @endif
            <span class="badge">{{ $invoice->status->label() }}</span>
        </div>
    </div>

    <div class="row" style="margin-top: 24px;">
        <div class="col">
            <p class="label">Tagihan untuk</p>
            <p style="font-weight: bold;">{{ $invoice->customer->name }}</p>
            @if($invoice->customer->phone)
                <p class="muted">{{ $invoice->customer->phone }}</p>
            @endif
            @if($invoice->customer->address)
                <p class="muted">{{ $invoice->customer->address }}</p>
            @endif
        </div>
        <div class="col right">
            <p class="label">No. Order</p>
            <p>{{ $invoice->order->order_number }}</p>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Produk</th>
                <th class="right">Qty</th>
                <th class="right">Harga</th>
                <th class="right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->order->items as $item)
                <tr>
                    <td>{{ $item->product_name }}</td>
                    <td class="right">{{ $item->quantity }}</td>
                    <td class="right">Rp{{ number_format((float) $item->price, 0, ',', '.') }}</td>
                    <td class="right">Rp{{ number_format((float) $item->total, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals">
        <tr>
            <td class="muted">Subtotal</td>
            <td class="right">Rp{{ number_format((float) $invoice->order->subtotal, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td class="muted">Diskon</td>
            <td class="right">- Rp{{ number_format((float) $invoice->order->discount, 0, ',', '.') }}</td>
        </tr>
        <tr class="total-row">
            <td>Total</td>
            <td class="right">Rp{{ number_format((float) $invoice->total, 0, ',', '.') }}</td>
        </tr>
    </table>

    <div style="clear: both; margin-top: 48px; text-align: center;" class="muted">
        <p>Terima kasih atas kepercayaan Anda.</p>
    </div>
</body>
</html>
