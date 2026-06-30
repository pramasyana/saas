import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Button from '@/atoms/Button';
import Section from '@/molecules/Section';

const plans = [
    {
        name: 'Starter',
        monthly: 19,
        yearly: 190,
        desc: 'Perfect for solo entrepreneurs',
        features: [
            '50 bookings/mo',
            'Basic CRM',
            'Email reminders',
            'Calendar sync',
            '1 staff member',
        ],
    },
    {
        name: 'Professional',
        monthly: 59,
        yearly: 590,
        desc: 'For growing businesses',
        popular: true,
        features: [
            'Unlimited bookings',
            'Full CRM + Timeline',
            'WhatsApp & Email',
            'Analytics dashboard',
            '5 staff members',
            'Custom booking form',
        ],
    },
    {
        name: 'Business',
        monthly: 119,
        yearly: 1190,
        desc: 'For established teams',
        features: [
            'Everything in Pro',
            '15 staff members',
            'Revenue reports',
            'Marketing automation',
            'Payment integration',
            'Custom branding',
        ],
    },
    {
        name: 'Enterprise',
        monthly: 249,
        yearly: 2490,
        desc: 'For large organizations',
        features: [
            'Everything in Business',
            'Unlimited staff',
            'API access',
            'Dedicated support',
            'Custom integrations',
            'SLA guarantee',
        ],
    },
];

export default function PricingSection() {
    const [yearly, setYearly] = useState(false);

    return (
        <Section
            id="pricing"
            heading="Simple, transparent pricing."
            subheading="Start free. Upgrade when you grow. No surprises."
            className="bg-neutral-50/50"
        >
            <div className="mx-auto max-w-6xl">
                <div className="mb-10 flex items-center justify-center gap-4">
                    <button
                        onClick={() => setYearly(false)}
                        className={`text-sm font-medium transition-colors ${
                            !yearly
                                ? 'text-neutral-900'
                                : 'text-neutral-400 hover:text-neutral-600'
                        }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setYearly(!yearly)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                            yearly ? 'bg-primary' : 'bg-neutral-200'
                        }`}
                        aria-label="Toggle billing"
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                                yearly ? 'translate-x-5' : ''
                            }`}
                        />
                    </button>
                    <button
                        onClick={() => setYearly(true)}
                        className={`text-sm font-medium transition-colors ${
                            yearly
                                ? 'text-neutral-900'
                                : 'text-neutral-400 hover:text-neutral-600'
                        }`}
                    >
                        Yearly
                        <span className="ml-1.5 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                            Save 20%
                        </span>
                    </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-4">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            whileHover={{ y: -4 }}
                            className={`relative rounded-2xl border-2 bg-white p-6 transition-shadow ${
                                plan.popular
                                    ? 'border-primary shadow-xl shadow-primary/10'
                                    : 'border-border shadow-sm hover:shadow-lg'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary to-primary-light px-3 py-1 text-xs font-semibold text-white shadow-lg">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            <h3 className="text-lg font-bold text-neutral-900">
                                {plan.name}
                            </h3>
                            <p className="mt-1 text-sm text-neutral-400">
                                {plan.desc}
                            </p>
                            <div className="mt-5 flex items-baseline gap-0.5">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={yearly ? 'yearly' : 'monthly'}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                        className="text-3xl font-bold text-neutral-900"
                                    >
                                        ${plan.monthly}
                                    </motion.span>
                                </AnimatePresence>
                                <span className="text-sm text-neutral-400">
                                    /mo
                                </span>
                            </div>
                            <hr className="my-5 border-border" />
                            <ul className="space-y-3">
                                {plan.features.map((f) => (
                                    <li
                                        key={f}
                                        className="flex items-start gap-2.5 text-sm"
                                    >
                                        <svg
                                            className="mt-0.5 h-4 w-4 shrink-0 text-success"
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
                                        <span className="text-neutral-600">
                                            {f}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6">
                                <Button
                                    variant={
                                        plan.popular ? 'primary' : 'outline'
                                    }
                                    className="w-full"
                                >
                                    Start Free Trial
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <p className="mt-8 text-center text-sm text-neutral-400">
                    All plans include a 14-day free trial. No credit card
                    required.
                </p>
            </div>
        </Section>
    );
}
