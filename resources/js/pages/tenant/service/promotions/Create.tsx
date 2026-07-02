import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import type { Branch } from '@/features/company/types';
import PromotionForm from '@/features/service/components/PromotionForm';
import { useCreatePromotion } from '@/features/service/hooks/usePromotions';
import type { PromotionFormData } from '@/features/service/types';
import TenantLayout from '@/layouts/TenantLayout';
import { useToastStore } from '@/stores/toast';

interface CreatePageProps {
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

export default function Create({ title }: CreatePageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const createMutation = useCreatePromotion();
    const [saving, setSaving] = useState(false);
    const [branchId, setBranchId] = useState('');
    const errors = extractErrors(createMutation.error);
    const { data: branchesData } = useAllBranches();
    const branches = (branchesData?.data ?? []) as Branch[];

    useEffect(() => {
        if (!branchId && branches.length > 0) {
            const defaultBranch = branches.find((b) => b.is_default) ?? branches[0];

            if (defaultBranch) {
                setBranchId(defaultBranch.id);
            }
        }
    }, [branches]);

    function handleSave(data: PromotionFormData) {
        setSaving(true);
        createMutation.mutate({ ...data, branch_id: branchId }, {
            onSuccess: () => {
                addToast('success', 'Promosi berhasil ditambahkan.');
                router.get('/service/promotions');
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
                <Link href="/service/dashboard" className="transition-colors hover:text-neutral-700">Dashboard</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <Link href="/service/promotions" className="transition-colors hover:text-neutral-700">Promosi</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Tambah Promosi</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Tambah Promosi Baru</h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Buat promosi atau diskon untuk menarik lebih banyak pelanggan.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Form */}
                <FadeIn className="lg:col-span-2" delay={0.05}>
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
                        <PromotionForm
                            promotion={null}
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
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-900">Tips Promosi</p>
                                    <p className="text-xs text-neutral-500">Strategi yang efektif.</p>
                                </div>
                            </div>
                            <ul className="mt-4 space-y-2.5">
                                {[
                                    'Gunakan kode promo yang mudah diingat pelanggan.',
                                    'Batasi periode promosi untuk menciptakan urgensi.',
                                    'Sesuaikan diskon dengan margin keuntungan Anda.',
                                    'Promosi bundle biasanya lebih menarik dari diskon tunggal.',
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
                                    'Promosi aktif langsung bisa digunakan di kasir.',
                                    'Kode promo bersifat opsional, bisa dikosongkan.',
                                    'Batas pemakaian kosong berarti tidak terbatas.',
                                    'Pastikan tanggal berlaku tidak tumpang tindih.',
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
