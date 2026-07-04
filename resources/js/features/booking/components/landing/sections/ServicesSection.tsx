import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react';
import type { LandingConfig, ServiceItem, PackageItem, CategoryItem, PricingInfo } from '@/features/booking/hooks/useLandingSettings';
import { cn } from '@/lib/utils';
import FadeIn from '@/atoms/FadeIn';

function formatPrice(price: number): string {
    return price.toLocaleString('id-ID');
}

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
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: 'easeOut' as const },
    },
};

function getCategoryIcon(name?: string | null): string {
    if (!name) return '✦';
    const lower = name.toLowerCase();
    if (lower.includes('wajah') || lower.includes('face')) return '✨';
    if (lower.includes('body') || lower.includes('tubuh')) return '🌸';
    if (lower.includes('hair') || lower.includes('rambut')) return '💇';
    if (lower.includes('nail') || lower.includes('kuku') || lower.includes('manicure')) return '💅';
    if (lower.includes('massage') || lower.includes('spa')) return '💆';
    if (lower.includes('paket') || lower.includes('special')) return '🎁';
    return '✦';
}

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
            className="group flex flex-col rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            style={{ borderColor: colors.primary + '08' }}
        >
            <div className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-2.5">
                    <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs"
                        style={{ backgroundColor: service.color || colors.primary + '10' }}
                    >
                        <span style={{ color: service.color ? '#fff' : colors.primary }}>
                            {getCategoryIcon(service.category_name)}
                        </span>
                    </div>
                    {service.category_name && (
                        <span
                            className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                            style={{ backgroundColor: colors.primary + '06', color: colors.primary }}
                        >
                            {service.category_name}
                        </span>
                    )}
                </div>

                <h3 className="text-base font-semibold leading-snug" style={{ color: colors.text }}>
                    {service.name}
                </h3>

                {service.description && (
                    <p className="text-xs leading-relaxed" style={{ color: colors.text_muted }}>
                        {service.description}
                    </p>
                )}

                <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: colors.text_muted }}>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {service.duration} menit
                </span>
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 border-t px-5 py-3.5" style={{ borderColor: colors.primary + '06' }}>
                <div className="flex items-center gap-2">
                    {settings?.show_prices !== false && (
                        <>
                            {showDiscount && originalPrice && (
                                <span className="text-[11px] leading-none line-through" style={{ color: colors.text_muted }}>
                                    Rp{formatPrice(originalPrice)}
                                </span>
                            )}
                            <span className="text-sm font-bold leading-none" style={{ color: colors.text }}>
                                Rp{formatPrice(finalPrice)}
                            </span>
                            {showDiscount && (
                                <span className="rounded-full bg-danger/10 px-1.5 py-0.5 text-[9px] font-semibold leading-none text-danger">
                                    {pricing!.discount_label}
                                </span>
                            )}
                        </>
                    )}
                </div>
                <Link
                    href="/booking"
                    className="inline-flex items-center justify-center rounded-lg px-3.5 py-2 text-[11px] font-semibold text-white shadow-sm transition-all hover:shadow-md"
                    style={{ backgroundColor: colors.primary }}
                >
                    Booking
                </Link>
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
            className="group flex flex-col rounded-2xl border-2 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            style={{ borderColor: colors.primary + '14' }}
        >
            <div className="flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between gap-2">
                    <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                        style={{ backgroundColor: colors.primary + '08', color: colors.primary }}
                    >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                        Paket
                    </span>
                    {showDiscount && (
                        <span className="rounded-full bg-danger/10 px-2 py-0.5 text-[9px] font-semibold leading-none text-danger">
                            {pricing!.discount_label}
                        </span>
                    )}
                </div>

                <h3 className="text-base font-semibold leading-snug" style={{ color: colors.text }}>{pkg.name}</h3>

                {pkg.description && (
                    <p className="text-xs leading-relaxed" style={{ color: colors.text_muted }}>
                        {pkg.description}
                    </p>
                )}
            </div>

            <div className="px-5 pb-4">
                <div className="rounded-xl px-4 py-3" style={{ backgroundColor: colors.primary + '03' }}>
                    <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: colors.text_muted }}>
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                        </svg>
                        Termasuk
                    </div>
                    <div className="space-y-1">
                        {pkg.services.map((ps) => (
                            <div key={ps.id} className="flex items-center gap-2 text-xs" style={{ color: colors.text_muted }}>
                                <svg className="h-3 w-3 shrink-0" style={{ color: colors.secondary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                {ps.quantity > 1 && <span className="font-semibold tabular-nums" style={{ color: colors.text }}>{ps.quantity}x</span>}
                                <span>{ps.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-5 pb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: colors.text_muted }}>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {pkg.duration} menit
                </span>
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 border-t px-5 py-3.5" style={{ borderColor: colors.primary + '06' }}>
                <div className="flex items-center gap-2">
                    {settings?.show_prices !== false && (
                        <>
                            {showDiscount && originalPrice && (
                                <span className="text-[11px] leading-none line-through" style={{ color: colors.text_muted }}>
                                    Rp{formatPrice(originalPrice)}
                                </span>
                            )}
                            <span className="text-sm font-bold leading-none" style={{ color: colors.text }}>
                                Rp{formatPrice(finalPrice)}
                            </span>
                        </>
                    )}
                </div>
                <Link
                    href="/booking"
                    className="inline-flex items-center justify-center rounded-lg px-3.5 py-2 text-[11px] font-semibold text-white shadow-sm transition-all hover:shadow-md"
                    style={{ backgroundColor: colors.primary }}
                >
                    Booking
                </Link>
            </div>
        </motion.div>
    );
}

export default function ServicesSection({ data, colors, services, packages, categories, branches, settings }: Props) {
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
        const result: { id: string; name: string; color: string | null }[] = [
            { id: 'all', name: 'Semua Layanan', color: null },
            ...(categories ?? [])
                .filter((c) => items.some((s) => s.category_id === c.id))
                .map((c) => ({ id: c.id, name: c.name, color: c.color })),
        ];

        if (items.some((s) => !s.category_id)) {
            result.push({ id: '__uncategorized', name: 'Lainnya', color: null });
        }

        if (pkgItems.length > 0) {
            result.push({ id: '__packages', name: 'Paket Hemat', color: null });
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
        if (!selectedBranchId) return null;
        const p = (item as any).pricing_by_branch?.[selectedBranchId];
        return p ?? null;
    }

    return (
        <section id="services" className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: colors.background }}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center">
                        {data.title && (
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: colors.text }}>
                                {data.title}
                            </h2>
                        )}
                        {data.subtitle && (
                            <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed sm:text-lg" style={{ color: colors.text_muted }}>
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                </FadeIn>

                {branches && branches.length > 1 && (
                    <FadeIn delay={0.1}>
                        <div className="mt-10 flex flex-wrap justify-center gap-2">
                            {branches.map((b) => {
                                const isActive = selectedBranchId === b.id;
                                return (
                                    <button
                                        key={b.id}
                                        type="button"
                                        onClick={() => { setSelectedBranchId(b.id); setActiveTab('all'); }}
                                        className={cn(
                                            'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all',
                                            isActive
                                                ? 'text-white shadow-sm'
                                                : 'bg-white text-neutral-500 hover:text-neutral-800 hover:border-neutral-300',
                                        )}
                                        style={{
                                            backgroundColor: isActive ? colors.primary : undefined,
                                            borderColor: isActive ? colors.primary : colors.primary + '20',
                                        }}
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                        {b.name}
                                        {b.is_default && (
                                            <span
                                                className={cn(
                                                    'ml-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider',
                                                    isActive ? 'bg-white/20' : '',
                                                )}
                                                style={{ color: isActive ? '#fff' : colors.primary }}
                                            >
                                                utama
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </FadeIn>
                )}

                <div className="mt-10 lg:flex lg:gap-10">
                    {(items.length > 0 || pkgItems.length > 0) && tabs.length > 1 && (
                        <FadeIn delay={0.2}>
                            <div className="mb-8 flex gap-1 overflow-x-auto pb-1 lg:mb-0 lg:w-52 lg:shrink-0 lg:flex-col lg:gap-0">
                                {tabs.map((tab) => {
                                    const isActive = activeTab === tab.id;
                                    const count = tab.id === '__packages'
                                        ? pkgItems.length
                                        : tab.id === 'all'
                                            ? items.length
                                            : tab.id === '__uncategorized'
                                                ? items.filter((s) => !s.category_id).length
                                                : items.filter((s) => s.category_id === tab.id).length;

                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                'relative flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all lg:w-full lg:rounded-r-none lg:rounded-l-xl',
                                                isActive ? 'text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-800',
                                            )}
                                            style={{
                                                backgroundColor: isActive ? colors.primary : 'transparent',
                                            }}
                                        >
                                            {tab.color && (
                                                <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white" style={{ backgroundColor: tab.color }} />
                                            )}
                                            {!tab.color && tab.id === 'all' && (
                                                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                                </svg>
                                            )}
                                            {!tab.color && tab.id === '__packages' && (
                                                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                                </svg>
                                            )}
                                            <span className="truncate">{tab.name}</span>
                                            <span
                                                className={cn(
                                                    'ml-auto inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums leading-none',
                                                    isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500',
                                                )}
                                            >
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </FadeIn>
                    )}

                    <div className="min-w-0 flex-1">
                        <AnimatePresence mode="wait">
                            {filtered.length > 0 ? (
                                <motion.div
                                    key={activeTab}
                                    className="grid gap-5 sm:grid-cols-2"
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
                                    className="mt-14 text-center"
                                >
                                    <div className="inline-flex items-center gap-3 rounded-2xl border bg-white px-8 py-5 shadow-sm" style={{ borderColor: colors.primary + '15' }}>
                                        <svg className="h-8 w-8 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: colors.text_muted }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 11.625l2.25-2.25M12 11.625l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                        </svg>
                                        <div className="text-left">
                                            <p className="text-sm font-medium" style={{ color: colors.text }}>
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
                </div>
            </div>
        </section>
    );
}