import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const stats = [
    { value: 'Rp100T+', label: 'Pasar booking online 2026' },
    { value: '80%', label: 'Penurunan no-show' },
    { value: '40%', label: 'Kenaikan pendapatan bisnis' },
    { value: '10x', label: 'ROI otomatisasi booking' },
];

export default function MarketSection() {
    return (
        <Section
            id="market"
            heading="Industri booking sedang meledak."
            subheading="Bisnis jasa beralih ke online. Yang tidak beradaptasi akan tertinggal."
            className="bg-neutral-50/50"
        >
            <div className="mx-auto max-w-5xl">
                <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="rounded-2xl border border-border bg-white p-5 text-center"
                        >
                            <div className="text-2xl font-bold text-primary">
                                {s.value}
                            </div>
                            <div className="mt-1 text-xs text-neutral-400">
                                {s.label}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-white to-primary-light/5 p-8 text-center">
                    <div className="mx-auto max-w-2xl">
                        <h3 className="text-lg font-semibold text-neutral-900">
                            Perubahan sedang terjadi sekarang
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                            Pasar booking online global diproyeksikan mencapai{' '}
                            <span className="font-semibold text-primary">
                                Rp100 triliun
                            </span>{' '}
                            pada 2026. Konsumen menginginkan booking instan
                            dan self-service. Bisnis yang menyediakannya
                            mencatat{' '}
                            <span className="font-semibold text-primary">
                                kenaikan pendapatan 40%
                            </span>{' '}
                            dan{' '}
                            <span className="font-semibold text-primary">
                                no-show turun 80%
                            </span>
                            . Pertanyaannya bukan apakah akan digitalisasi —
                            tapi apakah Anda akan memimpin atau tertinggal.
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    );
}
