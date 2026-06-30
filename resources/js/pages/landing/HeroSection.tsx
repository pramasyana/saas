import { motion } from 'framer-motion';
import Button from '@/atoms/Button';
import DashboardMockup from '@/organisms/DashboardMockup';

const stats = [
    { value: '10K+', label: 'Active Businesses' },
    { value: '50K+', label: 'Bookings Daily' },
    { value: '98%', label: 'Satisfaction Rate' },
];

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-white">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent" />
            <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/[0.02] blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-5 pt-28 pb-16 md:px-8 md:pt-36 md:pb-24">
                <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-20">
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                All-in-One Booking & CRM Platform
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-neutral-900 md:text-5xl lg:text-6xl xl:text-7xl"
                        >
                            Run Your Business.
                            <br />
                            Know Your Customers.
                            <br />
                            <span className="bg-gradient-to-r from-primary via-primary to-primary-light bg-clip-text text-transparent">
                                Grow Smarter.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-neutral-500 lg:mx-0 lg:text-lg"
                        >
                            The intelligent platform that combines online
                            booking, customer management, and business analytics
                            into one seamless experience. Stop juggling tools —
                            start growing.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
                        >
                            <Button
                                size="lg"
                                className="w-full sm:w-auto shadow-xl shadow-primary/25"
                            >
                                Start Free Trial
                            </Button>
                            <Button
                                size="lg"
                                variant="secondary"
                                className="w-full sm:w-auto"
                            >
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                    />
                                </svg>
                                Book a Demo
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-6 flex flex-wrap justify-center gap-6 lg:justify-start"
                        >
                            {[
                                'No credit card required',
                                '14-day free trial',
                                'Cancel anytime',
                            ].map((text) => (
                                <span
                                    key={text}
                                    className="inline-flex items-center gap-1.5 text-xs text-neutral-400"
                                >
                                    <svg
                                        className="h-3.5 w-3.5 text-success"
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
                                    {text}
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex-1"
                    >
                        <DashboardMockup />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-20 grid grid-cols-3 gap-6 border-t border-border pt-12 md:gap-12"
                >
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-2xl font-bold text-neutral-900 md:text-3xl">
                                {stat.value}
                            </p>
                            <p className="mt-1 text-sm text-neutral-400">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
