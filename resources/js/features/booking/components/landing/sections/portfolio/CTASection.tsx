import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['cta']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function CTASection({ data, colors }: Props) {
    return (
        <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden" style={{ backgroundColor: '#1A1A2E' }}>
            <div className="absolute top-0 right-0 w-96 h-96 opacity-10" style={{ backgroundColor: colors.primary, borderRadius: '50%', filter: 'blur(140px)' }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 opacity-5" style={{ backgroundColor: colors.primary, borderRadius: '50%', filter: 'blur(100px)' }} />
            <div className="mx-auto max-w-6xl px-gutter text-center relative z-10">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                    <div className="h-1 w-16 mx-auto mb-10" style={{ backgroundColor: colors.primary }} />
                    <h2 className="text-6xl font-black tracking-tighter text-white sm:text-7xl lg:text-8xl xl:text-9xl leading-[0.85]">
                        {data.title || 'Let\'s Create'}
                    </h2>
                </motion.div>
                {data.subtitle && (
                    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="mt-8 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto text-white/60"
                    >
                        {data.subtitle}
                    </motion.p>
                )}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-12"
                >
                    <Link href={data.button_link || '/book'}
                        className="group inline-flex items-center gap-3 bg-white px-10 py-5 text-base font-bold uppercase tracking-wider transition-all hover:shadow-2xl hover:gap-4"
                        style={{ color: '#1A1A2E' }}
                    >
                        <span>{data.button_text || 'Get Started'}</span>
                        <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
