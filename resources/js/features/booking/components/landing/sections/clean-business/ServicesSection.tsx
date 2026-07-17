import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import FadeIn from '@/atoms/FadeIn';
import type { LandingConfig, ServiceItem, PackageItem, CategoryItem, PricingInfo } from '@/features/booking/hooks/useLandingSettings';
import { cn, formatPrice } from '@/lib/utils';

interface BranchItem {
    id: string; name: string; is_default: boolean;
}

interface Props {
    data: NonNullable<LandingConfig['services']>;
    colors: NonNullable<LandingConfig['colors']>;
    services?: ServiceItem[];
    packages?: PackageItem[];
    categories?: CategoryItem[];
    branches?: BranchItem[];
    settings?: { show_prices: boolean };
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' as const },
    },
};

function ServiceCard({
    service,
    colors,
    settings,
    getPricing,
}: {
    service: ServiceItem;
    colors: NonNullable<LandingConfig['colors']>;
    settings?: { show_prices: boolean };
    getPricing: (item: ServiceItem | PackageItem) => PricingInfo | null;
}) {
    const pricing = getPricing(service);
    const showDiscount = pricing && pricing.discount > 0 && pricing.discount_label;
    const finalPrice = showDiscount ? pricing.adjusted_price : service.price;
    const originalPrice = showDiscount ? pricing.original_price : null;

    return (
        <motion.div
            variants={cardVariants}
            className="group relative flex flex-col rounded-lg overflow-hidden border bg-white transition-all duration-300 hover:shadow-sm"
            style={{ borderColor: '#E5E7EB' }}
        >
            <div className="h-40 overflow-hidden relative" style={{ backgroundColor: colors.primary + '05' }}>
                <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl" style={{ color: colors.primary + '15' }}>✦</span>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-base font-bold" style={{ color: colors.text }}>{service.name}</h3>
                {service.description && (
                    <p className="mt-2 text-sm leading-relaxed line-clamp-2 flex-1" style={{ color: colors.text_muted }}>
                        {service.description}
                    </p>
                )}
                <div className="flex items-center justify-between mt-6">
                    <div>
                        {settings?.show_prices !== false && (
                            <div className="flex items-center gap-2">
                                {showDiscount && originalPrice && (
                                    <span className="text-sm leading-none line-through" style={{ color: colors.text_muted }}>
                                        {formatPrice(originalPrice)}
                                    </span>
                                )}
                                <span className="text-lg font-extrabold" style={{ color: colors.primary }}>
                                    {formatPrice(finalPrice)}
                                </span>
                                {showDiscount && (
                                    <span className="rounded-lg bg-red-50 px-1.5 py-0.5 text-[9px] font-bold text-red-600">
                                        {pricing!.discount_label}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <Link
                        href="/book"
                        className="w-9 h-9 rounded-lg border flex items-center justify-center transition-colors"
                        style={{ borderColor: '#E5E7EB', color: colors.primary }}
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

function PackageCard({
    pkg,
    colors,
    settings,
    getPricing,
}: {
    pkg: PackageItem;
    colors: NonNullable<LandingConfig['colors']>;
    settings?: { show_prices: boolean };
    getPricing: (item: ServiceItem | PackageItem) => PricingInfo | null;
}) {
    const pricing = getPricing(pkg);
    const showDiscount = pricing && pricing.discount > 0 && pricing.discount_label;
    const finalPrice = showDiscount ? pricing.adjusted_price : pkg.price;
    const originalPrice = showDiscount ? pricing.original_price : null;

    return (
        <motion.div
            variants={cardVariants}
            className="group relative flex flex-col rounded-lg overflow-hidden border-2 bg-white transition-all duration-300 hover:shadow-sm"
            style={{ borderColor: colors.primary + '30' }}
        >
            <div className="p-6 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                    <span
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                        style={{ backgroundColor: colors.primary + '10', color: colors.primary }}
                    >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                        Paket
                    </span>
                    {showDiscount && (
                        <span className="rounded-lg bg-red-50 px-2 py-0.5 text-[9px] font-bold text-red-600">
                            {pricing!.discount_label}
                        </span>
                    )}
                </div>
                <h3 className="text-base font-bold" style={{ color: colors.text }}>{pkg.name}</h3>
                {pkg.description && (
                    <p className="text-sm leading-relaxed" style={{ color: colors.text_muted }}>{pkg.description}</p>
                )}
            </div>

            <div className="px-6 pb-4">
                <div className="rounded-lg px-4 py-3 border" style={{ borderColor: '#E5E7EB' }}>
                    <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.text_muted }}>
                        Termasuk
                    </div>
                    <div className="space-y-1">
                        {pkg.services.map((ps) => (
                            <div key={ps.id} className="flex items-center gap-2 text-xs" style={{ color: colors.text_muted }}>
                                <svg className="h-3 w-3 shrink-0" style={{ color: colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                {ps.quantity > 1 && <span className="font-bold tabular-nums" style={{ color: colors.text }}>{ps.quantity}x</span>}
                                <span>{ps.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t px-6 py-4" style={{ borderColor: '#E5E7EB' }}>
                <div className="flex items-center gap-2">
                    {settings?.show_prices !== false && (
                        <>
                            {showDiscount && originalPrice && (
                                <span className="text-sm leading-none line-through" style={{ color: colors.text_muted }}>
                                    {formatPrice(originalPrice)}
                                </span>
                            )}
                            <span className="text-lg font-extrabold" style={{ color: colors.primary }}>
                                {formatPrice(finalPrice)}
                            </span>
                        </>
                    )}
                </div>
                <Link
                    href="/book"
                    className="w-9 h-9 rounded-lg border flex items-center justify-center transition-colors"
                    style={{ borderColor: '#E5E7EB', color: colors.primary }}
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </Link>
            </div>
        </motion.div>
    );
}

export default function ServicesSection({ data, colors, services, packages, categories, branches, settings }: Props) {
    const showBranchSelector = branches && branches.length > 1;
    const defaultBranchId = useMemo(() => {
        if (!branches || branches.length === 0) {
            return null;
        }
        return branches.find((b) => b.is_default)?.id ?? branches[0].id;
    }, [branches]);

    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(defaultBranchId);
    const [activeTab, setActiveTab] = useState<string>('all');

    const filteredServices = useMemo(() => {
        if (!selectedBranchId || !services) {
            return services ?? [];
        }
        return services.filter((s) => s.branch_id === selectedBranchId || s.branch_id === null);
    }, [services, selectedBranchId]);

    const filteredPackages = useMemo(() => {
        if (!selectedBranchId || !packages) {
            return packages ?? [];
        }
        return packages.filter((p) => p.branch_id === selectedBranchId || p.branch_id === null);
    }, [packages, selectedBranchId]);

    const items = filteredServices;
    const pkgItems = filteredPackages;

    const tabs = useMemo(() => {
        const result: { id: string; name: string }[] = [
            { id: 'all', name: 'Semua' },
            ...(categories ?? [])
                .filter((c) => items.some((s) => s.category_id === c.id))
                .map((c) => ({ id: c.id, name: c.name })),
        ];

        if (items.some((s) => !s.category_id)) {
            result.push({ id: '__uncategorized', name: 'Lainnya' });
        }

        if (pkgItems.length > 0) {
            result.push({ id: '__packages', name: 'Paket' });
        }

        return result;
    }, [items, categories, pkgItems.length]);

    const filtered = activeTab === '__packages'
        ? pkgItems
        : activeTab === 'all'
            ? items
            : activeTab === '__uncategorized'
                ? items.filter((s) => !s.category_id)
                : items.filter((s) => s.category_id === activeTab);

    function getPricing(item: ServiceItem | PackageItem): PricingInfo | null {
        if (!selectedBranchId) {
            return null;
        }
        const p = (item as any).pricing_by_branch?.[selectedBranchId];
        return p ?? null;
    }

    return (
        <section id="services" className="py-16 sm:py-20 lg:py-section-gap-desktop" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="mx-auto max-w-7xl px-gutter">
                <FadeIn>
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                        <div className="space-y-4">
                            {data.title && (
                                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: colors.text }}>
                                    {data.title}
                                </h2>
                            )}
                            {!data.title && (
                                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: colors.text }}>
                                    Layanan Kami
                                </h2>
                            )}
                        </div>
                    </div>
                </FadeIn>

                {showBranchSelector && (
                    <div className="flex gap-2 mb-8 overflow-x-auto">
                        {branches!.map((branch) => (
                            <button
                                key={branch.id}
                                type="button"
                                onClick={() => setSelectedBranchId(branch.id)}
                                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold whitespace-nowrap transition-colors border"
                                style={{
                                    backgroundColor: selectedBranchId === branch.id ? colors.primary : '#FFFFFF',
                                    borderColor: selectedBranchId === branch.id ? colors.primary : '#E5E7EB',
                                    color: selectedBranchId === branch.id ? '#FFFFFF' : colors.text_muted,
                                }}
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                {branch.name}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex gap-0 border-b mb-10" style={{ borderColor: '#E5E7EB' }}>
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className="px-5 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-px"
                                style={{
                                    borderColor: isActive ? colors.primary : 'transparent',
                                    color: isActive ? colors.primary : colors.text_muted,
                                }}
                            >
                                {tab.name}
                            </button>
                        );
                    })}
                </div>

                <div className="min-w-0 flex-1">
                    <AnimatePresence mode="wait">
                        {filtered.length > 0 ? (
                            <motion.div
                                key={activeTab}
                                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                            >
                                {activeTab === '__packages'
                                    ? (filtered as PackageItem[]).map((p) => (
                                        <PackageCard key={p.id} pkg={p} colors={colors} settings={settings} getPricing={getPricing} />
                                    ))
                                    : (filtered as ServiceItem[]).map((s) => (
                                        <ServiceCard key={s.id} service={s} colors={colors} settings={settings} getPricing={getPricing} />
                                    ))
                                }
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center"
                            >
                                <div
                                    className="inline-flex items-center gap-3 rounded-lg border px-8 py-5"
                                    style={{ borderColor: '#E5E7EB' }}
                                >
                                    <svg className="h-8 w-8 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: colors.text_muted }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 11.625l2.25-2.25M12 11.625l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                    </svg>
                                    <div className="text-left">
                                        <p className="text-sm font-bold" style={{ color: colors.text }}>
                                            {activeTab === '__packages' ? 'Belum ada paket tersedia' : 'Belum ada layanan tersedia'}
                                        </p>
                                        <p className="text-xs mt-0.5" style={{ color: colors.text_muted }}>
                                            {activeTab === '__packages'
                                                ? 'Paket akan muncul setelah ditambahkan oleh admin.'
                                                : 'Layanan akan muncul setelah ditambahkan oleh admin.'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="/book"
                        className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold transition-colors"
                        style={{ backgroundColor: colors.primary, color: '#FFFFFF' }}
                    >
                        Lihat Katalog Lengkap
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
