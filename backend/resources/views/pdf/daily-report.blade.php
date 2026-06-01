<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <style>
        * { font-family: DejaVu Sans, sans-serif; }
        body { color: #0f172a; font-size: 12px; margin: 0; padding: 32px; }
        h1 { color: #0f766e; font-size: 20px; margin: 0; }
        .muted { color: #64748b; }
        .summary { background: #f0fdfa; border-radius: 8px; padding: 12px; margin: 16px 0; }
        .metrics { width: 100%; border-collapse: collapse; margin-top: 8px; }
        .metrics td { padding: 8px; border: 1px solid #e2e8f0; }
        .metrics .label { color: #64748b; font-size: 10px; text-transform: uppercase; }
        .metrics .value { font-size: 16px; font-weight: bold; }
        table.list { width: 100%; border-collapse: collapse; margin-top: 8px; }
        table.list th { text-align: left; border-bottom: 2px solid #e2e8f0; padding: 6px; color: #64748b; }
        table.list td { padding: 6px; border-bottom: 1px solid #f1f5f9; }
        h2 { font-size: 14px; margin-top: 24px; }
        .right { text-align: right; }
    </style>
</head>
<body>
    <h1>{{ $business->name }}</h1>
    <p class="muted">Laporan Harian — {{ $report->report_date->format('d M Y') }}</p>

    <div class="summary">{{ $summary }}</div>

    <table class="metrics">
        <tr>
            <td><div class="label">Total Order</div><div class="value">{{ $report->total_orders }}</div></td>
            <td><div class="label">Omzet</div><div class="value">Rp{{ number_format((float) $report->total_revenue, 0, ',', '.') }}</div></td>
            <td><div class="label">Belum Bayar</div><div class="value">Rp{{ number_format((float) $report->total_unpaid, 0, ',', '.') }}</div></td>
        </tr>
        <tr>
            <td><div class="label">Order Selesai</div><div class="value">{{ $report->total_completed }}</div></td>
            <td><div class="label">Customer Baru</div><div class="value">{{ $report->new_customers }}</div></td>
            <td></td>
        </tr>
    </table>

    <h2>Produk Terlaris</h2>
    @if(count($report->top_products_json ?? []) > 0)
        <table class="list">
            <thead><tr><th>Produk</th><th class="right">Qty</th><th class="right">Omzet</th></tr></thead>
            <tbody>
                @foreach($report->top_products_json as $p)
                    <tr>
                        <td>{{ $p['name'] }}</td>
                        <td class="right">{{ $p['quantity'] }}</td>
                        <td class="right">Rp{{ number_format((float) $p['revenue'], 0, ',', '.') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p class="muted">Belum ada penjualan hari ini.</p>
    @endif

    <h2>Stok Rendah</h2>
    @if(count($report->low_stock_json ?? []) > 0)
        <table class="list">
            <thead><tr><th>Produk</th><th class="right">Stok</th><th class="right">Minimum</th></tr></thead>
            <tbody>
                @foreach($report->low_stock_json as $s)
                    <tr>
                        <td>{{ $s['name'] }}</td>
                        <td class="right">{{ $s['stock'] }}</td>
                        <td class="right">{{ $s['minimum_stock'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p class="muted">Semua stok aman.</p>
    @endif
</body>
</html>
