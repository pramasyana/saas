import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const steps = [
    {
        num: '01',
        icon: '🔍',
        title: 'Choose a Service',
        desc: 'Browse your services and pick what you need. See real-time availability instantly.',
    },
    {
        num: '02',
        icon: '📅',
        title: 'Pick Date & Time',
        desc: 'Select from available slots. Our smart calendar prevents double bookings automatically.',
    },
    {
        num: '03',
        icon: '✍️',
        title: 'Enter Your Details',
        desc: 'Quick form to capture your name, contact, and any special requests.',
    },
    {
        num: '04',
        icon: '✅',
        title: 'Confirm Booking',
        desc: 'Review your appointment details and confirm with one click.',
    },
    {
        num: '05',
        icon: '🎉',
        title: 'Get Confirmed!',
        desc: 'Receive instant confirmation via WhatsApp and email with reminders before your visit.',
    },
];

export default function HowItWorksSection() {
    return (
        <Section
            id="how-it-works"
            heading="Book in seconds. Not hours."
            subheading="A seamless booking experience for you and your customers."
        >
            <div className="mx-auto max-w-5xl">
                <div className="grid gap-6 md:grid-cols-5">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.num}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="relative rounded-2xl border border-border bg-white p-5 text-center transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
                        >
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary-light/10 text-2xl">
                                {step.icon}
                            </div>
                            <div className="mt-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                {step.num}
                            </div>
                            <h3 className="mt-3 text-sm font-semibold text-neutral-900">
                                {step.title}
                            </h3>
                            <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">
                                {step.desc}
                            </p>
                            {i < steps.length - 1 && (
                                <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-neutral-200 md:block">
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                        />
                                    </svg>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
