import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useAnimatedCounter } from '@/features/booking/hooks/useAnimatedCounter';
import type { LandingConfig, StatItem } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['stats']>;
    colors: NonNullable<LandingConfig['colors']>;
}

function AnimatedStat({ item, colors, enabled }: { item: StatItem; colors: NonNullable<LandingConfig['colors']>; enabled: boolean }) {
    const num = parseInt(item.number.replace(/[^0-9]/g, ''), 10) || 0;
    const suffix = item.number.replace(/[0-9]/g, '');
    const display = useAnimatedCounter({ end: num, duration: 2000, enabled });

    return (
        <div className="text-center">
            <div className="text-5xl font-light tabular-nums" style={{ color: colors.text }}>
                {item.prefix ?? ''}{display}{suffix}
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em]" style={{ color: colors.text_muted }}>
                {item.label}
            </p>
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
        <section className="py-24 lg:py-32" style={{ backgroundColor: '#FAFAFA' }}>
            <div className="mx-auto max-w-4xl px-gutter" ref={ref}>
                <div className="grid gap-16 grid-cols-2">
                    {items.slice(0, 4).map((item: StatItem, i: number) => (
                        <div key={i} className="relative">
                            <AnimatedStat item={item} colors={colors} enabled={isInView} />
                            {i < Math.min(items.length, 4) - 1 && i % 2 === 0 && (
                                <div
                                    className="absolute top-1/2 -right-8 w-1.5 h-1.5 rounded-full -translate-y-1/2"
                                    style={{ backgroundColor: colors.primary + '25' }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
