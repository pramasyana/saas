<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Slot Tersedia</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 24px;">
    <table align="center" width="600" style="background: #fff; border-radius: 8px; overflow: hidden;">
        <tr>
            <td style="padding: 24px; background: #16a34a; color: #fff; text-align: center;">
                <h1 style="margin: 0;">Slot Tersedia!</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 24px;">
                <p>Halo <strong>{{ $customer_name }}</strong>,</p>
                <p>Ada slot yang tersedia untuk layanan yang Anda tunggu:</p>

                <table style="width: 100%; margin: 16px 0;">
                    @if ($service_name)
                    <tr>
                        <td style="padding: 8px; color: #666;">Layanan</td>
                        <td style="padding: 8px;"><strong>{{ $service_name }}</strong></td>
                    </tr>
                    @endif
                    @if ($preferred_date)
                    <tr>
                        <td style="padding: 8px; color: #666;">Tanggal</td>
                        <td style="padding: 8px;"><strong>{{ \Carbon\Carbon::parse($preferred_date)->format('d M Y') }}</strong></td>
                    </tr>
                    @endif
                    @if ($preferred_time)
                    <tr>
                        <td style="padding: 8px; color: #666;">Waktu</td>
                        <td style="padding: 8px;"><strong>{{ \Carbon\Carbon::parse($preferred_time)->format('H:i') }}</strong></td>
                    </tr>
                    @endif
                </table>

                <p>Silakan hubungi kami untuk melakukan booking. Terima kasih!</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 16px 24px; background: #f9f9f9; color: #999; text-align: center; font-size: 12px;">
                &copy; {{ date('Y') }} Booking System
            </td>
        </tr>
    </table>
</body>
</html>
