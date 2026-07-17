import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import type { LandingConfig, FAQItem } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['faq']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function FAQSection({ data, colors }: Props) {
    const items = data.items;
    const [openIndex, setOpenIndex] = useState(-1);

    if (!items?.length) {
        return null;
    }

    return (
        <section id="faq" className="py-24 lg:py-32" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="mx-auto max-w-3xl px-gutter">
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

                <div className="space-y-0">
                    {items.map((item: FAQItem, i: number) => {
                        const isOpen = openIndex === i;
                        return (
                            <div key={i} style={{ borderBottom: `1px solid ${colors.primary}12` }}>
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                                    className="flex w-full items-center justify-between py-8 text-left"
                                >
                                    <span className="text-base font-medium pr-8" style={{ color: colors.text }}>
                                        {item.question}
                                    </span>
                                    <span
                                        className="text-2xl font-light shrink-0 transition-transform duration-300"
                                        style={{
                                            color: colors.text_muted,
                                            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                                        }}
                                    >
                                        +
                                    </span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            key="content"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pb-10 text-sm font-light leading-relaxed" style={{ color: colors.text_muted }}>
                                                {item.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
