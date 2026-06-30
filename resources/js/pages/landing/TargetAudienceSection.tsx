import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const businesses = [
    { icon: '💇', title: 'Beauty Salon', desc: 'Hair, nails, makeup, and skincare appointments' },
    { icon: '✂️', title: 'Barbershop', desc: 'Traditional and modern barber services' },
    { icon: '🧖', title: 'Spa & Wellness', desc: 'Massages, facials, and holistic treatments' },
    { icon: '🏥', title: 'Clinic', desc: 'Medical, dental, and specialist visits' },
    { icon: '🏋️', title: 'Fitness Studio', desc: 'Classes, PT sessions, and gym memberships' },
    { icon: '📚', title: 'Tutoring', desc: 'Academic coaching and skill development' },
    { icon: '💼', title: 'Consulting', desc: 'Professional advisory and coaching services' },
    { icon: '🐾', title: 'Pet Care', desc: 'Grooming, veterinary, and pet sitting' },
];

export default function TargetAudienceSection() {
    return (
        <Section
            id="audience"
            heading="Built for every service business."
            subheading="From solopreneurs to multi-location businesses."
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
