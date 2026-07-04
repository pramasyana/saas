import { Link } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['hero']>;
    colors: NonNullable<LandingConfig['colors']>;
    tenantName?: string;
}

const DEFAULT_INTERVAL = 5000;

function FloatingOrbs({ color }: { color?: string }) {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
                className="absolute -top-20 -left-20 h-72 w-72 rounded-full opacity-20 blur-3xl"
                style={{ backgroundColor: color, animation: 'float 6s ease-in-out infinite' }}
            />
            <div
                className="absolute top-1/3 -right-16 h-56 w-56 rounded-full opacity-15 blur-3xl"
                style={{ backgroundColor: color, animation: 'float-slow 8s ease-in-out infinite' }}
            />
            <div
                className="absolute -bottom-10 left-1/3 h-48 w-48 rounded-full opacity-10 blur-3xl"
                style={{ backgroundColor: color, animation: 'float 7s ease-in-out infinite reverse' }}
            />
        </div>
    );
}

function HeroSlide({
    item,
    colors,
    titleFallback,
    overlayOpacity,
}: {
    item: NonNullable<NonNullable<LandingConfig['hero']>['carousel_items']>[number];
    colors: NonNullable<LandingConfig['colors']>;
    titleFallback: string;
    overlayOpacity: number;
}) {
    return (
        <div className="relative flex h-full w-full items-center justify-center">
            {item.background_image && (
                <img
                    src={item.background_image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
            )}
            <div
                className="absolute inset-0"
                style={{ backgroundColor: colors.primary, opacity: Math.min(overlayOpacity, 25) / 100 }}
            />
            <FloatingOrbs color={colors.primary} />
            <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl drop-shadow-lg"
                >
                    {item.title || titleFallback}
                </motion.h1>
                {item.subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                        className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl lg:text-2xl"
                    >
                        {item.subtitle}
                    </motion.p>
                )}
                {item.cta_text && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                        className="mt-10"
                    >
                        <Link
                            href={item.cta_link || '/booking'}
                            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-white px-8 py-4 text-sm font-semibold shadow-2xl transition-all hover:shadow-3xl hover:scale-105"
                            style={{ color: colors.primary }}
                        >
                            <span className="relative z-10">{item.cta_text}</span>
                            <svg className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                            <div
                                className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10"
                                style={{ backgroundColor: colors.primary }}
                            />
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function HeroCarousel({
    items,
    interval,
    colors,
    overlayOpacity,
    titleFallback,
}: {
    items: NonNullable<NonNullable<LandingConfig['hero']>['carousel_items']>;
    interval: number;
    colors: NonNullable<LandingConfig['colors']>;
    overlayOpacity: number;
    titleFallback: string;
}) {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused || items.length <= 1) return;
        const id = setInterval(() => {
            setCurrent((c) => (c + 1) % items.length);
        }, interval);
        return () => clearInterval(id);
    }, [paused, items.length, interval]);

    const goTo = useCallback((index: number) => setCurrent(index), []);
    const prev = useCallback(() => setCurrent((c) => (c - 1 + items.length) % items.length), [items.length]);
    const next = useCallback(() => setCurrent((c) => (c + 1) % items.length), [items.length]);

    return (
        <div
            className="relative h-full w-full"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className="relative h-full w-full overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0"
                    >
                        <HeroSlide
                            item={items[current]}
                            colors={colors}
                            titleFallback={titleFallback}
                            overlayOpacity={overlayOpacity}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {items.length > 1 && (
                <>
                    <button type="button" onClick={prev}
                        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-110"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button type="button" onClick={next}
                        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-110"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                    <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                        {items.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => goTo(i)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    i === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default function HeroSection({ data, colors, tenantName }: Props) {
    const bgType = data.background_type || 'color';
    const defaultOverlay = bgType === 'carousel' ? 25 : 40;
    const overlayOpacity = data.overlay_opacity ?? defaultOverlay;
    const titleFallback = data.title || `Welcome to ${tenantName ?? 'Your Business'}`;

    if (bgType === 'carousel' && data.carousel_items && data.carousel_items.length > 0) {
        return (
            <section id="hero" className="relative overflow-hidden" style={{ backgroundColor: colors.primary }}>
                <div className="relative" style={{ minHeight: '32rem' }}>
                    <div className="absolute inset-0">
                        <HeroCarousel
                            items={data.carousel_items}
                            interval={data.carousel_interval ?? DEFAULT_INTERVAL}
                            colors={colors}
                            overlayOpacity={overlayOpacity}
                            titleFallback={titleFallback}
                        />
                    </div>
                </div>
            </section>
        );
    }

    if (bgType === 'image' && data.background_image) {
        return (
            <section id="hero" className="relative overflow-hidden min-h-[32rem] flex items-center">
                <img src={data.background_image} alt="" className="absolute inset-0 h-full w-full object-cover scale-105 transition-transform duration-[20s] hover:scale-110" />
                <div className="absolute inset-0" style={{ backgroundColor: colors.primary, opacity: overlayOpacity / 100 }} />
                <FloatingOrbs color={colors.primary} />
                <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl drop-shadow-lg"
                >
                    {data.title || `Welcome to ${tenantName ?? 'Your Business'}`}
                </motion.h1>
                {data.subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl lg:text-2xl"
                        >
                            {data.subtitle}
                        </motion.p>
                    )}
                    {data.cta_text && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-10"
                        >
                            <Link
                                href={data.cta_link || '/booking'}
                                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-white px-8 py-4 text-sm font-semibold shadow-2xl transition-all hover:shadow-3xl hover:scale-105"
                                style={{ color: colors.primary }}
                            >
                                <span className="relative z-10">{data.cta_text}</span>
                                <svg className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>
        );
    }

    return (
        <section id="hero" className="relative overflow-hidden min-h-[32rem] flex items-center" style={{ backgroundColor: colors.primary }}>
            <FloatingOrbs color={colors.primary} />
            <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl drop-shadow-lg"
                >
                    {data.title || `Welcome to ${tenantName ?? 'Your Business'}`}
                </motion.h1>
                {data.subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                        className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl lg:text-2xl"
                    >
                        {data.subtitle}
                    </motion.p>
                )}
                {data.cta_text && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                        className="mt-10"
                    >
                        <Link
                            href={data.cta_link || '/booking'}
                            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-white px-8 py-4 text-sm font-semibold shadow-2xl transition-all hover:shadow-3xl hover:scale-105"
                            style={{ color: colors.primary }}
                        >
                            <span className="relative z-10">{data.cta_text}</span>
                            <svg className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                            <div
                                className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10"
                                style={{ backgroundColor: colors.primary }}
                            />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}