<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Reminder Booking</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 24px;">
    <table align="center" width="600" style="background: #fff; border-radius: 8px; overflow: hidden;">
        <tr>
            <td style="padding: 24px; background: #2563eb; color: #fff; text-align: center;">
                <h1 style="margin: 0;">Booking Reminder</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 24px;">
                <p>Halo <strong>{{ $customer_name }}</strong>,</p>
                <p>Ini adalah pengingat bahwa Anda memiliki jadwal booking:</p>

                <table style="width: 100%; margin: 16px 0;">
                    <tr>
                        <td style="padding: 8px; color: #666;">Kode Booking</td>
                        <td style="padding: 8px;"><strong>{{ $booking_code }}</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; color: #666;">Tanggal</td>
                        <td style="padding: 8px;"><strong>{{ \Carbon\Carbon::parse($start_time)->format('d M Y') }}</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; color: #666;">Waktu</td>
                        <td style="padding: 8px;"><strong>{{ \Carbon\Carbon::parse($start_time)->format('H:i') }} - {{ \Carbon\Carbon::parse($end_time)->format('H:i') }}</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; color: #666;">Durasi</td>
                        <td style="padding: 8px;"><strong>{{ $duration_minutes }} menit</strong></td>
                    </tr>
                    @if ($branch_name)
                    <tr>
                        <td style="padding: 8px; color: #666;">Cabang</td>
                        <td style="padding: 8px;"><strong>{{ $branch_name }}</strong></td>
                    </tr>
                    @endif
                    @if ($staff_name)
                    <tr>
                        <td style="padding: 8px; color: #666;">Staff</td>
                        <td style="padding: 8px;"><strong>{{ $staff_name }}</strong></td>
                    </tr>
                    @endif
                </table>

                <p>Harap datang tepat waktu. Terima kasih!</p>
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
