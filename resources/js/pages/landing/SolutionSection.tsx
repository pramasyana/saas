import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const solutions = [
    {
        icon: '📅',
        title: 'Smart Booking Engine',
        desc: 'Online booking with real-time availability, automated scheduling, and instant confirmations.',
    },
    {
        icon: '👥',
        title: 'Built-in CRM',
        desc: 'Complete customer profiles with visit history, preferences, notes, and communication logs.',
    },
    {
        icon: '📊',
        title: 'Real-time Analytics',
        desc: 'Know your revenue, booking trends, popular services, and customer lifetime value.',
    },
    {
        icon: '⏰',
        title: 'Staff Management',
        desc: 'Intelligent scheduling, conflict detection, role-based permissions, and performance tracking.',
    },
    {
        icon: '📱',
        title: 'Automated Reminders',
        desc: 'WhatsApp and email reminders that reduce no-shows by up to 80%.',
    },
    {
        icon: '📋',
        title: 'Reports & Insights',
        desc: 'Custom reports on revenue, bookings, customer behavior, and staff productivity.',
    },
];

export default function SolutionSection() {
    return (
        <Section
            id="solution"
            heading="One platform. Endless possibilities."
            subheading="Everything you need to run your service business, beautifully integrated."
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
                        Everything you need to run and grow your business —
                        in one place.
                    </p>
                </motion.div>
            </div>
        </Section>
    );
}
