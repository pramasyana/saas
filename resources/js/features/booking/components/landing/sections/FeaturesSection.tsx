import { motion } from 'framer-motion';
import type { LandingConfig, FeatureItem } from '@/features/booking/hooks/useLandingSettings';
import { FeatureIcon } from './_utils';
import FadeIn from '@/atoms/FadeIn';

interface Props {
    data: NonNullable<LandingConfig['features']>;
    colors: NonNullable<LandingConfig['colors']>;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' as const },
    },
};

export default function FeaturesSection({ data, colors }: Props) {
    const items = data.items;

    if (!items?.length) return null;

    return (
        <section id="features" className="py-16 sm:py-20 lg:py-section-gap-desktop" style={{ backgroundColor: '#F2F3FF' }}>
            <div className="mx-auto max-w-7xl px-gutter">
                <FadeIn>
                    <div className="text-center mb-20 space-y-4">
                        {data.title && (
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: colors.text }}>
                                {data.title}
                            </h2>
                        )}
                        {data.subtitle && (
                            <p className="max-w-2xl mx-auto text-base leading-relaxed sm:text-lg" style={{ color: colors.text_muted }}>
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                </FadeIn>

                <motion.div
                    className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {items.map((item: FeatureItem, i: number) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="group relative overflow-hidden rounded-lg p-8 transition-all duration-500 hover:-translate-y-2"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        >
                            <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-500"
                                style={{
                                    backgroundColor: colors.primary + '10',
                                    color: colors.primary,
                                }}
                            >
                                <div className="group-hover:hidden transition-all duration-500">
                                    <FeatureIcon icon={item.icon} />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold" style={{ color: colors.text }}>{item.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed" style={{ color: colors.text_muted }}>{item.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
