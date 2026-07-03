<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>404 - Halaman Tidak Ditemukan</title>
    @vite(['resources/css/app.css'])
    <style>
        body {
            font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
    </style>
</head>
<body class="min-h-screen bg-gradient-to-b from-white to-[#F5F3FF] flex items-center justify-center p-6">
    <div class="w-full max-w-lg text-center">
        <!-- 404 Illustration -->
        <div class="relative mx-auto mb-8 flex items-center justify-center">
            <div class="absolute inset-0 flex items-center justify-center opacity-[0.04]">
                <svg class="h-72 w-72" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="200" cy="200" r="180" stroke="#7C3AED" stroke-width="2" stroke-dasharray="8 6"/>
                    <circle cx="200" cy="200" r="120" stroke="#7C3AED" stroke-width="1.5" stroke-dasharray="4 8"/>
                    <circle cx="200" cy="200" r="60" stroke="#7C3AED" stroke-width="1" stroke-dasharray="2 6"/>
                </svg>
            </div>
            <div class="relative">
                <div class="text-[140px] sm:text-[180px] font-bold leading-none tracking-tighter select-none"
                     style="background: linear-gradient(135deg, #7C3AED 0%, #A78BFA 40%, #C4B5FD 70%, #7C3AED 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    404
                </div>
            </div>
        </div>

        <!-- Floating icon -->
        <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-[0_8px_32px_-4px_rgba(124,58,237,0.12)] ring-1 ring-black/5"
             style="animation: float 3s ease-in-out infinite;">
            <svg class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
        </div>

        <!-- Text -->
        <h1 class="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            Halaman Tidak Ditemukan
        </h1>
        <p class="text-neutral-500 text-sm sm:text-base leading-relaxed mb-8 max-w-sm mx-auto">
            Halaman yang Anda cari tidak tersedia atau telah dipindahkan. Periksa kembali URL atau kembali ke beranda.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="{{ url('/') }}"
               class="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-[0.97]">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Kembali ke Beranda
            </a>
            <button onclick="window.history.back()"
                    class="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 hover:shadow-md active:scale-[0.97]">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Kembali Sebelumnya
            </button>
        </div>

        <!-- Footer -->
        <div class="mt-12 text-xs text-neutral-400">
            &copy; {{ date('Y') }} {{ config('app.name', 'Laravel') }}. All rights reserved.
        </div>
    </div>
</body>
</html>
