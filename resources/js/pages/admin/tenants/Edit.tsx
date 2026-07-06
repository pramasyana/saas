import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import TenantForm from '@/features/tenants/components/TenantForm';
import { useUpdateTenant } from '@/features/tenants/hooks/useTenants';
import type { TenantFormData } from '@/features/tenants/types';
import AdminLayout from '@/layouts/AdminLayout';
import TenantSubNav from '@/molecules/TenantSubNav';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/stores/toast';

interface EditTenantPageProps {
    title: string;
    tenant: {
        id: string;
        name: string | null;
        email: string | null;
        phone: string | null;
        domains: string[];
        user: { id: number; name: string; email: string } | null;
    };
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

const avatarColors = [
    'bg-primary text-white',
    'bg-emerald-500 text-white',
    'bg-amber-500 text-white',
    'bg-rose-500 text-white',
    'bg-sky-500 text-white',
    'bg-violet-500 text-white',
];

function getAvatarColor(name: string): string {
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getInitials(name: string | null): string {
    if (!name) {
return '?';
}

    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function EditTenant({ title, tenant }: EditTenantPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const updateMutation = useUpdateTenant();
    const [saving, setSaving] = useState(false);
    const errors = extractErrors(updateMutation.error);

    function handleSave(data: TenantFormData) {
        setSaving(true);
        updateMutation.mutate(
            { id: tenant.id, data },
            {
                onSuccess: () => {
                    addToast('success', 'Tenant berhasil diperbarui.');
                    router.get('/admin/tenants');
                },
                onSettled: () => {
                    setSaving(false);
                },
            },
        );
    }

    return (
        <AdminLayout>
            <Head title={title} />

            <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/admin/dashboard" className="transition-colors hover:text-neutral-700">Dashboard</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <Link href="/admin/tenants" className="transition-colors hover:text-neutral-700">Tenants</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Edit Tenant</span>
            </nav>

            <TenantSubNav tenantId={tenant.id} tenantName={tenant.name} tenantEmail={tenant.email} />

            <div className="mt-6 mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-neutral-900">Informasi Tenant</h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Perbarui informasi perusahaan yang sudah terdaftar.
                    </p>
                </div>
                <Link
                    href={`/admin/tenants/${tenant.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                    Kembali ke Detail
                </Link>
            </div>

            <FadeIn delay={0.03}>
                <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
                    <div className="mb-6 flex items-center gap-4 pb-6 border-b border-neutral-100">
                        <div className={cn(
                            'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold shadow-sm',
                            getAvatarColor(tenant.name ?? ''),
                        )}>
                            {getInitials(tenant.name)}
                        </div>
                        <div>
                            <p className="text-base font-semibold text-neutral-900">{tenant.name || 'Tanpa Nama'}</p>
                            <p className="mt-0.5 text-sm text-neutral-500">{tenant.email || 'Email tidak tersedia'}</p>
                            <p className="mt-0.5 text-xs text-neutral-400">
                                Domain: {tenant.domains?.[0] || '-'} · Telepon: {tenant.phone || '-'} · Pemilik: {tenant.user?.name || '-'}
                            </p>
                        </div>
                    </div>

                    <TenantForm
                        tenant={tenant}
                        saving={saving}
                        errors={errors}
                        onSave={handleSave}
                    />
                </div>
            </FadeIn>
        </AdminLayout>
    );
}
