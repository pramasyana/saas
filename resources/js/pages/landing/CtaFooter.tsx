import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import Button from '@/atoms/Button';

export default function CtaFooter() {
    return (
        <section className="px-6 max-w-7xl mx-auto mb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary p-12 text-center text-white shadow-2xl"
            >
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)] bg-[size:40px_40px]" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Siap untuk akselerasikan pertumbuhan?
                    </h2>
                    <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
                        Tingkatkan efisiensi bisnis, kolaborasi lintas fungsi,
                        dan ambil keputusan lebih cepat dan tepat bersama Nusentra.
                    </p>
                    <Link href="/register">
                        <Button
                            variant="primary"
                            size="lg"
                            className="gap-2 bg-white text-primary hover:bg-white/90 shadow-xl"
                        >
                            <Rocket className="h-4 w-4" />
                            Konsultasi Sekarang
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
