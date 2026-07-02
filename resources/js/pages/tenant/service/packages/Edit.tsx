import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import type { Branch } from '@/features/company/types';
import PackageForm from '@/features/service/components/PackageForm';
import { useUpdatePackage } from '@/features/service/hooks/usePackages';
import type { Package, PackageFormData } from '@/features/service/types';
import TenantLayout from '@/layouts/TenantLayout';
import { useToastStore } from '@/stores/toast';

interface EditPageProps {
    title: string;
    package: Package;
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

export default function Edit({ title, package: pkg }: EditPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const updateMutation = useUpdatePackage();
    const [saving, setSaving] = useState(false);
    const [branchId, setBranchId] = useState(pkg.branch_id);
    const errors = extractErrors(updateMutation.error);
    const { data: branchesData } = useAllBranches();
    const branches = (branchesData?.data ?? []) as Branch[];

    function handleSave(data: PackageFormData) {
        setSaving(true);
        updateMutation.mutate(
            { id: pkg.id, data: { ...data, branch_id: branchId } },
            {
                onSuccess: () => {
                    addToast('success', 'Paket berhasil diperbarui.');
                    router.get('/service/packages');
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
                <Link href="/dashboard" className="transition-colors hover:text-neutral-700">Dashboard</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <Link href="/service/packages" className="transition-colors hover:text-neutral-700">Paket</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Edit Paket</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Paket</h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Perbarui informasi paket layanan yang sudah ada.
                </p>
            </div>

            {/* Package Summary Card */}
            <FadeIn delay={0.03}>
                <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-6 sm:p-8">
                        <div className="flex items-center gap-5">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white shadow-lg ring-4 ring-white/20">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div className="min-w-0 text-white">
                                <h2 className="text-xl font-bold">{pkg.name}</h2>
                                {pkg.description && (
                                    <p className="mt-1 text-sm text-white/80">{pkg.description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 sm:grid-cols-4">
                        {[
                            { label: 'Harga', value: `Rp ${pkg.price.toLocaleString('id-ID')}` },
                            { label: 'Durasi', value: `${pkg.duration} menit` },
                            { label: 'Layanan', value: `${pkg.services_count ?? pkg.services?.length ?? 0} layanan` },
                            { label: 'Status', value: pkg.is_active ? 'Aktif' : 'Nonaktif' },
                        ].map((item) => (
                            <div key={item.label} className="px-5 py-4">
                                <p className="text-xs font-medium text-neutral-400">{item.label}</p>
                                <p className="mt-1 text-sm font-semibold text-neutral-900">
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
                    <PackageForm
                        packageData={pkg}
                        saving={saving}
                        errors={errors}
                        onSave={handleSave}
                    />
                </div>
            </FadeIn>
        </TenantLayout>
    );
}
