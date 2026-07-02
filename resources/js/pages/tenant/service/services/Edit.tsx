import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import type { Branch } from '@/features/company/types';
import ServiceForm from '@/features/service/components/ServiceForm';
import { useUpdateService } from '@/features/service/hooks/useServices';
import type { ServiceFormData, ServiceItem } from '@/features/service/types';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/stores/toast';

interface EditPageProps {
    title: string;
    service: ServiceItem;
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

export default function Edit({ title, service }: EditPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const updateMutation = useUpdateService();
    const [saving, setSaving] = useState(false);
    const [branchId, setBranchId] = useState(service.branch_id);
    const errors = extractErrors(updateMutation.error);
    const { data: branchesData } = useAllBranches();
    const branches = (branchesData?.data ?? []) as Branch[];

    function handleSave(data: ServiceFormData) {
        setSaving(true);
        updateMutation.mutate(
            { id: service.id, data: { ...data, branch_id: branchId } },
            {
                onSuccess: () => {
                    addToast('success', 'Layanan berhasil diperbarui.');
                    router.get('/service/services');
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
                <Link href="/service/services" className="transition-colors hover:text-neutral-700">Layanan</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Edit Layanan</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Layanan</h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Perbarui informasi layanan yang sudah ada.
                </p>
            </div>

            {/* Service Summary Card */}
            <FadeIn delay={0.03}>
                <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div
                        className={cn('p-6 sm:p-8', !service.color && 'bg-gradient-to-r from-primary via-primary-dark to-primary')}
                        style={service.color ? {
                            background: `linear-gradient(to right, ${service.color}, ${service.color}dd, ${service.color}99)`,
                        } : undefined}
                    >
                        <div className="flex items-center gap-5">
                            <div
                                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-lg ring-4 ring-white/20"
                                style={{ backgroundColor: service.color || undefined }}
                            >
                                {service.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 text-white">
                                <h2 className="text-xl font-bold">{service.name}</h2>
                                <p className="mt-1 text-sm text-white/80">{service.category_name || 'Tanpa kategori'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 sm:grid-cols-3">
                        {[
                            { label: 'Durasi', value: `${service.duration} menit` },
                            { label: 'Harga', value: `Rp ${service.price.toLocaleString('id-ID')}` },
                            { label: 'Status', value: service.is_active ? 'Aktif' : 'Nonaktif' },
                        ].map((item) => (
                            <div key={item.label} className="px-5 py-4">
                                <p className="text-xs font-medium text-neutral-400">{item.label}</p>
                                <p className={cn(
                                    'mt-1 text-sm font-semibold',
                                    item.label === 'Status' ? (service.is_active ? 'text-success' : 'text-neutral-500') : 'text-neutral-900',
                                )}>
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
                    <ServiceForm
                        service={service}
                        saving={saving}
                        errors={errors}
                        onSave={handleSave}
                    />
                </div>
            </FadeIn>
        </TenantLayout>
    );
}
