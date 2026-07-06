import { useState, useEffect, useCallback } from 'react';
import { useTenants } from '@/features/tenants/hooks/useTenants';

interface TenantSelectModalProps {
    open: boolean;
    selectedIds: string[];
    onSelect: (ids: string[]) => void;
    onClose: () => void;
}

export default function TenantSelectModal({ open, selectedIds, onSelect, onClose }: TenantSelectModalProps) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [localSelected, setLocalSelected] = useState<string[]>(selectedIds);

    const { data, isLoading } = useTenants({ search, page, per_page: 10, sort: 'created_at', direction: 'desc' });

    const tenants = data?.data ?? [];
    const meta = data?.meta;

    useEffect(() => {
        if (open) {
            setLocalSelected(selectedIds);
            setSearch('');
            setPage(1);
        }
    }, [open, selectedIds]);

    function toggleTenant(id: string) {
        setLocalSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    }

    function handleSave() {
        onSelect(localSelected);
        onClose();
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div
                className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                    <h2 className="text-base font-semibold text-neutral-900">Pilih Tenant</h2>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-5 py-3">
                    <input
                        type="text"
                        placeholder="Cari tenant..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        autoFocus
                    />
                </div>

                <div className="max-h-72 overflow-y-auto px-5">
                    {isLoading ? (
                        <div className="space-y-3 py-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-10 animate-pulse rounded-xl bg-neutral-100" />
                            ))}
                        </div>
                    ) : tenants.length === 0 ? (
                        <p className="py-8 text-center text-sm text-neutral-500">Tidak ada tenant ditemukan</p>
                    ) : (
                        <div className="divide-y divide-neutral-100">
                            {tenants.map((tenant) => (
                                <label
                                    key={tenant.id}
                                    className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-neutral-50 -mx-1 px-1 rounded-lg transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={localSelected.includes(tenant.id)}
                                        onChange={() => toggleTenant(tenant.id)}
                                        className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-neutral-900 truncate">{tenant.name ?? 'Tanpa Nama'}</p>
                                        <p className="text-xs text-neutral-500 truncate">{tenant.email ?? tenant.id}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {meta && meta.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-3">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-40"
                        >
                            Sebelumnya
                        </button>
                        <span className="text-xs text-neutral-500">
                            Halaman {meta.current_page} dari {meta.last_page}
                        </span>
                        <button
                            disabled={page >= meta.last_page}
                            onClick={() => setPage((p) => p + 1)}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-40"
                        >
                            Selanjutnya
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between border-t border-neutral-200 px-5 py-4">
                    <p className="text-xs text-neutral-500">{localSelected.length} tenant dipilih</p>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50">
                            Batal
                        </button>
                        <button onClick={handleSave} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark">
                            Simpan ({localSelected.length})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
