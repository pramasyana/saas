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

function PricingCard({ item, colors }: { item: PricingItem; colors: NonNullable<LandingConfig['colors']> }) {
    return (
        <motion.div
            variants={cardVariants}
            className={cn(
                'relative rounded-lg border bg-white overflow-hidden transition-all duration-300',
                item.highlighted ? 'shadow-md' : 'hover:shadow-sm',
            )}
            style={{
                borderColor: item.highlighted ? colors.primary : '#E5E7EB',
                borderTop: `4px solid ${item.highlighted ? colors.primary : '#E5E7EB'}`,
            }}
        >
            {item.highlighted && (
                <div
                    className="absolute top-0 left-0 right-0 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: colors.accent || colors.primary }}
                >
                    {item.highlight_label || 'Paling Laris'}
                </div>
            )}

            <div className={cn('text-center', item.highlighted ? 'pt-10 pb-6 px-8' : 'pt-8 pb-6 px-8')}>
                <h3 className="text-lg font-bold" style={{ color: colors.text }}>{item.name}</h3>
                {item.description && (
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: colors.text_muted }}>{item.description}</p>
                )}
                <div className="mt-5">
                    <span className="text-5xl font-extrabold tracking-tight" style={{ color: colors.text }}>Rp {item.price}</span>
                    {item.period && <span className="text-sm ml-1" style={{ color: colors.text_muted }}>{item.period}</span>}
                </div>
            </div>

            <ul className="px-8 space-y-3.5">
                {item.features?.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm">
                        <svg
                            className="mt-0.5 h-4 w-4 shrink-0"
                            style={{ color: colors.primary }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span style={{ color: colors.text_muted }}>{f}</span>
                    </li>
                ))}
            </ul>

            <div className="px-8 pb-8 pt-8">
                <Link
                    href={item.cta_link || '/book'}
                    className={cn(
                        'flex items-center justify-center rounded-lg px-6 py-3.5 text-sm font-bold transition-colors',
                        item.highlighted
                            ? 'text-white'
                            : 'border',
                    )}
                    style={item.highlighted
                        ? { backgroundColor: colors.primary, color: '#fff' }
                        : { borderColor: colors.primary, color: colors.primary }
                    }
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
                    cta_link: '/book',
                    highlighted: false,
                    highlight_label: undefined,
                })),
            });
        }

        return grouped;
    }, [isFromServices, services, categories]);

    if (isFromServices) {
        if (!groups?.length) {
            return null;
        }

        return (
            <section id="pricing" className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <FadeIn>
                        <div className="text-center">
                            {data.title && (
                                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: colors.text }}>
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
                                        {group.color && <span className="h-3.5 w-3.5 rounded-sm" style={{ backgroundColor: group.color }} />}
                                        <h3 className="text-2xl font-bold" style={{ color: colors.text }}>{group.name}</h3>
                                        <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
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
    if (!items.length) {
        return null;
    }

    return (
        <section id="pricing" className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center">
                        {data.title && (
                            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: colors.text }}>
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
                        <PricingCard key={i} item={item} colors={colors} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
