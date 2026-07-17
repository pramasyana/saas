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
            <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
                <img src={data.background_image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ backgroundColor: '#111827', opacity: 0.7 }} />
                <div className="relative mx-auto max-w-5xl px-4 py-10 text-center sm:px-6 lg:px-8 lg:py-14">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
                    >
                        {title}
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mx-auto mt-6 h-1 w-16 origin-left"
                        style={{ backgroundColor: colors.primary }}
                    />
                    {data.subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl lg:text-2xl"
                        >
                            {data.subtitle}
                        </motion.p>
                    )}
                    {data.cta_text && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="mt-10"
                        >
                            <Link
                                href={data.cta_link || '/book'}
                                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-sm font-bold transition-colors hover:bg-gray-100"
                                style={{ color: colors.primary }}
                            >
                                {data.cta_text}
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden" style={{ backgroundColor: colors.primary }}>
            <div className="mx-auto max-w-7xl px-gutter grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full py-6 lg:py-10">
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    {data.badge && (
                        <div
                            className="inline-flex items-center gap-2 rounded-lg border px-4 py-1.5"
                            style={{ backgroundColor: '#FFFFFF', borderColor: colors.primary + '30', color: colors.primary }}
                        >
                            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: colors.primary }} />
                            <span className="text-xs font-bold tracking-wider uppercase">{data.badge}</span>
                        </div>
                    )}

                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
                        {title}
                    </h1>

                    <div className="h-1 w-16" style={{ backgroundColor: colors.accent || '#FFFFFF' }} />

                    <p className="text-lg leading-relaxed max-w-xl text-white/80">
                        {data.subtitle || 'Nikmati pengalaman perawatan premium dengan terapis profesional. Hasil maksimal, harga bersahabat, dan kenyamanan tanpa kompromi.'}
                    </p>

                    <div className="flex flex-wrap gap-4">
                        {data.cta_text ? (
                            <Link
                                href={data.cta_link || '/book'}
                                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold transition-colors hover:bg-gray-100"
                                style={{ color: colors.primary }}
                            >
                                {data.cta_text}
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        ) : (
                            <Link
                                href="/book"
                                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold transition-colors hover:bg-gray-100"
                                style={{ color: colors.primary }}
                            >
                                Booking Sekarang
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        )}
                        <a
                            href="#services"
                            className="inline-flex items-center rounded-lg border px-6 py-3 text-sm font-bold transition-colors text-white hover:bg-white/10"
                            style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                        >
                            Lihat Layanan
                        </a>
                    </div>

                    {data.stats && data.stats.length > 0 && (
                        <div className="flex items-center gap-6 pt-4">
                            {data.stats.map((stat, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && <div className="h-10 w-px bg-white/20" />}
                                    <div>
                                        <p className="text-3xl font-extrabold text-white">
                                            {stat.prefix ?? ''}{stat.number}{stat.suffix ?? ''}
                                        </p>
                                        <p className="text-xs font-medium text-white/60">{stat.label}</p>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </motion.div>

                {data.image && (
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="overflow-hidden rounded-lg border-2 border-white/20 p-1">
                            <div className="aspect-[4/3] w-full overflow-hidden rounded">
                                <img src={data.image} alt="" className="h-full w-full object-cover" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
