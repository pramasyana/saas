import { motion } from 'framer-motion';
import FadeIn from '@/atoms/FadeIn';
import type { LandingConfig, FeatureItem } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['features']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function FeaturesSection({ data, colors }: Props) {
    const items = data.items;

    if (!items?.length) {
        return null;
    }

    return (
        <section id="features" className="py-24 lg:py-32" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="mx-auto max-w-5xl px-gutter">
                <FadeIn>
                    <div className="text-center mb-20 space-y-4">
                        {data.title && (
                            <h2 className="text-5xl lg:text-6xl font-black tracking-tight" style={{ color: colors.text }}>
                                {data.title}
                            </h2>
                        )}
                        {data.subtitle && (
                            <p className="max-w-2xl mx-auto text-base font-light leading-relaxed" style={{ color: colors.text_muted }}>
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                </FadeIn>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } }}
                >
                    {items.map((item: FeatureItem, i: number) => (
                        <motion.div
                            key={i}
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                            className="grid grid-cols-[4rem_1fr] gap-8 py-10"
                            style={{ borderBottom: `1px solid ${colors.primary}12` }}
                        >
                            <span className="text-4xl font-light tabular-nums" style={{ color: colors.primary + '40' }}>
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <div>
                                <h3 className="text-xl font-semibold tracking-tight" style={{ color: colors.text }}>
                                    {item.title}
                                </h3>
                                <p className="mt-3 text-sm font-light leading-relaxed max-w-xl" style={{ color: colors.text_muted }}>
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
