import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React from 'react';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';
import { useAnimatedCounter } from '@/features/booking/hooks/useAnimatedCounter';

interface Props {
    data: NonNullable<LandingConfig['hero']>;
    colors: NonNullable<LandingConfig['colors']>;
    tenantName?: string;
}

function StatItem({ stat, colors, inView }: { stat: { number: string; label: string; prefix?: string; suffix?: string }; colors: NonNullable<LandingConfig['colors']>; inView: boolean }) {
    const num = parseInt(stat.number.replace(/[^0-9]/g, ''), 10) || 0;
    const suffix = stat.number.replace(/[0-9]/g, '');
    const display = useAnimatedCounter({ end: num, duration: 2000, enabled: inView });

    return (
        <div>
            <p className="text-4xl font-black tracking-tight text-white lg:text-5xl">
                {stat.prefix ?? ''}{display}{suffix}{stat.suffix ?? ''}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/50">{stat.label}</p>
        </div>
    );
}

export default function HeroSection({ data, colors, tenantName }: Props) {
    const bgType = data.background_type || 'color';
    const title = data.title || `Welcome to ${tenantName ?? 'Your Business'}`;
    const sectionRef = React.useRef<HTMLDivElement>(null);
    const isInView = React.useRef(false);
    const [, forceUpdate] = React.useState(0);

    React.useEffect(() => {
        if (!sectionRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isInView.current) {
                    isInView.current = true;
                    forceUpdate((n) => n + 1);
                }
            },
            { threshold: 0.3 },
        );
        observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    if (bgType === 'image' && data.background_image) {
        return (
            <section ref={sectionRef} className="relative min-h-screen flex items-end overflow-hidden" style={{ backgroundColor: '#1A1A2E' }}>
                <img src={data.background_image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(26,26,46,0.95) 0%, rgba(26,26,46,0.6) 50%, rgba(26,26,46,0.2) 100%)' }} />
                <div className="relative z-10 w-full px-gutter pb-20 lg:pb-28">
                    <div className="mx-auto max-w-7xl">
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }} className="max-w-2xl space-y-8">
                            {data.badge && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                                    className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm"
                                >
                                    <span className="h-2 w-2 animate-pulse" style={{ backgroundColor: colors.primary }} />
                                    <span className="text-xs font-bold uppercase tracking-widest text-white/80">{data.badge}</span>
                                </motion.div>
                            )}
                            <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
                                {title}
                            </h1>
                            {data.subtitle && (
                                <p className="max-w-lg text-lg leading-relaxed text-white/60 lg:text-xl">{data.subtitle}</p>
                            )}
                            {data.cta_text && (
                                <div>
                                    <Link
                                        href={data.cta_link || '/book'}
                                        className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-bold text-white transition-all hover:gap-5"
                                        style={{ backgroundColor: colors.primary }}
                                    >
                                        {data.cta_text}
                                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                </div>
                            )}
                            {data.stats && data.stats.length > 0 && (
                                <div className="flex items-center gap-8 pt-6">
                                    {data.stats.map((stat, i) => (
                                        <React.Fragment key={i}>
                                            {i > 0 && <div className="h-12 w-px bg-white/20" />}
                                            <StatItem stat={stat} colors={colors} inView={isInView.current} />
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden pt-20" style={{ backgroundColor: colors.background }}>
            <div className="mx-auto max-w-7xl px-gutter w-full py-10 lg:py-16">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-4 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-6 relative z-10"
                    >
                        {data.badge && (
                            <div
                                className="inline-flex items-center gap-2 border px-4 py-1.5 mb-6"
                                style={{ backgroundColor: colors.primary + '08', borderColor: colors.primary + '20', color: colors.primary }}
                            >
                                <span className="h-2 w-2" style={{ backgroundColor: colors.primary }} />
                                <span className="text-xs font-bold uppercase tracking-widest">{data.badge}</span>
                            </div>
                        )}
                        <h1 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl" style={{ color: colors.text }}>
                            {title}
                        </h1>
                        <div className="mt-6 h-1 w-16" style={{ backgroundColor: colors.primary }} />
                        {data.subtitle && (
                            <p className="mt-6 max-w-lg text-lg leading-relaxed lg:text-xl" style={{ color: colors.text_muted }}>
                                {data.subtitle}
                            </p>
                        )}
                        <div className="mt-8 flex flex-wrap gap-4">
                            {data.cta_text ? (
                                <Link
                                    href={data.cta_link || '/book'}
                                    className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-bold text-white transition-all hover:gap-5"
                                    style={{ backgroundColor: colors.primary }}
                                >
                                    {data.cta_text}
                                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            ) : (
                                <Link
                                    href="/book"
                                    className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-bold text-white transition-all hover:gap-5"
                                    style={{ backgroundColor: colors.primary }}
                                >
                                    Booking Sekarang
                                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="lg:col-span-6 relative"
                    >
                        <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: colors.primary }} />
                        {data.image ? (
                            <div className="relative">
                                <div className="overflow-hidden rounded-none lg:rounded-2xl shadow-2xl">
                                    <div className="aspect-[4/3] w-full overflow-hidden">
                                        <img src={data.image} alt="" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                                    </div>
                                </div>
                                <div
                                    className="absolute -bottom-6 -left-6 lg:-left-12 z-20 w-48 rounded-2xl p-5 shadow-2xl lg:w-56"
                                    style={{ backgroundColor: '#1A1A2E' }}
                                >
                                    {data.stats && data.stats.length > 0 && (
                                        <>
                                            <p className="text-3xl font-black text-white">
                                                {data.stats[0].prefix ?? ''}{data.stats[0].number}{data.stats[0].suffix ?? ''}
                                            </p>
                                            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/50">{data.stats[0].label}</p>
                                        </>
                                    )}
                                    {!data.stats?.length && (
                                        <>
                                            <p className="text-3xl font-black text-white">100%</p>
                                            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/50">Kepuasan</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl" style={{ backgroundColor: colors.primary + '08' }}>
                                <span className="text-7xl font-black" style={{ color: colors.primary + '15' }}>&#10070;</span>
                            </div>
                        )}
                    </motion.div>
                </div>

                {data.stats && data.stats.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4"
                    >
                        {data.stats.slice(1).map((stat, i) => (
                            <div key={i} className="flex items-center gap-4" style={{ borderLeft: `3px solid ${colors.primary}`, paddingLeft: '16px' }}>
                                <div>
                                    <p className="text-2xl font-black" style={{ color: colors.text }}>
                                        {stat.prefix ?? ''}{stat.number}{stat.suffix ?? ''}
                                    </p>
                                    <p className="text-xs font-medium uppercase tracking-widest" style={{ color: colors.text_muted }}>{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
