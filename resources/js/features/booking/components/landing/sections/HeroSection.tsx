import { Link } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['hero']>;
    colors: NonNullable<LandingConfig['colors']>;
    tenantName?: string;
}

const DEFAULT_INTERVAL = 5000;

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
            <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                    {item.title || titleFallback}
                </h1>
                {item.subtitle && <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">{item.subtitle}</p>}
                {item.cta_text && <div className="mt-10">
                    <Link href={item.cta_link || '/booking'} className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105" style={{ color: colors.primary }}>
                        {item.cta_text}
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </Link>
                </div>}
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
        if (paused || items.length <= 1) {
return;
}

        const id = setInterval(() => {
            setCurrent((c) => (c + 1) % items.length);
        }, interval);

        return () => clearInterval(id);
    }, [paused, items.length, interval]);

    const goTo = useCallback((index: number) => {
        setCurrent(index);
    }, []);

    const prev = useCallback(() => {
        setCurrent((c) => (c - 1 + items.length) % items.length);
    }, [items.length]);

    const next = useCallback(() => {
        setCurrent((c) => (c + 1) % items.length);
    }, [items.length]);

    return (
        <div
            className="relative h-full w-full"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className="relative h-full w-full overflow-hidden">
                {items.map((item, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 transition-opacity duration-700"
                        style={{ opacity: i === current ? 1 : 0 }}
                    >
                        {i === current && (
                            <HeroSlide
                                item={item}
                                colors={colors}
                                titleFallback={titleFallback}
                                overlayOpacity={overlayOpacity}
                            />
                        )}
                    </div>
                ))}
            </div>

            {items.length > 1 && (
                <>
                    <button type="button" onClick={prev}
                        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition-colors hover:bg-white/40"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button type="button" onClick={next}
                        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition-colors hover:bg-white/40"
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
                                className={`h-2 rounded-full transition-all ${i === current ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
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
    const defaultOverlay = bgType === 'carousel' ? 30 : 50;
    const overlayOpacity = data.overlay_opacity ?? defaultOverlay;
    const titleFallback = data.title || `Welcome to ${tenantName ?? 'Your Business'}`;

    if (bgType === 'carousel' && data.carousel_items && data.carousel_items.length > 0) {
        return (
            <section id="hero" className="relative overflow-hidden" style={{ backgroundColor: colors.primary }}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)' }} />
                <div className="relative" style={{ minHeight: '28rem' }}>
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
            <section id="hero" className="relative overflow-hidden">
                <img src={data.background_image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ backgroundColor: colors.primary, opacity: overlayOpacity / 100 }} />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)' }} />
                <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        {data.title || `Welcome to ${tenantName ?? 'Your Business'}`}
                    </h1>
                    {data.subtitle && <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">{data.subtitle}</p>}
                    {data.cta_text && <div className="mt-10">
                        <Link href={data.cta_link || '/booking'} className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105" style={{ color: colors.primary }}>
                            {data.cta_text}
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                        </Link>
                    </div>}
                </div>
            </section>
        );
    }
    
    return (
        <section id="hero" className="relative overflow-hidden" style={{ backgroundColor: colors.primary }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)' }} />
            <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                    {data.title || `Welcome to ${tenantName ?? 'Your Business'}`}
                </h1>
                {data.subtitle && <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">{data.subtitle}</p>}
                {data.cta_text && <div className="mt-10">
                    <Link href={data.cta_link || '/booking'} className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105" style={{ color: colors.primary }}>
                        {data.cta_text}
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </Link>
                </div>}
            </div>
        </section>
    );
}
