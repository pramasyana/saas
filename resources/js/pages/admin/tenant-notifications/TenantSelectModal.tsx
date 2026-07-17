import { useState, useEffect } from 'react';
import { useTenants } from '@/features/tenants/hooks/useTenants';
import Modal from '@/molecules/Modal';

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

    return (
        <Modal open={open} onClose={onClose} size="lg">
            <div className="border-b border-border px-6 py-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-neutral-900">Pilih Tenant</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="px-6 py-3">
                <div className="relative">
                    <svg
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Cari tenant..."
                        value={search}
                        onChange={(e) => {
 setSearch(e.target.value); setPage(1); 
}}
                        className="w-full rounded-xl border border-neutral-300 py-2.5 pl-9 pr-4 text-sm shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        autoFocus
                    />
                </div>
            </div>

            <div className="max-h-72 overflow-y-auto px-6">
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
                                className="flex items-center gap-3 rounded-lg px-1 py-2.5 -mx-1 cursor-pointer transition-colors hover:bg-neutral-50"
                            >
                                <input
                                    type="checkbox"
                                    checked={localSelected.includes(tenant.id)}
                                    onChange={() => toggleTenant(tenant.id)}
                                    className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-neutral-900">{tenant.name ?? 'Tanpa Nama'}</p>
                                    <p className="truncate text-xs text-neutral-500">{tenant.email ?? tenant.id}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-3">
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

            <div className="flex items-center justify-between border-t border-border px-6 py-4">
                <p className="text-xs text-neutral-500">{localSelected.length} tenant dipilih</p>
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                    >
                        Simpan ({localSelected.length})
                    </button>
                </div>
            </div>
        </Modal>
    );
}
