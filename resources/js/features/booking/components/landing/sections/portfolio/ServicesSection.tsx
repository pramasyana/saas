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
        transition: { staggerChildren: 0.1 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' as const },
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
        <motion.div variants={cardVariants}
            className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl"
        >
            <div className="h-60 overflow-hidden relative" style={{ backgroundColor: colors.primary + '08' }}>
                <div className="w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundColor: colors.primary + '04' }}>
                    <span className="text-6xl font-black" style={{ color: colors.primary + '12' }}>✦</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <Link href="/book" className="inline-flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                        Book Now
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold" style={{ color: '#1A1A2E' }}>{service.name}</h3>
                {service.description && (
                    <p className="mt-3 text-sm leading-relaxed line-clamp-2 flex-1" style={{ color: colors.text_muted }}>
                        {service.description}
                    </p>
                )}
                <div className="flex items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
                    {settings?.show_prices !== false && (
                        <div className="flex items-center gap-2">
                            {showDiscount && originalPrice && (
                                <span className="text-sm leading-none line-through" style={{ color: colors.text_muted }}>
                                    {formatPrice(originalPrice)}
                                </span>
                            )}
                            <span className="text-lg font-black" style={{ color: colors.primary }}>
                                {formatPrice(finalPrice)}
                            </span>
                        </div>
                    )}
                    <Link href="/book" className="w-10 h-10 rounded-none border flex items-center justify-center transition-all hover:text-white"
                        style={{ borderColor: '#1A1A2E', color: '#1A1A2E' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1A1A2E'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#1A1A2E'; }}
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
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
        <motion.div variants={cardVariants}
            className="group relative flex flex-col overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl"
            style={{ borderColor: colors.primary + '20' }}
        >
            <div className="p-6" style={{ backgroundColor: '#1A1A2E' }}>
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/70">
                    Package
                </span>
                <h3 className="mt-3 text-xl font-bold text-white">{pkg.name}</h3>
                {pkg.description && (
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{pkg.description}</p>
                )}
            </div>

            <div className="px-6 py-4 flex-1">
                <div className="space-y-2">
                    {pkg.services.map((ps) => (
                        <div key={ps.id} className="flex items-center gap-2 text-sm" style={{ color: colors.text_muted }}>
                            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            {ps.quantity > 1 && <span className="font-bold" style={{ color: '#1A1A2E' }}>{ps.quantity}x</span>}
                            <span>{ps.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t px-6 py-4" style={{ borderColor: '#E5E7EB' }}>
                {settings?.show_prices !== false && (
                    <div className="flex items-center gap-2">
                        {showDiscount && originalPrice && (
                            <span className="text-sm leading-none line-through" style={{ color: colors.text_muted }}>
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                        <span className="text-xl font-black" style={{ color: colors.primary }}>
                            {formatPrice(finalPrice)}
                        </span>
                    </div>
                )}
                <Link href="/book" className="w-10 h-10 rounded-none border flex items-center justify-center transition-all hover:text-white"
                    style={{ borderColor: '#1A1A2E', color: '#1A1A2E' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1A1A2E'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#1A1A2E'; }}
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </Link>
            </div>
        </motion.div>
    );
}

export default function ServicesSection({ data, colors, services, packages, categories, branches, settings }: Props) {
    const showBranchSelector = branches && branches.length > 1;
    const defaultBranchId = useMemo(() => {
        if (!branches || branches.length === 0) return null;
        return branches.find((b) => b.is_default)?.id ?? branches[0].id;
    }, [branches]);

    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(defaultBranchId);
    const [activeTab, setActiveTab] = useState<string>('all');

    const filteredServices = useMemo(() => {
        if (!selectedBranchId || !services) return services ?? [];
        return services.filter((s) => s.branch_id === selectedBranchId || s.branch_id === null);
    }, [services, selectedBranchId]);

    const filteredPackages = useMemo(() => {
        if (!selectedBranchId || !packages) return packages ?? [];
        return packages.filter((p) => p.branch_id === selectedBranchId || p.branch_id === null);
    }, [packages, selectedBranchId]);

    const items = filteredServices;
    const pkgItems = filteredPackages;

    const tabs = useMemo(() => {
        const result: { id: string; name: string }[] = [
            { id: 'all', name: 'All' },
            ...(categories ?? [])
                .filter((c) => items.some((s) => s.category_id === c.id))
                .map((c) => ({ id: c.id, name: c.name })),
        ];
        if (items.some((s) => !s.category_id)) result.push({ id: '__uncategorized', name: 'Other' });
        if (pkgItems.length > 0) result.push({ id: '__packages', name: 'Packages' });
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
        if (!selectedBranchId) return null;
        return (item as any).pricing_by_branch?.[selectedBranchId] ?? null;
    }

    return (
        <section id="services" className="py-20 sm:py-24 lg:py-32" style={{ backgroundColor: '#FAFAF8' }}>
            <div className="mx-auto max-w-7xl px-gutter">
                <FadeIn>
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                        <div className="space-y-4">
                            <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: colors.primary }}>Our Services</span>
                            <h2 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-[0.95]" style={{ color: '#1A1A2E' }}>
                                {data.title || 'What We Offer'}
                            </h2>
                        </div>
                    </div>
                </FadeIn>

                {showBranchSelector && (
                    <div className="flex gap-2 mb-8 overflow-x-auto">
                        {branches!.map((branch) => (
                            <button key={branch.id} type="button" onClick={() => setSelectedBranchId(branch.id)}
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all"
                                style={{
                                    backgroundColor: selectedBranchId === branch.id ? '#1A1A2E' : 'transparent',
                                    color: selectedBranchId === branch.id ? '#fff' : colors.text_muted,
                                }}
                            >
                                {branch.name}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex gap-1 mb-12 border-b" style={{ borderColor: '#E5E7EB' }}>
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                                className="px-6 py-3 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 -mb-px"
                                style={{
                                    borderColor: isActive ? colors.primary : 'transparent',
                                    color: isActive ? '#1A1A2E' : colors.text_muted,
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
                            <motion.div key={activeTab}
                                className="grid gap-8 sm:grid-cols-2"
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
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                                <p className="text-sm font-medium" style={{ color: colors.text_muted }}>No services available yet.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
