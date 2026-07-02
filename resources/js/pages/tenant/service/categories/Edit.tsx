import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import CategoryForm from '@/features/service/components/CategoryForm';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import { useUpdateCategory } from '@/features/service/hooks/useCategories';
import type { Category, CategoryFormData } from '@/features/service/types';
import type { Branch } from '@/features/company/types';
import TenantLayout from '@/layouts/TenantLayout';
import { useToastStore } from '@/stores/toast';

interface EditPageProps {
    title: string;
    category: Category;
}

function extractErrors(error: unknown): Record<string, string[]> {
    if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as Record<string, unknown>;

        if (data.errors && typeof data.errors === 'object') {
            return data.errors as Record<string, string[]>;
        }

        if (data.message && typeof data.message === 'string') {
            return { _general: [data.message] };
        }
    }

    return {};
}

export default function Edit({ title, category }: EditPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const updateMutation = useUpdateCategory();
    const [saving, setSaving] = useState(false);
    const [branchId, setBranchId] = useState(category.branch_id);
    const errors = extractErrors(updateMutation.error);
    const { data: branchesData } = useAllBranches();
    const branches = (branchesData?.data ?? []) as Branch[];

    function handleSave(data: CategoryFormData) {
        setSaving(true);
        updateMutation.mutate(
            { id: category.id, data: { ...data, branch_id: branchId } },
            {
                onSuccess: () => {
                    addToast('success', 'Kategori berhasil diperbarui.');
                    router.get('/service/categories');
                },
                onSettled: () => {
                    setSaving(false);
                },
            },
        );
    }

    return (
        <TenantLayout>
            <Head title={title} />

            {/* Breadcrumb */}
            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/service/categories" className="transition-colors hover:text-neutral-700">Layanan</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <Link href="/service/categories" className="transition-colors hover:text-neutral-700">Kategori</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Edit Kategori</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Kategori</h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Perbarui informasi kategori layanan yang sudah terdaftar.
                </p>
            </div>

            {/* Category Summary Card */}
            <FadeIn delay={0.03}>
                <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div
                        className="bg-gradient-to-r p-6 sm:p-8"
                        style={{
                            background: category.color
                                ? `linear-gradient(to right, ${category.color}, ${category.color}dd)`
                                : 'linear-gradient(to right, #6366F1, #4F46E5)',
                        }}
                    >
                        <div className="flex items-center gap-5">
                            <div
                                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-lg ring-4 ring-white/20"
                                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                            >
                                {category.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <div className="min-w-0 text-white">
                                <h2 className="text-xl font-bold">{category.name}</h2>
                                <p className="mt-1 text-sm text-white/80">{category.description || 'Tidak ada deskripsi'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 sm:grid-cols-3">
                        {[
                            { label: 'Urutan', value: String(category.sort_order) },
                            { label: 'Layanan', value: String(category.services_count ?? 0) },
                            { label: 'Status', value: category.is_active ? 'Aktif' : 'Nonaktif' },
                        ].map((item) => (
                            <div key={item.label} className="px-5 py-4">
                                <p className="text-xs font-medium text-neutral-400">{item.label}</p>
                                <p className={`mt-1 text-sm font-semibold ${
                                    item.label === 'Status' && !category.is_active ? 'text-danger' : 'text-neutral-900'
                                }`}>
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </FadeIn>

            {/* Form */}
            <FadeIn delay={0.06}>
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Cabang</label>
                        <Select
                            value={branchId}
                            onChange={(v) => setBranchId(v)}
                            options={branches
                                .filter((b) => b.is_active)
                                .map((b) => ({ value: b.id, label: b.name }))}
                            placeholder="Pilih cabang"
                        />
                        {errors.branch_id && <p className="mt-1 text-xs text-danger">{errors.branch_id}</p>}
                    </div>
                    <CategoryForm
                        category={category}
                        saving={saving}
                        errors={errors}
                        onSave={handleSave}
                    />
                </div>
            </FadeIn>
        </TenantLayout>
    );
}
