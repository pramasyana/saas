import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    useCosts,
    useCreateCost,
    useUpdateCost,
    useDeleteCost,
    useImportCosts,
    useCostCategories,
    useFinancingStats,
} from '@/features/financing/hooks/useFinancing';
import type { Cost, CostFormData } from '@/features/financing/types';
import TenantLayout from '@/layouts/TenantLayout';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemAnim = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

const PER_PAGE_OPTIONS = [10, 15, 25, 50];

export default function CostsIndex() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [showModal, setShowModal] = useState(false);
    const [editingCost, setEditingCost] = useState<Cost | null>(null);
    const [showImport, setShowImport] = useState(false);
    const [csvText, setCsvText] = useState('');
    const [showDeleteId, setShowDeleteId] = useState<string | null>(null);

    const filters = {
        search: debouncedSearch,
        category_id: categoryId,
        date_from: dateFrom,
        date_to: dateTo,
        page,
        per_page: perPage,
    };

    const { data: costsRes, isLoading } = useCosts(filters);
    const { data: categoriesRes } = useCostCategories();
    const { data: statsRes } = useFinancingStats();
    const createCost = useCreateCost();
    const updateCost = useUpdateCost();
    const deleteCost = useDeleteCost();
    const importCosts = useImportCosts();

    const costs = costsRes?.data ?? [];
    const meta = costsRes?.meta;
    const categories = categoriesRes?.data ?? [];
    const stats = statsRes?.data;

    function handleSearch(value: string) {
        setSearch(value);
        clearTimeout((globalThis as Record<string, ReturnType<typeof setTimeout>>).__searchTimer);
        (globalThis as Record<string, ReturnType<typeof setTimeout>>).__searchTimer = setTimeout(() => {
            setDebouncedSearch(value);
            setPage(1);
        }, 400);
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const data: CostFormData = {
            cost_category_id: form.get('cost_category_id') as string,
            name: form.get('name') as string,
            amount: Number(form.get('amount')),
            date: form.get('date') as string,
            notes: (form.get('notes') as string) || undefined,
        };

        if (editingCost) {
            updateCost.mutate({ id: editingCost.id, data }, {
                onSuccess: () => {
 setShowModal(false); setEditingCost(null); 
},
            });
        } else {
            createCost.mutate(data, {
                onSuccess: () => {
 setShowModal(false); 
},
            });
        }
    }

    function handleImport(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        importCosts.mutate(csvText, {
            onSuccess: () => {
 setShowImport(false); setCsvText(''); 
},
        });
    }

    function openEdit(cost: Cost) {
        setEditingCost(cost);
        setShowModal(true);
    }

    function handleDelete(id: string) {
        deleteCost.mutate(id, { onSuccess: () => setShowDeleteId(null) });
    }

    return (
        <TenantLayout>
            <Head title="Biaya" />

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                {/* Header */}
                <motion.div variants={itemAnim} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">Biaya</h1>
                        <p className="mt-1 text-sm text-neutral-500">Kelola biaya operasional bisnis Anda.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowImport(true)}
                            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            Import CSV
                        </button>
                        <button
                            onClick={() => {
 setEditingCost(null); setShowModal(true); 
}}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Tambah Biaya
                        </button>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <motion.div variants={itemAnim} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm border-l-4 border-l-primary">
                        <p className="text-sm font-medium text-neutral-500">Total Kategori</p>
                        <p className="mt-1.5 text-2xl font-bold text-neutral-900">{stats?.total_categories ?? 0}</p>
                    </motion.div>
                    <motion.div variants={itemAnim} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm border-l-4 border-l-neutral-400">
                        <p className="text-sm font-medium text-neutral-500">Total Entri Biaya</p>
                        <p className="mt-1.5 text-2xl font-bold text-neutral-900">{stats?.total_costs ?? 0}</p>
                    </motion.div>
                    <motion.div variants={itemAnim} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm border-l-4 border-l-danger">
                        <p className="text-sm font-medium text-neutral-500">Biaya Bulan Ini</p>
                        <p className="mt-1.5 text-2xl font-bold text-neutral-900">{formatPrice(stats?.current_month_cost ?? 0)}</p>
                    </motion.div>
                    <motion.div variants={itemAnim} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm border-l-4 border-l-warning">
                        <p className="text-sm font-medium text-neutral-500">Biaya Bulan Lalu</p>
                        <p className="mt-1.5 text-2xl font-bold text-neutral-900">{formatPrice(stats?.prev_month_cost ?? 0)}</p>
                    </motion.div>
                </div>

                {/* Filters */}
                <motion.div variants={itemAnim} className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 sm:max-w-xs">
                        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Cari biaya..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <select
                        value={categoryId}
                        onChange={(e) => {
 setCategoryId(e.target.value); setPage(1); 
}}
                        className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 focus:border-primary focus:outline-none"
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => {
 setDateFrom(e.target.value); setPage(1); 
}}
                        className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 focus:border-primary focus:outline-none"
                    />
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => {
 setDateTo(e.target.value); setPage(1); 
}}
                        className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 focus:border-primary focus:outline-none"
                    />
                    <select
                        value={perPage}
                        onChange={(e) => {
 setPerPage(Number(e.target.value)); setPage(1); 
}}
                        className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 focus:border-primary focus:outline-none"
                    >
                        {PER_PAGE_OPTIONS.map((n) => (
                            <option key={n} value={n}>{n} / halaman</option>
                        ))}
                    </select>
                </motion.div>

                {/* Table */}
                <motion.div variants={itemAnim} className="rounded-xl border border-neutral-200 bg-white shadow-sm">
                    {isLoading ? (
                        <div className="p-6 space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-12 animate-pulse rounded-lg bg-neutral-100" />
                            ))}
                        </div>
                    ) : costs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <svg className="h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                            </svg>
                            <p className="mt-3 text-sm font-medium text-neutral-500">Belum ada data biaya</p>
                            <p className="mt-1 text-xs text-neutral-400">Klik "Tambah Biaya" untuk menambahkan entri pertama.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop table */}
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-neutral-100 text-left text-xs font-medium text-neutral-500">
                                            <th className="px-6 py-3">Nama</th>
                                            <th className="px-6 py-3">Kategori</th>
                                            <th className="px-6 py-3">Tanggal</th>
                                            <th className="px-6 py-3 text-right">Jumlah</th>
                                            <th className="px-6 py-3">Catatan</th>
                                            <th className="px-6 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {costs.map((cost) => (
                                            <tr key={cost.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50">
                                                <td className="px-6 py-3.5 font-medium text-neutral-900">{cost.name}</td>
                                                <td className="px-6 py-3.5">
                                                    <span
                                                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                                                        style={{
                                                            backgroundColor: `${cost.category.color}15`,
                                                            color: cost.category.color,
                                                        }}
                                                    >
                                                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cost.category.color }} />
                                                        {cost.category.name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3.5 text-neutral-500">{cost.date}</td>
                                                <td className="px-6 py-3.5 text-right font-medium text-danger">{formatPrice(cost.amount)}</td>
                                                <td className="px-6 py-3.5 text-neutral-400 max-w-[200px] truncate">{cost.notes ?? '-'}</td>
                                                <td className="px-6 py-3.5 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button onClick={() => openEdit(cost)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-primary">
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                            </svg>
                                                        </button>
                                                        <button onClick={() => setShowDeleteId(cost.id)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-danger-light hover:text-danger">
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile cards */}
                            <div className="space-y-3 p-4 md:hidden">
                                {costs.map((cost) => (
                                    <div key={cost.id} className="rounded-xl border border-neutral-200 p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium text-neutral-900">{cost.name}</p>
                                                <p className="mt-0.5 text-xs text-neutral-400">{cost.date}</p>
                                            </div>
                                            <p className="font-bold text-danger">{formatPrice(cost.amount)}</p>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span
                                                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                                                style={{ backgroundColor: `${cost.category.color}15`, color: cost.category.color }}
                                            >
                                                {cost.category.name}
                                            </span>
                                            {cost.notes && <span className="text-xs text-neutral-400 truncate max-w-[150px]">{cost.notes}</span>}
                                        </div>
                                        <div className="mt-3 flex items-center gap-2">
                                            <button onClick={() => openEdit(cost)} className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50">Edit</button>
                                            <button onClick={() => setShowDeleteId(cost.id)} className="rounded-lg border border-danger/20 px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger-light">Hapus</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {meta && (
                                <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4">
                                    <p className="text-xs text-neutral-400">
                                        {meta.total} data · Halaman {meta.current_page} dari {meta.last_page}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={meta.current_page <= 1}
                                            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 disabled:opacity-40"
                                        >
                                            Sebelumnya
                                        </button>
                                        {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => {
                                            const start = Math.max(1, Math.min(meta.current_page - 2, meta.last_page - 4));
                                            const p = start + i;

                                            if (p > meta.last_page) {
return null;
}

                                            return (
                                                <button
                                                    key={p}
                                                    onClick={() => setPage(p)}
                                                    className={cn(
                                                        'rounded-lg px-3 py-1.5 text-xs font-medium',
                                                        p === meta.current_page
                                                            ? 'bg-primary text-white'
                                                            : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50',
                                                    )}
                                                >
                                                    {p}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                                            disabled={meta.current_page >= meta.last_page}
                                            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 disabled:opacity-40"
                                        >
                                            Selanjutnya
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            </motion.div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
                    >
                        <h2 className="text-lg font-bold text-neutral-900">{editingCost ? 'Edit Biaya' : 'Tambah Biaya'}</h2>
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Kategori *</label>
                                <select name="cost_category_id" defaultValue={editingCost?.category.id ?? ''} required className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none">
                                    <option value="">Pilih kategori</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Nama *</label>
                                <input name="name" defaultValue={editingCost?.name ?? ''} required className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700">Jumlah (Rp) *</label>
                                    <input name="amount" type="number" step="0.01" min="0" defaultValue={editingCost?.amount ?? ''} required className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700">Tanggal *</label>
                                    <input name="date" type="date" defaultValue={editingCost?.date ?? new Date().toISOString().split('T')[0]} required className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Catatan</label>
                                <textarea name="notes" rows={3} defaultValue={editingCost?.notes ?? ''} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none" />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => {
 setShowModal(false); setEditingCost(null); 
}} className="rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">Batal</button>
                                <button type="submit" disabled={createCost.isPending || updateCost.isPending} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50">
                                    {createCost.isPending || updateCost.isPending ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Import Modal */}
            {showImport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
                    >
                        <h2 className="text-lg font-bold text-neutral-900">Import CSV</h2>
                        <p className="mt-1 text-sm text-neutral-500">Format: category, name, amount, date, notes</p>
                        <form onSubmit={handleImport} className="mt-4 space-y-4">
                            <textarea
                                value={csvText}
                                onChange={(e) => setCsvText(e.target.value)}
                                rows={8}
                                placeholder={"category,name,amount,date,notes\nOperasional,Listrik,500000,2026-07-01,Listrik bulanan\nMarketing,Iklan Facebook,200000,2026-07-05,"}
                                className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 font-mono text-xs focus:border-primary focus:outline-none"
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => {
 setShowImport(false); setCsvText(''); 
}} className="rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">Batal</button>
                                <button type="submit" disabled={importCosts.isPending} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50">
                                    {importCosts.isPending ? 'Mengimport...' : 'Import'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center"
                    >
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger-light">
                            <svg className="h-6 w-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-base font-bold text-neutral-900">Hapus Biaya?</h3>
                        <p className="mt-1 text-sm text-neutral-500">Data yang dihapus tidak dapat dikembalikan.</p>
                        <div className="mt-5 flex justify-center gap-2">
                            <button onClick={() => setShowDeleteId(null)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50">Batal</button>
                            <button onClick={() => handleDelete(showDeleteId)} disabled={deleteCost.isPending} className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-danger-600 disabled:opacity-50">
                                {deleteCost.isPending ? 'Menghapus...' : 'Hapus'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </TenantLayout>
    );
}
