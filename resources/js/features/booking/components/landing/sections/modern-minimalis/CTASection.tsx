import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['cta']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function CTASection({ data, colors }: Props) {
    return (
        <section className="py-32" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="mx-auto max-w-4xl px-gutter text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-16 h-px mx-auto mb-12" style={{ backgroundColor: colors.primary + '30' }} />
                    <h2 className="text-6xl lg:text-7xl font-black tracking-tight" style={{ color: colors.primary }}>
                        {data.title || 'Siap Booking?'}
                    </h2>
                </motion.div>
                {data.subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="mt-8 text-base font-light leading-relaxed max-w-xl mx-auto"
                        style={{ color: colors.text_muted }}
                    >
                        {data.subtitle}
                    </motion.p>
                )}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-12"
                >
                    <Link
                        href={data.button_link || '/book'}
                        className="group inline-flex items-center gap-3 border px-8 py-4 text-sm font-medium tracking-wide transition-colors hover:bg-gray-50"
                        style={{ borderColor: colors.primary, color: colors.primary }}
                    >
                        {data.button_text || 'Booking Sekarang'}
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </motion.div>
                <div className="w-16 h-px mx-auto mt-12" style={{ backgroundColor: colors.primary + '30' }} />
            </div>
        </section>
    );
}
