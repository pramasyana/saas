import { useState } from 'react';
import type { LandingConfig, FAQItem } from '@/features/booking/hooks/useLandingSettings';
import { cn } from '@/lib/utils';

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
        <section id="faq" className="border-b border-neutral-200/50 py-16 sm:py-20 lg:py-24" style={{ backgroundColor: colors.background }}>
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    {data.title && <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: colors.text }}>{data.title}</h2>}
                    {data.subtitle && <p className="mt-3" style={{ color: colors.text_muted }}>{data.subtitle}</p>}
                </div>
                <div className="mt-12 space-y-3">
                    {items.map((item: FAQItem, i: number) => (
                        <div key={i} className="rounded-xl border bg-white shadow-sm" style={{ borderColor: colors.primary + '15' }}>
                            <button type="button" onClick={() => setOpenIndex(openIndex === i ? -1 : i)} className="flex w-full items-center justify-between px-6 py-4 text-left">
                                <span className="text-sm font-semibold pr-4" style={{ color: colors.text }}>{item.question}</span>
                                <svg className={cn('h-5 w-5 shrink-0 transition-transform', openIndex === i && 'rotate-180')} style={{ color: colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                            {openIndex === i && (
                                <div className="border-t px-6 py-4" style={{ borderColor: colors.primary + '10' }}>
                                    <p className="text-sm leading-relaxed" style={{ color: colors.text_muted }}>{item.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
