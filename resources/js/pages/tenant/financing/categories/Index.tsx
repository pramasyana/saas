import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import TenantLayout from '@/layouts/TenantLayout';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import {
    useCostCategories,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
} from '@/features/financing/hooks/useFinancing';
import type { CostCategory, CostCategoryFormData } from '@/features/financing/types';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemAnim = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

const COLOR_PRESETS = [
    '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#64748b',
];

export default function CategoriesIndex() {
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CostCategory | null>(null);
    const [showDeleteId, setShowDeleteId] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0]);

    const { data: categoriesRes, isLoading } = useCostCategories();
    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();
    const deleteCategory = useDeleteCategory();

    const categories = categoriesRes?.data ?? [];

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const data: CostCategoryFormData = {
            name: form.get('name') as string,
            description: (form.get('description') as string) || undefined,
            color: selectedColor,
            sort_order: Number(form.get('sort_order') ?? 0),
        };

        if (editingCategory) {
            updateCategory.mutate({ id: editingCategory.id, data }, {
                onSuccess: () => { setShowModal(false); setEditingCategory(null); setSelectedColor(COLOR_PRESETS[0]); },
            });
        } else {
            createCategory.mutate(data, {
                onSuccess: () => { setShowModal(false); setSelectedColor(COLOR_PRESETS[0]); },
            });
        }
    }

    function openEdit(cat: CostCategory) {
        setEditingCategory(cat);
        setSelectedColor(cat.color);
        setShowModal(true);
    }

    function handleDelete(id: string) {
        deleteCategory.mutate(id, { onSuccess: () => setShowDeleteId(null) });
    }

    return (
        <TenantLayout>
            <Head title="Kategori Biaya" />

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                {/* Header */}
                <motion.div variants={itemAnim} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">Kategori Biaya</h1>
                        <p className="mt-1 text-sm text-neutral-500">Kelola kategori untuk pengelompokan biaya operasional.</p>
                    </div>
                    <button
                        onClick={() => { setEditingCategory(null); setSelectedColor(COLOR_PRESETS[0]); setShowModal(true); }}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah Kategori
                    </button>
                </motion.div>

                {/* Categories Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-40 animate-pulse rounded-xl border border-neutral-200 bg-white" />
                        ))}
                    </div>
                ) : categories.length === 0 ? (
                    <motion.div variants={itemAnim} className="flex flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white py-16 text-center">
                        <svg className="h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                        </svg>
                        <p className="mt-3 text-sm font-medium text-neutral-500">Belum ada kategori biaya</p>
                        <p className="mt-1 text-xs text-neutral-400">Klik "Tambah Kategori" untuk membuat kategori pertama.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((cat) => (
                            <motion.div
                                key={cat.id}
                                variants={itemAnim}
                                className="group relative rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                                            style={{ backgroundColor: `${cat.color}15` }}
                                        >
                                            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: cat.color }} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-neutral-900">{cat.name}</h3>
                                            {cat.description && (
                                                <p className="mt-0.5 text-xs text-neutral-400 line-clamp-1">{cat.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                        <button onClick={() => openEdit(cat)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-primary">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                        <button onClick={() => setShowDeleteId(cat.id)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-danger-light hover:text-danger">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-4 text-xs text-neutral-500">
                                    <span className="flex items-center gap-1">
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                        {cat.costs_count ?? 0} entri
                                    </span>
                                    <span className="font-medium text-neutral-700">
                                        {formatPrice(cat.costs_sum_amount ?? 0)}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                    >
                        <h2 className="text-lg font-bold text-neutral-900">{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Nama *</label>
                                <input name="name" defaultValue={editingCategory?.name ?? ''} required className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Deskripsi</label>
                                <textarea name="description" rows={2} defaultValue={editingCategory?.description ?? ''} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Warna</label>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {COLOR_PRESETS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setSelectedColor(color)}
                                            className={cn(
                                                'h-8 w-8 rounded-full border-2 transition-transform',
                                                selectedColor === color ? 'scale-110 border-neutral-900' : 'border-transparent hover:scale-105',
                                            )}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Urutan</label>
                                <input name="sort_order" type="number" min="0" defaultValue={editingCategory?.sort_order ?? 0} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none" />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => { setShowModal(false); setEditingCategory(null); }} className="rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">Batal</button>
                                <button type="submit" disabled={createCategory.isPending || updateCategory.isPending} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50">
                                    {createCategory.isPending || updateCategory.isPending ? 'Menyimpan...' : 'Simpan'}
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
                        <h3 className="mt-4 text-base font-bold text-neutral-900">Hapus Kategori?</h3>
                        <p className="mt-1 text-sm text-neutral-500">Semua biaya di kategori ini juga akan dihapus.</p>
                        <div className="mt-5 flex justify-center gap-2">
                            <button onClick={() => setShowDeleteId(null)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50">Batal</button>
                            <button onClick={() => handleDelete(showDeleteId)} disabled={deleteCategory.isPending} className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-danger-600 disabled:opacity-50">
                                {deleteCategory.isPending ? 'Menghapus...' : 'Hapus'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </TenantLayout>
    );
}
