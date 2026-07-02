import PublicLayout from '@/layouts/PublicLayout';

export default function BookingDisabled() {
    return (
        <PublicLayout>
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                    <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-neutral-900">Booking Tidak Tersedia</h1>
                <p className="mt-2 text-sm text-neutral-500">
                    Maaf, booking online sedang tidak aktif untuk saat ini.
                </p>
                <p className="mt-1 text-sm text-neutral-400">
                    Silakan hubungi kami melalui kontak yang tersedia.
                </p>
            </div>
        </PublicLayout>
    );
}
