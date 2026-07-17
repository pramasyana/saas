import { motion } from 'framer-motion';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';
import { getInitials } from '../_utils';

interface Props {
    data: NonNullable<LandingConfig['testimonials']>;
    colors: NonNullable<LandingConfig['colors']>;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' as const },
    },
};

export default function TestimonialsSection({ data, colors }: Props) {
    const items = data.items;

    if (!items?.length) {
        return null;
    }

    return (
        <section id="testimonials" className="py-16 sm:py-20 lg:py-section-gap-desktop" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="mx-auto max-w-7xl px-gutter">
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

                <motion.div
                    className="grid gap-6 md:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {items.map((item, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariants}
                            className="relative rounded-lg border bg-white p-8 transition-all duration-300 hover:shadow-sm"
                            style={{ borderColor: '#E5E7EB' }}
                        >
                            <div
                                className="absolute -top-2 -right-2 text-8xl font-serif leading-none select-none"
                                style={{ color: colors.primary + '10' }}
                            >
                                &ldquo;
                            </div>

                            <div className="flex mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className={`h-4 w-4 ${star <= item.rating ? '' : 'text-neutral-300'}`}
                                        style={star <= item.rating ? { color: '#F59E0B' } : {}}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            <p className="text-sm leading-relaxed italic mb-6 relative z-10" style={{ color: colors.text }}>
                                &ldquo;{item.content}&rdquo;
                            </p>

                            <div className="flex items-center gap-3 border-t pt-5" style={{ borderColor: '#E5E7EB' }}>
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold text-white"
                                    style={{ backgroundColor: colors.primary }}
                                >
                                    {getInitials(item.name)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold" style={{ color: colors.text }}>{item.name}</p>
                                    {item.role && <p className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.text_muted }}>{item.role}</p>}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
