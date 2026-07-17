import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useRef, useEffect } from 'react';
import FadeIn from '@/atoms/FadeIn';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';
import { StarRating } from '../_utils';

interface Props {
    data: NonNullable<LandingConfig['testimonials']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function TestimonialsSection({ data, colors }: Props) {
    const items = data.items;
    const [activeIndex, setActiveIndex] = useState(0);
    const n = items?.length ?? 0;
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const next = useCallback(() => {
        if (n <= 0) return;
        setActiveIndex((prev) => (prev + 1) % n);
    }, [n]);

    const prev = useCallback(() => {
        if (n <= 0) return;
        setActiveIndex((prev) => (prev - 1 + n) % n);
    }, [n]);

    useEffect(() => {
        if (n <= 1) return;
        intervalRef.current = setInterval(next, 5000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [next, n]);

    const resetInterval = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (n > 1) {
            intervalRef.current = setInterval(next, 5000);
        }
    }, [next, n]);

    if (!items?.length) return null;

    const active = items[activeIndex];
    const authorA = items[(activeIndex + 1) % n];
    const authorB = n > 2 ? items[(activeIndex + 2) % n] : null;

    return (
        <section id="testimonials" className="py-20 sm:py-24 lg:py-32 select-none" style={{ backgroundColor: '#FAFAF8' }}>
            <div className="mx-auto max-w-7xl px-gutter">
                <FadeIn>
                    <div className="mb-16">
                        <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: colors.primary }}>Testimonials</span>
                        <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-[0.95]" style={{ color: '#1A1A2E' }}>
                            {data.title || 'What Clients Say'}
                        </h2>
                        {data.subtitle && (
                            <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: colors.text_muted }}>
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                </FadeIn>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeIndex}
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.5 }}
                            className="lg:col-span-8 p-10 sm:p-12 shadow-2xl relative overflow-hidden"
                            style={{ backgroundColor: '#1A1A2E' }}
                        >
                            <div className="absolute top-6 left-8 text-9xl font-serif leading-none text-white/[0.04]">&ldquo;</div>
                            <div className="relative z-10">
                                <StarRating rating={active.rating} />
                                <p className="mt-6 text-lg sm:text-xl leading-relaxed italic text-white/90">
                                    &ldquo;{active.content}&rdquo;
                                </p>
                                <div className="mt-8 flex items-center gap-4">
                                    <div className="w-14 h-14 flex items-center justify-center text-lg font-bold text-white"
                                        style={{ backgroundColor: colors.primary }}
                                    >
                                        {active.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-white">{active.name}</p>
                                        {active.role && <p className="text-xs font-medium text-white/50 uppercase tracking-wider">{active.role}</p>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="lg:col-span-4 space-y-4">
                        {[authorA, authorB].filter(Boolean).map((author, i) => (
                            <motion.div key={`${activeIndex}-author-${i}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="p-6 border bg-white"
                                style={{ borderColor: '#E5E7EB' }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 flex items-center justify-center text-sm font-bold text-white"
                                        style={{ backgroundColor: colors.primary + '80' }}
                                    >
                                        {author!.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold" style={{ color: '#1A1A2E' }}>{author!.name}</p>
                                        {author!.role && <p className="text-xs" style={{ color: colors.text_muted }}>{author!.role}</p>}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <div className="flex items-center gap-3 pt-4">
                            <button type="button" onClick={() => { prev(); resetInterval(); }}
                                className="w-12 h-12 border flex items-center justify-center transition-all hover:text-white"
                                style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1A1A2E'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#1A1A2E'; }}
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                            </button>
                            <button type="button" onClick={() => { next(); resetInterval(); }}
                                className="w-12 h-12 border flex items-center justify-center transition-all hover:text-white"
                                style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1A1A2E'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#1A1A2E'; }}
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                            <div className="flex gap-2 ml-2">
                                {items.map((_, i) => (
                                    <button key={i} type="button"
                                        onClick={() => { setActiveIndex(i); resetInterval(); }}
                                        className="h-1 transition-all duration-300"
                                        style={{
                                            width: i === activeIndex ? '24px' : '6px',
                                            backgroundColor: i === activeIndex ? colors.primary : colors.primary + '30',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
