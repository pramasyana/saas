import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const benefits = [
    {
        icon: '⏱️',
        title: 'Hemat 10+ Jam per Minggu',
        desc: 'Otomatiskan booking, pengingat, dan follow-up. Berhenti buang waktu pada administrasi manual.',
    },
    {
        icon: '📉',
        title: 'Kurangi No-Show 80%',
        desc: 'Pengingat cerdas multi-channel via WhatsApp dan Email memastikan pelanggan datang.',
    },
    {
        icon: '👤',
        title: 'Kenali Setiap Pelanggan',
        desc: 'Profil lengkap dengan riwayat, preferensi, dan perilaku — personalisasi setiap interaksi.',
    },
    {
        icon: '💡',
        title: 'Keputusan Berbasis Data',
        desc: 'Tahu persis layanan mana yang menghasilkan, kapan Anda tersibuk, dan apa yang diinginkan pelanggan.',
    },
    {
        icon: '📧',
        title: 'Kembangkan dengan Otomatisasi',
        desc: 'Kirim kampanye tertarget, penawaran ulang tahun, dan urutan re-engagement secara otomatis.',
    },
];

export default function BenefitsSection() {
    return (
        <Section
            id="benefits"
            heading="Dibuat untuk menghemat waktu dan meningkatkan pendapatan."
            subheading="Setiap fitur memecahkan masalah nyata yang dihadapi bisnis jasa setiap hari."
        >
            <div className="mx-auto max-w-3xl">
                <div className="space-y-4">
                    {benefits.map((b, i) => (
                        <motion.div
                            key={b.title}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="group flex items-start gap-5 rounded-2xl border border-border bg-white p-5 transition-all duration-300 hover:border-success/20 hover:shadow-lg hover:shadow-success/5 md:p-6"
                        >
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/10 text-2xl">
                                <svg
                                    className="h-5 w-5 text-success"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.5 12.75l6 6 9-13.5"
                                    />
                                </svg>
                            </span>
                            <div>
                                <h3 className="text-base font-semibold text-neutral-900">
                                    {b.title}
                                </h3>
                                <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                                    {b.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="mt-8 rounded-2xl bg-gradient-to-r from-success/5 to-success/10 p-6 text-center md:p-8"
                >
                    <p className="text-lg font-semibold text-success md:text-xl">
                        Lebih banyak booking. Pendapatan lebih tinggi. Pelanggan lebih puas.
                    </p>
                </motion.div>
            </div>
        </Section>
    );
}
