import { useState, useMemo } from 'react';
import type { LandingConfig, ServiceItem, PackageItem, CategoryItem, PricingInfo } from '@/features/booking/hooks/useLandingSettings';
import { cn } from '@/lib/utils';

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

export default function ServicesSection({ data, colors, services, packages, categories, branches, settings }: Props) {
    const defaultBranchId = useMemo(() => {
        if (!branches || branches.length === 0) return null;
        return branches.find((b) => b.is_default)?.id ?? branches[0].id;
    }, [branches]);

    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(defaultBranchId);

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
    const [activeTab, setActiveTab] = useState<string>('all');

    const tabs = useMemo(() => {
        const result: { id: string; name: string; color: string | null }[] = [
            { id: 'all', name: 'Semua', color: null },
            ...(categories ?? [])
                .filter((c) => items.some((s) => s.category_id === c.id))
                .map((c) => ({ id: c.id, name: c.name, color: c.color })),
        ];

        if (items.some((s) => !s.category_id)) {
            result.push({ id: '__uncategorized', name: 'Lainnya', color: null });
        }

        if (pkgItems.length > 0) {
            result.push({ id: '__packages', name: 'Paket', color: null });
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

    function DiscountBadge({ label }: { label: string }) {
        return (
            <span className="rounded bg-danger/10 px-1.5 py-0.5 text-[10px] font-semibold leading-tight text-danger">
                {label}
            </span>
        );
    }

    function PriceDisplay({ item, basePrice }: { item: ServiceItem | PackageItem; basePrice: number }) {
        const pricing = getPricing(item);

        if (pricing && pricing.discount > 0 && pricing.discount_label) {
            return (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs leading-relaxed line-through" style={{ color: colors.text_muted }}>Rp {formatPrice(pricing.original_price)}</span>
                    <span className="text-sm font-bold" style={{ color: colors.primary }}>Rp {formatPrice(pricing.adjusted_price)}</span>
                    <DiscountBadge label={pricing.discount_label} />
                </div>
            );
        }

        if (settings?.show_prices !== false) {
            return <span className="text-sm font-bold" style={{ color: colors.primary }}>Rp {formatPrice(basePrice)}</span>;
        }

        return null;
    }

    return (
        <section id="services" className="border-b border-neutral-200/50 py-16 sm:py-20 lg:py-24" style={{ backgroundColor: colors.background }}>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    {data.title && <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: colors.text }}>{data.title}</h2>}
                    {data.subtitle && <p className="mt-3" style={{ color: colors.text_muted }}>{data.subtitle}</p>}
                </div>

                {branches && branches.length > 1 && (
                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                        {branches.map((b) => (
                            <button key={b.id} type="button" onClick={() => { setSelectedBranchId(b.id); setActiveTab('all'); }}
                                className={cn(
                                    'rounded-xl border px-4 py-2 text-sm font-medium transition-all',
                                    selectedBranchId === b.id
                                        ? 'border-transparent text-white shadow-sm' : 'bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-800',
                                )}
                                style={selectedBranchId === b.id ? { backgroundColor: colors.primary, borderColor: colors.primary } : { borderColor: colors.primary + '30' }}>
                                <svg className="-ml-0.5 mr-1.5 inline-block h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                {b.name}
                            </button>
                        ))}
                    </div>
                )}

                {(items.length > 0 || pkgItems.length > 0) && tabs.length > 1 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {tabs.map((tab) => (
                            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'rounded-xl border px-4 py-2 text-sm font-medium transition-all',
                                    activeTab === tab.id
                                        ? 'border-transparent text-white shadow-sm' : 'bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-800',
                                )}
                                style={activeTab === tab.id ? { backgroundColor: colors.primary, borderColor: colors.primary } : { borderColor: colors.primary + '30' }}>
                                {tab.color && <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: tab.color }} />}
                                {tab.id === '__packages' && <span className="mr-1.5">📦</span>}
                                {tab.name}
                            </button>
                        ))}
                    </div>
                )}

                {filtered.length > 0 ? (
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {activeTab === '__packages' ? (
                            (filtered as PackageItem[]).map((p) => (
                                <div key={p.id} className="group relative rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md" style={{ borderColor: colors.primary + '20' }}>
                                    <span className="absolute right-3 top-3 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: colors.primary }}>Paket</span>
                                    <h3 className="text-lg font-semibold pr-16" style={{ color: colors.text }}>{p.name}</h3>
                                    {p.description && <p className="mt-2 text-sm" style={{ color: colors.text_muted }}>{p.description}</p>}
                                    <div className="mt-4 space-y-1">
                                        {p.services.map((ps) => (
                                            <div key={ps.id} className="flex items-center gap-2 text-xs" style={{ color: colors.text_muted }}>
                                                <svg className="h-3.5 w-3.5 shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                                {ps.quantity > 1 && <span className="font-medium">{ps.quantity}x</span>} {ps.name}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex items-center justify-between border-t pt-4" style={{ borderColor: colors.primary + '15' }}>
                                        <span className="text-xs" style={{ color: colors.text_muted }}>{p.duration} menit</span>
                                        {settings?.show_prices !== false && <PriceDisplay item={p} basePrice={p.price} />}
                                    </div>
                                </div>
                            ))
                        ) : (
                            (filtered as ServiceItem[]).map((s) => (
                                <div key={s.id} className="group rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md" style={{ borderColor: colors.primary + '20' }}>
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ backgroundColor: s.color || colors.primary }}>{s.name.charAt(0)}</div>
                                    <h3 className="text-lg font-semibold" style={{ color: colors.text }}>{s.name}</h3>
                                    {s.description && <p className="mt-2 text-sm" style={{ color: colors.text_muted }}>{s.description}</p>}
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-xs" style={{ color: colors.text_muted }}>{s.duration} menit</span>
                                        {settings?.show_prices !== false && <PriceDisplay item={s} basePrice={s.price} />}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="mt-12 text-center text-sm" style={{ color: colors.text_muted }}>{activeTab === '__packages' ? 'Paket akan muncul di halaman publik.' : 'Layanan akan muncul di halaman publik.'}</div>
                )}
            </div>
        </section>
    );
}
