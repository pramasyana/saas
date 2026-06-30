import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const businesses = [
    { icon: '💇', title: 'Salon Kecantikan', desc: 'Rambut, kuku, rias, dan perawatan kulit' },
    { icon: '✂️', title: 'Barbershop', desc: 'Pangkas rambut tradisional dan modern' },
    { icon: '🧖', title: 'Spa & Wellness', desc: 'Pijat, facial, dan perawatan holistik' },
    { icon: '🏥', title: 'Klinik', desc: 'Kunjungan medis, gigi, dan spesialis' },
    { icon: '🏋️', title: 'Studio Fitness', desc: 'Kelas, sesi PT, dan keanggotaan gym' },
    { icon: '📚', title: 'Bimbingan Belajar', desc: 'Les akademik dan pengembangan skill' },
    { icon: '💼', title: 'Konsultan', desc: 'Jasa konsultasi profesional dan coaching' },
    { icon: '🐾', title: 'Perawatan Hewan', desc: 'Grooming, vet, dan pet sitting' },
];

export default function TargetAudienceSection() {
    return (
        <Section
            id="audience"
            heading="Dibuat untuk setiap bisnis jasa."
            subheading="Dari pebisnis solo hingga bisnis multi-cabang."
            className="bg-neutral-50/50"
        >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {businesses.map((b, i) => (
                    <motion.div
                        key={b.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                        className="group rounded-2xl border border-border bg-white p-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                    >
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/5 to-primary-light/5 text-3xl transition-transform duration-300 group-hover:scale-110">
                            {b.icon}
                        </span>
                        <h3 className="mt-4 text-base font-semibold text-neutral-900">
                            {b.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-neutral-400">
                            {b.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
