import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import BranchForm from '@/features/company/components/BranchForm';
import { useCreateBranch } from '@/features/company/hooks/useBranches';
import type { BranchFormData } from '@/features/company/types';
import TenantLayout from '@/layouts/TenantLayout';
import { useToastStore } from '@/stores/toast';

interface CreatePageProps {
    title: string;
}

function extractErrors(error: unknown): Record<string, string[]> {
    if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as Record<string, unknown>;
        if (data.errors && typeof data.errors === 'object') return data.errors as Record<string, string[]>;
        if (data.message && typeof data.message === 'string') return { _general: [data.message] };
    }
    return {};
}

export default function BranchCreate({ title }: CreatePageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const createMutation = useCreateBranch();
    const [saving, setSaving] = useState(false);
    const errors = extractErrors(createMutation.error);

    function handleSave(data: BranchFormData) {
        setSaving(true);
        createMutation.mutate(data, {
            onSuccess: () => {
                addToast('success', 'Cabang berhasil ditambahkan.');
                router.get('/company/branches');
            },
            onSettled: () => {
                setSaving(false);
            },
        });
    }

    return (
        <TenantLayout>
            <Head title={title} />

            {/* Breadcrumb */}
            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/company/branches" className="transition-colors hover:text-neutral-700">Perusahaan</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <Link href="/company/branches" className="transition-colors hover:text-neutral-700">Cabang</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Tambah Cabang</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Tambah Cabang Baru</h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Tambah cabang baru untuk memperluas jangkauan bisnis Anda.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Form */}
                <FadeIn className="lg:col-span-2" delay={0.05}>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
                        <BranchForm
                            branch={null}
                            saving={saving}
                            errors={errors}
                            onSave={handleSave}
                        />
                    </div>
                </FadeIn>

                {/* Info Panel */}
                <FadeIn delay={0.1}>
                    <div className="space-y-5">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-900">Tips</p>
                                    <p className="text-xs text-neutral-500">Panduan pengisian.</p>
                                </div>
                            </div>
                            <ul className="mt-4 space-y-2.5">
                                {[
                                    'Nama cabang akan otomatis menghasilkan slug. Anda bisa mengubahnya manual.',
                                    'Alamat lengkap membantu pelanggan menemukan lokasi cabang.',
                                    'Peta di landing page otomatis dari cabang utama (default).',
                                    'Setelah dibuat, atur jam kerja dan hari libur di menu masing-masing cabang.',
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
                                    'Hanya cabang dengan status Aktif yang muncul di landing page publik.',
                                    'Cabang utama (default) tidak bisa dihapus, hanya bisa dinonaktifkan.',
                                    'Data cabang digunakan otomatis di halaman kontak dan peta.',
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
