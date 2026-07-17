import { motion } from 'framer-motion';
import { Scissors, Sparkles, Dumbbell, Stethoscope, GraduationCap } from 'lucide-react';
import Section from '@/molecules/Section';

const businesses = [
    { icon: Scissors, title: 'Salon & Barbershop', desc: 'Hair, nails, beauty, and grooming services' },
    { icon: Sparkles, title: 'Spa & Wellness', desc: 'Massage, facials, and holistic treatments' },
    { icon: Stethoscope, title: 'Clinics', desc: 'Medical, dental, and specialist visits' },
    { icon: Dumbbell, title: 'Fitness Studios', desc: 'Classes, personal training, and memberships' },
    { icon: GraduationCap, title: 'Education', desc: 'Tutoring, coaching, and skill development' },
];

export default function TargetAudienceSection() {
    return (
        <Section
            id="audience"
            heading="Built for every service business."
            subheading="From solo operators to multi-location enterprises."
            className="bg-neutral-50/50"
        >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {businesses.map((b, i) => {
                    const Icon = b.icon;

                    return (
                        <motion.div
                            key={b.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.06 }}
                            className="group rounded-2xl border border-border bg-white p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                        >
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/5 to-primary-light/5 transition-transform duration-300 group-hover:scale-110">
                                <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-neutral-900">
                                {b.title}
                            </h3>
                            <p className="mt-1.5 text-sm text-neutral-400">
                                {b.desc}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </Section>
    );
}
