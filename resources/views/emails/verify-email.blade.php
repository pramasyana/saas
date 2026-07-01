<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Verifikasi Email</title>
</head>
<body style="margin:0;padding:0;background-color:#f2f0ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f0ef;padding:32px 16px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)">

{{-- Header --}}
<tr><td style="background:linear-gradient(135deg,#4f46e5,#0ea5e9);padding:40px 32px 32px;text-align:center">
<table cellpadding="0" cellspacing="0" style="margin:0 auto 20px">
<tr><td style="background-color:rgba(255,255,255,0.15);border-radius:50%;width:64px;height:64px;text-align:center;vertical-align:middle">
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:18px auto">
<rect x="2" y="4" width="20" height="16" rx="2"/>
<path d="M22 7l-10 7L2 7"/>
</svg>
</td></tr>
</table>
<h1 style="margin:0 0 4px;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px">Verifikasi Email</h1>
<p style="margin:0;font-size:14px;color:rgba(255,255,255,0.85)">Konfirmasi alamat email Anda</p>
</td></tr>

{{-- Body --}}
<tr><td style="padding:36px 32px 28px">

{{-- Hello --}}
<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#292524">Halo <strong style="color:#1c1917">{{ $name }}</strong>,</p>

{{-- Context Message --}}
@if ($context === 'new_account')
<p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#57534e">
Akun baru telah dibuat untuk Anda dengan alamat email <strong style="color:#292524">{{ $email }}</strong>.
Silakan verifikasi alamat email Anda dengan mengklik tombol di bawah ini.
</p>
@else
<p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#57534e">
Anda menerima email ini karena ada permintaan verifikasi ulang untuk alamat <strong style="color:#292524">{{ $email }}</strong>.
Silakan verifikasi dengan mengklik tombol di bawah ini.
</p>
@endif

{{-- CTA Button --}}
<table cellpadding="0" cellspacing="0" style="margin:0 0 28px">
<tr><td style="background-color:#4f46e5;border-radius:8px;padding:14px 36px;text-align:center">
<a href="{{ $verificationUrl }}" style="color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;display:inline-block;letter-spacing:0.2px">Verifikasi Email</a>
</td></tr>
</table>

{{-- Info Box --}}
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffbeb;border-radius:8px;border-left:3px solid #f59e0b;margin:0 0 28px">
<tr><td style="padding:14px 16px">
<p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#92400e">Perhatian</p>
<ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.6;color:#a16207">
<li>Tautan ini berlaku selama <strong>1 jam</strong>.</li>
<li>Jangan bagikan tautan ini kepada siapa pun.</li>
<li>Jika Anda tidak merasa melakukan ini, abaikan email ini. Akun Anda tidak akan aktif sampai email diverifikasi.</li>
</ul>
</td></tr>
</table>

{{-- Fallback Link --}}
<p style="margin:0 0 0;font-size:13px;line-height:1.5;color:#a8a29e">
Tombol tidak berfungsi? Salin dan buka URL berikut di browser Anda:<br>
<a href="{{ $verificationUrl }}" style="color:#4f46e5;font-size:13px;word-break:break-all;text-decoration:underline">{{ $verificationUrl }}</a>
</p>
</td></tr>

{{-- Footer --}}
<tr><td style="background-color:#fafaf9;padding:20px 32px;border-top:1px solid #e7e5e4">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td>
<p style="margin:0 0 4px;font-size:12px;color:#a8a29e;line-height:1.5">
Email ini dikirim ke <strong style="color:#78716c">{{ $email }}</strong> atas permintaan verifikasi akun.
</p>
<p style="margin:0;font-size:12px;color:#a8a29e;line-height:1.5">
Jika Anda memiliki pertanyaan, hubungi tim dukungan kami.
</p>
</td></tr>
</table>
</td></tr>

</table>
{{-- Foot Note --}}
<p style="margin:12px 0 0;font-size:11px;color:#a8a29e;text-align:center">&copy; {{ date('Y') }} {{ config('app.name') }}. Seluruh hak cipta dilindungi.</p>
</td></tr>
</table>
</body>
</html>
