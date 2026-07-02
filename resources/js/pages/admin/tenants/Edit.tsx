import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import TenantForm from '@/features/tenants/components/TenantForm';
import { useUpdateTenant } from '@/features/tenants/hooks/useTenants';
import type { TenantFormData } from '@/features/tenants/types';
import AdminLayout from '@/layouts/AdminLayout';
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

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
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

            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Tenant</h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Perbarui informasi perusahaan yang sudah terdaftar.
                </p>
            </div>

            <FadeIn delay={0.03}>
                <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-6 sm:p-8">
                        <div className="flex items-center gap-5">
                            <div className={cn(
                                'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold shadow-lg ring-4 ring-white/20',
                                getAvatarColor(tenant.name ?? ''),
                            )}>
                                {getInitials(tenant.name)}
                            </div>
                            <div className="min-w-0 text-white">
                                <h2 className="text-xl font-bold truncate">{tenant.name || 'Tanpa Nama'}</h2>
                                <p className="mt-1 text-sm text-white/80">{tenant.email || 'Email tidak tersedia'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 sm:grid-cols-4">
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Domain</p>
                            <p className="mt-1 text-sm font-semibold text-neutral-900 truncate">
                                {tenant.domains?.[0] || '-'}
                            </p>
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Telepon</p>
                            <p className="mt-1 text-sm font-semibold text-neutral-900">
                                {tenant.phone || '-'}
                            </p>
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Pemilik</p>
                            <p className="mt-1 text-sm font-semibold text-neutral-900 truncate">
                                {tenant.user?.name || '-'}
                            </p>
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Email Pemilik</p>
                            <p className="mt-1 text-sm font-semibold text-neutral-900 truncate">
                                {tenant.user?.email || '-'}
                            </p>
                        </div>
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.06}>
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
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
