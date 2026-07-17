import { motion } from 'framer-motion';
import FadeIn from '@/atoms/FadeIn';
import type { LandingConfig, FeatureItem } from '@/features/booking/hooks/useLandingSettings';
import { FeatureIcon } from '../_utils';

interface Props {
    data: NonNullable<LandingConfig['features']>;
    colors: NonNullable<LandingConfig['colors']>;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' as const },
    },
};

export default function FeaturesSection({ data, colors }: Props) {
    const items = data.items;

    if (!items?.length) {
        return null;
    }

    return (
        <section id="features" className="py-16 sm:py-20 lg:py-section-gap-desktop" style={{ backgroundColor: '#F8FAFC' }}>
            <div className="mx-auto max-w-7xl px-gutter">
                <FadeIn>
                    <div className="text-center mb-16 space-y-4">
                        {data.title && (
                            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: colors.text }}>
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
                    className="grid gap-6 sm:grid-cols-2"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {items.map((item: FeatureItem, i: number) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="group relative flex gap-6 rounded-lg bg-white p-6 border transition-all duration-300 hover:shadow-sm"
                            style={{ borderColor: '#E5E7EB' }}
                        >
                            <div
                                className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
                                style={{ backgroundColor: colors.primary }}
                            />
                            <div
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                                style={{ backgroundColor: colors.primary + '10', color: colors.primary }}
                            >
                                <FeatureIcon icon={item.icon} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-base font-bold" style={{ color: colors.text }}>{item.title}</h3>
                                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: colors.text_muted }}>{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
