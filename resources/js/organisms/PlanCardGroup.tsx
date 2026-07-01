import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Plan, BillingInterval } from '@/types';

interface PlanCardGroupProps {
    mode: 'link' | 'select';
    plans: Plan[];
    billingInterval?: BillingInterval;
    onBillingChange?: (interval: BillingInterval) => void;
    selectedPlanId?: string;
    onPlanSelect?: (planId: string) => void;
}

function formatPrice(value: number): string {
    if (value === 0) {
        return 'Gratis';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export default function PlanCardGroup({ mode, plans, billingInterval: controlledInterval, onBillingChange, selectedPlanId, onPlanSelect }: PlanCardGroupProps) {
    const [internalInterval, setInternalInterval] = useState<BillingInterval>('monthly');
    const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

    const isControlled = controlledInterval !== undefined;
    const billingInterval = isControlled ? controlledInterval : internalInterval;
    const isYearly = billingInterval === 'yearly';

    function setBilling(interval: BillingInterval) {
        if (isControlled) {
            onBillingChange?.(interval);
        } else {
            setInternalInterval(interval);
        }
    }

    function toggleExpand(planSlug: string) {
        setExpandedPlan((prev) => (prev === planSlug ? null : planSlug));
    }

    return (
        <>
            <div className="flex items-center justify-center gap-4">
                <button
                    type="button"
                    onClick={() => setBilling('monthly')}
                    className={cn(
                        'text-sm font-medium transition-colors',
                        !isYearly ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600',
                    )}
                >
                    Bulanan
                </button>
                <button
                    type="button"
                    onClick={() => setBilling(isYearly ? 'monthly' : 'yearly')}
                    className={cn(
                        'relative h-6 w-11 rounded-full transition-colors',
                        isYearly ? 'bg-primary' : 'bg-neutral-200',
                    )}
                    aria-label="Toggle billing"
                >
                    <span
                        className={cn(
                            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                            isYearly && 'translate-x-5',
                        )}
                    />
                </button>
                <button
                    type="button"
                    onClick={() => setBilling('yearly')}
                    className={cn(
                        'text-sm font-medium transition-colors',
                        isYearly ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600',
                    )}
                >
                    Tahunan
                    <span className="ml-1.5 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                        Hemat 20%
                    </span>
                </button>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-4">
                {plans.map((plan, i) => {
                    const price = isYearly && plan.price_yearly ? plan.price_yearly : plan.price_monthly;
                    const displayFeatures = plan.features?.filter((f) => f.value !== 'false') ?? [];
                    const isSelected = mode === 'select' && selectedPlanId === plan.id;
                    const perMonth = isYearly && plan.price_yearly ? plan.price_yearly / 12 : plan.price_monthly;
                    const savings = plan.price_yearly && plan.price_monthly > 0
                        ? Math.round((1 - plan.price_yearly / (plan.price_monthly * 12)) * 100)
                        : 0;

                    const isExpanded = expandedPlan === plan.slug;
                    const INITIAL_FEATURES = 3;
                    const hasMoreFeatures = displayFeatures.length > INITIAL_FEATURES;

                    const card = (
                        <div
                            className={cn(
                                'relative flex h-full min-w-0 flex-col rounded-2xl border-2 bg-white p-6 transition-all duration-200',
                                mode === 'select'
                                    ? cn(
                                        'cursor-pointer',
                                        isSelected
                                            ? 'border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20'
                                            : 'border-border shadow-sm hover:shadow-md',
                                    )
                                    : cn(
                                        plan.is_popular
                                            ? 'border-primary shadow-xl shadow-primary/10'
                                            : 'border-border shadow-sm hover:shadow-lg',
                                    ),
                                plan.is_active === false && 'opacity-60',
                            )}
                            onClick={() => {
                                if (mode === 'select') {
                                    onPlanSelect?.(plan.id);
                                }
                            }}
                        >
                            {plan.is_popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary to-primary-light px-3 py-1 text-xs font-semibold text-white shadow-lg whitespace-nowrap">
                                        Paling Populer
                                    </span>
                                </div>
                            )}

                            {plan.is_active === false && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px]">
                                    <span className="rounded-full bg-neutral-200/80 px-4 py-1.5 text-xs font-semibold text-neutral-500 backdrop-blur-sm">
                                        Tidak Tersedia
                                    </span>
                                </div>
                            )}

                            {mode === 'select' && isSelected && (
                                <div className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-sm">
                                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                            )}

                            <h3 className={cn('text-lg font-bold', isSelected ? 'text-primary' : 'text-neutral-900')}>
                                {plan.name}
                            </h3>
                            <p className="mt-1 text-sm text-neutral-400 line-clamp-2">
                                {plan.description}
                            </p>

                            <div className="mt-5 flex items-baseline gap-0.5">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={billingInterval}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                        className={cn('min-w-0 truncate text-3xl font-bold', isSelected ? 'text-primary' : 'text-neutral-900')}
                                    >
                                        {price === 0 ? 'Gratis' : formatPrice(price)}
                                    </motion.span>
                                </AnimatePresence>
                                {price > 0 && (
                                    <span className="text-sm text-neutral-400">
                                        /{isYearly ? 'thn' : 'bln'}
                                    </span>
                                )}
                            </div>

                            {isYearly && plan.price_yearly && plan.price_monthly > 0 && (
                                <>
                                    <p className="mt-1 text-xs text-neutral-400 line-through">
                                        {formatPrice(plan.price_monthly * 12)}/thn
                                    </p>
                                    <p className="mt-0.5 text-xs font-medium text-success">
                                        Hemat {savings}%
                                    </p>
                                    <p className="mt-0.5 text-xs text-neutral-400">
                                        {formatPrice(Math.round(perMonth))}/bln
                                    </p>
                                </>
                            )}

                            {isYearly && plan.price_yearly && plan.price_monthly > 0 && mode === 'link' && (
                                <p className="mt-1 text-xs text-success font-medium">
                                    Hemat {savings}%
                                </p>
                            )}

                            <hr className="my-5 border-border" />

                            <div className="flex-1">
                                <ul className="space-y-3">
                                    {displayFeatures.slice(0, isExpanded ? displayFeatures.length : INITIAL_FEATURES).map((f) => {
                                        const isNumeric = f.definition.type === 'numeric';

                                        return (
                                            <li key={f.id} className="flex items-center gap-2.5 text-sm">
                                                <svg
                                                    className="h-4 w-4 shrink-0 text-success"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2.5}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                                <span className="text-xs text-neutral-600">
                                                    {isNumeric && isExpanded ? (
                                                        <>{f.value} <span className="text-neutral-400">{f.definition.label.toLowerCase()}</span></>
                                                    ) : (
                                                        f.definition.label
                                                    )}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>

                                {hasMoreFeatures && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleExpand(plan.slug);
                                        }}
                                        className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                                    >
                                        {isExpanded ? (
                                            <>
                                                Sembunyikan
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                                </svg>
                                            </>
                                        ) : (
                                            <>
                                                Lihat {displayFeatures.length - INITIAL_FEATURES} fitur lainnya
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            <div className="mt-6" onClick={(e) => e.stopPropagation()}>
                                {mode === 'link' ? (
                                    <Link href={`/register?plan=${plan.slug}&billing=${billingInterval}`}>
                                        <span
                                            className={cn(
                                                'flex w-full items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200',
                                                plan.is_popular
                                                    ? 'bg-primary text-white hover:bg-primary-dark hover:shadow-md'
                                                    : 'border border-border bg-white text-neutral-700 hover:bg-neutral-50 hover:shadow-md',
                                            )}
                                        >
                                            {plan.price_monthly === 0 ? 'Daftar Gratis' : 'Mulai Uji Coba'}
                                        </span>
                                    </Link>
                                ) : null}
                            </div>
                        </div>
                    );

                    if (mode === 'link') {
                        return (
                            <motion.div
                                key={plan.slug}
                                className="flex"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={plan.is_active !== false ? { y: -4 } : undefined}
                            >
                                {card}
                            </motion.div>
                        );
                    }

                    return (
                        <motion.div
                            key={plan.id}
                            className="flex"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                        >
                            {card}
                        </motion.div>
                    );
                })}
            </div>
        </>
    );
}
