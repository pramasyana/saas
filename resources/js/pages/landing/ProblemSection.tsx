import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const problems = [
    {
        icon: '📋',
        title: 'Manual Booking Chaos',
        desc: 'Endless phone calls, text messages, and back-and-forth just to schedule an appointment.',
    },
    {
        icon: '❌',
        title: 'Double Bookings',
        desc: 'Overlapping schedules lead to unhappy customers and lost revenue every single week.',
    },
    {
        icon: '📊',
        title: 'Scattered Customer Data',
        desc: 'Customer info spread across spreadsheets, notebooks, and sticky notes with no central view.',
    },
    {
        icon: '📈',
        title: 'Blind Business Decisions',
        desc: 'No visibility into revenue trends, popular services, or customer behavior patterns.',
    },
    {
        icon: '👋',
        title: 'Customer Churn',
        desc: 'No systematic way to follow up, re-engage, or build lasting customer relationships.',
    },
];

export default function ProblemSection() {
    return (
        <Section
            id="problem"
            heading="Running a service business shouldn't be this hard."
            subheading="Yet most businesses struggle with the same preventable problems."
            className="relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-danger/[0.02] blur-3xl" />
            <div className="relative mx-auto max-w-4xl">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {problems.map((p, i) => (
                        <motion.div
                            key={p.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="group rounded-2xl border border-danger/10 bg-white p-6 transition-all duration-300 hover:border-danger/20 hover:shadow-lg hover:shadow-danger/5"
                        >
                            <span className="text-2xl">{p.icon}</span>
                            <h3 className="mt-4 text-base font-semibold text-neutral-900">
                                {p.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                                {p.desc}
                            </p>
                        </motion.div>
                    ))}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        className="col-span-full mt-4 rounded-2xl border border-danger/20 bg-gradient-to-br from-danger/5 to-danger/10 p-6 text-center md:p-8"
                    >
                        <p className="text-base font-semibold text-danger md:text-lg">
                            The result? Lost bookings, stressed teams,
                            unhappy customers, and stunted growth.
                        </p>
                    </motion.div>
                </div>
            </div>
        </Section>
    );
}
