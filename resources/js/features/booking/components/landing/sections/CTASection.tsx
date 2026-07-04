import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['cta']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function CTASection({ data, colors }: Props) {
    const bgColor = data.background_color || colors.primary;
    const txtColor = data.text_color || '#FFFFFF';

    return (
        <section className="relative overflow-hidden py-20 sm:py-24 lg:py-section-gap-desktop" style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        }}>
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 h-48 w-48 rounded-full bg-white/20 blur-3xl" style={{ animation: 'float 6s ease-in-out infinite' }} />
                <div className="absolute bottom-1/4 right-1/4 h-36 w-36 rounded-full bg-white/15 blur-3xl" style={{ animation: 'float-slow 8s ease-in-out infinite' }} />
                <div className="absolute top-1/2 left-1/2 h-24 w-24 rounded-full bg-white/10 blur-2xl" style={{ animation: 'float 7s ease-in-out infinite reverse' }} />
            </div>
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `radial-gradient(circle at 25% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
                }}
            />
            <div className="mx-auto max-w-3xl px-gutter text-center relative z-10 space-y-8">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl"
                    style={{ color: txtColor }}
                >
                    {data.title || 'Siap Booking?'}
                </motion.h2>
                {data.subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
                        style={{ color: txtColor + 'CC' }}
                    >
                        {data.subtitle}
                    </motion.p>
                )}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Link
                        href={data.button_link || '/booking'}
                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-white px-10 py-5 text-lg font-semibold shadow-2xl transition-all hover:shadow-3xl hover:scale-105"
                        style={{ color: colors.primary }}
                    >
                        <span className="relative z-10">{data.button_text || 'Booking Sekarang'}</span>
                        <svg className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
