import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const reasons = [
    {
        icon: '📱',
        title: 'Pelanggan ingin booking sendiri',
        desc: '88% konsumen lebih suka booking online. Jika kalender Anda manual, mereka pergi ke kompetitor.',
    },
    {
        icon: '📉',
        title: 'No-show menggerogoti pendapatan diam-diam',
        desc: 'Pengingat manual gagal. Follow-up otomatis via WhatsApp & Email mengurangi no-show hingga 80%.',
    },
    {
        icon: '📊',
        title: 'Anda buta tanpa data',
        desc: 'Spreadsheet tidak bisa memberi tahu jam sibuk, nilai seumur hidup pelanggan, atau tren pendapatan. Dashboard analitik kami bisa.',
    },
    {
        icon: '⚡',
        title: 'Kompetitor Anda sudah otomatis',
        desc: 'Sementara Anda sibuk dengan telepon dan double booking, mereka melayani lebih banyak pelanggan dengan usaha lebih sedikit.',
    },
    {
        icon: '🏗️',
        title: 'Berkembang tanpa software itu mustahil',
        desc: 'Anda tidak bisa menambah jam dalam sehari. Tapi Anda bisa menambah slot booking, staf, dan lokasi — tanpa kekacauan.',
    },
];

export default function WhyNowSection() {
    return (
        <Section
            id="why-now"
            heading="Kenapa sekarang? Karena biaya menunggu adalah pendapatan yang hilang."
            subheading="Setiap hari tanpa otomatisasi adalah uang yang tertinggal di atas meja."
        >
            <div className="mx-auto max-w-3xl space-y-4">
                {reasons.map((r, i) => (
                    <motion.div
                        key={r.title}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-start gap-4 rounded-xl border border-border bg-white p-5 transition-all hover:border-primary/20 hover:shadow-sm"
                    >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-lg">
                            {r.icon}
                        </span>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-900">
                                {r.title}
                            </h3>
                            <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                                {r.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
