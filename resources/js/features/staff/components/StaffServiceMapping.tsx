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
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (staffServices && !loaded) {
            setSelected(new Set(staffServices.map((s) => s.id)));
            setPrimaries(new Set(staffServices.filter((s) => s.is_primary).map((s) => s.id)));
            setLoaded(true);
        }
    }, [staffServices, loaded]);

    function toggle(id: string) {
        setSelected((prev) => {
            const next = new Set(prev);

            if (next.has(id)) {
                next.delete(id);
                setPrimaries((p) => {
 const p2 = new Set(p); p2.delete(id);

 return p2; 
});
            } else {
                next.add(id);
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

    async function handleSave() {
        const services = Array.from(selected).map((id) => ({
            id,
            is_primary: primaries.has(id),
        }));
        syncMutation.mutate(services, {
            onSuccess: () => addToast('success', 'Layanan staff diperbarui.'),
            onError: () => addToast('error', 'Gagal memperbarui layanan.'),
        });
    }

    const isLoading = loadingServices || loadingMapped;
    const services = allServices?.data ?? [];
    const hasChanges = (() => {
        if (!staffServices) {
return true;
}

        const mappedIds = new Set(staffServices.map((s) => s.id));

        if (mappedIds.size !== selected.size) {
return true;
}

        for (const id of mappedIds) {
if (!selected.has(id)) {
return true;
}
}

        return false;
    })();

    return (
        <div>
            <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-neutral-900">Layanan yang Ditangani</h3>
                    <p className="text-xs text-neutral-500">Pilih layanan yang bisa ditangani staff ini.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 animate-pulse rounded-lg bg-neutral-100" />
                    ))}
                </div>
            ) : services.length === 0 ? (
                <p className="text-sm text-neutral-400">Belum ada layanan. Tambah layanan terlebih dahulu.</p>
            ) : (
                <div className="space-y-1.5">
                    {services.map((svc) => {
                        const isSelected = selected.has(svc.id);
                        const isPrimary = primaries.has(svc.id);

                        return (
                            <div
                                key={svc.id}
                                className={cn(
                                    'flex items-center justify-between rounded-lg border px-4 py-2.5 transition-all',
                                    isSelected
                                        ? 'border-primary/30 bg-primary-50'
                                        : 'border-neutral-200 bg-white hover:border-neutral-300',
                                )}
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggle(svc.id)}
                                        className="h-4 w-4 shrink-0 rounded border-neutral-300 text-primary focus:ring-primary"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-neutral-900 truncate">{svc.name}</p>
                                        {svc.duration && (
                                            <p className="text-[11px] text-neutral-400">{svc.duration} menit</p>
                                        )}
                                    </div>
                                </div>
                                {isSelected && (
                                    <label className="flex items-center gap-1.5 shrink-0 ml-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isPrimary}
                                            onChange={() => togglePrimary(svc.id)}
                                            className="h-3.5 w-3.5 rounded border-neutral-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        <span className="text-[11px] font-medium text-neutral-500">Utama</span>
                                    </label>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={syncMutation.isPending || !hasChanges}
                    className={cn(
                        'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                        syncMutation.isPending || !hasChanges
                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-primary-dark',
                    )}
                >
                    {syncMutation.isPending ? 'Menyimpan...' : 'Simpan Layanan'}
                </button>
            </div>
        </div>
    );
}
