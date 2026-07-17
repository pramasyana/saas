import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['cta']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function CTASection({ data, colors }: Props) {
    return (
        <section className="py-20 sm:py-24 lg:py-section-gap-desktop" style={{ backgroundColor: colors.primary }}>
            <div className="mx-auto max-w-3xl px-gutter text-center space-y-8">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl"
                >
                    {data.title || 'Siap Booking?'}
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mx-auto h-1 w-16 origin-center"
                    style={{ backgroundColor: '#FFFFFF' }}
                />

                {data.subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto text-white/80"
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
                        href={data.button_link || '/book'}
                        className="inline-flex items-center gap-2 rounded-lg bg-white px-10 py-5 text-lg font-bold transition-colors hover:bg-gray-100"
                        style={{ color: colors.primary }}
                    >
                        <span>{data.button_text || 'Booking Sekarang'}</span>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
