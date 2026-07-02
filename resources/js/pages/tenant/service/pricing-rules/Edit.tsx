import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import PricingRuleForm from '@/features/service/components/PricingRuleForm';
import { useUpdatePricingRule } from '@/features/service/hooks/usePricingRules';
import type { PricingRule, PricingRuleFormData } from '@/features/service/types';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/stores/toast';

interface EditPageProps {
    title: string;
    pricingRule: PricingRule;
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

const typeBadgeConfig: Record<string, { label: string; color: string; bg: string }> = {
    percentage_discount: { label: 'Diskon %', color: 'text-success', bg: 'bg-success-light' },
    fixed_discount: { label: 'Diskon Rp', color: 'text-success', bg: 'bg-success-light' },
    percentage_surcharge: { label: 'Tambahan %', color: 'text-warning', bg: 'bg-warning-light' },
    fixed_surcharge: { label: 'Tambahan Rp', color: 'text-warning', bg: 'bg-warning-light' },
    price_override: { label: 'Override', color: 'text-primary', bg: 'bg-primary-50' },
};

export default function Edit({ title, pricingRule }: EditPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const updateMutation = useUpdatePricingRule();
    const [saving, setSaving] = useState(false);
    const errors = extractErrors(updateMutation.error);
    const typeInfo = typeBadgeConfig[pricingRule.action_type] || { label: pricingRule.action_type, color: 'text-neutral-500', bg: 'bg-neutral-100' };

    function handleSave(data: PricingRuleFormData) {
        setSaving(true);
        updateMutation.mutate(
            { id: pricingRule.id, data },
            {
                onSuccess: () => {
                    addToast('success', 'Aturan harga berhasil diperbarui.');
                    router.get('/service/pricing-rules');
                },
                onSettled: () => {
                    setSaving(false);
                },
            },
        );
    }

    function formatValue(value: number, type: string): string {
        if (type.includes('percentage')) return `${value}%`;
        return `Rp${value.toLocaleString('id-ID')}`;
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
                <span className="font-medium text-neutral-900">Edit Aturan</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Aturan Harga</h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Perbarui aturan harga dinamis yang sudah ada.
                </p>
            </div>

            {/* Rule Summary Card */}
            <FadeIn delay={0.03}>
                <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-6 sm:p-8">
                        <div className="flex items-center gap-5">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white shadow-lg ring-4 ring-white/20">
                                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                </svg>
                            </div>
                            <div className="min-w-0 text-white">
                                <h2 className="text-xl font-bold">{pricingRule.name}</h2>
                                <p className="mt-1 text-sm text-white/80">
                                    {typeInfo.label} · {formatValue(pricingRule.value, pricingRule.action_type)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 sm:grid-cols-4">
                        {[
                            { label: 'Tipe', value: pricingRule.action_label },
                            { label: 'Nilai', value: formatValue(pricingRule.value, pricingRule.action_type) },
                            { label: 'Prioritas', value: pricingRule.priority.toString() },
                            { label: 'Status', value: pricingRule.is_active ? 'Aktif' : 'Nonaktif' },
                        ].map((item) => (
                            <div key={item.label} className="px-5 py-4">
                                <p className="text-xs font-medium text-neutral-400">{item.label}</p>
                                <p className={cn(
                                    'mt-1 text-sm font-semibold',
                                    item.label === 'Status' && pricingRule.is_active ? 'text-success' : '',
                                    item.label === 'Status' && !pricingRule.is_active ? 'text-neutral-500' : '',
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
                    <PricingRuleForm
                        pricingRule={pricingRule}
                        saving={saving}
                        errors={errors}
                        onSave={handleSave}
                    />
                </div>
            </FadeIn>
        </TenantLayout>
    );
}
