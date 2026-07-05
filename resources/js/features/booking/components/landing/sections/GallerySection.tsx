import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import type { LandingConfig, GalleryItem } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['gallery']>;
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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: 'easeOut' as const },
    },
};

export default function GallerySection({ data, colors }: Props) {
    const items = data.items;
    const [lightbox, setLightbox] = useState<number | null>(null);

    if (!items?.length) {
return null;
}

    return (
        <section id="gallery" className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: colors.background }}>
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
                    className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {items.map((item: GalleryItem, i: number) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="group relative mb-4 overflow-hidden rounded-2xl bg-neutral-100 shadow-sm cursor-pointer break-inside-avoid"
                            onClick={() => setLightbox(i)}
                        >
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.title ?? ''}
                                    className="w-full object-cover transition-all duration-500 group-hover:scale-110"
                                    style={{ minHeight: i % 3 === 0 ? '20rem' : i % 3 === 1 ? '16rem' : '18rem' }}
                                />
                            ) : (
                                <div
                                    className="flex w-full items-center justify-center text-neutral-300"
                                    style={{ minHeight: '14rem' }}
                                >
                                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                    </svg>
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <div>
                                    {item.title && <p className="text-sm font-semibold text-white">{item.title}</p>}
                                    {item.description && <p className="mt-1 text-xs text-white/70">{item.description}</p>}
                                </div>
                            </div>
                            <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
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
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setLightbox(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="relative max-h-[85vh] max-w-4xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={items[lightbox].image}
                                alt={items[lightbox].title ?? ''}
                                className="h-auto max-h-[85vh] w-full rounded-2xl object-contain shadow-2xl"
                            />
                            <button
                                type="button"
                                onClick={() => setLightbox(null)}
                                className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110"
                            >
                                <svg className="h-5 w-5 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            {(lightbox > 0) && (
                                <button
                                    type="button"
                                    onClick={() => setLightbox(lightbox - 1)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/40"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                            )}
                            {(lightbox < items.length - 1) && (
                                <button
                                    type="button"
                                    onClick={() => setLightbox(lightbox + 1)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/40"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            )}
                            {items[lightbox].title && (
                                <div className="absolute bottom-0 left-0 right-0 rounded-b-2xl bg-gradient-to-t from-black/70 to-transparent p-5 pt-12">
                                    <p className="text-lg font-semibold text-white">{items[lightbox].title}</p>
                                    {items[lightbox].description && (
                                        <p className="mt-1 text-sm text-white/70">{items[lightbox].description}</p>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}