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
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
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
        <section id="gallery" className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: '#F8FAFC' }}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center">
                        {data.title && (
                            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: colors.text }}>
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
                    className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {items.map((item: GalleryItem, i: number) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="group relative overflow-hidden rounded-lg border bg-white cursor-pointer transition-all duration-300 hover:shadow-sm"
                            style={{ borderColor: '#E5E7EB' }}
                            onClick={() => setLightbox(i)}
                        >
                            {item.image ? (
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title ?? ''}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            ) : (
                                <div
                                    className="flex aspect-[4/3] w-full items-center justify-center text-neutral-300"
                                >
                                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                    </svg>
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <div>
                                    {item.title && <p className="text-sm font-bold text-white">{item.title}</p>}
                                    {item.description && <p className="mt-1 text-xs text-white/70">{item.description}</p>}
                                </div>
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
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
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
                                className="h-auto max-h-[85vh] w-full rounded-lg object-contain"
                            />
                            <button
                                type="button"
                                onClick={() => setLightbox(null)}
                                className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md transition-transform hover:scale-105"
                            >
                                <svg className="h-5 w-5 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            {lightbox > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setLightbox(lightbox - 1)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-neutral-800 shadow-md transition-all hover:scale-105"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                            )}
                            {lightbox < items.length - 1 && (
                                <button
                                    type="button"
                                    onClick={() => setLightbox(lightbox + 1)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-neutral-800 shadow-md transition-all hover:scale-105"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            )}
                            {items[lightbox].title && (
                                <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/70 to-transparent p-5 pt-12">
                                    <p className="text-lg font-bold text-white">{items[lightbox].title}</p>
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
