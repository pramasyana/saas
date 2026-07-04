import { useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type { LandingConfig, ServiceItem, PricingItem, CategoryItem } from '@/features/booking/hooks/useLandingSettings';
import { cn, formatPrice } from '@/lib/utils';
import FadeIn from '@/atoms/FadeIn';

interface Props {
    data: NonNullable<LandingConfig['pricing']>;
    colors: NonNullable<LandingConfig['colors']>;
    services?: ServiceItem[];
    categories?: CategoryItem[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' as const },
    },
};

function PricingCard({ item, colors, index }: { item: PricingItem; colors: NonNullable<LandingConfig['colors']>; index: number }) {
    return (
        <motion.div variants={cardVariants}
            className={cn(
                'relative rounded-2xl border bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl',
                item.highlighted
                    ? 'scale-[1.02] z-10 ring-2 shadow-xl -translate-y-2'
                    : 'border-neutral-200 hover:-translate-y-1',
            )}
            style={item.highlighted ? {
                borderColor: colors.primary,
                '--tw-ring-color': colors.primary,
                boxShadow: `0 20px 40px ${colors.primary}20`,
            } as React.CSSProperties : {}}
        >
            {item.highlighted && (
                <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-5 py-1.5 text-xs font-semibold text-white shadow-lg"
                    style={{ backgroundColor: colors.accent }}
                >
                    {item.highlight_label || 'Paling Laris'}
                </div>
            )}
            <div className="text-center">
                <h3 className="text-lg font-semibold" style={{ color: colors.text }}>{item.name}</h3>
                {item.description && (
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: colors.text_muted }}>{item.description}</p>
                )}
                <div className="mt-5">
                    <span className="text-5xl font-extrabold tracking-tight" style={{ color: colors.text }}>Rp {item.price}</span>
                    {item.period && <span className="text-sm ml-1" style={{ color: colors.text_muted }}>{item.period}</span>}
                </div>
            </div>
            <ul className="mt-6 space-y-3.5">
                {item.features?.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm">
                        <svg className="mt-0.5 h-5 w-5 shrink-0 rounded-full p-0.5 bg-success/15 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span style={{ color: colors.text_muted }}>{f}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-8">
                <Link
                    href={item.cta_link || '/booking'}
                    className={cn(
                        'flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold transition-all hover:shadow-lg',
                        item.highlighted
                            ? 'text-white shadow-md hover:scale-[1.02]'
                            : 'ring-1 ring-inset hover:ring-2',
                    )}
                    style={item.highlighted
                        ? { backgroundColor: colors.primary, color: '#fff' }
                        : { borderColor: colors.primary, '--tw-ring-color': colors.primary } as React.CSSProperties}
                >
                    {item.cta_text || 'Pilih Paket'}
                </Link>
            </div>
        </motion.div>
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
            <section id="pricing" className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: colors.background }}>
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

                    <div className="mt-14 space-y-16">
                        {groups.map((group) => (
                            <div key={group.name}>
                                <FadeIn>
                                    <div className="mb-10 flex items-center gap-3">
                                        {group.color && <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: group.color }} />}
                                        <h3 className="text-2xl font-semibold" style={{ color: colors.text }}>{group.name}</h3>
                                        <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '15' }} />
                                    </div>
                                </FadeIn>

                                <motion.div
                                    className="grid gap-6 lg:grid-cols-3 items-start"
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: '-80px' }}
                                >
                                    {group.items.map((item, i) => (
                                        <PricingCard key={i} item={item} colors={colors} index={i} />
                                    ))}
                                </motion.div>
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
        <section id="pricing" className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: colors.background }}>
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

                <motion.div
                    className="mt-14 grid gap-6 lg:grid-cols-3 items-start"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {items.map((item, i) => (
                        <PricingCard key={i} item={item} colors={colors} index={i} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}