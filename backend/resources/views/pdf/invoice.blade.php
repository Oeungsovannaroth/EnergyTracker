<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #0f172a; }
        .header { display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 18px; }
        .muted { color: #64748b; }
        table { width: 100%; border-collapse: collapse; margin-top: 28px; }
        th, td { border-bottom: 1px solid #e2e8f0; padding: 10px; text-align: left; }
        .total { margin-top: 24px; text-align: right; font-size: 20px; font-weight: 700; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>SolarOps Invoice</h1>
            <p class="muted">{{ $invoice->invoice_number }}</p>
        </div>
        <div>
            <strong>{{ $invoice->customer }}</strong><br>
            <span class="muted">{{ $invoice->email }}</span>
        </div>
    </div>
    <table>
        <thead>
        <tr><th>Description</th><th>Qty</th><th>Unit</th><th>Total</th></tr>
        </thead>
        <tbody>
        @foreach ($invoice->items as $item)
            <tr>
                <td>{{ $item['description'] }}</td>
                <td>{{ $item['quantity'] }}</td>
                <td>${{ number_format($item['unit_price'], 2) }}</td>
                <td>${{ number_format($item['total'], 2) }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
    <p class="total">Total: ${{ number_format($invoice->total, 2) }}</p>
</body>
</html>
