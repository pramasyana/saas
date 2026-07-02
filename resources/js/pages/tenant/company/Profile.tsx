import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState  } from 'react';
import type {FormEvent} from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import { useCompanyBranding } from '@/features/company/hooks/useCompanyBranding';
import { useCompanyProfile, useUpdateCompanyProfile } from '@/features/company/hooks/useCompanyProfile';
import type { CompanyProfile as CompanyProfileType } from '@/features/company/types';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/stores/toast';

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

function getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function CompanyProfilePage() {
    const addToast = useToastStore((s) => s.addToast);
    const { data: profile, isLoading } = useCompanyProfile();
    const { data: branding } = useCompanyBranding();
    const mutation = useUpdateCompanyProfile();
    const [saving, setSaving] = useState(false);
    const errors = extractErrors(mutation.error);

    const [form, setForm] = useState<CompanyProfileType>({
        address: '',
        city: '',
        province: '',
        postal_code: '',
        country: '',
        phone: '',
    });

    useEffect(() => {
        if (profile) {
            setForm({
                address: profile.address ?? '',
                city: profile.city ?? '',
                province: profile.province ?? '',
                postal_code: profile.postal_code ?? '',
                country: profile.country ?? '',
                phone: profile.phone ?? '',
            });
        }
    }, [profile]);

    function setField<K extends keyof CompanyProfileType>(key: K, value: CompanyProfileType[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSaving(true);
        const payload = { ...form };
        Object.keys(payload).forEach((k) => {
            const key = k as keyof CompanyProfileType;

            if (!payload[key]) {
payload[key] = null;
}
        });
        mutation.mutate(payload, {
            onSuccess: () => {
                addToast('success', 'Profil perusahaan berhasil diperbarui.');
            },
            onSettled: () => {
                setSaving(false);
            },
        });
    }

    function inputClass(field: string, extra?: string) {
        return cn(
            'block w-full rounded-xl border px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2',
            errors[field]
                ? 'border-danger ring-danger/20 focus:border-danger focus:ring-danger/30'
                : 'border-neutral-300 ring-neutral-300 focus:border-primary focus:ring-primary/30',
            'disabled:bg-neutral-50 disabled:text-neutral-500',
            extra,
        );
    }

    function renderField(
        label: string,
        field: string,
        children: React.ReactNode,
    ) {
        const fieldErrors = errors[field];

        return (
            <div>
                <label className="block text-sm font-medium text-neutral-700">{label}</label>
                <div className="relative mt-1.5">{children}</div>
                {fieldErrors && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-danger">
                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <span>{fieldErrors[0]}</span>
                    </div>
                )}
            </div>
        );
    }

    const initial = getInitials(profile?.city || 'Perusahaan');
    const avatarColor = getAvatarColor(profile?.city || 'Perusahaan');

    const filledCount = [form.address, form.city, form.province, form.postal_code, form.country, form.phone].filter(Boolean).length;
    const pct = Math.round((filledCount / 6) * 100);

    if (isLoading) {
        return (
            <TenantLayout>
                <div className="flex items-center justify-center py-20">
                    <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                </div>
            </TenantLayout>
        );
    }

    return (
        <TenantLayout>
            <Head title="Profil Perusahaan" />

            {/* Breadcrumb */}
            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/company/profile" className="transition-colors hover:text-neutral-700">Perusahaan</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Profile</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Profil Perusahaan</h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Atur informasi profil perusahaan Anda agar pelanggan mudah menemukan Anda.
                </p>
            </div>

            {/* Summary Card */}
            <FadeIn delay={0.03}>
                <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div
                        className="bg-gradient-to-r from-primary via-primary-dark to-primary p-6 sm:p-8"
                        style={branding?.primary_color ? { background: `linear-gradient(135deg, ${branding.primary_color}, ${branding.primary_color}dd)` } : undefined}
                    >
                        <div className="flex items-center gap-5">
                            <div className={cn(
                                'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold shadow-lg ring-4 ring-white/20',
                                avatarColor,
                            )}>
                                {initial}
                            </div>
                            <div className="min-w-0 text-white">
                                <h2 className="text-xl font-bold truncate">Profil Perusahaan</h2>
                                <p className="mt-1 text-sm text-white/80">{form.city || form.province || 'Lengkapi alamat perusahaan'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 sm:grid-cols-4">
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Kota</p>
                            <p className="mt-1 text-sm font-semibold text-neutral-900 truncate">{form.city || '-'}</p>
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Provinsi</p>
                            <p className="mt-1 text-sm font-semibold text-neutral-900">{form.province || '-'}</p>
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Kode Pos</p>
                            <p className="mt-1 text-sm font-semibold text-neutral-900">{form.postal_code || '-'}</p>
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Negara</p>
                            <p className="mt-1 text-sm font-semibold text-neutral-900">{form.country || '-'}</p>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Form */}
            <FadeIn delay={0.06}>
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors._general && (
                            <div className="flex items-center gap-2.5 rounded-xl border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
                                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                                <span>{errors._general[0]}</span>
                            </div>
                        )}

                        {renderField('Alamat Lengkap', 'address', (
                            <textarea
                                value={form.address ?? ''}
                                onChange={(e) => setField('address', e.target.value)}
                                className={inputClass('address', 'min-h-[100px]')}
                                placeholder="Masukkan alamat lengkap perusahaan"
                                rows={4}
                            />
                        ))}

                        <div className="grid gap-5 sm:grid-cols-2">
                            {renderField('Kota / Kabupaten', 'city', (
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={form.city ?? ''}
                                        onChange={(e) => setField('city', e.target.value)}
                                        className={inputClass('city', 'pl-10')}
                                        placeholder="Contoh: Jakarta Selatan"
                                    />
                                </div>
                            ))}
                            {renderField('Provinsi', 'province', (
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={form.province ?? ''}
                                        onChange={(e) => setField('province', e.target.value)}
                                        className={inputClass('province', 'pl-10')}
                                        placeholder="Contoh: DKI Jakarta"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="grid gap-5 sm:grid-cols-3">
                            {renderField('Kode Pos', 'postal_code', (
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={form.postal_code ?? ''}
                                        onChange={(e) => setField('postal_code', e.target.value)}
                                        className={inputClass('postal_code', 'pl-10')}
                                        placeholder="12345"
                                    />
                                </div>
                            ))}
                            {renderField('Negara', 'country', (
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={form.country ?? ''}
                                        onChange={(e) => setField('country', e.target.value)}
                                        className={inputClass('country', 'pl-10')}
                                        placeholder="Indonesia"
                                    />
                                </div>
                            ))}
                            {renderField('No. Telepon', 'phone', (
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={form.phone ?? ''}
                                        onChange={(e) => setField('phone', e.target.value)}
                                        className={inputClass('phone', 'pl-10')}
                                        placeholder="+62 xxx xxxx"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-6">
                            <div className="mr-auto flex items-center gap-2">
                                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-neutral-200">
                                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-xs text-neutral-400">{pct}% lengkap</span>
                            </div>
                            <Button type="submit" disabled={saving} className="min-w-[140px]">
                                {saving ? (
                                    <span className="inline-flex items-center gap-2">
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Menyimpan...
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        Simpan Perubahan
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </FadeIn>
        </TenantLayout>
    );
}
