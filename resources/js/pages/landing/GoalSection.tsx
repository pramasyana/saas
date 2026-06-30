import { motion } from 'framer-motion';
import Button from '@/atoms/Button';
import Section from '@/molecules/Section';

export default function GoalSection() {
    return (
        <Section
            id="goal"
            heading="One platform. Complete control."
            subheading="From first booking to loyal customer — we handle everything in between."
            className="bg-neutral-50/50"
        >
            <div className="mx-auto max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-white to-primary-light/5 p-10"
                >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-2xl text-white shadow-lg shadow-primary/20">
                        🎯
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-neutral-900">
                        Replace 5 tools with one
                    </h3>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-500">
                        Stop juggling a booking app, a CRM, a reminder tool, a
                        spreadsheet, and a payment processor. Our platform
                        combines everything into a single, elegant interface
                        that your team will actually enjoy using.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Button variant="primary" size="lg">
                            Start Free Trial
                        </Button>
                        <Button variant="outline" size="lg">
                            Schedule a Demo
                        </Button>
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}
