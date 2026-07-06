import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Check, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import Button from '@/atoms/Button';
import DashboardMockup from '@/organisms/DashboardMockup';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-white">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent" />
            <div className="absolute top-0 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary/[0.02] blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-5 pt-28 pb-16 md:px-8 md:pt-36 md:pb-24">
                <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-32">
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary">
                                <Sparkles className="h-3.5 w-3.5" />
                                Platform Booking & CRM All-in-One
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-neutral-900 md:text-5xl lg:text-7xl"
                        >
                            <span className="bg-gradient-to-r from-primary via-primary-dark to-primary-light bg-clip-text text-transparent">
                                Booking Lebih Pintar.
                            </span>
                            <br />
                            <span className="text-neutral-900">
                                Bisnis Lebih Berkembang.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-neutral-500 lg:mx-0 lg:text-lg"
                        >
                            Booking online, manajemen pelanggan, dan analitik
                            — semua dalam satu platform. Berhenti berganti-ganti
                            alat dan mulailah mengembangkan bisnis Anda.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
                        >
                            <Link href="/register" className="w-full sm:w-auto">
                                <Button className="w-full gap-2 shadow-xl shadow-primary/25">
                                    Mulai Uji Coba Gratis
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Button
                                variant="secondary"
                                className="w-full gap-2 sm:w-auto"
                            >
                                <Calendar className="h-4 w-4" />
                                Jadwalkan Demo
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.25 }}
                            className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 lg:justify-start"
                        >
                            <span className="inline-flex items-center gap-2 text-xs text-neutral-400">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10">
                                    <Check className="h-3 w-3 text-success" />
                                </span>
                                Tanpa kartu kredit
                            </span>
                            <span className="inline-flex items-center gap-2 text-xs text-neutral-400">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10">
                                    <Check className="h-3 w-3 text-success" />
                                </span>
                                Uji coba 14 hari
                            </span>
                            <span className="inline-flex items-center gap-2 text-xs text-neutral-400">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10">
                                    <Check className="h-3 w-3 text-success" />
                                </span>
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
                    className="mt-24 grid grid-cols-3 divide-x divide-border/50"
                >
                    <div className="px-4 text-center md:px-8">
                        <p className="text-3xl font-bold text-neutral-900 md:text-4xl">
                            10K+
                        </p>
                        <p className="mt-1.5 text-sm text-neutral-400">
                            Bisnis Aktif
                        </p>
                    </div>
                    <div className="px-4 text-center md:px-8">
                        <p className="text-3xl font-bold text-neutral-900 md:text-4xl">
                            50K+
                        </p>
                        <p className="mt-1.5 text-sm text-neutral-400">
                            Booking Harian
                        </p>
                    </div>
                    <div className="px-4 text-center md:px-8">
                        <p className="text-3xl font-bold text-neutral-900 md:text-4xl">
                            98%
                        </p>
                        <p className="mt-1.5 text-sm text-neutral-400">
                            Tingkat Kepuasan
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
