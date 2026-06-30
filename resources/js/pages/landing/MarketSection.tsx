import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const stats = [
    { value: '$7.5B', label: 'Market size by 2026' },
    { value: '80%', label: 'Reduction in no-shows' },
    { value: '40%', label: 'Revenue uplift for businesses' },
    { value: '10x', label: 'ROI on booking automation' },
];

export default function MarketSection() {
    return (
        <Section
            id="market"
            heading="The booking industry is exploding."
            subheading="Service businesses are moving online. Those who don&#39;t adapt get left behind."
            className="bg-neutral-50/50"
        >
            <div className="mx-auto max-w-5xl">
                <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="rounded-2xl border border-border bg-white p-5 text-center"
                        >
                            <div className="text-2xl font-bold text-primary">
                                {s.value}
                            </div>
                            <div className="mt-1 text-xs text-neutral-400">
                                {s.label}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-white to-primary-light/5 p-8 text-center">
                    <div className="mx-auto max-w-2xl">
                        <h3 className="text-lg font-semibold text-neutral-900">
                            The shift is happening now
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                            By 2026, the global online booking market is
                            projected to reach{' '}
                            <span className="font-semibold text-primary">
                                $7.5 billion
                            </span>
                            . Consumers expect instant, self-service booking.
                            Businesses that provide it see{' '}
                            <span className="font-semibold text-primary">
                                40% more revenue
                            </span>{' '}
                            and{' '}
                            <span className="font-semibold text-primary">
                                80% fewer no-shows
                            </span>
                            . The question isn&#39;t whether to digitize —
                            it&#39;s whether you&#39;ll lead or follow.
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    );
}
