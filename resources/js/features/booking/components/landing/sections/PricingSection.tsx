import { useMemo } from 'react';
import { Link } from '@inertiajs/react';
import type { LandingConfig, ServiceItem, PricingItem, CategoryItem } from '@/features/booking/hooks/useLandingSettings';
import { cn } from '@/lib/utils';

function formatPrice(price: number): string {
    return price.toLocaleString('id-ID');
}

interface Props {
    data: NonNullable<LandingConfig['pricing']>;
    colors: NonNullable<LandingConfig['colors']>;
    services?: ServiceItem[];
    categories?: CategoryItem[];
}

function PricingCard({ item, colors }: { item: PricingItem; colors: NonNullable<LandingConfig['colors']> }) {
    return (
        <div className={cn('relative rounded-2xl border bg-white p-8 shadow-sm', item.highlighted && 'ring-2 shadow-lg scale-105 z-10', !item.highlighted && 'border-neutral-200')}
            style={item.highlighted ? { borderColor: colors.primary, '--tw-ring-color': colors.primary } as React.CSSProperties : {}}>
            {item.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold text-white shadow-sm" style={{ backgroundColor: colors.accent }}>
                    {item.highlight_label || 'Paling Laris'}
                </div>
            )}
            <div className="text-center">
                <h3 className="text-lg font-semibold" style={{ color: colors.text }}>{item.name}</h3>
                {item.description && <p className="mt-1 text-sm" style={{ color: colors.text_muted }}>{item.description}</p>}
                <div className="mt-4">
                    <span className="text-4xl font-extrabold" style={{ color: colors.text }}>Rp {item.price}</span>
                    {item.period && <span className="text-sm" style={{ color: colors.text_muted }}>{item.period}</span>}
                </div>
            </div>
            <ul className="mt-6 space-y-3">
                {item.features?.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        <span style={{ color: colors.text_muted }}>{f}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-8">
                <Link href={item.cta_link || '/booking'}
                    className={cn('flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition-all hover:shadow-md',
                        item.highlighted ? 'text-white' : 'text-primary ring-1 ring-inset')}
                    style={item.highlighted ? { backgroundColor: colors.primary, color: '#fff' } : { borderColor: colors.primary, '--tw-ring-color': colors.primary } as React.CSSProperties}>
                    {item.cta_text || 'Pilih Paket'}
                </Link>
            </div>
        </div>
    );
}

export default function PricingSection({ data, colors, services, categories }: Props) {
    const isFromServices = data.source === 'services' || (!data.items?.length && (services?.length ?? 0) > 0);

    const groups = useMemo(() => {
        if (!isFromServices) return null;

        const svcs = services ?? [];
        const cats = categories ?? [];

        const grouped: { name: string; color: string | null; items: PricingItem[] }[] = [];

        for (const cat of cats) {
            const catServices = svcs.filter((s) => s.category_id === cat.id);
            if (!catServices.length) continue;

            grouped.push({
                name: cat.name,
                color: cat.color,
                items: catServices.map((s) => ({
                    name: s.name,
                    price: formatPrice(s.price),
                    period: '/sesi',
                    description: s.description ?? '',
                    features: [`Durasi ${s.duration} menit`],
                    cta_text: 'Booking Sekarang',
                    cta_link: '/booking',
                    highlighted: false,
                    highlight_label: undefined,
                })),
            });
        }

        const uncategorized = svcs.filter((s) => !s.category_id);
        if (uncategorized.length) {
            grouped.push({
                name: 'Lainnya',
                color: null,
                items: uncategorized.map((s) => ({
                    name: s.name,
                    price: formatPrice(s.price),
                    period: '/sesi',
                    description: s.description ?? '',
                    features: [`Durasi ${s.duration} menit`],
                    cta_text: 'Booking Sekarang',
                    cta_link: '/booking',
                    highlighted: false,
                    highlight_label: undefined,
                })),
            });
        }

        return grouped;
    }, [isFromServices, services, categories]);

    if (isFromServices) {
        if (!groups?.length) return null;

        return (
            <section id="pricing" className="border-b border-neutral-200/50 py-16 sm:py-20 lg:py-24" style={{ backgroundColor: colors.background }}>
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        {data.title && <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: colors.text }}>{data.title}</h2>}
                        {data.subtitle && <p className="mt-3" style={{ color: colors.text_muted }}>{data.subtitle}</p>}
                    </div>
                    <div className="mt-12 space-y-14">
                        {groups.map((group) => (
                            <div key={group.name}>
                                <div className="mb-8 flex items-center gap-3">
                                    {group.color && <span className="h-3 w-3 rounded-full" style={{ backgroundColor: group.color }} />}
                                    <h3 className="text-xl font-semibold" style={{ color: colors.text }}>{group.name}</h3>
                                </div>
                                <div className="grid gap-6 lg:grid-cols-3 items-start">
                                    {group.items.map((item, i) => (
                                        <PricingCard key={i} item={item} colors={colors} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    const items = data.items ?? [];
    if (!items.length) return null;

    return (
        <section id="pricing" className="border-b border-neutral-200/50 py-16 sm:py-20 lg:py-24" style={{ backgroundColor: colors.background }}>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    {data.title && <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: colors.text }}>{data.title}</h2>}
                    {data.subtitle && <p className="mt-3" style={{ color: colors.text_muted }}>{data.subtitle}</p>}
                </div>
                <div className="mt-12 grid gap-6 lg:grid-cols-3 items-start">
                    {items.map((item, i) => (
                        <PricingCard key={i} item={item} colors={colors} />
                    ))}
                </div>
            </div>
        </section>
    );
}
