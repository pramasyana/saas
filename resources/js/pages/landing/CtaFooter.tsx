import { motion } from 'framer-motion';
import Button from '@/atoms/Button';

export default function CtaFooter() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary-light py-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')]" />
            <div className="relative mx-auto max-w-7xl px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-2xl"
                >
                    <h2 className="text-3xl font-bold text-white md:text-4xl">
                        Ready to simplify your bookings?
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-white/70">
                        Join thousands of businesses that have streamlined their
                        booking, CRM, and communication — all in one place.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <Button
                            variant="primary"
                            size="lg"
                            className="bg-white text-primary hover:bg-white/90"
                        >
                            Start Free Trial
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white/30 text-white hover:bg-white/10"
                        >
                            Schedule a Demo
                        </Button>
                    </div>
                    <p className="mt-4 text-xs text-white/40">
                        No credit card required. 14-day free trial.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
