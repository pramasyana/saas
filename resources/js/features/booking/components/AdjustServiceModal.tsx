import { useMemo, useState } from 'react';
import Button from '@/atoms/Button';
import { useAdjustServices } from '@/features/booking/hooks/useBookings';
import { useAllStaff } from '@/features/staff/hooks/useStaff';
import { useAllServices } from '@/features/service/hooks/useServices';
import type { AdjustmentPayload, Booking, BookingServiceItem } from '@/features/booking/types';
import type { ServiceItem } from '@/features/service/types';
import { formatPrice } from '@/lib/utils';
import Modal from '@/molecules/Modal';
import { useToastStore } from '@/stores/toast';

interface AdjustServiceModalProps {
    booking: Booking;
    open: boolean;
    onClose: () => void;
}

export default function AdjustServiceModal({ booking, open, onClose }: AdjustServiceModalProps) {
    const adjustMut = useAdjustServices();
    const addToast = useToastStore((s) => s.addToast);
    const { data: servicesData } = useAllServices();
    const services: ServiceItem[] = servicesData?.data ?? [];
    const { data: staffData } = useAllStaff();
    const staffList = staffData?.data ?? [];

    const [localServices, setLocalServices] = useState<BookingServiceItem[]>(() => [...(booking.services ?? [])]);
    const [notes, setNotes] = useState('');

    const existingServices = useMemo(() => localServices.filter((s) => !s.id.startsWith('temp_')), [localServices]);
    const newServices = useMemo(() => localServices.filter((s) => s.id.startsWith('temp_')), [localServices]);

    const adjustments = useMemo(() => buildAdjustments(booking.services ?? [], localServices), [booking.services, localServices]);

    const oldTotal = useMemo(() => calcTotal(booking.services ?? []), [booking.services]);
    const newTotal = useMemo(() => calcTotal(localServices), [localServices]);
    const difference = newTotal - oldTotal;

    const hasChanges = adjustments.length > 0;

    function handleRemove(serviceId: string) {
        setLocalServices((prev) => prev.filter((s) => s.id !== serviceId));
    }

    function handleQuantityChange(serviceId: string, qty: number) {
        if (qty < 1) return;
        setLocalServices((prev) => prev.map((s) => s.id === serviceId ? { ...s, quantity: qty } : s));
    }

    function handleStaffChange(serviceId: string, staffId: string) {
        setLocalServices((prev) => prev.map((s) => s.id === serviceId ? { ...s, staff_id: staffId || null, staff_name: staffList.find((st) => st.id === staffId)?.name ?? null } : s));
    }

    function handleAddService(serviceId: string) {
        const svc = services.find((s) => s.id === serviceId);
        if (!svc) return;

        const alreadyExist = localServices.find((s) => s.service_id === svc.id && !s.id.startsWith('temp_'));

        if (alreadyExist) {
            setLocalServices((prev) => prev.map((s) =>
                s.id === alreadyExist.id ? { ...s, quantity: s.quantity + 1 } : s
            ));
        } else {
            const alreadyNew = newServices.find((s) => s.service_id === svc.id);

            if (alreadyNew) {
                setLocalServices((prev) => prev.map((s) =>
                    s.id === alreadyNew.id ? { ...s, quantity: s.quantity + 1 } : s
                ));
            } else {
                const newService: BookingServiceItem = {
                    id: `temp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
                    service_id: svc.id,
                    staff_id: null,
                    staff_name: null,
                    name: svc.name,
                    price: Number(svc.price),
                    duration: Number(svc.duration),
                    quantity: 1,
                    sort_order: localServices.length,
                };
                setLocalServices((prev) => [...prev, newService]);
            }
        }
    }

    async function handleSubmit() {
        if (!hasChanges) return;

        try {
            await adjustMut.mutateAsync({
                id: booking.id,
                data: {
                    adjustments,
                    notes: notes || undefined,
                },
            });
            addToast('success', 'Layanan berhasil disesuaikan.');
            onClose();
        } catch {
            addToast('error', 'Gagal menyesuaikan layanan.');
        }
    }

    return (
        <Modal open={open} onClose={onClose} size="xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: 'rgba(107,56,212,0.1)' }}>
                        <span className="material-symbols-rounded text-base !text-primary">edit_note</span>
                    </div>
                    <h2 className="text-lg font-bold text-neutral-900">Adjust Layanan</h2>
                </div>
                <button onClick={onClose} className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto px-6 py-5 space-y-5">
                {/* ── Layanan Saat Ini ── */}
                <div>
                    <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                        <span className="material-symbols-rounded text-sm">spa</span>
                        Layanan Saat Ini
                    </p>
                    {existingServices.length === 0 ? (
                        <p className="text-sm text-neutral-400 italic">Belum ada layanan</p>
                    ) : (
                        <div className="divide-y rounded-xl border shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                            {existingServices.map((s) => {
                                const orig = (booking.services ?? []).find((o) => o.id === s.id);
                                const qtyChanged = orig && orig.quantity !== s.quantity;

                                return (
                                    <div key={s.id} className="px-4 py-3.5 first:rounded-t-xl last:rounded-b-xl hover:bg-neutral-50/50">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-neutral-900">{s.name}</p>
                                                <p className="text-[11px] text-neutral-400">
                                                    {formatPrice(Number(s.price))} / pcs
                                                    {qtyChanged && (
                                                        <span className="ml-1.5 font-medium text-primary">
                                                            ({orig.quantity} → {s.quantity})
                                                        </span>
                                                    )}
                                                </p>
                                                <select
                                                    value={s.staff_id ?? ''}
                                                    onChange={(e) => handleStaffChange(s.id, e.target.value)}
                                                    className="mt-1 w-full rounded-lg border bg-white px-2 py-1 text-[11px] text-neutral-600 outline-none focus:border-primary"
                                                    style={{ borderColor: 'rgba(0,0,0,0.1)' }}
                                                >
                                                    <option value="">Tanpa staff</option>
                                                    {staffList.filter((st) => st.is_active).map((st) => (
                                                        <option key={st.id} value={st.id}>{st.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="flex items-center gap-4 shrink-0">
                                                {/* Quantity */}
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuantityChange(s.id, s.quantity - 1)}
                                                        disabled={s.quantity <= 1}
                                                        className="flex h-6 w-6 items-center justify-center rounded-md border text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-30"
                                                        style={{ borderColor: 'rgba(0,0,0,0.1)' }}
                                                    >
                                                        <span className="material-symbols-rounded text-sm">remove</span>
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-semibold text-neutral-900">{s.quantity}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuantityChange(s.id, s.quantity + 1)}
                                                        className="flex h-6 w-6 items-center justify-center rounded-md border text-neutral-500 transition-colors hover:bg-neutral-100"
                                                        style={{ borderColor: 'rgba(0,0,0,0.1)' }}
                                                    >
                                                        <span className="material-symbols-rounded text-sm">add</span>
                                                    </button>
                                                </div>

                                                {/* Remove */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemove(s.id)}
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger"
                                                >
                                                    <span className="material-symbols-rounded text-sm">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-1.5 flex justify-end">
                                            <p className="text-[11px] text-neutral-400">
                                                Subtotal: <span className="font-semibold text-neutral-700">{formatPrice(Number(s.price) * s.quantity)}</span>
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Layanan Tambahan ── */}
                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                            <span className="material-symbols-rounded text-sm">add_circle</span>
                            Layanan Tambahan
                        </p>
                        {newServices.length > 0 && (
                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
                                {newServices.reduce((sum, s) => sum + s.quantity, 0)}
                            </span>
                        )}
                    </div>

                    {newServices.length > 0 && (
                        <div className="mb-3 divide-y rounded-xl border border-dashed shadow-sm" style={{ borderColor: 'rgba(107,56,212,0.3)' }}>
                            {newServices.map((s) => (
                                <div key={s.id} className="px-4 py-3 first:rounded-t-xl last:rounded-b-xl" style={{ backgroundColor: 'rgba(107,56,212,0.03)' }}>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                                    <span className="material-symbols-rounded text-[10px] !text-primary">add</span>
                                                </span>
                                                <p className="text-sm font-semibold text-neutral-900">{s.name}</p>
                                            </div>
                                            <p className="text-[11px] text-neutral-400 mt-0.5 ml-7">
                                                {formatPrice(Number(s.price))} / pcs
                                            </p>
                                            <select
                                                value={s.staff_id ?? ''}
                                                onChange={(e) => handleStaffChange(s.id, e.target.value)}
                                                className="mt-1 ml-7 w-full rounded-lg border bg-white px-2 py-1 text-[11px] text-neutral-600 outline-none focus:border-primary"
                                                style={{ borderColor: 'rgba(0,0,0,0.1)' }}
                                            >
                                                <option value="">Tanpa staff</option>
                                                {staffList.filter((st) => st.is_active).map((st) => (
                                                    <option key={st.id} value={st.id}>{st.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-4 shrink-0">
                                            {/* Quantity */}
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuantityChange(s.id, s.quantity - 1)}
                                                    disabled={s.quantity <= 1}
                                                    className="flex h-6 w-6 items-center justify-center rounded-md border text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-30"
                                                    style={{ borderColor: 'rgba(0,0,0,0.1)' }}
                                                >
                                                    <span className="material-symbols-rounded text-sm">remove</span>
                                                </button>
                                                <span className="w-8 text-center text-sm font-semibold text-neutral-900">{s.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuantityChange(s.id, s.quantity + 1)}
                                                    className="flex h-6 w-6 items-center justify-center rounded-md border text-neutral-500 transition-colors hover:bg-neutral-100"
                                                    style={{ borderColor: 'rgba(0,0,0,0.1)' }}
                                                >
                                                    <span className="material-symbols-rounded text-sm">add</span>
                                                </button>
                                            </div>

                                            {/* Remove */}
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(s.id)}
                                                className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger"
                                            >
                                                <span className="material-symbols-rounded text-sm">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-1.5 flex justify-end ml-7">
                                        <p className="text-[11px] text-neutral-400">
                                            Subtotal: <span className="font-semibold text-neutral-700">{formatPrice(Number(s.price) * s.quantity)}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add service dropdown */}
                    <select
                        value=""
                        onChange={(e) => {
                            if (e.target.value) handleAddService(e.target.value);
                        }}
                        className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-neutral-700 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                        style={{ borderColor: 'rgba(0,0,0,0.1)' }}
                    >
                        <option value="">Pilih layanan untuk ditambahkan...</option>
                        {services.filter((s) => s.is_active).map((s) => {
                            const existsCount = localServices.filter((ls) => ls.service_id === s.id).reduce((sum, ls) => sum + ls.quantity, 0);

                            return (
                                <option key={s.id} value={s.id}>
                                    {s.name} - {formatPrice(Number(s.price))}
                                    {existsCount > 0 ? ` (${existsCount} di keranjang)` : ''}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* ── Ringkasan ── */}
                <div className="rounded-2xl border bg-neutral-50 p-4 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                    <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                        <span className="material-symbols-rounded text-sm">receipt_long</span>
                        Ringkasan
                    </p>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-500">Total Sebelum</span>
                            <span className="text-sm font-medium text-neutral-700">{formatPrice(oldTotal)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-500">Total Sesudah</span>
                            <span className="text-sm font-semibold text-neutral-900">{formatPrice(newTotal)}</span>
                        </div>
                        <div className="border-t pt-2" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-neutral-700">Selisih</span>
                                <span className={`text-base font-extrabold ${difference >= 0 ? 'text-success' : 'text-danger'}`}>
                                    {difference >= 0 ? '+' : ''}{formatPrice(difference)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Catatan ── */}
                <div>
                    <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                        <span className="material-symbols-rounded text-sm">notes</span>
                        Catatan
                    </p>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Opsional: catatan untuk penyesuaian ini..."
                        rows={2}
                        className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-neutral-700 outline-none transition-colors placeholder:text-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        style={{ borderColor: 'rgba(0,0,0,0.1)' }}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 bg-neutral-50/50 px-6 py-4">
                <Button variant="secondary" onClick={onClose} disabled={adjustMut.isPending}>
                    Batal
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!hasChanges || adjustMut.isPending}
                    className="min-w-[180px]"
                >
                    {adjustMut.isPending ? 'Menyimpan...' : 'Simpan Penyesuaian'}
                </Button>
            </div>
        </Modal>
    );
}

function calcTotal(services: BookingServiceItem[]): number {
    return services.reduce((sum, s) => sum + Number(s.price) * s.quantity, 0);
}

function buildAdjustments(original: BookingServiceItem[], current: BookingServiceItem[]): AdjustmentPayload[] {
    const adjustments: AdjustmentPayload[] = [];
    const currentIds = new Set(current.map((s) => s.id));

    for (const orig of original) {
        if (!currentIds.has(orig.id)) {
            adjustments.push({ action: 'remove', booking_service_id: orig.id });
        }
    }

    for (const cur of current) {
        if (cur.id.startsWith('temp_')) {
            adjustments.push({
                action: 'add',
                service_id: cur.service_id ?? undefined,
                name: cur.name,
                price: Number(cur.price),
                duration: cur.duration,
                quantity: cur.quantity,
            });
        }
    }

    for (const cur of current) {
        if (cur.id.startsWith('temp_')) continue;
        const orig = original.find((s) => s.id === cur.id);
        if (!orig) continue;

        if (orig.quantity !== cur.quantity) {
            adjustments.push({ action: 'update_quantity', booking_service_id: cur.id, quantity: cur.quantity });
        }
    }

    return adjustments;
}
