import { useState } from 'react';
import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import { useBooking, useCancelBooking, useCheckIn, useCompleteBooking, useConfirmBooking, useMarkNoShow } from '@/features/booking/hooks/useBookings';
import type { Booking, BookingStatus, StatusLogItem } from '@/features/booking/types';
import { cn } from '@/lib/utils';
import Modal from '@/molecules/Modal';
import { useToastStore } from '@/stores/toast';

interface BookingDetailModalProps {
    bookingId: string | null;
    onClose: () => void;
}

const statusConfig: Record<BookingStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'new' }> = {
    pending: { label: 'Pending', variant: 'warning' },
    confirmed: { label: 'Dikonfirmasi', variant: 'success' },
    in_progress: { label: 'Berlangsung', variant: 'new' },
    completed: { label: 'Selesai', variant: 'default' },
    cancelled: { label: 'Dibatalkan', variant: 'danger' },
    no_show: { label: 'No Show', variant: 'danger' },
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
        'bg-primary text-white', 'bg-emerald-500 text-white', 'bg-amber-500 text-white',
        'bg-rose-500 text-white', 'bg-sky-500 text-white', 'bg-violet-500 text-white',
    ];
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
hash = name.charCodeAt(i) + ((hash << 5) - hash);
}

    return colors[Math.abs(hash) % colors.length];
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-medium text-neutral-400">{label}</p>
            <p className="mt-0.5 text-sm font-medium text-neutral-900">{value}</p>
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
            <p className="mb-3 text-xs font-medium text-neutral-400">RIWAYAT STATUS</p>
            <div className="space-y-3">
                {[...logs].reverse().map((log, i) => {
                    const isLast = i === logs.length - 1;

                    return (
                        <div key={i} className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <div className={cn(
                                    'h-2.5 w-2.5 rounded-full ring-2 ring-white',
                                    isLast ? 'bg-primary' : 'bg-neutral-300',
                                )} />
                                {!isLast && <div className="mt-1 h-full w-px bg-neutral-200" />}
                            </div>
                            <div className="pb-3">
                                <p className="text-sm font-medium text-neutral-900">
                                    {log.from_status ? `${statusLabels[log.from_status] ?? log.from_status} → ` : ''}
                                    {statusLabels[log.to_status] ?? log.to_status}
                                </p>
                                <p className="text-xs text-neutral-400">
                                    {log.created_at ? formatShortDate(log.created_at) : ''}
                                    {log.changed_by !== 'system' && ` oleh ${log.changed_by}`}
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
                    <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold text-neutral-900">Detail Booking</h2>
                            {config && <Badge variant={config.variant}>{config.label}</Badge>}
                        </div>
                        <button onClick={onClose} className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
                        {/* Customer Info */}
                        <div className="mb-6 flex items-center gap-4">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getAvatarColor(booking.customer_name)}`}>
                                {getInitials(booking.customer_name)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-base font-semibold text-neutral-900">{booking.customer_name}</p>
                                {booking.customer_phone && <p className="text-sm text-neutral-500">{booking.customer_phone}</p>}
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-xs text-neutral-400">Kode Booking</p>
                                <p className="text-sm font-bold text-primary">{booking.booking_code}</p>
                            </div>
                        </div>

                        {/* Booking Info Grid */}
                        <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl bg-neutral-50 p-4 sm:grid-cols-3">
                            <InfoRow label="Tanggal" value={formatDate(booking.start_time)} />
                            <InfoRow label="Waktu" value={`${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}`} />
                            <InfoRow label="Durasi" value={`${booking.duration_minutes} menit`} />
                            <InfoRow label="Staff" value={booking.staff_name ?? '-'} />
                            <InfoRow label="Cabang" value={booking.branch_name ?? '-'} />
                            <InfoRow label="Sumber" value={booking.source === 'walk_in' ? 'Walk In' : booking.source === 'online' ? 'Online' : 'Telepon'} />
                        </div>

                        {/* Layanan */}
                        {booking.services && booking.services.length > 0 && (
                            <div className="mb-6">
                                <p className="mb-2 text-xs font-medium text-neutral-400">LAYANAN</p>
                                <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200">
                                    {booking.services.map((s) => (
                                        <div key={s.id} className="flex items-center justify-between px-4 py-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-neutral-900">{s.name}</p>
                                                {s.quantity > 1 && <p className="text-xs text-neutral-400">{s.quantity}x</p>}
                                            </div>
                                            {s.price > 0 && (
                                                <p className="text-sm font-semibold text-neutral-900">
                                                    Rp {s.price.toLocaleString('id-ID')}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {booking.notes && (
                            <div className="mb-6">
                                <p className="mb-1.5 text-xs font-medium text-neutral-400">CATATAN</p>
                                <p className="rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-700">{booking.notes}</p>
                            </div>
                        )}

                        {/* Reminder Status */}
                        {reminder && (
                            <div className="mb-6">
                                <p className="mb-2 text-xs font-medium text-neutral-400">REMINDER</p>
                                <div className="flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
                                        <svg className="h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                        </svg>
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

                        {/* Status Timeline */}
                        {booking.status_logs && booking.status_logs.length > 0 && (
                            <div className="mb-2">
                                <StatusTimeline logs={booking.status_logs} />
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-end gap-2 border-t border-neutral-200 px-6 py-4">
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
                                <Button
                                    variant="secondary"
                                    onClick={() => setConfirmAction(null)}
                                    disabled={!!loadingAction}
                                >
                                    Batal
                                </Button>
                                <Button
                                    variant={confirmAction === 'cancel' ? 'danger' : 'danger'}
                                    onClick={() => executeAction(confirmAction)}
                                    disabled={!!loadingAction}
                                    className="min-w-[120px]"
                                >
                                    {loadingAction ? 'Memproses...' : cfg.confirmLabel}
                                </Button>
                            </div>
                        </div>
                    );
                })()}
            </Modal>
        </Modal>
    );
}
