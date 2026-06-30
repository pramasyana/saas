import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Section from '@/molecules/Section';

const faqs = [
    {
        q: 'Apakah ada uji coba gratis?',
        a: 'Ya. Semua paket termasuk uji coba 14 hari dengan akses penuh. Tanpa kartu kredit.',
    },
    {
        q: 'Bisa migrasi dari sistem booking yang sudah ada?',
        a: 'Tentu. Kami menawarkan dukungan migrasi gratis untuk paket Pro ke atas. Tim kami yang menangani transfer data.',
    },
    {
        q: 'Apakah Anda menyediakan branding kustom?',
        a: 'Ya. Paket Business dan Enterprise sudah termasuk white-label branding. Gunakan logo, warna, dan domain Anda sendiri.',
    },
    {
        q: 'Dukungan seperti apa yang tersedia?',
        a: 'Semua paket termasuk dukungan email. Paket Pro menambahkan live chat. Paket Enterprise termasuk account manager khusus dan dukungan prioritas.',
    },
    {
        q: 'Apakah data saya aman?',
        a: 'Kami menggunakan enkripsi enterprise-grade (AES-256) untuk data saat istirahat dan TLS 1.3 untuk data dalam perjalanan. Kami patuh SOC 2.',
    },
    {
        q: 'Bisa menerima pembayaran lewat platform?',
        a: 'Ya. Kami terintegrasi dengan Stripe dan Midtrans. Anda bisa mengumpulkan deposit, pembayaran penuh, atau keduanya saat booking.',
    },
];

export default function FaqSection() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <Section
            id="faq"
            heading="Pertanyaan yang sering diajukan."
            subheading="Semua yang perlu Anda ketahui tentang platform kami."
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
