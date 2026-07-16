import { useEffect, useState } from 'react';
import { useAllServices } from '@/features/service/hooks/useServices';
import { useStaffServices, useSyncStaffServices } from '@/features/staff/hooks/useStaffServices';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/stores/toast';

interface StaffServiceMappingProps {
    staffId: string;
}

export default function StaffServiceMapping({ staffId }: StaffServiceMappingProps) {
    const addToast = useToastStore((s) => s.addToast);
    const { data: allServices, isLoading: loadingServices } = useAllServices();
    const { data: staffServices, isLoading: loadingMapped } = useStaffServices(staffId);
    const syncMutation = useSyncStaffServices(staffId);

    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [primaries, setPrimaries] = useState<Set<string>>(new Set());
    const [percentages, setPercentages] = useState<Record<string, number>>({});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (staffServices && !loaded) {
            setSelected(new Set(staffServices.map((s) => s.id)));
            setPrimaries(new Set(staffServices.filter((s) => s.is_primary).map((s) => s.id)));
            const pctMap: Record<string, number> = {};
            for (const s of staffServices) {
                pctMap[s.id] = s.commission_percentage;
            }
            setPercentages(pctMap);
            setLoaded(true);
        }
    }, [staffServices, loaded]);

    function toggle(id: string) {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
                setPrimaries((p) => {
                    const p2 = new Set(p);
                    p2.delete(id);
                    return p2;
                });
            } else {
                next.add(id);
                if (!(id in percentages)) {
                    setPercentages((prev) => ({ ...prev, [id]: 0 }));
                }
            }
            return next;
        });
    }

    function togglePrimary(id: string) {
        setPrimaries((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }

    function setPercentage(id: string, value: number) {
        setPercentages((prev) => ({ ...prev, [id]: Math.min(100, Math.max(0, value)) }));
    }

    function handleSave() {
        const services = Array.from(selected).map((id) => ({
            id,
            is_primary: primaries.has(id),
            commission_percentage: percentages[id] ?? 0,
        }));
        syncMutation.mutate(services, {
            onSuccess: () => addToast('success', 'Layanan staff diperbarui.'),
            onError: () => addToast('error', 'Gagal memperbarui layanan.'),
        });
    }

    const isLoading = loadingServices || loadingMapped;
    const services = allServices?.data ?? [];
    const hasChanges = (() => {
        if (!staffServices) return true;
        const mappedIds = new Set(staffServices.map((s) => s.id));
        if (mappedIds.size !== selected.size) return true;
        for (const id of mappedIds) {
            if (!selected.has(id)) return true;
            const original = staffServices.find((s) => s.id === id);
            if (original && original.commission_percentage !== (percentages[id] ?? 0)) return true;
        }
        return false;
    })();

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-4 rounded-xl border border-neutral-100 bg-neutral-50 px-5 py-4">
                        <div className="h-5 w-5 animate-pulse rounded bg-neutral-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
                            <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
                        </div>
                        <div className="h-8 w-16 animate-pulse rounded-lg bg-neutral-200" />
                    </div>
                ))}
            </div>
        );
    }

    if (services.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 py-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                    <svg className="h-7 w-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.049.58.026 1.193-.14 1.743" />
                    </svg>
                </div>
                <p className="text-sm font-medium text-neutral-900">Belum ada layanan</p>
                <p className="text-xs text-neutral-500">Tambah layanan terlebih dahulu di menu Layanan.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="space-y-2">
                {services.map((svc) => {
                    const isSelected = selected.has(svc.id);
                    const isPrimary = primaries.has(svc.id);
                    const pct = percentages[svc.id] ?? 0;

                    return (
                        <div
                            key={svc.id}
                            className={cn(
                                'rounded-xl border px-5 py-3.5 transition-all duration-200',
                                isSelected
                                    ? 'border-primary/20 bg-primary-50/40 shadow-sm'
                                    : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm',
                            )}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggle(svc.id)}
                                        className="h-4.5 w-4.5 shrink-0 rounded border-neutral-300 text-primary focus:ring-primary"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="truncate text-sm font-semibold text-neutral-900">{svc.name}</p>
                                            {isSelected && isPrimary && (
                                                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                                                    Utama
                                                </span>
                                            )}
                                        </div>
                                        {svc.duration && (
                                            <p className="mt-0.5 text-xs text-neutral-500">{svc.duration} menit</p>
                                        )}
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="flex shrink-0 items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <input
                                                type="number"
                                                min={0}
                                                max={100}
                                                step={0.5}
                                                value={pct}
                                                onChange={(e) => setPercentage(svc.id, parseFloat(e.target.value) || 0)}
                                                className="w-16 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-right text-xs font-semibold text-neutral-700 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                                            />
                                            <span className="text-xs font-medium text-neutral-400">%</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => togglePrimary(svc.id)}
                                            className={cn(
                                                'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all',
                                                isPrimary
                                                    ? 'border-amber-300 bg-amber-50 text-amber-700'
                                                    : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50',
                                            )}
                                        >
                                            <svg className="h-3.5 w-3.5" fill={isPrimary ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                            </svg>
                                            Utama
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-5">
                <p className="text-xs text-neutral-500">
                    {selected.size} dari {services.length} layanan dipilih
                </p>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={syncMutation.isPending || !hasChanges}
                    className={cn(
                        'inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30',
                        syncMutation.isPending || !hasChanges
                            ? 'cursor-not-allowed bg-neutral-200 text-neutral-400'
                            : 'bg-primary hover:bg-primary-dark hover:shadow-md',
                    )}
                >
                    {syncMutation.isPending ? (
                        <>
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Simpan Layanan
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
