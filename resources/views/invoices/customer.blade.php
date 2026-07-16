<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{ $invoice->number }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #1a1a1a; font-size: 13px; line-height: 1.5; }
        .invoice-container { max-width: 800px; margin: 0 auto; padding: 40px; }

        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
        .company-info h1 { font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
        .company-info p { font-size: 12px; color: #6b7280; }
        .invoice-badge { text-align: right; }
        .invoice-badge h2 { font-size: 28px; font-weight: 800; color: #7c3aed; letter-spacing: -0.5px; }
        .invoice-badge .number { font-size: 13px; color: #6b7280; margin-top: 2px; }

        .meta-grid { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .meta-box { width: 48%; }
        .meta-box h3 { font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .meta-box p { font-size: 13px; color: #374151; }
        .meta-box .highlight { font-weight: 600; color: #1a1a1a; }

        .status-badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-paid { background: #d1fae5; color: #065f46; }
        .status-partial { background: #dbeafe; color: #1e40af; }
        .status-cancelled { background: #fee2e2; color: #991b1b; }

        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        thead th { background: #f9fafb; padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.3px; border-bottom: 1px solid #e5e7eb; }
        thead th:last-child, thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
        tbody td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
        tbody td:last-child, tbody td:nth-child(3), tbody td:nth-child(4) { text-align: right; }
        tbody tr:hover { background: #fafafa; }
        .item-type { font-size: 10px; color: #9ca3af; font-weight: 500; }
        .item-meta { font-size: 11px; color: #9ca3af; margin-top: 2px; }

        .summary { display: flex; justify-content: flex-end; margin-bottom: 30px; }
        .summary-table { width: 300px; }
        .summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
        .summary-row.total { border-top: 2px solid #1a1a1a; margin-top: 6px; padding-top: 10px; font-weight: 700; font-size: 16px; }

        .payment-info { background: #f9fafb; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; border: 1px solid #e5e7eb; }
        .payment-info h3 { font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 8px; }
        .payment-detail { display: flex; gap: 30px; }
        .payment-detail div { font-size: 12px; }
        .payment-detail .label { color: #9ca3af; }
        .payment-detail .value { font-weight: 600; color: #1a1a1a; }

        .notes { margin-top: 20px; padding: 12px 16px; background: #fffbeb; border-radius: 8px; border: 1px solid #fde68a; }
        .notes h4 { font-size: 11px; font-weight: 600; color: #92400e; margin-bottom: 4px; }
        .notes p { font-size: 12px; color: #78350f; }

        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 11px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="company-info">
                <h1>{{ $tenant->name ?? 'Nama Bisnis' }}</h1>
                <p>{{ $tenant->getInternal('address') ?? '' }}</p>
                <p>{{ $tenant->getInternal('phone') ?? '' }}</p>
                <p>{{ $tenant->getInternal('email') ?? '' }}</p>
            </div>
            <div class="invoice-badge">
                <h2>INVOICE</h2>
                <p class="number">{{ $invoice->number }}</p>
            </div>
        </div>

        <div class="meta-grid">
            <div class="meta-box">
                <h3>Tagih Kepada</h3>
                <p class="highlight">{{ $invoice->customer->name ?? '-' }}</p>
                <p>{{ $invoice->customer->email ?? '' }}</p>
                <p>{{ $invoice->customer->phone ?? '' }}</p>
                <p>{{ $invoice->customer->address ?? '' }}</p>
            </div>
            <div class="meta-box" style="text-align: right;">
                <h3>Detail Invoice</h3>
                <p>Tanggal: <span class="highlight">{{ $invoice->created_at->format('d/m/Y') }}</span></p>
                <p>Jatuh Tempo: <span class="highlight">{{ $invoice->due_date?->format('d/m/Y') ?? '-' }}</span></p>
                <p>Status: <span class="status-badge status-{{ $invoice->status }}">{{ $invoice->status === 'paid' ? 'LUNAS' : ($invoice->status === 'pending' ? 'BELUM BAYAR' : strtoupper($invoice->status)) }}</span></p>
                @if($invoice->booking)
                <p style="margin-top: 4px;">Booking: <span class="highlight">{{ $invoice->booking->booking_code }}</span></p>
                @endif
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 5%">No</th>
                    <th style="width: 50%">Deskripsi</th>
                    <th style="width: 10%">Qty</th>
                    <th style="width: 17%">Harga Satuan</th>
                    <th style="width: 18%">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>
                        <span class="item-type">{{ $item->type_label }}</span>
                        <div>{{ $item->name }}</div>
                        @if($item->metadata && isset($item->metadata['staff_name']))
                        <div class="item-meta">Staff: {{ $item->metadata['staff_name'] }}</div>
                        @endif
                    </td>
                    <td>{{ $item->quantity }}</td>
                    <td>Rp {{ number_format($item->unit_price, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($item->total_price, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="summary">
            <div class="summary-table">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>Rp {{ number_format($invoice->subtotal, 0, ',', '.') }}</span>
                </div>
                @if($invoice->discount_amount > 0)
                <div class="summary-row">
                    <span>Diskon</span>
                    <span>- Rp {{ number_format($invoice->discount_amount, 0, ',', '.') }}</span>
                </div>
                @endif
                @if($invoice->tax_amount > 0)
                <div class="summary-row">
                    <span>Pajak ({{ $invoice->tax_rate }}%)</span>
                    <span>Rp {{ number_format($invoice->tax_amount, 0, ',', '.') }}</span>
                </div>
                @endif
                <div class="summary-row total">
                    <span>Total</span>
                    <span>Rp {{ number_format($invoice->total_amount, 0, ',', '.') }}</span>
                </div>
            </div>
        </div>

        @if($invoice->status === 'paid' || $invoice->status === 'partial')
        <div class="payment-info">
            <h3>Informasi Pembayaran</h3>
            <div class="payment-detail">
                <div>
                    <span class="label">Metode: </span>
                    <span class="value">{{ $invoice->payment_method_label ?? '-' }}</span>
                </div>
                <div>
                    <span class="label">Dibayar: </span>
                    <span class="value">Rp {{ number_format($invoice->paid_amount, 0, ',', '.') }}</span>
                </div>
                <div>
                    <span class="label">Tanggal: </span>
                    <span class="value">{{ $invoice->paid_at?->format('d/m/Y H:i') ?? '-' }}</span>
                </div>
            </div>
        </div>
        @endif

        @if($invoice->notes)
        <div class="notes">
            <h4>Catatan</h4>
            <p>{{ $invoice->notes }}</p>
        </div>
        @endif

        <div class="footer">
            <p>Terima kasih atas kunjungan Anda.</p>
            <p>{{ $tenant->name ?? '' }} &mdash; Invoice ini dibuat secara otomatis oleh sistem.</p>
        </div>
    </div>
</body>
</html>
