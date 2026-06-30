import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Section from '@/molecules/Section';

const faqs = [
    {
        q: 'Is there a free trial?',
        a: 'Yes. Every plan includes a 14-day free trial with full access. No credit card required.',
    },
    {
        q: 'Can I migrate from my current booking system?',
        a: 'Absolutely. We offer free migration support for Pro and above plans. Our team handles the data transfer for you.',
    },
    {
        q: 'Do you offer custom branding?',
        a: 'Yes. Business and Enterprise plans include white-label branding. Use your own logo, colors, and domain.',
    },
    {
        q: 'What kind of support do you provide?',
        a: 'All plans include email support. Pro plans add live chat. Enterprise plans include a dedicated account manager and priority support.',
    },
    {
        q: 'Is my data secure?',
        a: 'We use enterprise-grade encryption (AES-256) for data at rest and TLS 1.3 for data in transit. We are SOC 2 compliant.',
    },
    {
        q: 'Can I accept payments through the platform?',
        a: 'Yes. We integrate with Stripe and Midtrans. You can collect deposits, full payments, or both at booking time.',
    },
];

export default function FaqSection() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <Section
            id="faq"
            heading="Frequently asked questions."
            subheading="Everything you need to know about our platform."
        >
            <div className="mx-auto max-w-2xl divide-y divide-border">
                {faqs.map((faq, i) => (
                    <div key={i} className="py-4">
                        <button
                            onClick={() => setOpen(open === i ? null : i)}
                            className="flex w-full items-center justify-between text-left"
                        >
                            <span className="text-sm font-medium text-neutral-900">
                                {faq.q}
                            </span>
                            <motion.svg
                                animate={{ rotate: open === i ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="h-4 w-4 shrink-0 text-neutral-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                />
                            </motion.svg>
                        </button>
                        <AnimatePresence initial={false}>
                            {open === i && (
                                <motion.div
                                    key="content"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                                        {faq.a}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </Section>
    );
}
