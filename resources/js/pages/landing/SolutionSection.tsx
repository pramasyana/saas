import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const solutions = [
    {
        icon: '📅',
        title: 'Booking Otomatis',
        desc: 'Booking online dengan ketersediaan real-time, penjadwalan otomatis, dan konfirmasi instan.',
    },
    {
        icon: '👥',
        title: 'CRM Terintegrasi',
        desc: 'Profil pelanggan lengkap dengan riwayat kunjungan, preferensi, catatan, dan log komunikasi.',
    },
    {
        icon: '📊',
        title: 'Analitik Real-time',
        desc: 'Ketahui pendapatan, tren booking, layanan populer, dan nilai seumur hidup pelanggan.',
    },
    {
        icon: '⏰',
        title: 'Manajemen Staf',
        desc: 'Penjadwalan cerdas, deteksi konflik, izin berbasis peran, dan pelacakan kinerja.',
    },
    {
        icon: '📱',
        title: 'Pengingat Otomatis',
        desc: 'Pengingat via WhatsApp dan Email yang mengurangi no-show hingga 80%.',
    },
    {
        icon: '📋',
        title: 'Laporan & Insight',
        desc: 'Laporan khusus tentang pendapatan, booking, perilaku pelanggan, dan produktivitas staf.',
    },
];

export default function SolutionSection() {
    return (
        <Section
            id="solution"
            heading="Satu platform. Tak terbatas kemungkinannya."
            subheading="Semua yang Anda butuhkan untuk menjalankan bisnis jasa, terintegrasi dengan indah."
            className="bg-neutral-50/50"
        >
            <div className="mx-auto max-w-5xl">
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {solutions.map((s, i) => (
                        <motion.div
                            key={s.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="group rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                        >
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary-light/10 text-2xl">
                                {s.icon}
                            </span>
                            <h3 className="mt-5 text-base font-semibold text-neutral-900">
                                {s.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                                {s.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="mt-10 rounded-2xl bg-gradient-to-r from-primary/5 to-primary-light/5 p-6 text-center md:p-8"
                >
                    <p className="text-lg font-semibold text-primary md:text-xl">
                        Semua yang Anda butuhkan untuk menjalankan dan
                        mengembangkan bisnis — dalam satu tempat.
                    </p>
                </motion.div>
            </div>
        </Section>
    );
}
