import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import AdminLayout from '@/layouts/AdminLayout';
import TenantSubNav from '@/molecules/TenantSubNav';
import { useToastStore } from '@/stores/toast';

interface BrandingData {
    primary_color: string | null;
    secondary_color: string | null;
    custom_css: string | null;
}

interface Props {
    branding: BrandingData | null;
    tenant_id: string;
    tenant_name?: string | null;
    tenant_email?: string | null;
}

const DEFAULT_PRIMARY = '#4F46E5';
const DEFAULT_SECONDARY = '#10B981';

export default function CompanyBranding({ branding, tenant_id, tenant_name, tenant_email }: Props) {
    const addToast = useToastStore((s) => s.addToast);

    const { data, setData, put, errors, processing } = useForm({
        primary_color: branding?.primary_color ?? DEFAULT_PRIMARY,
        secondary_color: branding?.secondary_color ?? DEFAULT_SECONDARY,
        custom_css: branding?.custom_css ?? '',
    });

    const primaryPreview = data.primary_color || DEFAULT_PRIMARY;
    const secondaryPreview = data.secondary_color || DEFAULT_SECONDARY;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/tenants/${tenant_id}/company/branding`, {
            onSuccess: () => addToast('success', 'Branding berhasil diperbarui.'),
        });
    }

    function inputClass(field: string) {
        const hasError = errors[field];

        return [
            'block w-full rounded-lg border px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2',
            hasError
                ? 'border-danger ring-danger/20 focus:border-danger focus:ring-danger/30'
                : 'border-neutral-300 ring-neutral-300 focus:border-primary focus:ring-primary/30',
        ].join(' ');
    }

    return (
        <AdminLayout>
            <Head title="Branding" />

            <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/admin/dashboard" className="transition-colors hover:text-neutral-700">Dashboard</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <Link href="/admin/tenants" className="transition-colors hover:text-neutral-700">Tenants</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Branding</span>
            </nav>

            <TenantSubNav tenantId={tenant_id} tenantName={tenant_name} tenantEmail={tenant_email} />

            <div className="mt-6 mb-6">
                <h1 className="text-xl font-bold tracking-tight text-neutral-900">Branding</h1>
                <p className="mt-1 text-sm text-neutral-500">
                    Kelola tampilan visual perusahaan tenant.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <FadeIn delay={0.03}>
                        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {errors._general && (
                                    <div className="flex items-center gap-2.5 rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
                                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                        </svg>
                                        <span>{errors._general[0]}</span>
                                    </div>
                                )}

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700">Warna Utama (Primary)</label>
                                        <div className="relative mt-1.5">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                                <div
                                                    className="h-5 w-5 rounded-full border border-neutral-200 shadow-sm"
                                                    style={{ backgroundColor: primaryPreview }}
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={data.primary_color}
                                                onChange={(e) => setData('primary_color', e.target.value)}
                                                className={inputClass('primary_color') + ' pl-11'}
                                                placeholder={DEFAULT_PRIMARY}
                                            />
                                        </div>
                                        {errors.primary_color && <p className="mt-1 text-xs text-danger">{errors.primary_color[0]}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700">Warna Sekunder (Secondary)</label>
                                        <div className="relative mt-1.5">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                                <div
                                                    className="h-5 w-5 rounded-full border border-neutral-200 shadow-sm"
                                                    style={{ backgroundColor: secondaryPreview }}
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={data.secondary_color}
                                                onChange={(e) => setData('secondary_color', e.target.value)}
                                                className={inputClass('secondary_color') + ' pl-11'}
                                                placeholder={DEFAULT_SECONDARY}
                                            />
                                        </div>
                                        {errors.secondary_color && <p className="mt-1 text-xs text-danger">{errors.secondary_color[0]}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700">Custom CSS</label>
                                    <textarea
                                        value={data.custom_css}
                                        onChange={(e) => setData('custom_css', e.target.value)}
                                        className={inputClass('custom_css') + ' min-h-[200px] font-mono text-xs'}
                                        placeholder="/* Tulis CSS kustom di sini */"
                                        rows={8}
                                    />
                                    {errors.custom_css && <p className="mt-1 text-xs text-danger">{errors.custom_css[0]}</p>}
                                    <p className="mt-1.5 text-xs text-neutral-400">
                                        CSS ini akan ditambahkan ke halaman landing tenant. Gunakan dengan hati-hati.
                                    </p>
                                </div>

                                <div className="flex items-center justify-end border-t border-neutral-200 pt-6">
                                    <Button type="submit" disabled={processing} className="min-w-[140px]">
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </FadeIn>
                </div>

                <div>
                    <FadeIn delay={0.06}>
                        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Pratinjau Warna</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-medium text-neutral-500 mb-1.5">Warna Utama</p>
                                    <div className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50 p-3">
                                        <div
                                            className="h-10 w-10 rounded-lg shadow-sm"
                                            style={{ backgroundColor: primaryPreview }}
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">{primaryPreview}</p>
                                            <p className="text-xs text-neutral-500">Primary</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-neutral-500 mb-1.5">Warna Sekunder</p>
                                    <div className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50 p-3">
                                        <div
                                            className="h-10 w-10 rounded-lg shadow-sm"
                                            style={{ backgroundColor: secondaryPreview }}
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">{secondaryPreview}</p>
                                            <p className="text-xs text-neutral-500">Secondary</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.09}>
                        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Tips</h3>
                            <ul className="space-y-2 text-xs text-neutral-500">
                                <li className="flex items-start gap-2">
                                    <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    Gunakan kode warna hex (contoh: #4F46E5)
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    Pilih warna dengan kontras yang baik
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    Custom CSS hanya untuk kustomisasi lanjutan
                                </li>
                            </ul>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </AdminLayout>
    );
}
