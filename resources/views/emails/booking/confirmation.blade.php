<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="background:linear-gradient(135deg,#7C3AED,#A78BFA);padding:32px 40px;text-align:center;">
                            <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">Booking Confirmed</h1>
                            <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px;">Terima kasih telah melakukan booking</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px 40px;">
                            <div style="text-align:center;margin-bottom:24px;">
                                <div style="font-size:32px;font-weight:800;color:#7C3AED;letter-spacing:2px;">{{ $booking_code }}</div>
                                <p style="color:#6b7280;font-size:13px;margin:4px 0 0;">Kode Booking</p>
                            </div>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border-radius:8px;padding:20px;">
                                <tr>
                                    <td style="padding:8px 16px;width:40%;color:#6b7280;font-size:14px;">Nama</td>
                                    <td style="padding:8px 16px;color:#111827;font-size:14px;font-weight:600;">{{ $customer_name }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 16px;color:#6b7280;font-size:14px;">Layanan</td>
                                    <td style="padding:8px 16px;color:#111827;font-size:14px;font-weight:600;">
                                        @foreach($services as $service)
                                            {{ $service['name'] }}@if(!$loop->last), @endif
                                        @endforeach
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 16px;color:#6b7280;font-size:14px;">Staff</td>
                                    <td style="padding:8px 16px;color:#111827;font-size:14px;font-weight:600;">{{ $staff_name ?? 'Akan diatur' }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 16px;color:#6b7280;font-size:14px;">Cabang</td>
                                    <td style="padding:8px 16px;color:#111827;font-size:14px;font-weight:600;">{{ $branch_name ?? '-' }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 16px;color:#6b7280;font-size:14px;">Waktu</td>
                                    <td style="padding:8px 16px;color:#111827;font-size:14px;font-weight:600;">
                                        {{ \Carbon\Carbon::parse($start_time)->format('d M Y H:i') }} - {{ \Carbon\Carbon::parse($end_time)->format('H:i') }}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 16px;color:#6b7280;font-size:14px;">Durasi</td>
                                    <td style="padding:8px 16px;color:#111827;font-size:14px;font-weight:600;">{{ $duration_minutes }} menit</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 16px;color:#6b7280;font-size:14px;">Status</td>
                                    <td style="padding:8px 16px;">
                                        <span style="display:inline-block;padding:2px 12px;border-radius:12px;font-size:13px;font-weight:600;background-color:#fef3c7;color:#92400e;">
                                            {{ ucfirst($status) }}
                                        </span>
                                    </td>
                                </tr>
                            </table>

                            <p style="text-align:center;color:#6b7280;font-size:13px;margin:24px 0 0;line-height:1.5;">
                                Booking Anda sedang menunggu konfirmasi dari kami.<br>
                                Kami akan mengirimkan pemberitahuan jika status booking berubah.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
                            <p style="color:#9ca3af;font-size:12px;margin:0;">&copy; {{ date('Y') }} BookCRM. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
