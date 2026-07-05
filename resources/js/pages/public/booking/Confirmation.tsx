import { Head } from '@inertiajs/react';
import { usePublicBooking } from '@/features/booking/hooks/usePublicBooking';
import PublicLayout from '@/layouts/PublicLayout';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';

interface ServiceAddon {
    name: string;
    price: number;
    quantity: number;
}

interface BookingServiceItem {
    name: string;
    price: number;
    duration: number;
    quantity: number;
    addons?: ServiceAddon[];
}

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
    total_guests: number;
    guest_details: string[] | null;
    is_group?: boolean;
    max_participants?: number;
    services: BookingServiceItem[];
    rooms?: { id: string; name: string; color: string | null }[];
    participants?: { name: string; phone?: string; email?: string; status?: string }[];
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

function formatTime(d: string) {
    return new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function formatDateLong(d: string) {
    return new Date(d).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
    pending: { label: 'Menunggu Konfirmasi', color: '#92400e', bg: '#fef3c7', icon: 'hourglass' },
    confirmed: { label: 'Telah Dikonfirmasi', color: '#065f46', bg: '#d1fae5', icon: 'check_circle' },
    in_progress: { label: 'Sedang Diproses', color: '#1e40af', bg: '#dbeafe', icon: 'progress_activity' },
    completed: { label: 'Selesai', color: '#065f46', bg: '#d1fae5', icon: 'verified' },
    cancelled: { label: 'Dibatalkan', color: '#991b1b', bg: '#fee2e2', icon: 'cancel' },
    no_show: { label: 'Tidak Hadir', color: '#6b7280', bg: '#f3f4f6', icon: 'person_off' },
};

function InfoValue({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border p-4 transition-colors hover:shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
            <span className="material-symbols-rounded mt-0.5 text-lg shrink-0" style={{ color: 'var(--c-primary, #7C3AED)' }}>{icon}</span>
            <div className="min-w-0">
                <p className="text-xs font-medium" style={{ color: 'var(--c-muted, #737373)' }}>{label}</p>
                <p className="mt-0.5 text-sm font-semibold" style={{ color: 'var(--c-text, #171717)' }}>{value}</p>
            </div>
        </div>
    );
}

export default function ConfirmationPage({ booking, colors: colorsProp, tenant }: PageProps) {
    const c = { ...defaultColors, ...colorsProp };
    const { data: pollData } = usePublicBooking(booking.booking_code);
    const currentBooking = pollData?.data ?? booking;
    const statusInfo = statusConfig[currentBooking.status] ?? { label: currentBooking.status, color: '#6b7280', bg: '#f3f4f6', icon: 'info' };
    const totalGuests = Math.max(1, currentBooking.total_guests ?? 1);
    const totalPrice = currentBooking.services.reduce((sum, svc) => {
        const svcTotal = Number(svc.price) * Number(svc.quantity) * totalGuests;
        const addonTotal = (svc.addons || []).reduce((aSum, a) => aSum + Number(a.price) * Number(a.quantity), 0);
        return sum + svcTotal + addonTotal;
    }, 0);

    return (
        <PublicLayout tenantName={tenant?.name} colors={c} solidHeader>
            <Head title="Booking Berhasil">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
            </Head>

            <style>{`
                .material-symbols-rounded {
                    font-family: 'Material Symbols Rounded';
                    font-weight: normal;
                    font-style: normal;
                    font-size: 24px;
                    line-height: 1;
                    letter-spacing: normal;
                    text-transform: none;
                    display: inline-block;
                    white-space: nowrap;
                    word-wrap: normal;
                    direction: ltr;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    text-rendering: optimizeLegibility;
                    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                }
                :root {
                    --c-primary: ${c.primary};
                    --c-secondary: ${c.secondary};
                    --c-text: ${c.text};
                    --c-muted: ${c.text_muted};
                    --c-bg: ${c.background};
                }
                .skeleton-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
                }
            `}</style>

            <div className="mx-auto max-w-2xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
                {/* ── Hero Card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="relative overflow-hidden rounded-2xl p-8 text-center"
                    style={{
                        background: `linear-gradient(135deg, ${c.primary}12 0%, ${c.secondary || c.primary}08 100%)`,
                        border: `1px solid ${c.primary}15`,
                    }}
                >
                    {/* Decorative circles */}
                    <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-20" style={{ background: c.primary }} />
                    <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full opacity-10" style={{ background: c.secondary || c.primary }} />

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 18 }}
                        className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary || c.primary})` }}
                    >
                        <span className="material-symbols-rounded text-3xl text-white">check</span>
                    </motion.div>

                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: c.text }}>Booking Berhasil!</h1>
                    <p className="mt-1.5 text-sm" style={{ color: c.text_muted }}>
                        Terima kasih, <span className="font-semibold" style={{ color: c.text }}>{currentBooking.customer_name}</span>. Booking Anda telah tercatat.
                    </p>

                    {/* Booking Code */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="mx-auto mt-6 inline-block rounded-xl px-8 py-4"
                        style={{ backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: `1px solid ${c.primary}12` }}
                    >
                        <p className="text-[10px] font-semibold tracking-[0.15em] uppercase" style={{ color: c.text_muted }}>Kode Booking</p>
                        <p className="mt-1 text-3xl font-extrabold tracking-wider" style={{ color: c.primary, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>
                            {currentBooking.booking_code}
                        </p>
                    </motion.div>

                    {/* Status Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold"
                        style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
                    >
                        <span className="material-symbols-rounded text-base">{statusInfo.icon}</span>
                        {statusInfo.label}
                    </motion.div>
                </motion.div>

                {/* ── Content Cards ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mt-6 space-y-5"
                >
                    {/* Booking Info */}
                    <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                        <div className="mb-4 flex items-center gap-2">
                            <span className="material-symbols-rounded text-base" style={{ color: c.primary }}>description</span>
                            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: c.text_muted }}>Informasi Booking</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <InfoValue icon="event" label="Tanggal" value={formatDateLong(currentBooking.start_time)} />
                            <InfoValue icon="schedule" label="Waktu" value={`${formatTime(currentBooking.start_time)} - ${formatTime(currentBooking.end_time)}`} />
                            <InfoValue icon="timer" label="Durasi" value={`${currentBooking.duration_minutes} menit`} />
                            {currentBooking.staff_name && <InfoValue icon="badge" label="Staff" value={currentBooking.staff_name} />}
                            {currentBooking.branch_name && <InfoValue icon="store" label="Cabang" value={currentBooking.branch_name} />}
                            <InfoValue icon="travel_explore" label="Sumber" value={currentBooking.source === 'walk_in' ? 'Walk In' : currentBooking.source === 'online' ? 'Online' : 'Telepon'} />
                            <InfoValue icon="group" label="Jumlah Tamu" value={`${currentBooking.total_guests} orang`} />
                            {currentBooking.guest_details && currentBooking.guest_details.length > 0 && (
                                <div className="col-span-full">
                                    <InfoValue icon="people" label="Nama Tamu" value={currentBooking.guest_details.join(', ')} />
                                </div>
                            )}
                            {currentBooking.rooms && currentBooking.rooms.length > 0 && (
                                <InfoValue icon="meeting_room" label="Ruangan" value={currentBooking.rooms.map((r) => r.name).join(', ')} />
                            )}
                            {currentBooking.is_group && (
                                <InfoValue icon="groups" label="Tipe" value="Booking Grup / Kelas" />
                            )}
                        </div>
                    </div>

                    {/* Services */}
                    {currentBooking.services.length > 0 && (
                        <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                            <div className="mb-4 flex items-center gap-2">
                                <span className="material-symbols-rounded text-base" style={{ color: c.primary }}>spa</span>
                                <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: c.text_muted }}>Detail Layanan</h2>
                            </div>
                            <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                                {currentBooking.services.map((svc, i) => (
                                    <div key={i} className="py-3 first:pt-0 last:pb-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs" style={{ backgroundColor: `${c.primary}0c`, color: c.primary }}>
                                                    <span className="material-symbols-rounded text-sm">check</span>
                                                </span>
                                                <span className="text-sm font-semibold truncate" style={{ color: c.text }}>
                                                    {svc.quantity > 1 && <>{svc.quantity}x </>}{svc.name}
                                                </span>
                                            </div>
                                            {svc.price > 0 && (
                                                <div className="text-right shrink-0 ml-3">
                                                    <span className="text-sm font-bold" style={{ color: c.primary }}>
                                                        {totalGuests > 1 ? formatPrice(svc.price * totalGuests) : formatPrice(svc.price)}
                                                    </span>
                                                    {totalGuests > 1 && (
                                                        <p className="text-[11px] leading-tight mt-0.5" style={{ color: c.text_muted }}>
                                                            {formatPrice(svc.price)} × {totalGuests} orang
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {svc.addons && svc.addons.length > 0 && (
                                            <div className="mt-2 space-y-1 pl-9">
                                                {svc.addons.map((a, j) => (
                                                    <div key={j} className="flex items-center justify-between text-xs" style={{ color: c.text_muted }}>
                                                        <span className="flex items-center gap-1.5">
                                                            <span className="material-symbols-rounded text-[10px]">add_circle</span>
                                                            {a.quantity > 1 && <span className="font-semibold" style={{ color: c.text }}>{a.quantity}x </span>}
                                                            {a.name}
                                                        </span>
                                                        {a.price > 0 && <span className="font-medium" style={{ color: c.text }}>{formatPrice(a.price * a.quantity)}</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Participants (group booking) */}
                    {currentBooking.is_group && currentBooking.participants && currentBooking.participants.length > 0 && (
                        <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                            <div className="mb-4 flex items-center gap-2">
                                <span className="material-symbols-rounded text-base" style={{ color: c.primary }}>groups</span>
                                <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: c.text_muted }}>Daftar Peserta</h2>
                            </div>
                            <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                                {currentBooking.participants.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary || c.primary})` }}>
                                                {p.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold truncate" style={{ color: c.text }}>{p.name}</p>
                                                {(p.phone || p.email) && (
                                                    <p className="text-xs truncate" style={{ color: c.text_muted }}>{[p.phone, p.email].filter(Boolean).join(' · ')}</p>
                                                )}
                                            </div>
                                        </div>
                                        <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-semibold', p.status === 'attended' ? 'text-green-700 bg-green-100' : p.status === 'cancelled' ? 'text-red-700 bg-red-100' : 'text-yellow-700 bg-yellow-100')}>
                                            {p.status === 'attended' ? 'Hadir' : p.status === 'cancelled' ? 'Batal' : 'Terdaftar'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {currentBooking.notes && (
                        <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="material-symbols-rounded text-base" style={{ color: c.primary }}>notes</span>
                                <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: c.text_muted }}>Catatan</h2>
                            </div>
                            <p className="rounded-xl px-4 py-3 text-sm leading-relaxed" style={{ backgroundColor: `${c.primary}04`, color: c.text }}>{currentBooking.notes}</p>
                        </div>
                    )}

                    {/* Total Price */}
                    {totalPrice > 0 && (
                        <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${c.primary}0c` }}>
                                        <span className="material-symbols-rounded text-lg" style={{ color: c.primary }}>payments</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold" style={{ color: c.text }}>Total Harga</p>
                                        <p className="text-xs" style={{ color: c.text_muted }}>Sudah termasuk layanan dan pajak</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-extrabold tracking-tight" style={{ color: c.primary }}>{formatPrice(totalPrice)}</span>
                            </div>
                        </div>
                    )}

                    {/* Customer Info */}
                    <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                        <div className="mb-4 flex items-center gap-2">
                            <span className="material-symbols-rounded text-base" style={{ color: c.primary }}>person</span>
                            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: c.text_muted }}>Data Pemesan</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary || c.primary})` }}>
                                {currentBooking.customer_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-semibold" style={{ color: c.text }}>{currentBooking.customer_name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                        <div className="mb-4 flex items-center gap-2">
                            <span className="material-symbols-rounded text-base" style={{ color: c.primary }}>flag</span>
                            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: c.text_muted }}>Langkah Selanjutnya</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: c.primary }}>
                                    1
                                </div>
                                <p className="text-sm leading-relaxed" style={{ color: c.text }}>
                                    Booking Anda sedang menunggu konfirmasi dari pihak {tenant?.name || 'kami'}.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: c.secondary || c.primary }}>
                                    2
                                </div>
                                <p className="text-sm leading-relaxed" style={{ color: c.text }}>
                                    Anda akan menerima notifikasi via email atau WhatsApp ketika booking telah dikonfirmasi.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: c.text_muted }}>
                                    3
                                </div>
                                <p className="text-sm leading-relaxed" style={{ color: c.text }}>
                                    Hadir 10 menit sebelum jadwal untuk pengalaman yang lebih nyaman.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <p className="text-center text-xs leading-relaxed" style={{ color: c.text_muted }}>
                        <span className="material-symbols-rounded align-middle text-[10px] mr-1">sync</span>
                        Halaman ini akan otomatis memperbarui status booking setiap 30 detik.
                    </p>
                </motion.div>
            </div>
        </PublicLayout>
    );
}
