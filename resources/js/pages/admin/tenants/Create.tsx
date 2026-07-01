import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import FadeIn from '@/atoms/FadeIn';
import TenantForm from '@/features/tenants/components/TenantForm';
import { useCreateTenant } from '@/features/tenants/hooks/useTenants';
import { useToastStore } from '@/stores/toast';
import type { TenantFormData } from '@/features/tenants/types';

interface CreateTenantPageProps {
    title: string;
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

export default function CreateTenant({ title }: CreateTenantPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const createMutation = useCreateTenant();
    const [saving, setSaving] = useState(false);
    const errors = extractErrors(createMutation.error);

    function handleSave(data: TenantFormData) {
        setSaving(true);
        createMutation.mutate(data, {
            onSuccess: () => {
                addToast('success', 'Tenant berhasil ditambahkan.');
                router.get('/admin/tenants');
            },
            onSettled: () => {
                setSaving(false);
            },
        });
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
                <span className="font-medium text-neutral-900">Tambah Tenant</span>
            </nav>

            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Tambah Tenant Baru</h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Daftarkan perusahaan baru untuk menggunakan platform.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <FadeIn className="lg:col-span-2" delay={0.05}>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
                        <TenantForm
                            tenant={null}
                            saving={saving}
                            errors={errors}
                            onSave={handleSave}
                        />
                    </div>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <div className="space-y-5">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-900">Domain Tenant</p>
                                    <p className="text-xs text-neutral-500">Tips pengaturan domain.</p>
                                </div>
                            </div>
                            <ul className="mt-4 space-y-2.5">
                                {[
                                    'Domain digunakan untuk mengakses panel tenant secara terpisah.',
                                    'Gunakan subdomain yang mudah diingat, misal: "perusahaan.domain.com".',
                                    'Pastikan domain belum digunakan oleh tenant lain.',
                                    'Domain bisa diubah kapan saja melalui menu edit tenant.',
                                ].map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-600">
                                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[10px] font-bold text-primary">
                                            {i + 1}
                                        </span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning-light text-warning">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-900">Informasi</p>
                                    <p className="text-xs text-neutral-500">Yang perlu diketahui.</p>
                                </div>
                            </div>
                            <ul className="mt-4 space-y-2.5">
                                {[
                                    'Tenant akan mendapatkan database terpisah secara otomatis.',
                                    'Setiap tenant memiliki data yang terisolasi satu sama lain.',
                                    'Tenant bisa memiliki banyak user dengan akses berbeda.',
                                    'Semua tagihan dan subscription dikelola per tenant.',
                                ].map((info, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-600">
                                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-warning-light text-[10px] font-bold text-warning">
                                            !
                                        </span>
                                        {info}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </AdminLayout>
    );
}
