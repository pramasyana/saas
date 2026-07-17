import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import FadeIn from '@/atoms/FadeIn';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['testimonials']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function TestimonialsSection({ data, colors }: Props) {
    const items = data.items;
    const n = items?.length ?? 0;
    const [activeIdx, setActiveIdx] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const next = useCallback(() => setActiveIdx((i) => (i + 1) % n), [n]);

    useEffect(() => {
        if (n <= 1) {
            return;
        }
        intervalRef.current = setInterval(next, 5000);
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [next, n]);

    if (!items?.length) {
        return null;
    }

    return (
        <section id="testimonials" className="py-24 lg:py-32" style={{ backgroundColor: '#FAFAFA' }}>
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

                <div className="relative text-center min-h-[280px] flex items-center justify-center">
                    <span
                        className="absolute top-0 left-1/2 -translate-x-1/2 text-[10rem] leading-none font-serif pointer-events-none select-none"
                        style={{ color: colors.primary + '08' }}
                    >
                        &ldquo;
                    </span>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIdx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.5 }}
                            className="relative z-10"
                        >
                            <p className="text-xl lg:text-2xl font-light italic leading-relaxed max-w-2xl mx-auto" style={{ color: colors.text }}>
                                &ldquo;{items[activeIdx].content}&rdquo;
                            </p>
                            <div className="mt-8">
                                <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: colors.text_muted }}>
                                    {items[activeIdx].name}
                                </p>
                                {items[activeIdx].role && (
                                    <p className="mt-1 text-xs font-light" style={{ color: colors.text_muted }}>
                                        {items[activeIdx].role}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-12 flex justify-center gap-3">
                    {items.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setActiveIdx(i)}
                            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                            style={{ backgroundColor: i === activeIdx ? colors.primary : colors.primary + '25' }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
