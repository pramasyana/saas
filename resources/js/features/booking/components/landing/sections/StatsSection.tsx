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
        <div className="group text-center">
            <div className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
                {display}{suffix}
            </div>
            <p className="mt-3 text-sm font-medium text-white/70 sm:text-base">{item.label}</p>
            <div
                className="mx-auto mt-4 h-1 w-8 rounded-full opacity-40 group-hover:opacity-80 transition-opacity"
                style={{ backgroundColor: '#fff' }}
            />
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
        <section className="relative overflow-hidden py-16 sm:py-20" style={{ backgroundColor: colors.primary }}>
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-white/20 blur-3xl" style={{ animation: 'float 8s ease-in-out infinite' }} />
                <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-white/15 blur-3xl" style={{ animation: 'float-slow 10s ease-in-out infinite' }} />
            </div>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative" ref={ref}>
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((item: StatItem, i: number) => (
                        <AnimatedStat key={i} item={item} colors={colors} enabled={isInView} />
                    ))}
                </div>
            </div>
        </section>
    );
}