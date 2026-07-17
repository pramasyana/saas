import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import FadeIn from '@/atoms/FadeIn';
import type { LandingConfig, ServiceItem, PackageItem, CategoryItem, PricingInfo } from '@/features/booking/hooks/useLandingSettings';
import { cn, formatPrice } from '@/lib/utils';

interface BranchItem {
    id: string;
    name: string;
    is_default: boolean;
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
        <section id="services" className="py-24 lg:py-32" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="mx-auto max-w-5xl px-gutter">
                <FadeIn>
                    <div className="text-center mb-16 space-y-4">
                        {data.title && (
                            <h2 className="text-5xl lg:text-6xl font-black tracking-tight" style={{ color: colors.text }}>
                                {data.title}
                            </h2>
                        )}
                        {data.subtitle && (
                            <p className="max-w-2xl mx-auto text-base font-light leading-relaxed" style={{ color: colors.text_muted }}>
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                </FadeIn>

                {showBranchSelector && (
                    <div className="flex gap-8 justify-center mb-10 overflow-x-auto">
                        {branches!.map((branch) => (
                            <button
                                key={branch.id}
                                type="button"
                                onClick={() => setSelectedBranchId(branch.id)}
                                className="pb-2 text-sm font-medium whitespace-nowrap transition-colors"
                                style={{
                                    color: selectedBranchId === branch.id ? colors.text : colors.text_muted,
                                    borderBottom: selectedBranchId === branch.id ? `1px solid ${colors.primary}` : '1px solid transparent',
                                }}
                            >
                                {branch.name}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex gap-8 justify-center mb-12 overflow-x-auto">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className="pb-2 text-xs font-medium uppercase tracking-[0.15em] whitespace-nowrap transition-colors"
                                style={{
                                    color: isActive ? colors.text : colors.text_muted,
                                    borderBottom: isActive ? `1px solid ${colors.primary}` : '1px solid transparent',
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
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {(activeTab === '__packages' ? (filtered as PackageItem[]) : (filtered as ServiceItem[])).map((item, i) => {
                                    const pricing = getPricing(item as ServiceItem | PackageItem);
                                    const showDiscount = pricing && pricing.discount > 0 && pricing.discount_label;
                                    const finalPrice = showDiscount ? pricing!.adjusted_price : (item as ServiceItem | PackageItem).price;
                                    const originalPrice = showDiscount ? pricing!.original_price : null;

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between py-6"
                                            style={{ borderBottom: `1px solid ${colors.primary}10` }}
                                        >
                                            <div className="flex-1">
                                                <h3 className="text-base font-medium" style={{ color: colors.text }}>
                                                    {item.name}
                                                </h3>
                                                {item.description && (
                                                    <p className="mt-1 text-xs font-light" style={{ color: colors.text_muted }}>
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 ml-8">
                                                {settings?.show_prices !== false && (
                                                    <div className="flex items-center gap-2">
                                                        {showDiscount && originalPrice && (
                                                            <span className="text-xs line-through" style={{ color: colors.text_muted }}>
                                                                {formatPrice(originalPrice)}
                                                            </span>
                                                        )}
                                                        <span className="text-base font-medium tabular-nums" style={{ color: colors.text }}>
                                                            {formatPrice(finalPrice)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <p className="text-sm font-light" style={{ color: colors.text_muted }}>
                                    {activeTab === '__packages' ? 'Belum ada paket tersedia' : 'Belum ada layanan tersedia'}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-16 text-center">
                    <Link
                        href="/book"
                        className="inline-flex items-center gap-2 text-sm font-medium tracking-wide transition-colors hover:gap-3"
                        style={{ color: colors.primary }}
                    >
                        Lihat Katalog Lengkap
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
