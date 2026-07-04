import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';
import { StarRating } from './_utils';
import FadeIn from '@/atoms/FadeIn';

interface Props {
    data: NonNullable<LandingConfig['testimonials']>;
    colors: NonNullable<LandingConfig['colors']>;
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

export default function TestimonialsSection({ data, colors }: Props) {
    const items = data.items;
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!items?.length || items.length <= 3) return;
        const id = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % items.length);
        }, 4000);
        return () => clearInterval(id);
    }, [items?.length]);

    if (!items?.length) return null;

    const desktopItems = items;
    const mobileItem = items[activeIndex];

    return (
        <section id="testimonials" className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: colors.background }}>
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

                <div className="hidden lg:block">
                    <motion.div
                        className="mt-14 grid gap-6 lg:grid-cols-3"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        {desktopItems.map((item, i) => (
                            <motion.div key={i} variants={cardVariants}
                                className="group relative overflow-hidden rounded-2xl border bg-white p-7 shadow-sm transition-all hover:shadow-xl"
                                style={{ borderColor: colors.primary + '12' }}
                            >
                                <div className="absolute -top-6 -right-6 text-7xl opacity-[0.04] font-serif" style={{ color: colors.primary }}>"</div>
                                <StarRating rating={item.rating} />
                                <p className="mt-4 text-sm leading-relaxed italic" style={{ color: colors.text_muted }}>
                                    &ldquo;{item.content}&rdquo;
                                </p>
                                <div className="mt-5 flex items-center gap-3 border-t pt-4" style={{ borderColor: colors.primary + '10' }}>
                                    <div
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                        style={{ backgroundColor: colors.primary }}
                                    >
                                        {item.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold" style={{ color: colors.text }}>{item.name}</p>
                                        {item.role && <p className="text-xs" style={{ color: colors.text_muted }}>{item.role}</p>}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                <div className="mt-14 lg:hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.4 }}
                            className="rounded-2xl border bg-white p-7 shadow-sm"
                            style={{ borderColor: colors.primary + '12' }}
                        >
                            <div className="absolute -top-6 -right-6 text-7xl opacity-[0.04] font-serif" style={{ color: colors.primary }}>"</div>
                            <StarRating rating={mobileItem.rating} />
                            <p className="mt-4 text-sm leading-relaxed italic" style={{ color: colors.text_muted }}>
                                &ldquo;{mobileItem.content}&rdquo;
                            </p>
                            <div className="mt-5 flex items-center gap-3 border-t pt-4" style={{ borderColor: colors.primary + '10' }}>
                                <div
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                    style={{ backgroundColor: colors.primary }}
                                >
                                    {mobileItem.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold" style={{ color: colors.text }}>{mobileItem.name}</p>
                                    {mobileItem.role && <p className="text-xs" style={{ color: colors.text_muted }}>{mobileItem.role}</p>}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    <div className="mt-4 flex justify-center gap-2">
                        {items.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setActiveIndex(i)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    i === activeIndex ? 'w-6' : 'w-2'
                                }`}
                                style={{
                                    backgroundColor: i === activeIndex ? colors.primary : colors.primary + '30',
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}