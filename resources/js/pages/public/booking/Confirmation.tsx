import { Head } from '@inertiajs/react';
import { usePublicBooking } from '@/features/booking/hooks/usePublicBooking';
import PublicLayout from '@/layouts/PublicLayout';

interface BookingData {
    id: string;
    booking_code: string;
    status: string;
    customer_name: string;
    staff_name: string | null;
    branch_name: string | null;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    source: string;
    notes: string | null;
    services: { name: string; price: number; duration: number; quantity: number }[];
}

interface PageProps {
    booking: BookingData;
    tenant?: {
        name: string;
        logo: string | null;
    };
}

function formatDateTime(dateStr: string): string {
    const d = new Date(dateStr);

    return d.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Menunggu Konfirmasi', color: '#92400e', bg: '#fef3c7' },
    confirmed: { label: 'Telah Dikonfirmasi', color: '#065f46', bg: '#d1fae5' },
    in_progress: { label: 'Sedang Diproses', color: '#1e40af', bg: '#dbeafe' },
    completed: { label: 'Selesai', color: '#065f46', bg: '#d1fae5' },
    cancelled: { label: 'Dibatalkan', color: '#991b1b', bg: '#fee2e2' },
    no_show: { label: 'Tidak Hadir', color: '#6b7280', bg: '#f3f4f6' },
};

export default function ConfirmationPage({ booking, tenant }: PageProps) {
    const { data: pollData } = usePublicBooking(booking.booking_code);
    const currentBooking = pollData?.data ?? booking;
    const statusInfo = statusLabels[currentBooking.status] ?? { label: currentBooking.status, color: '#6b7280', bg: '#f3f4f6' };
    const serviceNames = currentBooking.services.map((s) => s.name).join(', ');

    return (
        <PublicLayout tenantName={tenant?.name}>
            <Head title="Booking Confirmed" />

            <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
                    {/* Icon */}
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-50">
                        <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-neutral-900">Booking Berhasil!</h1>
                    <p className="mt-2 text-neutral-500">Terima kasih, booking Anda telah tercatat.</p>

                    {/* Booking Code */}
                    <div className="mx-auto mt-6 inline-block rounded-xl bg-neutral-50 px-8 py-4">
                        <div className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">Kode Booking</div>
                        <div className="mt-1 text-3xl font-extrabold tracking-wide text-primary">
                            {currentBooking.booking_code}
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
                        style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
                    >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: statusInfo.color }} />
                        {statusInfo.label}
                    </div>

                    {/* Detail */}
                    <div className="mt-8 rounded-xl border border-border bg-neutral-50 p-6 text-left">
                        <table className="w-full text-sm">
                            <tbody>
                                <tr>
                                    <td className="w-1/3 py-2 pr-4 text-neutral-500">Layanan</td>
                                    <td className="py-2 font-medium text-neutral-900">{serviceNames}</td>
                                </tr>
                                {currentBooking.staff_name && (
                                    <tr>
                                        <td className="py-2 pr-4 text-neutral-500">Staff</td>
                                        <td className="py-2 font-medium text-neutral-900">{currentBooking.staff_name}</td>
                                    </tr>
                                )}
                                {currentBooking.branch_name && (
                                    <tr>
                                        <td className="py-2 pr-4 text-neutral-500">Cabang</td>
                                        <td className="py-2 font-medium text-neutral-900">{currentBooking.branch_name}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td className="py-2 pr-4 text-neutral-500">Waktu</td>
                                    <td className="py-2 font-medium text-neutral-900">{formatDateTime(currentBooking.start_time)}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4 text-neutral-500">Durasi</td>
                                    <td className="py-2 font-medium text-neutral-900">{currentBooking.duration_minutes} menit</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-6 text-sm text-neutral-400">
                        Halaman ini akan otomatis memperbarui status booking setiap 30 detik.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
