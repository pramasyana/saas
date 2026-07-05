import { useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import Badge from '@/atoms/Badge';
import Modal from '@/molecules/Modal';
import { useBookings, useBooking } from '@/features/booking/hooks/useBookings';
import type { Booking, BookingServiceItem } from '@/features/booking/types';
import { formatPrice } from '@/lib/utils';

interface TransactionHistoryProps {
    customerId: string;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'new' }> = {
    pending: { label: 'Pending', variant: 'warning' },
    confirmed: { label: 'Dikonfirmasi', variant: 'success' },
    in_progress: { label: 'Berlangsung', variant: 'new' },
    completed: { label: 'Selesai', variant: 'default' },
    cancelled: { label: 'Dibatalkan', variant: 'danger' },
    no_show: { label: 'No Show', variant: 'danger' },
};

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(d: string) {
    return new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function calcTotal(svc: BookingServiceItem[], guests: number): number {
    const pax = Math.max(1, guests ?? 1);
    return svc.reduce((sum, s) => {
        const svcTotal = Number(s.price) * Number(s.quantity) * pax;
        const addonTotal = (s.addons || []).reduce((a, b) => a + Number(b.price) * Number(b.quantity), 0);
        return sum + svcTotal + addonTotal;
    }, 0);
}

const statusLabels: Record<string, string> = {
    pending: 'Pending', confirmed: 'Dikonfirmasi', in_progress: 'Berlangsung',
    completed: 'Selesai', cancelled: 'Dibatalkan', no_show: 'No Show',
};

function formatShortDate(d: string) {
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function DetailModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
    const { data: detail } = useBooking(booking.id);
    const full = detail?.data ?? booking;
    const pax = Math.max(1, full.total_guests ?? 1);
    const logs = full.status_logs ?? [];

    return (
        <Modal open onClose={onClose} size="md">
            <div className="p-5 max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
                    <div>
                        <h3 className="text-base font-bold text-neutral-900">Detail Transaksi</h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                            {booking.booking_code} &middot; {formatDate(booking.start_time)}
                        </p>
                    </div>
                    <Badge variant={statusConfig[booking.status]?.variant ?? 'default'}>
                        {statusConfig[booking.status]?.label ?? booking.status}
                    </Badge>
                </div>

                <div className="space-y-4">
                    {/* Info */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg bg-neutral-50 px-3 py-2.5">
                            <p className="text-[10px] text-neutral-400">Tanggal</p>
                            <p className="font-semibold text-neutral-900">{formatDate(booking.start_time)}</p>
                        </div>
                        <div className="rounded-lg bg-neutral-50 px-3 py-2.5">
                            <p className="text-[10px] text-neutral-400">Waktu</p>
                            <p className="font-semibold text-neutral-900">{formatTime(booking.start_time)}</p>
                        </div>
                        <div className="rounded-lg bg-neutral-50 px-3 py-2.5">
                            <p className="text-[10px] text-neutral-400">Staff</p>
                            <p className="font-semibold text-neutral-900">{booking.staff_name || '-'}</p>
                        </div>
                        <div className="rounded-lg bg-neutral-50 px-3 py-2.5">
                            <p className="text-[10px] text-neutral-400">Cabang</p>
                            <p className="font-semibold text-neutral-900">{booking.branch_name || '-'}</p>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Layanan</p>
                        <div className="divide-y divide-neutral-100 rounded-lg border border-neutral-200">
                            {booking.services.map((s) => (
                                <div key={s.id} className="px-3 py-2.5 first:rounded-t-lg last:rounded-b-lg">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold text-neutral-900">{s.name}</p>
                                        <p className="text-xs font-bold text-neutral-900">{formatPrice(s.price * pax)}</p>
                                    </div>
                                    {s.addons && s.addons.length > 0 && (
                                        <div className="mt-1 space-y-0.5 pl-3">
                                            {s.addons.map((a, j) => (
                                                <div key={j} className="flex items-center justify-between text-[10px] text-neutral-500">
                                                    <span>{a.quantity > 1 ? `${a.quantity}x ` : ''}{a.name}</span>
                                                    <span className="font-medium text-neutral-700">{formatPrice(a.price * a.quantity)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between rounded-lg bg-primary-50 px-3 py-2.5">
                        <p className="text-xs font-bold text-neutral-900">Total</p>
                        <p className="text-base font-extrabold text-primary">{formatPrice(calcTotal(booking.services, booking.total_guests))}</p>
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Catatan</p>
                            <p className="rounded-lg bg-neutral-50 px-3 py-2.5 text-xs text-neutral-700">{booking.notes}</p>
                        </div>
                    )}

                    {/* Status Timeline */}
                    {logs.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2.5">Riwayat Status</p>
                            <div className="relative pl-1">
                                <div className="absolute left-[7px] top-1 h-[calc(100%-8px)] w-0.5 bg-neutral-200" />
                                <div className="space-y-3">
                                    {[...logs].reverse().map((log, i) => {
                                        const isLast = i === logs.length - 1;
                                        return (
                                            <div key={i} className="relative flex gap-2.5">
                                                <div className="relative z-10 mt-0.5">
                                                    <div className={`h-[10px] w-[10px] rounded-full ring-2 ring-white ${isLast ? 'bg-primary' : 'bg-neutral-300'}`} />
                                                </div>
                                                <div className="pb-1">
                                                    <p className="text-xs font-medium text-neutral-900">
                                                        {statusLabels[log.to_status] ?? log.to_status}
                                                    </p>
                                                    <p className="text-[10px] text-neutral-400">
                                                        {log.created_at ? formatShortDate(log.created_at) : ''}
                                                        {log.changed_by !== 'system' && log.changed_by_name ? ` oleh ${log.changed_by_name}` : ''}
                                                        {log.changed_by !== 'system' && !log.changed_by_name && ` oleh ${log.changed_by}`}
                                                    </p>
                                                    {log.notes && <p className="mt-0.5 text-[10px] text-neutral-500">{log.notes}</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default function TransactionHistory({ customerId }: TransactionHistoryProps) {
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Booking | null>(null);
    const perPage = 10;

    const { data, isLoading } = useBookings({ customer_id: customerId, page, per_page: perPage });
    const bookings: Booking[] = data?.data ?? [];
    const meta = data?.meta;

    return (
        <FadeIn>
            <div className="space-y-5">
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Riwayat Transaksi</h3>
                        <p className="text-xs text-neutral-500">Semua booking pelanggan ini</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex animate-pulse items-center gap-4 rounded-xl border border-neutral-200 p-4">
                                <div className="h-10 w-10 rounded-lg bg-neutral-200" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-1/3 rounded bg-neutral-200" />
                                    <div className="h-3 w-1/2 rounded bg-neutral-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-10">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                            <svg className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                        </div>
                        <p className="text-sm text-neutral-500">Belum ada transaksi</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {bookings.map((b) => {
                            const total = calcTotal(b.services, b.total_guests);
                            return (
                                <div key={b.id} className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:bg-neutral-50">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-neutral-900" style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>
                                                {b.booking_code}
                                            </span>
                                            <Badge variant={statusConfig[b.status]?.variant ?? 'default'}>
                                                {statusConfig[b.status]?.label ?? b.status}
                                            </Badge>
                                        </div>
                                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-neutral-500">
                                            <span>{formatDate(b.start_time)} {formatTime(b.start_time)}</span>
                                            {b.staff_name && <span>&middot; {b.staff_name}</span>}
                                            <span>&middot; {b.services.length} layanan</span>
                                            {b.total_guests > 1 && <span>&middot; {b.total_guests} tamu</span>}
                                        </div>
                                        <div className="mt-1.5 flex flex-wrap gap-1">
                                            {b.services.slice(0, 3).map((s) => (
                                                <span key={s.id} className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                                                    {s.name}
                                                </span>
                                            ))}
                                            {b.services.length > 3 && (
                                                <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-400">
                                                    +{b.services.length - 3} lainnya
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <p className="text-sm font-bold text-primary">{formatPrice(total)}</p>
                                        <button
                                            type="button"
                                            onClick={() => setSelected(b)}
                                            className="rounded-lg border border-neutral-200 px-3 py-1 text-[11px] font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                                        >
                                            Detail
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {meta && meta.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                        <button disabled={page <= 1} onClick={() => setPage(page - 1)}
                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                            Prev
                        </button>
                        <span className="text-sm text-neutral-500">{meta.current_page} / {meta.last_page}</span>
                        <button disabled={page >= meta.last_page} onClick={() => setPage(page + 1)}
                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {selected && <DetailModal booking={selected} onClose={() => setSelected(null)} />}
        </FadeIn>
    );
}
