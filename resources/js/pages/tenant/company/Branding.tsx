import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState, useRef  } from 'react';
import type {FormEvent} from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import { useCompanyBranding, useUpdateCompanyBranding } from '@/features/company/hooks/useCompanyBranding';
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

export default function CompanyBrandingPage() {
    const addToast = useToastStore((s) => s.addToast);
    const { data: branding, isLoading } = useCompanyBranding();
    const mutation = useUpdateCompanyBranding();
    const [saving, setSaving] = useState(false);
    const errors = extractErrors(mutation.error);

    const [primaryColor, setPrimaryColor] = useState('#2563eb');
    const [secondaryColor, setSecondaryColor] = useState('#7c3aed');
    const [customCss, setCustomCss] = useState('');
    const [faviconFile, setFaviconFile] = useState<File | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (branding) {
            setPrimaryColor(branding.primary_color ?? '#2563eb');
            setSecondaryColor(branding.secondary_color ?? '#7c3aed');
            setCustomCss(branding.custom_css ?? '');

            if (branding.favicon_url) {
                setFaviconPreview(branding.favicon_url);
            }
        }
    }, [branding]);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) {
return;
}

        setFaviconFile(file);
        const reader = new FileReader();
        reader.onload = () => setFaviconPreview(reader.result as string);
        reader.readAsDataURL(file);
    }

    function handleRemoveFavicon() {
        setFaviconFile(null);
        setFaviconPreview(null);

        if (fileInputRef.current) {
fileInputRef.current.value = '';
}
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSaving(true);
        const fd = new FormData();
        fd.append('primary_color', primaryColor);
        fd.append('secondary_color', secondaryColor);

        if (customCss) {
fd.append('custom_css', customCss);
}

        if (faviconFile) {
            fd.append('favicon', faviconFile);
        } else if (faviconPreview === null && branding?.favicon_url) {
            fd.append('remove_favicon', '1');
        }

        mutation.mutate(fd, {
            onSuccess: () => {
                addToast('success', 'Branding berhasil diperbarui.');
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
            <Head title="Branding" />

            {/* Breadcrumb */}
            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/company/branding" className="transition-colors hover:text-neutral-700">Perusahaan</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Branding</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Branding</h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Sesuaikan tampilan visual perusahaan Anda agar lebih profesional dan konsisten.
                </p>
            </div>

            {/* Summary Card */}
            <FadeIn delay={0.03}>
                <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div
                        className="bg-gradient-to-r from-primary via-primary-dark to-primary p-6 sm:p-8"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                    >
                        <div className="flex items-center gap-5">
                            <div className={cn(
                                'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold shadow-lg ring-4 ring-white/20',
                                getAvatarColor('Brand'),
                            )}>
                                {faviconPreview ? (
                                    <img src={faviconPreview} alt="Favicon" className="h-10 w-10 object-contain" />
                                ) : (
                                    getInitials('BR')
                                )}
                            </div>
                            <div className="min-w-0 text-white">
                                <h2 className="text-xl font-bold truncate">Tampilan Brand</h2>
                                <p className="mt-1 text-sm text-white/80">Warna dan favicon perusahaan Anda</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 sm:grid-cols-4">
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Warna Utama</p>
                            <div className="mt-1 flex items-center gap-2">
                                <div className="h-4 w-4 rounded" style={{ backgroundColor: primaryColor }} />
                                <p className="text-sm font-semibold text-neutral-900">{primaryColor}</p>
                            </div>
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Warna Sekunder</p>
                            <div className="mt-1 flex items-center gap-2">
                                <div className="h-4 w-4 rounded" style={{ backgroundColor: secondaryColor }} />
                                <p className="text-sm font-semibold text-neutral-900">{secondaryColor}</p>
                            </div>
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Gradien</p>
                            <div className="mt-1 h-4 w-full rounded" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }} />
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Favicon</p>
                            <p className="mt-1 text-sm font-semibold text-neutral-900 truncate">
                                {faviconPreview ? 'Tersedia' : 'Belum ada'}
                            </p>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Form + Sidebar */}
            <div className="grid gap-8 lg:grid-cols-3">
                <FadeIn className="lg:col-span-2" delay={0.06}>
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

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
                                    <label className="block text-sm font-medium text-neutral-700">Warna Utama</label>
                                    <p className="mt-0.5 text-xs text-neutral-400">Tombol, link, dan elemen utama.</p>
                                    <div className="mt-3 flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            className="h-10 w-10 cursor-pointer rounded-lg border border-neutral-300 p-0.5"
                                        />
                                        <input
                                            type="text"
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            className={inputClass('primary_color', 'flex-1 font-mono')}
                                            placeholder="#2563eb"
                                        />
                                    </div>
                                </div>
                                <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
                                    <label className="block text-sm font-medium text-neutral-700">Warna Sekunder</label>
                                    <p className="mt-0.5 text-xs text-neutral-400">Aksen, gradien, dan variasi.</p>
                                    <div className="mt-3 flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={secondaryColor}
                                            onChange={(e) => setSecondaryColor(e.target.value)}
                                            className="h-10 w-10 cursor-pointer rounded-lg border border-neutral-300 p-0.5"
                                        />
                                        <input
                                            type="text"
                                            value={secondaryColor}
                                            onChange={(e) => setSecondaryColor(e.target.value)}
                                            className={inputClass('secondary_color', 'flex-1 font-mono')}
                                            placeholder="#7c3aed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
                                <label className="block text-sm font-medium text-neutral-700">Favicon</label>
                                <p className="mt-0.5 text-xs text-neutral-400">Ikon tab browser. Format: ICO, PNG, SVG. Ukuran optimal: 32x32 atau 16x16.</p>
                                <div className="mt-3 flex items-center gap-4">
                                    {faviconPreview && (
                                        <div className="relative">
                                            <img
                                                src={faviconPreview}
                                                alt="Favicon preview"
                                                className="h-12 w-12 rounded-lg border border-neutral-200 bg-white object-contain p-1"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveFavicon}
                                                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white shadow-sm hover:bg-danger-dark"
                                            >
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50">
                                        <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                        {faviconPreview ? 'Ganti File' : 'Pilih File'}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/x-icon,image/png,image/svg+xml"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Custom CSS</label>
                                <p className="mt-0.5 text-xs text-neutral-400">CSS kustom akan diterapkan di seluruh halaman perusahaan.</p>
                                <div className="relative mt-1.5">
                                    <textarea
                                        value={customCss}
                                        onChange={(e) => setCustomCss(e.target.value)}
                                        className={inputClass('custom_css', 'min-h-[120px] font-mono text-xs')}
                                        placeholder="/* Contoh: */&#10;.btn-custom { background: var(--color-primary); }"
                                        rows={5}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-6">
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

                {/* Sidebar */}
                <FadeIn delay={0.1}>
                    <div className="space-y-5">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-900">Pratinjau Warna</p>
                                    <p className="text-xs text-neutral-500">Tampilan langsung.</p>
                                </div>
                            </div>
                            <div className="mt-4 space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    <button className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm" style={{ backgroundColor: primaryColor }}>
                                        Tombol Utama
                                    </button>
                                    <button className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm" style={{ backgroundColor: secondaryColor + '15', color: secondaryColor, border: `1px solid ${secondaryColor}30` }}>
                                        Tombol Kedua
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex h-12 items-center justify-center rounded-lg text-xs font-medium text-white shadow-sm" style={{ backgroundColor: primaryColor }}>
                                        Solid
                                    </div>
                                    <div className="flex h-12 items-center justify-center rounded-lg text-xs font-medium shadow-sm" style={{ backgroundColor: primaryColor + '15', color: primaryColor }}>
                                        Light
                                    </div>
                                </div>
                                <div className="h-12 w-full rounded-lg shadow-sm" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }} />
                            </div>
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
                                    'Gunakan warna yang konsisten dengan logo perusahaan.',
                                    'Kontras warna yang baik meningkatkan keterbacaan.',
                                    'Favicon akan muncul di tab browser pelanggan.',
                                    'Perubahan akan langsung terlihat di seluruh halaman.',
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
        </TenantLayout>
    );
}
