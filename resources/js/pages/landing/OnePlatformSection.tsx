import { motion } from 'framer-motion';
import { Calendar, Users, CreditCard, Globe, Network } from 'lucide-react';
import Section from '@/molecules/Section';

const modules = [
    {
        icon: Calendar,
        title: 'Booking',
        desc: 'Online scheduling with real-time availability, automated confirmations, and smart reminders.',
        color: 'from-blue-500/10 to-blue-600/5',
        iconColor: 'text-blue-600',
    },
    {
        icon: Users,
        title: 'CRM',
        desc: 'Complete customer profiles with history, preferences, and communication tracking.',
        color: 'from-primary/10 to-primary-light/5',
        iconColor: 'text-primary',
    },
    {
        icon: CreditCard,
        title: 'Finance',
        desc: 'Invoicing, payment tracking, and financial reporting in one place.',
        color: 'from-emerald-500/10 to-emerald-600/5',
        iconColor: 'text-emerald-600',
    },
    {
        icon: Globe,
        title: 'Pages',
        desc: 'Professional landing pages for your business, built and managed from your dashboard.',
        color: 'from-amber-500/10 to-amber-600/5',
        iconColor: 'text-amber-600',
    },
    {
        icon: Network,
        title: 'Connected Data',
        desc: 'Every module talks to the other. No silos, no duplicate entry, no gaps.',
        color: 'from-violet-500/10 to-violet-600/5',
        iconColor: 'text-violet-600',
    },
];

const outcomes = [
    { label: 'Faster operations', icon: '→' },
    { label: 'Business growth', icon: '→' },
];

export default function OnePlatformSection() {
    return (
        <section id="features" className="relative overflow-hidden bg-neutral-50/50 py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary"
                    >
                        ONE PLATFORM
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                        className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl"
                    >
                        Everything you need.
                        <br />
                        <span className="text-primary">Nothing you don&apos;t.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mt-4 text-lg leading-relaxed text-neutral-500"
                    >
                        Nusentra is a connected business ecosystem that helps
                        companies transition from manual operations to a fully
                        integrated digital platform.
                    </motion.p>
                </div>

                <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {modules.map((mod, i) => {
                        const Icon = mod.icon;

                        return (
                            <motion.div
                                key={mod.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.06 }}
                                className="group rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                            >
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${mod.color}`}>
                                    <Icon className={`h-6 w-6 ${mod.iconColor}`} />
                                </div>
                                <h3 className="mt-4 text-base font-semibold text-neutral-900">
                                    {mod.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                                    {mod.desc}
                                </p>
                            </motion.div>
                        );
                    })}

                    {outcomes.map((outcome, i) => (
                        <motion.div
                            key={outcome.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: (modules.length + i) * 0.06 }}
                            className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary-light/5">
                                <span className="text-lg font-bold text-primary">{outcome.icon}</span>
                            </div>
                            <h3 className="text-base font-semibold text-neutral-900">
                                {outcome.label}
                            </h3>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
