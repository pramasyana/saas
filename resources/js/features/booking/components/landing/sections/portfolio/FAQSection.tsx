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

    if (!items?.length) return null;

    return (
        <section id="faq" className="py-20 sm:py-24 lg:py-32" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="mx-auto max-w-4xl px-gutter">
                <FadeIn>
                    <div className="mb-16">
                        <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: colors.primary }}>FAQ</span>
                        <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-[0.95]" style={{ color: '#1A1A2E' }}>
                            {data.title || 'Frequently Asked'}
                        </h2>
                        {data.subtitle && (
                            <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: colors.text_muted }}>
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                </FadeIn>

                <div className="space-y-0">
                    {items.map((item: FAQItem, i: number) => {
                        const isOpen = openIndex === i;
                        const number = String(i + 1).padStart(2, '0');

                        return (
                            <div key={i} className="border-t" style={{ borderColor: '#E5E7EB' }}>
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                                    className="flex w-full items-start gap-6 py-8 text-left group"
                                >
                                    <span className="text-4xl font-black shrink-0 transition-colors" style={{ color: isOpen ? colors.primary : '#E5E7EB' }}>
                                        {number}
                                    </span>
                                    <span className="flex-1 text-xl font-bold pr-4 sm:text-2xl" style={{ color: '#1A1A2E' }}>
                                        {item.question}
                                    </span>
                                    <div className="mt-2 shrink-0 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                                            style={{ color: isOpen ? colors.primary : colors.text_muted }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </div>
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
                                            <div className="pb-8 pl-16">
                                                <p className="text-base leading-relaxed" style={{ color: colors.text_muted }}>
                                                    {item.answer}
                                                </p>
                                            </div>
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
