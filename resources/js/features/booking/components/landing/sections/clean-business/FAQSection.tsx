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
        <section id="faq" className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: '#F8FAFC' }}>
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
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

                <div className="mt-12">
                    {items.map((item: FAQItem, i: number) => {
                        const isOpen = openIndex === i;

                        return (
                            <div
                                key={i}
                                className="border-b last:border-b-0"
                                style={{
                                    borderColor: '#E5E7EB',
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                                    className="flex w-full items-center justify-between py-5 text-left transition-colors"
                                    style={isOpen ? {
                                        borderLeft: `4px solid ${colors.primary}`,
                                        paddingLeft: '16px',
                                        marginLeft: '-20px',
                                        backgroundColor: colors.primary + '05',
                                    } : { paddingLeft: '20px', marginLeft: '-20px' }}
                                >
                                    <span className="text-sm font-bold pr-4 sm:text-base" style={{ color: colors.text }}>
                                        {item.question}
                                    </span>
                                    <div
                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-200"
                                        style={{
                                            backgroundColor: colors.primary + '10',
                                            color: colors.primary,
                                        }}
                                    >
                                        <svg
                                            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
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
                                            <div className="pb-5 pl-10">
                                                <p className="text-sm leading-relaxed" style={{ color: colors.text_muted }}>
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
