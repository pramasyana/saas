import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const testimonials = [
    {
        initials: 'AP',
        name: 'Andini Putri',
        role: 'Owner, Bloom Creative Studio',
        quote: 'Sistem Booking dari Nusentra sangat memudahkan operasional studio kami. Pelanggan bisa pesan sendiri dan jadwal kami selalu rapi.',
        stats: [
            { value: '2x', label: 'Lebih Cepat' },
            { value: '50%', label: 'Effort Reduksi' },
        ],
    },
    {
        initials: 'BS',
        name: 'Budi Santoso',
        role: 'Manager Operasional, Jaya Retail',
        quote: 'Modul Finance dan CRM Nusentra benar-benar membantu kami memahami pelanggan dan mengontrol keuangan retail kami.',
        stats: [
            { value: '99%', label: 'Akurasi Stok' },
            { value: '30%', label: 'Omzet Naik' },
        ],
    },
];

export default function TestimonialsSection() {
    return (
        <Section
            className="bg-neutral-50/50"
            heading="Apa Kata Pengguna Kami"
            subheading="Bergabunglah dengan ribuan pemilik bisnis yang telah bertransformasi."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((t, i) => (
                    <motion.div
                        key={t.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.12 }}
                        className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200/50 flex flex-col md:flex-row gap-6 items-center"
                    >
                        <div className="w-28 h-28 rounded-xl bg-primary/10 shrink-0 flex items-center justify-center">
                            <span className="text-primary text-3xl font-bold">{t.initials}</span>
                        </div>
                        <div>
                            <div className="flex gap-4 mb-4">
                                {t.stats.map((s) => (
                                    <div key={s.label}>
                                        <div className="text-3xl font-bold text-primary">{s.value}</div>
                                        <div className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider">
                                            {s.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="italic text-neutral-600 mb-4 text-sm leading-relaxed">
                                &ldquo;{t.quote}&rdquo;
                            </p>
                            <div className="font-bold text-sm text-neutral-900">{t.name}</div>
                            <div className="text-xs text-neutral-400">{t.role}</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
