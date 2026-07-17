import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useAnimatedCounter } from '@/features/booking/hooks/useAnimatedCounter';
import type { LandingConfig, StatItem } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['stats']>;
    colors: NonNullable<LandingConfig['colors']>;
}

function AnimatedStat({ item, enabled }: { item: StatItem; enabled: boolean }) {
    const num = parseInt(item.number.replace(/[^0-9]/g, ''), 10) || 0;
    const suffix = item.number.replace(/[0-9]/g, '');
    const display = useAnimatedCounter({ end: num, duration: 2000, enabled });

    return (
        <div className="text-center lg:text-left">
            <div className="text-6xl font-black tracking-tighter text-white sm:text-7xl lg:text-8xl">
                {item.prefix ?? ''}{display}{suffix}
            </div>
            <div className="mt-4 h-0.5 w-10 mx-auto lg:mx-0" style={{ backgroundColor: '#FFFFFF', opacity: 0.3 }} />
            <p className="mt-4 text-xs font-bold text-white/50 uppercase tracking-[0.25em]">{item.label}</p>
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
        <section className="relative py-20 sm:py-24 lg:py-32" style={{ backgroundColor: '#1A1A2E' }}>
            <div className="absolute top-0 right-0 w-96 h-96 opacity-5" style={{ backgroundColor: colors.primary, borderRadius: '50%', filter: 'blur(120px)' }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 opacity-5" style={{ backgroundColor: colors.primary, borderRadius: '50%', filter: 'blur(100px)' }} />
            <div className="mx-auto max-w-6xl px-gutter relative" ref={ref}>
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((item: StatItem, i: number) => (
                        <AnimatedStat key={i} item={item} enabled={isInView} />
                    ))}
                </div>
            </div>
        </section>
    );
}
