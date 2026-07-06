import { motion } from 'framer-motion';
import { Search, CalendarCheck, BellRing } from 'lucide-react';
import Section from '@/molecules/Section';

const steps = [
    {
        icon: Search,
        title: 'Pilih Layanan & Waktu',
        desc: 'Pelanggan browsing layanan Anda, lihat ketersediaan real-time, dan pilih slot yang paling sesuai.',
    },
    {
        icon: CalendarCheck,
        title: 'Booking Otomatis',
        desc: 'Konfirmasi instan dikirim. Kalender Anda terupdate otomatis. Tidak ada double booking.',
    },
    {
        icon: BellRing,
        title: 'Pengingat Cerdas',
        desc: 'Pengingat otomatis via WhatsApp & Email. No-show turun drastis. Pelanggan selalu tepat waktu.',
    },
];

export default function HowItWorksSection() {
    return (
        <Section
            id="how-it-works"
            heading="Booking dalam hitungan detik."
            subheading="Pengalaman booking yang mulus bagi Anda dan pelanggan Anda."
        >
            <div className="relative mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
                {steps.map((step, i) => {
                    const Icon = step.icon;
                    return (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.12 }}
                            className="relative text-center"
                        >
                            {i < steps.length - 1 && (
                                <div className="absolute top-12 -right-4 z-10 hidden text-neutral-200 md:block">
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                        />
                                    </svg>
                                </div>
                            )}
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary-light/10">
                                <Icon className="h-7 w-7 text-primary" />
                            </div>
                            <div className="mt-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                {String(i + 1).padStart(2, '0')}
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-neutral-900">
                                {step.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                                {step.desc}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </Section>
    );
}
