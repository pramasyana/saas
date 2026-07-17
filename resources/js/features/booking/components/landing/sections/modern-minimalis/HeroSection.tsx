import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['hero']>;
    colors: NonNullable<LandingConfig['colors']>;
    tenantName?: string;
}

export default function HeroSection({ data, colors, tenantName }: Props) {
    const title = data.title || `Welcome to ${tenantName ?? 'Your Business'}`;
    const bgType = data.background_type || 'color';

    if (bgType === 'image' && data.background_image) {
        return (
            <section className="relative min-h-screen flex items-center pt-20 overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
                <img src={data.background_image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ backgroundColor: '#000000', opacity: 0.5 }} />
                <div className="relative z-10 mx-auto max-w-7xl px-gutter grid lg:grid-cols-[55%_1fr] gap-16 items-center w-full py-24">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
                        <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[0.95]" style={{ color: '#FFFFFF' }}>
                            {title}
                        </h1>
                        <div className="w-16 h-px" style={{ backgroundColor: '#FFFFFF' }} />
                        {data.subtitle && (
                            <p className="text-lg font-light leading-relaxed max-w-lg" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                {data.subtitle}
                            </p>
                        )}
                        {data.cta_text && (
                            <div className="pt-4">
                                <Link
                                    href={data.cta_link || '/book'}
                                    className="group inline-flex items-center gap-3 border px-8 py-4 text-sm font-medium tracking-wide transition-colors"
                                    style={{ borderColor: '#FFFFFF', color: '#FFFFFF' }}
                                >
                                    {data.cta_text}
                                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="mx-auto max-w-7xl px-gutter grid lg:grid-cols-[55%_1fr] gap-16 items-center w-full py-24">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
                    <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[0.95]" style={{ color: colors.text }}>
                        {title}
                    </h1>
                    <div className="w-16 h-px" style={{ backgroundColor: colors.primary }} />
                    {data.subtitle && (
                        <p className="text-lg font-light leading-relaxed max-w-lg" style={{ color: colors.text_muted }}>
                            {data.subtitle}
                        </p>
                    )}
                    {data.cta_text && (
                        <div className="pt-4">
                            <Link
                                href={data.cta_link || '/book'}
                                className="group inline-flex items-center gap-3 border px-8 py-4 text-sm font-medium tracking-wide transition-colors hover:bg-gray-50"
                                style={{ borderColor: colors.primary, color: colors.primary }}
                            >
                                {data.cta_text}
                                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        </div>
                    )}
                </motion.div>

                {data.image && (
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="hidden lg:block">
                        <div className="aspect-[4/3] w-full overflow-hidden" style={{ border: `1px solid ${colors.primary}15` }}>
                            <img src={data.image} alt="" className="h-full w-full object-cover" />
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
