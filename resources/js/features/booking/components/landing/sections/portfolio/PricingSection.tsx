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

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12 },
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

function PricingCard({ item, colors }: { item: PricingItem; colors: NonNullable<LandingConfig['colors']> }) {
    const isHighlighted = item.highlighted;

    return (
        <motion.div variants={cardVariants}
            className={cn(
                'relative flex flex-col overflow-hidden transition-all duration-300',
                isHighlighted ? 'shadow-2xl lg:-translate-y-3' : 'shadow-lg hover:shadow-xl',
            )}
            style={{
                backgroundColor: '#FFFFFF',
                borderTop: isHighlighted ? `4px solid ${colors.primary}` : `1px solid ${colors.primary}12`,
            }}
        >
            {isHighlighted && (
                <div className="px-6 py-4" style={{ backgroundColor: '#1A1A2E' }}>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">{item.name}</h3>
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: colors.primary }}>
                            {item.highlight_label || 'Paling Laris'}
                        </span>
                    </div>
                </div>
            )}

            {!isHighlighted && (
                <div className="px-6 py-6">
                    <h3 className="text-lg font-bold" style={{ color: colors.text }}>{item.name}</h3>
                </div>
            )}

            <div className={cn('px-6', isHighlighted ? 'pb-6 pt-4' : 'pb-6')}>
                {item.description && (
                    <p className="mb-6 text-sm leading-relaxed" style={{ color: colors.text_muted }}>{item.description}</p>
                )}

                <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold" style={{ color: colors.text_muted }}>Rp</span>
                    <span className="text-5xl font-black tracking-tight" style={{ color: isHighlighted ? colors.primary : colors.text }}>
                        {item.price}
                    </span>
                    {item.period && <span className="text-sm ml-1" style={{ color: colors.text_muted }}>{item.period}</span>}
                </div>

                <ul className="mt-8 space-y-4">
                    {item.features?.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-3 text-sm">
                            <svg className="mt-0.5 h-5 w-5 shrink-0" style={{ color: colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            <span style={{ color: colors.text_muted }}>{f}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-8">
                    <Link
                        href={item.cta_link || '/book'}
                        className={cn(
                            'flex items-center justify-center py-4 text-sm font-bold transition-all',
                            isHighlighted
                                ? 'text-white hover:opacity-90'
                                : 'border-2 hover:text-white',
                        )}
                        style={isHighlighted
                            ? { backgroundColor: colors.primary, color: '#FFFFFF' }
                            : { borderColor: colors.primary, color: colors.primary }
                        }
                        onMouseEnter={!isHighlighted ? (e) => { e.currentTarget.style.backgroundColor = colors.primary ?? '#7C3AED'; e.currentTarget.style.color = '#FFFFFF'; } : undefined}
                        onMouseLeave={!isHighlighted ? (e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = colors.primary ?? '#7C3AED'; } : undefined}
                    >
                        {item.cta_text || 'Pilih Paket'}
                    </Link>
                </div>
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

    if (isFromServices) {
        if (!groups?.length) return null;

        return (
            <section id="pricing" className="py-20 sm:py-24 lg:py-32" style={{ backgroundColor: '#FAFAF8' }}>
                <div className="mx-auto max-w-7xl px-gutter">
                    <FadeIn>
                        <div className="mb-16 space-y-4">
                            <span className="block text-xs font-bold uppercase tracking-[0.2em]" style={{ color: colors.primary }}>
                                Harga
                            </span>
                            {data.title && (
                                <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl" style={{ color: colors.text }}>
                                    {data.title}
                                </h2>
                            )}
                            {data.subtitle && (
                                <p className="max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: colors.text_muted }}>
                                    {data.subtitle}
                                </p>
                            )}
                        </div>
                    </FadeIn>

                    <div className="space-y-16">
                        {groups.map((group) => (
                            <div key={group.name}>
                                <FadeIn>
                                    <div className="mb-10 flex items-center gap-3">
                                        {group.color && <span className="h-3 w-3" style={{ backgroundColor: group.color }} />}
                                        <h3 className="text-2xl font-bold" style={{ color: colors.text }}>{group.name}</h3>
                                        <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '15' }} />
                                    </div>
                                </FadeIn>

                                <motion.div
                                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: '-80px' }}
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

    const items = data.items ?? [];
    if (!items.length) return null;

    return (
        <section id="pricing" className="py-20 sm:py-24 lg:py-32" style={{ backgroundColor: '#FAFAF8' }}>
            <div className="mx-auto max-w-7xl px-gutter">
                <FadeIn>
                    <div className="mb-16 space-y-4">
                        <span className="block text-xs font-bold uppercase tracking-[0.2em]" style={{ color: colors.primary }}>
                            Harga
                        </span>
                        {data.title && (
                            <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl" style={{ color: colors.text }}>
                                {data.title}
                            </h2>
                        )}
                        {data.subtitle && (
                            <p className="max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: colors.text_muted }}>
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                </FadeIn>

                <motion.div
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {items.map((item, i) => (
                        <PricingCard key={i} item={item} colors={colors} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
