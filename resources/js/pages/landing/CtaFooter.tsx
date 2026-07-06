import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Button from '@/atoms/Button';

export default function CtaFooter() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary-light py-24">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')]" />
            <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-3xl" />
            <div className="relative mx-auto max-w-7xl px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-2xl"
                >
                    <h2 className="text-4xl font-bold text-white md:text-5xl">
                        Siap permudah booking Anda?
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-white/70">
                        Bergabunglah dengan ribuan bisnis yang telah
                        merapikan booking, CRM, dan komunikasi — semua
                        dalam satu tempat.
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2">
                        <span className="inline-flex items-center gap-2 text-sm text-white/60">
                            <CheckCircle className="h-4 w-4 text-white/40" />
                            Tanpa kartu kredit
                        </span>
                        <span className="inline-flex items-center gap-2 text-sm text-white/60">
                            <CheckCircle className="h-4 w-4 text-white/40" />
                            Uji coba 14 hari
                        </span>
                        <span className="inline-flex items-center gap-2 text-sm text-white/60">
                            <CheckCircle className="h-4 w-4 text-white/40" />
                            Batalkan kapan saja
                        </span>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <Link href="/register">
                            <Button
                                variant="primary"
                                size="lg"
                                className="gap-2 bg-white text-primary hover:bg-white/90"
                            >
                                Mulai Uji Coba Gratis
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white/30 text-white hover:bg-white/10"
                        >
                            Jadwalkan Demo
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
