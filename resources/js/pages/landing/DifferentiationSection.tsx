import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const diffs = [
    {
        them: 'Pen & paper or spreadsheets',
        us: 'Automated booking from any device',
        upside: 'No double-bookings, no missed calls',
    },
    {
        them: 'No customer history',
        us: 'Complete CRM with timeline',
        upside: 'Personalized service every visit',
    },
    {
        them: 'Manual WhatsApp & SMS',
        us: 'Auto reminders & follow-ups',
        upside: '80% fewer no-shows',
    },
    {
        them: 'No insight into performance',
        us: 'Real-time analytics & reports',
        upside: 'Make data-driven decisions',
    },
    {
        them: 'Generic calendar tools',
        us: 'Built for service businesses',
        upside: 'Everything in one place',
    },
    {
        them: 'No payment integration',
        us: 'Take deposits & payments online',
        upside: 'Get paid before they walk in',
    },
];

export default function DifferentiationSection() {
    return (
        <Section
            id="differentiation"
            heading="Built for service businesses. Not generic calendars."
            subheading="Most tools are adapted from general scheduling. We built ours specifically for you."
            className="bg-neutral-50/50"
        >
            <div className="mx-auto max-w-5xl">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {diffs.map((d, i) => (
                        <motion.div
                            key={d.them}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06 }}
                            className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white"
                        >
                            <div className="bg-danger/5 p-4">
                                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-danger">
                                    Them
                                </div>
                                <p className="text-sm text-neutral-600">
                                    {d.them}
                                </p>
                            </div>
                            <div className="bg-success/5 p-4">
                                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-success">
                                    Us
                                </div>
                                <p className="text-sm font-medium text-neutral-900">
                                    {d.us}
                                </p>
                            </div>
                            <div className="bg-primary/5 p-4">
                                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
                                    Upside
                                </div>
                                <p className="text-sm text-neutral-600">
                                    {d.upside}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
