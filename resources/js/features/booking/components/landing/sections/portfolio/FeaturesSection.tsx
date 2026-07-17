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
        transition: { staggerChildren: 0.15 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' as const },
    },
};

export default function FeaturesSection({ data, colors }: Props) {
    const items = data.items;

    if (!items?.length) {
        return null;
    }

    return (
        <section id="features" className="py-20 sm:py-24 lg:py-32" style={{ backgroundColor: colors.background }}>
            <div className="mx-auto max-w-7xl px-gutter">
                <FadeIn>
                    <div className="mb-16 space-y-4">
                        <span className="block text-xs font-bold uppercase tracking-[0.2em]" style={{ color: colors.primary }}>
                            Fitur Unggulan
                        </span>
                        {data.title && (
                            <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl" style={{ color: colors.text }}>
                                {data.title}
                            </h2>
                        )}
                        {data.subtitle && (
                            <p className="max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: colors.text_muted }}>
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                </FadeIn>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {items.map((item: FeatureItem, i: number) => {
                        const isEven = i % 2 === 0;
                        return (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                className={`flex flex-col items-center gap-8 py-12 lg:flex-row lg:gap-16 ${!isEven ? 'lg:flex-row-reverse' : ''}`}
                                style={{ borderBottom: i < items.length - 1 ? `1px solid ${colors.primary}12` : 'none' }}
                            >
                                <div
                                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 hover:scale-110"
                                    style={{ backgroundColor: colors.primary, color: '#FFFFFF' }}
                                >
                                    <div className="scale-110">
                                        <FeatureIcon icon={item.icon} />
                                    </div>
                                </div>

                                <div className={`flex-1 space-y-3 ${!isEven ? 'lg:text-right' : ''}`}>
                                    <h3 className="text-xl font-bold sm:text-2xl" style={{ color: colors.text }}>
                                        {item.title}
                                    </h3>
                                    <p className="max-w-xl text-base leading-relaxed" style={{ color: colors.text_muted }}>
                                        {item.description}
                                    </p>
                                </div>

                                {!isEven && <div className="hidden lg:block flex-1" />}
                                {isEven && <div className="hidden lg:block flex-1" />}
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
