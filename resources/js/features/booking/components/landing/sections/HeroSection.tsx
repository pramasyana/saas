import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React from 'react';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['hero']>;
    colors: NonNullable<LandingConfig['colors']>;
    tenantName?: string;
}

export default function HeroSection({ data, colors, tenantName }: Props) {
    const bgType = data.background_type || 'color';
    const title = data.title || `Welcome to ${tenantName ?? 'Your Business'}`;

    if (bgType === 'image' && data.background_image) {
        return (
            <section className="relative min-h-screen flex items-center pt-20 overflow-hidden" style={{ backgroundColor: colors.primary }}>
                <img src={data.background_image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ backgroundColor: colors.primary, opacity: 0.65 }} />
                <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                        className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl drop-shadow-lg"
                    >
                        {title}
                    </motion.h1>
                    {data.subtitle && (
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                            className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl lg:text-2xl"
                        >
                            {data.subtitle}
                        </motion.p>
                    )}
                    {data.cta_text && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-10">
                            <Link href={data.cta_link || '/booking'}
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
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden" style={{ backgroundColor: colors.background }}>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: colors.primary, animation: 'float 6s ease-in-out infinite' }} />
                <div className="absolute top-1/3 -right-16 h-56 w-56 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: colors.secondary, animation: 'float-slow 8s ease-in-out infinite' }} />
                <div className="absolute -bottom-10 left-1/3 h-48 w-48 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: colors.accent || colors.primary, animation: 'float 7s ease-in-out infinite reverse' }} />
            </div>

            <div className="mx-auto max-w-7xl px-gutter grid lg:grid-cols-2 gap-16 items-center w-full py-section-gap-mobile lg:py-section-gap-desktop">
                <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
                    {/* Badge */}
                    {data.badge && (
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border" style={{ backgroundColor: colors.primary + '10', borderColor: colors.primary + '20' }}>
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.primary }} />
                            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: colors.primary }}>{data.badge}</span>
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{
                            backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                        }}>
                            {title}
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg leading-relaxed max-w-xl" style={{ color: colors.text_muted }}>
                        {data.subtitle || 'Nikmati pengalaman perawatan premium dengan terapis profesional. Hasil maksimal, harga bersahabat, dan kenyamanan tanpa kompromi.'}
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4">
                        {data.cta_text ? (
                            <Link
                                href={data.cta_link || '/booking'}
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                                style={{ backgroundColor: colors.primary }}
                            >
                                {data.cta_text}
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        ) : (
                            <Link
                                href="/booking"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                                style={{ backgroundColor: colors.primary }}
                            >
                                Booking Sekarang
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        )}
                        <a
                            href="#services"
                            className="inline-flex items-center px-8 py-4 rounded-xl text-sm font-semibold transition-all border"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                borderColor: 'rgba(255,255,255,0.2)',
                                color: colors.text_muted,
                                backdropFilter: 'blur(12px)',
                            }}
                        >
                            Lihat Layanan
                        </a>
                    </div>

                    {/* Stats */}
                    {data.stats && data.stats.length > 0 && (
                        <div className="flex items-center gap-8 pt-8">
                            {data.stats.map((stat, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && <div className="h-10 w-px" style={{ backgroundColor: colors.primary + '20' }} />}
                                    <div>
                                        <p className="text-3xl font-bold" style={{ color: colors.primary }}>
                                            {stat.prefix ?? ''}{stat.number}{stat.suffix ?? ''}
                                        </p>
                                        <p className="text-xs font-medium" style={{ color: colors.text_muted }}>{stat.label}</p>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Right: Glass image card */}
                {data.image && (
                    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative hidden lg:block">
                        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full blur-[100px]" style={{ backgroundColor: colors.secondary + '20' }} />
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full blur-[100px]" style={{ backgroundColor: colors.primary + '20' }} />
                        <div className="relative z-10 overflow-hidden rounded-xl" style={{
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            padding: '8px',
                        }}>
                            <div className="aspect-[4/5] w-full rounded-lg overflow-hidden">
                                <img src={data.image} alt="" className="h-full w-full object-cover" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
