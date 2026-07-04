import { Head } from '@inertiajs/react';
import { usePublicBooking } from '@/features/booking/hooks/usePublicBooking';
import PublicLayout from '@/layouts/PublicLayout';
import { motion } from 'framer-motion';

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
    colors: {
        primary?: string;
        secondary?: string;
        accent?: string;
        background?: string;
        text?: string;
        text_muted?: string;
    } | null;
    tenant?: {
        name: string;
        logo: string | null;
    };
}

const defaultColors = {
    primary: '#7C3AED',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#FAFAFA',
    text: '#171717',
    text_muted: '#737373',
};

function formatDateTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

function formatPrice(price: number): string {
    return price.toLocaleString('id-ID');
}

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Menunggu Konfirmasi', color: '#92400e', bg: '#fef3c7' },
    confirmed: { label: 'Telah Dikonfirmasi', color: '#065f46', bg: '#d1fae5' },
    in_progress: { label: 'Sedang Diproses', color: '#1e40af', bg: '#dbeafe' },
    completed: { label: 'Selesai', color: '#065f46', bg: '#d1fae5' },
    cancelled: { label: 'Dibatalkan', color: '#991b1b', bg: '#fee2e2' },
    no_show: { label: 'Tidak Hadir', color: '#6b7280', bg: '#f3f4f6' },
};

export default function ConfirmationPage({ booking, colors: colorsProp, tenant }: PageProps) {
    const c = { ...defaultColors, ...colorsProp };
    const { data: pollData } = usePublicBooking(booking.booking_code);
    const currentBooking = pollData?.data ?? booking;
    const statusInfo = statusLabels[currentBooking.status] ?? { label: currentBooking.status, color: '#6b7280', bg: '#f3f4f6' };
    const serviceNames = currentBooking.services.map((s) => s.name).join(', ');

    return (
        <PublicLayout tenantName={tenant?.name} colors={c} solidHeader>
            <Head title="Booking Berhasil" />

            <div className="mx-auto max-w-2xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="rounded-2xl border bg-white p-8 text-center shadow-sm"
                    style={{ borderColor: c.primary + '10' }}
                >
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                        className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
                        style={{ backgroundColor: c.primary + '10' }}
                    >
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: c.primary }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </motion.div>

                    <h1 className="text-2xl font-bold" style={{ color: c.text }}>Booking Berhasil!</h1>
                    <p className="mt-2 text-sm" style={{ color: c.text_muted }}>Terima kasih, booking Anda telah tercatat.</p>

                    {/* Booking Code */}
                    <div className="mx-auto mt-6 inline-block rounded-xl px-8 py-4" style={{ backgroundColor: c.primary + '06' }}>
                        <p className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: c.text_muted }}>Kode Booking</p>
                        <p className="mt-1 text-3xl font-extrabold tracking-wide" style={{ color: c.primary }}>
                            {currentBooking.booking_code}
                        </p>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
                        style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
                    >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: statusInfo.color }} />
                        {statusInfo.label}
                    </div>

                    {/* Detail */}
                    <div className="mt-8 rounded-xl p-6 text-left" style={{ backgroundColor: c.primary + '04' }}>
                        <table className="w-full text-sm">
                            <tbody>
                                {[
                                    { label: 'Layanan', value: serviceNames },
                                    ...(currentBooking.staff_name ? [{ label: 'Staff', value: currentBooking.staff_name }] : []),
                                    ...(currentBooking.branch_name ? [{ label: 'Cabang', value: currentBooking.branch_name }] : []),
                                    { label: 'Waktu', value: formatDateTime(currentBooking.start_time) },
                                    { label: 'Durasi', value: `${currentBooking.duration_minutes} menit` },
                                ].map((row) => (
                                    <tr key={row.label}>
                                        <td className="w-1/3 py-2.5 pr-4 text-sm" style={{ color: c.text_muted }}>{row.label}</td>
                                        <td className="py-2.5 text-sm font-medium" style={{ color: c.text }}>{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-6 text-xs" style={{ color: c.text_muted }}>
                        Halaman ini akan otomatis memperbarui status booking setiap 30 detik.
                    </p>
                </motion.div>
            </div>
        </PublicLayout>
    );
}
