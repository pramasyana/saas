import { motion } from 'framer-motion';
import { Calendar, Users, Wallet, Globe, ArrowRight } from 'lucide-react';
import Section from '@/molecules/Section';

const modules = [
    {
        icon: Calendar,
        title: 'Booking',
        desc: 'Atur jadwal dan reservasi pelanggan secara otomatis tanpa bentrok. Pantau ketersediaan real-time.',
        bg: 'bg-primary/10',
        hoverBg: 'group-hover:bg-primary',
    },
    {
        icon: Users,
        title: 'CRM',
        desc: 'Kelola database pelanggan, riwayat transaksi, dan loyalitas dalam satu dasbor yang terpusat.',
        bg: 'bg-primary/10',
        hoverBg: 'group-hover:bg-primary',
    },
    {
        icon: Wallet,
        title: 'Finance',
        desc: 'Catat setiap transaksi, pantau arus kas, dan buat laporan keuangan otomatis dengan akurasi tinggi.',
        bg: 'bg-primary/10',
        hoverBg: 'group-hover:bg-primary',
    },
    {
        icon: Globe,
        title: 'Pages',
        desc: 'Buat website profesional untuk bisnis Anda dengan editor yang mudah digunakan tanpa perlu coding.',
        bg: 'bg-primary/10',
        hoverBg: 'group-hover:bg-primary',
    },
];

export default function CoreFeaturesSection() {
    return (
        <Section
            id="features"
            className="bg-neutral-50/30"
            heading="Solusi Lengkap untuk Bisnis Anda"
            subheading="Empat pilar utama Nusentra yang dirancang untuk membantu efisiensi dan pertumbuhan operasional bisnis Anda secara maksimal."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {modules.map((mod, i) => {
                    const Icon = mod.icon;
                    return (
                        <motion.div
                            key={mod.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="group bg-white p-6 rounded-xl border border-neutral-200/50 hover:border-primary/50 transition-all shadow-sm"
                        >
                            <div className={`w-12 h-12 rounded ${mod.bg} flex items-center justify-center mb-6 ${mod.hoverBg} transition-colors`}>
                                <Icon className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-2">{mod.title}</h3>
                            <p className="text-sm text-neutral-500 mb-4 leading-relaxed">{mod.desc}</p>
                            <a
                                href="#features"
                                className="text-sm font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all"
                            >
                                Pelajari selengkapnya <ArrowRight className="h-4 w-4" />
                            </a>
                        </motion.div>
                    );
                })}
            </div>
        </Section>
    );
}
