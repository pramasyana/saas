import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import FadeIn from '@/atoms/FadeIn';
import type { LandingConfig, ServiceItem, PricingItem, CategoryItem } from '@/features/booking/hooks/useLandingSettings';
import { cn, formatPrice } from '@/lib/utils';

interface Props {
    data: NonNullable<LandingConfig['pricing']>;
    colors: NonNullable<LandingConfig['colors']>;
    services?: ServiceItem[];
    categories?: CategoryItem[];
}

export default function PricingSection({ data, colors, services, categories }: Props) {
    const isFromServices = data.source === 'services' || (!data.items?.length && (services?.length ?? 0) > 0);

    const groups = useMemo(() => {
        if (!isFromServices) {
            return null;
        }
        const svcs = services ?? [];
        const cats = categories ?? [];
        const grouped: { name: string; color: string | null; items: PricingItem[] }[] = [];

        for (const cat of cats) {
            const catServices = svcs.filter((s) => s.category_id === cat.id);
            if (!catServices.length) {
                continue;
            }
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
                    cta_link: '/book',
                    highlighted: false,
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
                    cta_link: '/book',
                    highlighted: false,
                })),
            });
        }

        return grouped;
    }, [isFromServices, services, categories]);

    const items = useMemo(() => {
        if (isFromServices) {
            return null;
        }
        return data.items ?? [];
    }, [isFromServices, data.items]);

    if (isFromServices) {
        if (!groups?.length) {
            return null;
        }

        return (
            <section id="pricing" className="py-24 lg:py-32" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="mx-auto max-w-4xl px-gutter">
                    <FadeIn>
                        <div className="text-center mb-20 space-y-4">
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

                    <div className="space-y-16">
                        {groups.map((group) => (
                            <div key={group.name}>
                                <FadeIn>
                                    <div className="flex items-center gap-4 mb-8">
                                        {group.color && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />}
                                        <h3 className="text-sm font-medium uppercase tracking-[0.15em]" style={{ color: colors.text_muted }}>
                                            {group.name}
                                        </h3>
                                        <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '12' }} />
                                    </div>
                                </FadeIn>

                                <motion.div
                                    className="space-y-0"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: '-80px' }}
                                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
                                >
                                    {group.items.map((item, i) => (
                                        <PricingCard key={i} item={item} colors={colors} />
                                    ))}
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!items?.length) {
        return null;
    }

    return (
        <section id="pricing" className="py-24 lg:py-32" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="mx-auto max-w-4xl px-gutter">
                <FadeIn>
                    <div className="text-center mb-20 space-y-4">
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

                <motion.div
                    className="space-y-0"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
                >
                    {items.map((item, i) => (
                        <PricingCard key={i} item={item} colors={colors} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function PricingCard({ item, colors }: { item: PricingItem; colors: NonNullable<LandingConfig['colors']> }) {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
            className="py-8"
            style={{
                borderBottom: `1px solid ${colors.primary}12`,
                borderLeft: item.highlighted ? `4px solid ${colors.primary}` : '4px solid transparent',
                paddingLeft: item.highlighted ? 0 : 0,
            }}
        >
            <div className="flex items-start justify-between gap-8 pl-4">
                <div className="flex-1">
                    <h3 className="text-lg font-medium" style={{ color: colors.text }}>
                        {item.name}
                    </h3>
                    {item.description && (
                        <p className="mt-2 text-sm font-light leading-relaxed" style={{ color: colors.text_muted }}>
                            {item.description}
                        </p>
                    )}
                    {item.features?.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {item.features.map((f, fi) => (
                                <div key={fi} className="flex items-center gap-3 text-sm">
                                    <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: colors.primary }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    <span className="font-light" style={{ color: colors.text_muted }}>{f}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="text-right shrink-0">
                    <div className="text-4xl font-light tabular-nums" style={{ color: colors.text }}>
                        {item.price}
                    </div>
                    {item.period && (
                        <p className="mt-1 text-xs font-light" style={{ color: colors.text_muted }}>
                            {item.period}
                        </p>
                    )}
                    <div className="mt-4">
                        <Link
                            href={item.cta_link || '/book'}
                            className="inline-block border px-6 py-2 text-xs font-medium tracking-wide transition-colors hover:bg-gray-50"
                            style={{ borderColor: colors.primary, color: colors.primary }}
                        >
                            {item.cta_text || 'Pilih'}
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
