import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import type { LandingConfig, GalleryItem } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['gallery']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function GallerySection({ data, colors }: Props) {
    const items = data.items;
    const [lightbox, setLightbox] = useState<number | null>(null);

    if (!items?.length) {
        return null;
    }

    return (
        <section id="gallery" className="py-24 lg:py-32" style={{ backgroundColor: '#FAFAFA' }}>
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
                    className="grid grid-cols-2 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
                >
                    {items.map((item: GalleryItem, i: number) => (
                        <motion.div
                            key={i}
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                            className="group cursor-pointer overflow-hidden"
                            style={{ border: `1px solid ${colors.primary}10`, borderRadius: 0 }}
                            onClick={() => setLightbox(i)}
                        >
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.title ?? ''}
                                    className="w-full object-cover transition-opacity duration-500"
                                    style={{ aspectRatio: i % 3 === 0 ? '4/3' : '3/4' }}
                                />
                            ) : (
                                <div className="flex w-full items-center justify-center" style={{ aspectRatio: '1', backgroundColor: colors.primary + '05' }}>
                                    <span className="text-3xl font-light" style={{ color: colors.primary + '20' }}>+</span>
                                </div>
                            )}
                            {(item.title || item.description) && (
                                <div className="p-5">
                                    {item.title && <p className="text-sm font-medium" style={{ color: colors.text }}>{item.title}</p>}
                                    {item.description && <p className="mt-1 text-xs font-light" style={{ color: colors.text_muted }}>{item.description}</p>}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <AnimatePresence>
                {lightbox !== null && items[lightbox]?.image && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                        onClick={() => setLightbox(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="relative max-h-[85vh] max-w-4xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={items[lightbox].image}
                                alt={items[lightbox].title ?? ''}
                                className="h-auto max-h-[85vh] w-full object-contain"
                            />
                            <button
                                type="button"
                                onClick={() => setLightbox(null)}
                                className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center bg-white text-black text-lg font-light"
                            >
                                &times;
                            </button>
                            {lightbox > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setLightbox(lightbox - 1)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center bg-white/20 text-white backdrop-blur-sm"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                            )}
                            {lightbox < items.length - 1 && (
                                <button
                                    type="button"
                                    onClick={() => setLightbox(lightbox + 1)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center bg-white/20 text-white backdrop-blur-sm"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
