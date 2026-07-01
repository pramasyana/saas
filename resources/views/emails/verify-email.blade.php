<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f4;padding:40px 20px">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
<tr><td style="background:linear-gradient(135deg,#635bff,#0ea5e9);padding:32px;text-align:center">
<h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff">{{ $appName }}</h1>
</td></tr> 
<tr><td style="padding:32px">
<h2 style="margin:0 0 8px;font-size:18px;font-weight:600;color:#1c1917">Verifikasi Alamat Email</h2>
<p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#57534e">
Halo <strong>{{ $name }}</strong>,
</p>
<p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#57534e">
Terima kasih telah mendaftar di {{ $appName }}. Silakan verifikasi alamat email Anda dengan mengklik tombol di bawah ini.
</p>
<table cellpadding="0" cellspacing="0" style="margin:0 0 20px">
<tr><td style="background-color:#635bff;border-radius:10px;padding:12px 28px">
<a href="{{ $verificationUrl }}" style="color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;display:inline-block">Verifikasi Email</a>
</td></tr>
</table>
<p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#57534e">
Jika Anda tidak membuat akun ini, abaikan email ini.
</p>
<hr style="border:none;border-top:1px solid #e7e5e4;margin:24px 0">
<p style="margin:0;font-size:12px;color:#a8a29e">
Jika tombol di atas tidak berfungsi, salin dan buka URL berikut di browser Anda:<br>
<a href="{{ $verificationUrl }}" style="color:#635bff;font-size:12px;word-break:break-all">{{ $verificationUrl }}</a>
</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
