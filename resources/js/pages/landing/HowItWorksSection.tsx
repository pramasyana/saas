import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const steps = [
    {
        num: '01',
        icon: '🔍',
        title: 'Pilih Layanan',
        desc: 'Cari layanan yang Anda butuhkan. Lihat ketersediaan real-time secara instan.',
    },
    {
        num: '02',
        icon: '📅',
        title: 'Pilih Tanggal & Jam',
        desc: 'Pilih slot yang tersedia. Kalender pintar kami mencegah double booking otomatis.',
    },
    {
        num: '03',
        icon: '✍️',
        title: 'Isi Data Diri',
        desc: 'Formulir singkat untuk nama, kontak, dan permintaan khusus Anda.',
    },
    {
        num: '04',
        icon: '✅',
        title: 'Konfirmasi Booking',
        desc: 'Periksa detail janji temu dan konfirmasi dengan satu klik.',
    },
    {
        num: '05',
        icon: '🎉',
        title: 'Dapatkan Konfirmasi!',
        desc: 'Terima konfirmasi instan via WhatsApp dan Email, plus pengingat sebelum kunjungan.',
    },
];

export default function HowItWorksSection() {
    return (
        <Section
            id="how-it-works"
            heading="Booking dalam hitungan detik."
            subheading="Pengalaman booking yang mulus bagi Anda dan pelanggan Anda."
        >
            <div className="mx-auto max-w-5xl">
                <div className="grid gap-6 md:grid-cols-5">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.num}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="relative rounded-2xl border border-border bg-white p-5 text-center transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
                        >
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary-light/10 text-2xl">
                                {step.icon}
                            </div>
                            <div className="mt-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                {step.num}
                            </div>
                            <h3 className="mt-3 text-sm font-semibold text-neutral-900">
                                {step.title}
                            </h3>
                            <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">
                                {step.desc}
                            </p>
                            {i < steps.length - 1 && (
                                <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-neutral-200 md:block">
                                    <svg
                                        className="h-5 w-5"
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
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
