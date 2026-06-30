import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const reasons = [
    {
        icon: '📱',
        title: 'Customers expect self-service booking',
        desc: '88% of consumers prefer booking online. If your calendar is manual, they go to a competitor.',
    },
    {
        icon: '📉',
        title: 'No-shows are silently killing your revenue',
        desc: 'Manual reminders fail. Automated follow-ups via WhatsApp & email reduce no-shows by up to 80%.',
    },
    {
        icon: '📊',
        title: 'You&#39;re flying blind without data',
        desc: 'Spreadsheets can&#39;t tell you peak hours, customer lifetime value, or revenue trends. Our analytics dashboard does.',
    },
    {
        icon: '⚡',
        title: 'Your competitors already automated',
        desc: 'While you juggle phone calls and double-booking, they&#39;re serving more customers with less effort.',
    },
    {
        icon: '🏗️',
        title: 'Scaling without software is impossible',
        desc: 'You can&#39;t add more hours to your day. But you can add booking slots, staff, and locations — without adding chaos.',
    },
];

export default function WhyNowSection() {
    return (
        <Section
            id="why-now"
            heading="Why now? Because the cost of waiting is lost revenue."
            subheading="Every day without automation is money left on the table."
        >
            <div className="mx-auto max-w-3xl space-y-4">
                {reasons.map((r, i) => (
                    <motion.div
                        key={r.title}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-start gap-4 rounded-xl border border-border bg-white p-5 transition-all hover:border-primary/20 hover:shadow-sm"
                    >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-lg">
                            {r.icon}
                        </span>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-900">
                                {r.title}
                            </h3>
                            <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                                {r.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
