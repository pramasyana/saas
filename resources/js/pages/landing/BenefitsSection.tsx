import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const benefits = [
    {
        icon: '⏱️',
        title: 'Save 10+ Hours Weekly',
        desc: 'Automate booking, reminders, and follow-ups. Stop wasting time on manual admin work.',
    },
    {
        icon: '📉',
        title: 'Cut No-Shows by 80%',
        desc: 'Smart multi-channel reminders via WhatsApp and email ensure customers show up.',
    },
    {
        icon: '👤',
        title: 'Know Every Customer',
        desc: 'Complete profiles with history, preferences, and behavior — personalize every interaction.',
    },
    {
        icon: '💡',
        title: 'Data-Driven Decisions',
        desc: 'Know exactly which services drive revenue, when you\'re busiest, and what customers want.',
    },
    {
        icon: '📧',
        title: 'Grow with Automation',
        desc: 'Send targeted campaigns, birthday offers, and re-engagement sequences automatically.',
    },
];

export default function BenefitsSection() {
    return (
        <Section
            id="benefits"
            heading="Built to save you time and grow your revenue."
            subheading="Every feature solves a real problem that service businesses face daily."
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
                        More bookings. Higher revenue. Happier customers.
                    </p>
                </motion.div>
            </div>
        </Section>
    );
}
