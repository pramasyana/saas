import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import type { Branch } from '@/features/company/types';
import PricingRuleForm from '@/features/service/components/PricingRuleForm';
import { useCreatePricingRule } from '@/features/service/hooks/usePricingRules';
import type { PricingRuleFormData } from '@/features/service/types';
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
    const createMutation = useCreatePricingRule();
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

    function handleSave(data: PricingRuleFormData) {
        setSaving(true);
        createMutation.mutate({ ...data, branch_id: branchId }, {
            onSuccess: () => {
                addToast('success', 'Aturan harga berhasil ditambahkan.');
                router.get('/service/pricing-rules');
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
                <Link href="/service/pricing-rules" className="transition-colors hover:text-neutral-700">Aturan Harga</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Tambah Aturan</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Tambah Aturan Baru</h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Buat aturan harga dinamis untuk layanan, paket, atau add-on.
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
                        <PricingRuleForm
                            pricingRule={null}
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
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-900">Tips Aturan Harga</p>
                                    <p className="text-xs text-neutral-500">Panduan penggunaan.</p>
                                </div>
                            </div>
                            <ul className="mt-4 space-y-2.5">
                                {[
                                    'Prioritas lebih tinggi akan dijalankan lebih dulu jika ada aturan yang bertentangan.',
                                    'Aturan dengan nilai 0 atau diskon 0% akan diabaikan.',
                                    'Aturan hanya berlaku untuk item yang memenuhi semua kondisi yang ditentukan.',
                                    'Kosongkan tanggal jika aturan berlaku selamanya.',
                                    'Aturan nonaktif tidak akan diterapkan pada transaksi.',
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
                                    'Aturan harga dapat dikombinasikan untuk skenario pricing yang kompleks.',
                                    'Perubahan aturan langsung berlaku tanpa perlu reload aplikasi.',
                                    'Aturan dengan prioritas sama akan dieksekusi berdasarkan urutan dibuat.',
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
