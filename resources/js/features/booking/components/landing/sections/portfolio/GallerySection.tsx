import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import FadeIn from '@/atoms/FadeIn';
import type { LandingConfig, GalleryItem } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['gallery']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function GallerySection({ data, colors }: Props) {
    const items = data.items;
    const [lightbox, setLightbox] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    if (!items?.length) return null;

    const firstItem = items[0];
    const restItems = items.slice(1);

    return (
        <section id="gallery" className="py-20 sm:py-24 lg:py-32" style={{ backgroundColor: '#FAFAF8' }}>
            <div className="mx-auto max-w-7xl px-gutter">
                <FadeIn>
                    <div className="mb-16">
                        <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: colors.primary }}>Portfolio</span>
                        <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-[0.95]" style={{ color: '#1A1A2E' }}>
                            {data.title || 'Selected Works'}
                        </h2>
                        {data.subtitle && (
                            <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: colors.text_muted }}>
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                </FadeIn>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7 }}
                    className="relative overflow-hidden shadow-2xl cursor-pointer group"
                    onClick={() => setLightbox(0)}
                >
                    {firstItem.image ? (
                        <div className="aspect-[16/9] w-full overflow-hidden">
                            <img src={firstItem.image} alt={firstItem.title ?? ''}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    ) : (
                        <div className="aspect-[16/9] w-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '08' }}>
                            <span className="text-8xl font-black" style={{ color: colors.primary + '15' }}>✦</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {firstItem.title && (
                        <div className="absolute bottom-0 left-0 right-0 p-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                            <p className="text-2xl font-bold text-white">{firstItem.title}</p>
                            {firstItem.description && <p className="mt-2 text-sm text-white/70">{firstItem.description}</p>}
                        </div>
                    )}
                </motion.div>

                {restItems.length > 0 && (
                    <div ref={scrollRef} className="mt-6 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {restItems.map((item, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                className="snap-start shrink-0 w-72 sm:w-80 cursor-pointer group relative overflow-hidden shadow-xl"
                                onClick={() => setLightbox(i + 1)}
                            >
                                {item.image ? (
                                    <div className="aspect-[4/3] w-full overflow-hidden">
                                        <img src={item.image} alt={item.title ?? ''}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-[4/3] w-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '08' }}>
                                        <span className="text-5xl font-black" style={{ color: colors.primary + '15' }}>✦</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                {item.title && (
                                    <div className="absolute bottom-0 left-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        <p className="text-sm font-bold text-white">{item.title}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {lightbox !== null && items[lightbox]?.image && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                        onClick={() => setLightbox(null)}
                    >
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="relative max-h-[85vh] max-w-5xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={items[lightbox].image} alt={items[lightbox].title ?? ''}
                                className="h-auto max-h-[85vh] w-full object-contain shadow-2xl"
                            />
                            <button type="button" onClick={() => setLightbox(null)}
                                className="absolute -top-4 -right-4 flex h-12 w-12 items-center justify-center bg-white shadow-2xl transition-transform hover:scale-110"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            {lightbox > 0 && (
                                <button type="button" onClick={() => setLightbox(lightbox - 1)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/30"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                            )}
                            {lightbox < items.length - 1 && (
                                <button type="button" onClick={() => setLightbox(lightbox + 1)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/30"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            )}
                            {items[lightbox].title && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 pt-16">
                                    <p className="text-xl font-bold text-white">{items[lightbox].title}</p>
                                    {items[lightbox].description && <p className="mt-2 text-sm text-white/70">{items[lightbox].description}</p>}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
