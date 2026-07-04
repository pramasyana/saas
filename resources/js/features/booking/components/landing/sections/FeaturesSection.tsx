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
        <section id="features" className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: colors.background }}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center">
                        {data.title && (
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: colors.text }}>
                                {data.title}
                            </h2>
                        )}
                        {data.subtitle && (
                            <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed sm:text-lg" style={{ color: colors.text_muted }}>
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                </FadeIn>

                <motion.div
                    className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {items.map((item: FeatureItem, i: number) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="group relative overflow-hidden rounded-2xl border bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                            style={{ borderColor: colors.primary + '12' }}
                        >
                            <div
                                className="absolute top-0 right-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full opacity-10 transition-all duration-500 group-hover:opacity-20 group-hover:scale-150"
                                style={{ backgroundColor: colors.primary }}
                            />
                            <div
                                className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-110"
                                style={{
                                    backgroundColor: colors.primary,
                                    animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                                }}
                            >
                                <FeatureIcon icon={item.icon} />
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