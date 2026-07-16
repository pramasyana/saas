import { useState } from 'react';
import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import AdjustServiceModal from '@/features/booking/components/AdjustServiceModal';
import { useBooking, useCancelBooking, useCheckIn, useCompleteBooking, useConfirmBooking, useMarkNoShow } from '@/features/booking/hooks/useBookings';
import type { Booking, BookingStatus, StatusLogItem } from '@/features/booking/types';
import { cn } from '@/lib/utils';
import Modal from '@/molecules/Modal';
import { useToastStore } from '@/stores/toast';

interface BookingDetailModalProps {
    bookingId: string | null;
    onClose: () => void;
}

const statusConfig: Record<BookingStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'new'; icon: string }> = {
    pending: { label: 'Pending', variant: 'warning', icon: 'hourglass' },
    confirmed: { label: 'Dikonfirmasi', variant: 'success', icon: 'check_circle' },
    in_progress: { label: 'Berlangsung', variant: 'new', icon: 'progress_activity' },
    completed: { label: 'Selesai', variant: 'default', icon: 'verified' },
    cancelled: { label: 'Dibatalkan', variant: 'danger', icon: 'cancel' },
    no_show: { label: 'No Show', variant: 'danger', icon: 'person_off' },
};

const reminderBadge: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'new'> = {
    pending: 'warning',
    sent: 'success',
    failed: 'danger',
    cancelled: 'default',
};

const reminderLabel: Record<string, string> = {
    pending: 'Menunggu',
    sent: 'Terkirim',
    failed: 'Gagal',
    cancelled: 'Dibatalkan',
};

function formatTime(d: string) {
    return new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatShortDate(d: string) {
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(name: string): string {
    const colors = [
        'from-primary to-primary-dark', 'from-emerald-500 to-emerald-600', 'from-amber-500 to-amber-600',
        'from-rose-500 to-rose-600', 'from-sky-500 to-sky-600', 'from-violet-500 to-violet-600',
    ];
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border p-3.5 transition-colors hover:border-neutral-300" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
            <span className="material-symbols-rounded mt-0.5 text-lg shrink-0 !text-primary">{icon}</span>
            <div className="min-w-0">
                <p className="text-[11px] font-medium text-neutral-400">{label}</p>
                <p className="mt-0.5 text-sm font-semibold text-neutral-900">{value}</p>
            </div>
        </div>
    );
}

function StatusTimeline({ logs }: { logs: StatusLogItem[] }) {
    const statusLabels: Record<string, string> = {
        pending: 'Pending',
        confirmed: 'Dikonfirmasi',
        in_progress: 'Berlangsung',
        completed: 'Selesai',
        cancelled: 'Dibatalkan',
        no_show: 'No Show',
    };

    if (logs.length === 0) {
return null;
}

    return (
        <div>
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                <span className="material-symbols-rounded text-sm">history</span>
                Riwayat Status
            </p>
            <div className="space-y-0">
                {[...logs].reverse().map((log, i) => {
                    const isLast = i === logs.length - 1;

                    return (
                        <div key={i} className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <div className={cn(
                                    'h-2.5 w-2.5 rounded-full ring-2 ring-white',
                                    isLast ? 'bg-primary' : 'bg-neutral-300',
                                )} />
                                {!isLast && <div className="h-full w-px bg-neutral-200" />}
                            </div>
                            <div className={cn('pb-4', isLast && 'pb-0')}>
                                <p className="text-sm font-medium text-neutral-900">
                                    {log.from_status ? `${statusLabels[log.from_status] ?? log.from_status} → ` : ''}
                                    {statusLabels[log.to_status] ?? log.to_status}
                                </p>
                                <p className="text-xs text-neutral-400">
                                    {log.created_at ? formatShortDate(log.created_at) : ''}
                                    {log.changed_by !== 'system' && log.changed_by_name ? ` oleh ${log.changed_by_name}` : ''}
                                    {log.changed_by !== 'system' && !log.changed_by_name && log.changed_by ? ` oleh ${log.changed_by}` : ''}
                                </p>
                                {log.notes && <p className="mt-0.5 text-xs text-neutral-500">{log.notes}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const confirmConfig: Record<string, { title: string; description: string; confirmLabel: string }> = {
    cancel: {
        title: 'Batalkan Booking',
        description: 'Apakah anda yakin ingin membatalkan booking ini? Tindakan ini tidak dapat dikembalikan.',
        confirmLabel: 'Ya, Batalkan',
    },
    no_show: {
        title: 'Tandai No Show',
        description: 'Apakah anda yakin ingin menandai pelanggan ini sebagai no show? Tindakan ini tidak dapat dikembalikan.',
        confirmLabel: 'Ya, No Show',
    },
};

export default function BookingDetailModal({ bookingId, onClose }: BookingDetailModalProps) {
    const { data: bookingData, isLoading } = useBooking(bookingId ?? '');
    const booking: Booking | undefined = bookingData?.data;
    const [loadingAction, setLoadingAction] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<string | null>(null);
    const [showAdjust, setShowAdjust] = useState(false);
    const addToast = useToastStore((s) => s.addToast);

    const confirmMut = useConfirmBooking();
    const checkInMut = useCheckIn();
    const completeMut = useCompleteBooking();
    const cancelMut = useCancelBooking();
    const noShowMut = useMarkNoShow();

    async function doAction(action: string) {
        if (!booking) {
return;
}

        if (action === 'cancel' || action === 'no_show') {
            setConfirmAction(action);

            return;
        }

        await executeAction(action);
    }

    async function executeAction(action: string) {
        if (!booking) {
return;
}

        setLoadingAction(action);
        setConfirmAction(null);

        try {
            const actions: Record<string, () => Promise<unknown>> = {
                confirm: () => confirmMut.mutateAsync(booking.id),
                check_in: () => checkInMut.mutateAsync(booking.id),
                complete: () => completeMut.mutateAsync(booking.id),
                cancel: () => cancelMut.mutateAsync(booking.id),
                no_show: () => noShowMut.mutateAsync(booking.id),
            };
            await actions[action]();
            addToast('success', 'Berhasil');
            onClose();
        } catch {
            addToast('error', 'Gagal');
        } finally {
            setLoadingAction(null);
        }
    }

    const config = booking ? statusConfig[booking.status] : null;
    const reminder = booking?.reminders?.[0];

    return (
        <Modal open={!!bookingId} onClose={onClose} size="xl">
            {isLoading || !booking ? (
                <div className="animate-pulse p-6">
                    <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
                        <div className="h-5 w-32 rounded bg-neutral-200" />
                        <div className="h-5 w-20 rounded-full bg-neutral-200" />
                    </div>
                    <div className="mt-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-neutral-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-40 rounded bg-neutral-200" />
                            <div className="h-3 w-28 rounded bg-neutral-100" />
                        </div>
                        <div className="space-y-1 text-right">
                            <div className="h-3 w-20 rounded bg-neutral-100" />
                            <div className="h-4 w-24 rounded bg-neutral-200" />
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i}>
                                <div className="h-3 w-16 rounded bg-neutral-100" />
                                <div className="mt-1 h-4 w-28 rounded bg-neutral-200" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <FadeIn>
                    {/* ── Header ── */}
                    <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: 'rgba(107,56,212,0.1)' }}>
                                <span className="material-symbols-rounded text-base !text-primary">description</span>
                            </div>
                            <h2 className="text-lg font-bold text-neutral-900">Detail Booking</h2>
                            {config && <Badge variant={config.variant}>{config.label}</Badge>}
                        </div>
                        <button onClick={onClose} className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-5">
                        {/* ── Customer Header ── */}
                        <div className="flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white shadow-sm ${getAvatarColor(booking.customer_name)}`}>
                                {getInitials(booking.customer_name)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-base font-bold text-neutral-900">{booking.customer_name}</p>
                                {booking.customer_phone && <p className="text-sm text-neutral-500">{booking.customer_phone}</p>}
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Kode Booking</p>
                                <p className="mt-0.5 text-sm font-bold tracking-wide text-primary" style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>{booking.booking_code}</p>
                            </div>
                        </div>

                        {/* ── Booking Info Grid ── */}
                        <div>
                            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                                <span className="material-symbols-rounded text-sm">event_note</span>
                                Informasi Booking
                            </p>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                <InfoCard icon="event" label="Tanggal" value={formatDate(booking.start_time)} />
                                <InfoCard icon="schedule" label="Waktu" value={`${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}`} />
                                <InfoCard icon="timer" label="Durasi" value={`${booking.duration_minutes} menit`} />
                                <InfoCard icon="badge" label="Staff" value={booking.staff_name ?? '-'} />
                                <InfoCard icon="store" label="Cabang" value={booking.branch_name ?? '-'} />
                                <InfoCard icon="travel_explore" label="Sumber" value={booking.source === 'walk_in' ? 'Walk In' : booking.source === 'online' ? 'Online' : 'Telepon'} />
                                <InfoCard icon="group" label="Jumlah Tamu" value={`${booking.total_guests} orang`} />
                                {booking.guest_details && booking.guest_details.length > 0 && (
                                    <div className="col-span-full">
                                        <InfoCard icon="people" label="Nama Tamu" value={booking.guest_details.join(', ')} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Services ── */}
                        {booking.services && booking.services.length > 0 && (
                            <div>
                                <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                                    <span className="material-symbols-rounded text-sm">spa</span>
                                    Layanan
                                </p>
                                <div className="divide-y rounded-xl border shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                                    {booking.services.map((s) => {
                                        const pax = Math.max(1, booking.total_guests ?? 1);

                                        return (
                                            <div key={s.id} className="px-4 py-3.5 first:rounded-t-xl last:rounded-b-xl hover:bg-neutral-50/50">
                                                <div className="flex items-center justify-between">
                                                    <div className="min-w-0 flex-1 flex items-center gap-2.5">
                                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: 'rgba(107,56,212,0.08)' }}>
                                                            <span className="material-symbols-rounded text-sm !text-primary">check</span>
                                                        </span>
                                                        <div>
                                                            <p className="text-sm font-semibold text-neutral-900">{s.name}</p>
                                                            {s.quantity > 1 && <p className="text-xs text-neutral-400">{s.quantity}x</p>}
                                                            {s.staff_name && (
                                                                <p className="text-[10px] text-primary font-medium mt-0.5">
                                                                    <span className="material-symbols-rounded text-[10px] mr-0.5">person</span>
                                                                    {s.staff_name}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {s.price > 0 && (
                                                        <div className="text-right shrink-0 ml-3">
                                                            <p className="text-sm font-bold text-neutral-900">
                                                                Rp {(s.price * pax).toLocaleString('id-ID')}
                                                            </p>
                                                            {pax > 1 && (
                                                                <p className="text-[10px] text-neutral-400 leading-tight">
                                                                    Rp {s.price.toLocaleString('id-ID')} × {pax} pax
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                {s.addons && s.addons.length > 0 && (
                                                    <div className="mt-2 space-y-1 pl-9">
                                                        {s.addons.map((a, j) => (
                                                            <div key={j} className="flex items-center justify-between text-xs text-neutral-400">
                                                                <span className="flex items-center gap-1.5">
                                                                    <span className="material-symbols-rounded text-[10px]">add_circle</span>
                                                                    {a.quantity > 1 && <span className="font-semibold text-neutral-700">{a.quantity}x </span>}
                                                                    {a.name}
                                                                </span>
                                                                {a.price > 0 && <span className="font-medium text-neutral-700">Rp {(a.price * a.quantity).toLocaleString('id-ID')}</span>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── Total Price ── */}
                        {booking.services && booking.services.length > 0 && (
                            <div className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(107,56,212,0.08)' }}>
                                        <span className="material-symbols-rounded text-base !text-primary">payments</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-neutral-900">Total Harga</p>
                                        <p className="text-xs text-neutral-400">Sudah termasuk layanan</p>
                                    </div>
                                </div>
                                <span className="text-xl font-extrabold text-primary">
                                    Rp {booking.services.reduce((sum, s) => {
                                        const pax = Math.max(1, booking.total_guests ?? 1);
                                        const svcTotal = Number(s.price) * Number(s.quantity) * pax;
                                        const addonTotal = (s.addons || []).reduce((a, b) => a + Number(b.price) * Number(b.quantity), 0);

                                        return sum + svcTotal + addonTotal;
                                    }, 0).toLocaleString('id-ID')}
                                </span>
                            </div>
                        )}

                        {/* ── Notes ── */}
                        {booking.notes && (
                            <div className="rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                                    <span className="material-symbols-rounded text-sm">notes</span>
                                    Catatan
                                </p>
                                <p className="rounded-xl px-4 py-3 text-sm leading-relaxed text-neutral-700" style={{ backgroundColor: 'rgba(107,56,212,0.04)' }}>{booking.notes}</p>
                            </div>
                        )}

                        {/* ── Reminder ── */}
                        {reminder && (
                            <div className="rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                                    <span className="material-symbols-rounded text-sm">notifications</span>
                                    Reminder
                                </p>
                                <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ backgroundColor: 'rgba(107,56,212,0.04)' }}>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
                                        <span className="material-symbols-rounded text-sm !text-primary">notifications_active</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-neutral-900 capitalize">{reminder.type}</p>
                                        {reminder.scheduled_at && (
                                            <p className="text-xs text-neutral-500">Dijadwalkan: {formatShortDate(reminder.scheduled_at)}</p>
                                        )}
                                    </div>
                                    <Badge variant={reminderBadge[reminder.status] ?? 'default'}>
                                        {reminderLabel[reminder.status] ?? reminder.status}
                                    </Badge>
                                </div>
                                {reminder.error_message && (
                                    <p className="mt-1.5 text-xs text-danger">{reminder.error_message}</p>
                                )}
                            </div>
                        )}

                        {/* ── Status Timeline ── */}
                        {booking.status_logs && booking.status_logs.length > 0 && (
                            <div className="rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                                <StatusTimeline logs={booking.status_logs} />
                            </div>
                        )}
                    </div>

                    {/* ── Actions ── */}
                    <div className="flex flex-wrap items-center justify-end gap-2 border-t border-neutral-200 bg-neutral-50/50 px-6 py-4">
                        {['pending', 'confirmed', 'in_progress'].includes(booking.status) && (
                            <Button size="sm" variant="secondary" onClick={() => setShowAdjust(true)} disabled={!!loadingAction}>
                                <span className="material-symbols-rounded mr-1 text-sm">edit_note</span>
                                Adjust Layanan
                            </Button>
                        )}
                        {booking.status === 'pending' && (
                            <>
                                <Button size="sm" variant="danger" onClick={() => doAction('cancel')} disabled={!!loadingAction}>
                                    {loadingAction === 'cancel' ? 'Memproses...' : 'Batalkan'}
                                </Button>
                                <Button size="sm" variant="primary" onClick={() => doAction('confirm')} disabled={!!loadingAction}>
                                    {loadingAction === 'confirm' ? 'Memproses...' : 'Konfirmasi'}
                                </Button>
                            </>
                        )}
                        {booking.status === 'confirmed' && (
                            <>
                                <Button size="sm" variant="ghost" onClick={() => doAction('no_show')} disabled={!!loadingAction}>
                                    {loadingAction === 'no_show' ? 'Memproses...' : 'No Show'}
                                </Button>
                                <Button size="sm" variant="danger" onClick={() => doAction('cancel')} disabled={!!loadingAction}>
                                    {loadingAction === 'cancel' ? 'Memproses...' : 'Batalkan'}
                                </Button>
                                <Button size="sm" variant="primary" onClick={() => doAction('check_in')} disabled={!!loadingAction}>
                                    {loadingAction === 'check_in' ? 'Memproses...' : 'Check In'}
                                </Button>
                            </>
                        )}
                        {booking.status === 'in_progress' && (
                            <Button size="sm" variant="primary" onClick={() => doAction('complete')} disabled={!!loadingAction}>
                                {loadingAction === 'complete' ? 'Memproses...' : 'Selesaikan'}
                            </Button>
                        )}
                        {['completed', 'cancelled', 'no_show'].includes(booking.status) && (
                            <p className="text-sm text-neutral-400">Tidak ada aksi tersedia</p>
                        )}
                    </div>
                </FadeIn>
            )}

            {/* Confirmation Dialog */}
            <Modal open={!!confirmAction} onClose={() => setConfirmAction(null)} size="sm">
                {confirmAction && (() => {
                    const cfg = confirmConfig[confirmAction];

                    return (
                        <div className="p-6">
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-light">
                                    <svg className="h-7 w-7 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-900">{cfg.title}</h3>
                                    <p className="mt-1 text-sm text-neutral-500">{cfg.description}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-center gap-3">
                                <Button variant="secondary" onClick={() => setConfirmAction(null)} disabled={!!loadingAction}>Batal</Button>
                                <Button variant={confirmAction === 'cancel' ? 'danger' : 'danger'} onClick={() => executeAction(confirmAction)} disabled={!!loadingAction} className="min-w-[120px]">
                                    {loadingAction ? 'Memproses...' : cfg.confirmLabel}
                                </Button>
                            </div>
                        </div>
                    );
                })()}
            </Modal>

            {/* Adjust Service Modal */}
            {showAdjust && booking && (
                <AdjustServiceModal
                    booking={booking}
                    open={showAdjust}
                    onClose={() => setShowAdjust(false)}
                />
            )}
        </Modal>
    );
}
