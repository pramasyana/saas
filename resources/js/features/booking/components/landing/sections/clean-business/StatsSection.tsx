import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useAnimatedCounter } from '@/features/booking/hooks/useAnimatedCounter';
import type { LandingConfig, StatItem } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['stats']>;
    colors: NonNullable<LandingConfig['colors']>;
}

function AnimatedStat({
    item,
    colors,
    enabled,
    isLast,
}: {
    item: StatItem;
    colors: NonNullable<LandingConfig['colors']>;
    enabled: boolean;
    isLast: boolean;
}) {
    const num = parseInt(item.number.replace(/[^0-9]/g, ''), 10) || 0;
    const suffix = item.number.replace(/[0-9]/g, '');
    const display = useAnimatedCounter({ end: num, duration: 2000, enabled });

    return (
        <div className="text-center relative">
            <div
                className="text-5xl font-extrabold tracking-tight sm:text-6xl"
                style={{ color: colors.primary }}
            >
                {item.prefix ?? ''}{display}{suffix}
            </div>
            <p className="mt-3 text-sm font-medium sm:text-base" style={{ color: colors.text_muted }}>{item.label}</p>
            {!isLast && (
                <div className="absolute right-0 top-1/2 hidden h-12 -translate-y-1/2 w-px lg:block" style={{ backgroundColor: '#E5E7EB' }} />
            )}
        </div>
    );
}

export default function StatsSection({ data, colors }: Props) {
    const items = data.items;
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    if (!items?.length) {
        return null;
    }

    return (
        <section className="py-16 sm:py-20" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" ref={ref}>
                <div
                    className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
                    style={{ borderTop: `4px solid ${colors.primary}` }}
                >
                    {items.map((item: StatItem, i: number) => (
                        <div key={i} className="pt-8">
                            <AnimatedStat item={item} colors={colors} enabled={isInView} isLast={i === items.length - 1} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
