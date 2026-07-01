import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Button from '@/atoms/Button';
import DashboardMockup from '@/organisms/DashboardMockup';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-white">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent" />
            <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/[0.02] blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-5 pt-28 pb-16 md:px-8 md:pt-36 md:pb-24">
                <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-24">
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                Platform Booking & CRM All-in-One
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-neutral-900 md:text-5xl lg:text-6xl"
                        >
                            <span className="bg-gradient-to-r from-primary via-primary to-primary-light bg-clip-text text-transparent">
                                Booking Lebih Pintar.
                            </span>
                            <br />
                            Bisnis Lebih Berkembang.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="mx-auto mt-5 max-w-md text-base leading-relaxed text-neutral-500 lg:mx-0 lg:text-lg"
                        >
                            Booking online, manajemen pelanggan, dan analitik
                            — semua dalam satu platform. Berhenti berganti-ganti
                            alat dan mulailah mengembangkan bisnis Anda.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
                        >
                            <Link href="/register" className="w-full sm:w-auto">
                                <Button className="w-full shadow-xl shadow-primary/25">
                                    Mulai Uji Coba Gratis
                                </Button>
                            </Link>
                            <Button
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
                                Jadwalkan Demo
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.25 }}
                            className="mt-6 flex flex-wrap justify-center gap-6 lg:justify-start"
                        >
                            <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
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
                                Tanpa kartu kredit
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
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
                                Uji coba 14 hari
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
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
                                Batalkan kapan saja
                            </span>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex-1"
                    >
                        <DashboardMockup />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-24 grid grid-cols-3 gap-6 md:gap-16"
                >
                    <div className="text-center">
                        <p className="text-2xl font-bold text-neutral-900 md:text-3xl">
                            10K+
                        </p>
                        <p className="mt-1 text-sm text-neutral-400">
                            Bisnis Aktif
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-neutral-900 md:text-3xl">
                            50K+
                        </p>
                        <p className="mt-1 text-sm text-neutral-400">
                            Booking Harian
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-neutral-900 md:text-3xl">
                            98%
                        </p>
                        <p className="mt-1 text-sm text-neutral-400">
                            Tingkat Kepuasan
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
