import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import { useChangePlan } from '@/features/subscriptions/hooks/useSubscriptions';
import type { FeatureSnapshot } from '@/features/subscriptions/types';
import AdminLayout from '@/layouts/AdminLayout';
import { cn, formatPrice } from '@/lib/utils';
import TenantSubNav from '@/molecules/TenantSubNav';
import { useToastStore } from '@/stores/toast';

interface PlanFeatureItem {
    id: string;
    feature_definition_id: string;
    value: string | null;
    definition: {
        key: string;
        label: string;
        type: 'boolean' | 'numeric';
        category: string;
    };
}

interface PlanItem {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price_monthly: number;
    price_yearly: number | null;
    is_popular: boolean;
    features: PlanFeatureItem[];
}

interface SubscriptionData {
    id: string;
    plan_id: string;
    price_amount: number;
    billing_interval: 'monthly' | 'yearly';
    status: string;
    starts_at: string | null;
    ends_at: string | null;
    features_snapshot: FeatureSnapshot[] | null;
    plan: {
        id: string;
        name: string;
        slug: string;
        price_monthly: number;
        price_yearly: number | null;
        is_popular: boolean;
    } | null;
}

interface Props {
    title: string;
    tenant_id: string;
    tenant_name?: string | null;
    tenant_email?: string | null;
    subscription: SubscriptionData | null;
    plans: PlanItem[];
}

const categoryLabels: Record<string, string> = {
    limits: 'Batas',
    features: 'Fitur',
    customization: 'Kustomisasi',
    support: 'Dukungan',
};

function groupFeatures(features: PlanFeatureItem[]) {
    const grouped: Record<string, PlanFeatureItem[]> = {};

    for (const f of features) {
        const cat = f.definition.category || 'features';

        if (!grouped[cat]) {
grouped[cat] = [];
}

        grouped[cat].push(f);
    }

    return grouped;
}

function FeatureIcon({ included }: { included: boolean }) {
    return included ? (
        <svg className="h-4 w-4 shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    ) : (
        <svg className="h-4 w-4 shrink-0 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

function getIntervalLabel(interval: string): string {
    return interval === 'yearly' ? 'Tahunan' : 'Bulanan';
}

export default function TenantSubscription({ title, tenant_id, tenant_name, tenant_email, subscription, plans }: Props) {
    const addToast = useToastStore((s) => s.addToast);
    const changePlanMutation = useChangePlan();
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>(subscription?.billing_interval ?? 'monthly');

    const currentPlanId = subscription?.plan_id;

    function handlePlanSelect(planId: string) {
        setSelectedPlanId(planId === selectedPlanId ? null : planId);
    }

    function handleSave() {
        if (!selectedPlanId || !subscription) {
return;
}

        changePlanMutation.mutate(
            { id: subscription.id, plan_id: selectedPlanId, billing_interval: billingInterval },
            {
                onSuccess: () => {
                    addToast('success', 'Langganan berhasil diubah.');
                    setSelectedPlanId(null);
                },
            },
        );
    }

    const getPlanPrice = (plan: PlanItem) => {
        return billingInterval === 'yearly' && plan.price_yearly
            ? plan.price_yearly
            : plan.price_monthly;
    };

    const getPlanPriceDisplay = (plan: PlanItem) => {
        const price = getPlanPrice(plan);

        return formatPrice(price);
    };

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
                <span className="font-medium text-neutral-900">Langganan</span>
            </nav>

            <TenantSubNav tenantId={tenant_id} tenantName={tenant_name} tenantEmail={tenant_email} />

            <div className="mt-6 mb-6">
                <h1 className="text-xl font-bold tracking-tight text-neutral-900">Langganan</h1>
                <p className="mt-1 text-sm text-neutral-500">
                    Kelola paket langganan tenant ini.
                </p>
            </div>

            {subscription ? (
                <FadeIn delay={0.03}>
                    <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-500">Paket Saat Ini</p>
                                <p className="mt-1 text-lg font-bold text-neutral-900">{subscription.plan?.name ?? '-'}</p>
                            </div>
                            <span className={cn(
                                'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize',
                                subscription.status === 'active'
                                    ? 'bg-success-light text-success'
                                    : 'bg-neutral-100 text-neutral-600',
                            )}>
                                {subscription.status === 'active' ? 'Aktif' : subscription.status}
                            </span>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <p className="text-xs text-neutral-400">Harga</p>
                                <p className="mt-0.5 text-sm font-semibold text-neutral-900">{formatPrice(subscription.price_amount)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-400">Interval</p>
                                <p className="mt-0.5 text-sm font-semibold text-neutral-900 capitalize">{getIntervalLabel(subscription.billing_interval)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-400">Berakhir</p>
                                <p className="mt-0.5 text-sm font-semibold text-neutral-900">
                                    {subscription.ends_at ? new Date(subscription.ends_at).toLocaleDateString('id-ID') : '-'}
                                </p>
                            </div>
                        </div>
                        {subscription.features_snapshot && subscription.features_snapshot.length > 0 && (
                            <div className="mt-4 border-t border-neutral-100 pt-4">
                                <p className="mb-2 text-xs font-medium text-neutral-400 uppercase tracking-wider">Fitur</p>
                                <div className="flex flex-wrap gap-3">
                                    {subscription.features_snapshot.map((f, i) => (
                                        <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-neutral-50 px-3 py-1 text-xs text-neutral-600">
                                            {f.type === 'boolean' ? (
                                                <FeatureIcon included={f.value === 'true' || f.value === '1'} />
                                            ) : (
                                                <span className="text-xs font-medium text-primary">{f.value}</span>
                                            )}
                                            {f.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </FadeIn>
            ) : (
                <FadeIn delay={0.03}>
                    <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 text-neutral-500">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            <p className="text-sm">Tenant ini belum memiliki langganan aktif.</p>
                        </div>
                    </div>
                </FadeIn>
            )}

            <FadeIn delay={0.06}>
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-neutral-900">Pilih Paket</h2>
                        <p className="mt-0.5 text-sm text-neutral-500">Pilih paket baru untuk tenant ini.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">Tagihan:</span>
                        <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
                            <button
                                onClick={() => setBillingInterval('monthly')}
                                className={cn(
                                    'rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                                    billingInterval === 'monthly'
                                        ? 'bg-white text-neutral-900 shadow-sm'
                                        : 'text-neutral-500 hover:text-neutral-700',
                                )}
                            >
                                Bulanan
                            </button>
                            <button
                                onClick={() => setBillingInterval('yearly')}
                                className={cn(
                                    'rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                                    billingInterval === 'yearly'
                                        ? 'bg-white text-neutral-900 shadow-sm'
                                        : 'text-neutral-500 hover:text-neutral-700',
                                )}
                            >
                                Tahunan
                            </button>
                        </div>
                    </div>
                </div>

                {plans.length === 0 ? (
                    <div className="rounded-xl border border-neutral-200 bg-white px-6 py-12 text-center shadow-sm">
                        <p className="text-sm text-neutral-500">Tidak ada paket tersedia.</p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {plans.map((plan) => {
                            const isCurrent = plan.id === currentPlanId;
                            const isSelected = plan.id === selectedPlanId;
                            const yearlyPrice = plan.price_yearly;
                            const monthlyEquivalent = yearlyPrice ? yearlyPrice / 12 : null;
                            const savings = monthlyEquivalent
                                ? Math.round((1 - monthlyEquivalent / plan.price_monthly) * 100)
                                : 0;

                            return (
                                <div
                                    key={plan.id}
                                    onClick={() => !isCurrent && handlePlanSelect(plan.id)}
                                    className={cn(
                                        'relative flex cursor-pointer flex-col rounded-xl border bg-white p-5 shadow-sm transition-all duration-200',
                                        isCurrent && 'border-primary/30 bg-primary-50/30 ring-1 ring-primary/20 cursor-default',
                                        isSelected && 'border-primary ring-2 ring-primary/30',
                                        !isCurrent && !isSelected && 'border-neutral-200 hover:border-neutral-300 hover:shadow-md',
                                    )}
                                >
                                    {plan.is_popular && (
                                        <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                                            Populer
                                        </span>
                                    )}
                                    {isCurrent && (
                                        <span className="absolute -top-2.5 left-4 rounded-full bg-success px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                                            Aktif
                                        </span>
                                    )}

                                    <div className="mb-3">
                                        <h3 className="text-base font-bold text-neutral-900">{plan.name}</h3>
                                        {plan.description && (
                                            <p className="mt-0.5 text-xs text-neutral-500 line-clamp-2">{plan.description}</p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-2xl font-bold tracking-tight text-neutral-900">
                                            {getPlanPriceDisplay(plan)}
                                        </p>
                                        <p className="text-xs text-neutral-400">/{billingInterval === 'yearly' ? 'tahun' : 'bulan'}</p>
                                        {billingInterval === 'yearly' && savings > 0 && (
                                            <p className="mt-1 text-xs font-medium text-success">Hemat {savings}%</p>
                                        )}
                                    </div>

                                    <div className="mb-4 flex-1 space-y-2">
                                        {Object.entries(groupFeatures(plan.features)).map(([cat, features]) => (
                                            <div key={cat}>
                                                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                                                    {categoryLabels[cat] || cat}
                                                </p>
                                                <div className="space-y-1">
                                                    {features.map((f) => (
                                                        <div key={f.id} className="flex items-center gap-2">
                                                            {f.definition.type === 'boolean' ? (
                                                                <FeatureIcon included={f.value === 'true' || f.value === '1'} />
                                                            ) : (
                                                                <span className="min-w-[20px] text-right text-xs font-semibold text-primary">
                                                                    {f.value}
                                                                </span>
                                                            )}
                                                            <span className="text-xs text-neutral-600">{f.definition.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {!isCurrent && (
                                        <Button
                                            variant={isSelected ? 'primary' : 'outline'}
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePlanSelect(plan.id);
                                            }}
                                            className="w-full"
                                        >
                                            {isSelected ? 'Dipilih' : 'Pilih'}
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </FadeIn>

            {selectedPlanId && subscription && (
                <FadeIn delay={0.09}>
                    <div className="mt-6 flex items-center justify-between rounded-xl border border-primary/20 bg-primary-50/50 p-5 shadow-sm">
                        <div>
                            <p className="text-sm font-medium text-neutral-900">
                                Akan mengubah ke paket baru
                            </p>
                            <p className="mt-0.5 text-xs text-neutral-500">
                                Invoice baru akan dibuat untuk paket yang dipilih.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedPlanId(null)} disabled={changePlanMutation.isPending}>
                                Batal
                            </Button>
                            <Button variant="primary" size="sm" onClick={handleSave} disabled={changePlanMutation.isPending}>
                                {changePlanMutation.isPending ? 'Menyimpan...' : 'Konfirmasi'}
                            </Button>
                        </div>
                    </div>
                </FadeIn>
            )}

            {changePlanMutation.isError && (
                <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
                    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <span>{changePlanMutation.error instanceof Error ? changePlanMutation.error.message : 'Terjadi kesalahan.'}</span>
                </div>
            )}
        </AdminLayout>
    );
}
