import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Rocket, Eye } from 'lucide-react';
import Button from '@/atoms/Button';
import DashboardMockup from '@/organisms/DashboardMockup';

export default function HeroSection() {
    return (
        <section className="relative px-6 pt-32 pb-16 md:pt-40 md:pb-24 max-w-7xl mx-auto overflow-visible">
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="text-left">
                    <motion.span
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider mb-6"
                    >
                        Solusi Bisnis All-in-One Terbaik
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight mb-6 leading-tight"
                    >
                        Jalankan Bisnis Anda dalam{' '}
                        <span className="text-primary">Satu Tempat</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="text-lg md:text-xl text-neutral-500 max-w-xl mb-8 leading-relaxed"
                    >
                        Kelola booking, pelanggan, keuangan, dan operasional
                        dalam satu ekosistem yang terhubung. Scale bisnis Anda
                        dengan solusi software terintegrasi dari Nusentra.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-wrap gap-4"
                    >
                        <Link href="/register">
                            <Button className="gap-2 shadow-lg shadow-primary/25">
                                <Rocket className="h-4 w-4" />
                                Mulai Gratis Sekarang
                            </Button>
                        </Link>
                        <Button variant="secondary" className="gap-2">
                            <Eye className="h-4 w-4" />
                            Lihat Demo Produk
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-8 flex items-center gap-4"
                    >
                        <div className="flex -space-x-3">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center"
                                >
                                    <span className="text-primary text-sm font-semibold">
                                        {['A', 'B', 'C'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="text-sm text-neutral-500">
                            <span className="text-neutral-900 font-bold">10,000+</span> Bisnis telah bergabung
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="relative group"
                >
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -z-10 animate-pulse" />
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-[60px] -z-10" />
                    <div className="relative rounded-2xl p-2 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm border border-white/30 shadow-2xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                        <DashboardMockup />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
