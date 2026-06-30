import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const features = [
    { icon: '📅', title: 'Online Booking', desc: 'Accept bookings 24/7 with real-time availability' },
    { icon: '📋', title: 'Appointment Management', desc: 'Create, reschedule, and cancel with ease' },
    { icon: '👥', title: 'Customer CRM', desc: 'Full profiles with history and preferences' },
    { icon: '📊', title: 'Customer Timeline', desc: 'Every interaction, from first visit to last' },
    { icon: '💬', title: 'WhatsApp Reminders', desc: 'Auto-reminders that cut no-shows by 80%' },
    { icon: '📧', title: 'Email Notifications', desc: 'Polished emails for every booking event' },
    { icon: '📈', title: 'Analytics Dashboard', desc: 'Revenue, bookings, and trends at a glance' },
    { icon: '💰', title: 'Revenue Reports', desc: 'Detailed financials with export' },
    { icon: '👤', title: 'Staff Management', desc: 'Schedules, permissions, and performance' },
    { icon: '🔐', title: 'Roles & Permissions', desc: 'Granular access for your team' },
    { icon: '📝', title: 'Custom Booking Forms', desc: 'Collect exactly what you need' },
    { icon: '🎨', title: 'White-Label Branding', desc: 'Your brand, your colors, your domain' },
    { icon: '💳', title: 'Payment Integration', desc: 'Accept deposits and payments online' },
    { icon: '🏷️', title: 'Coupons & Promos', desc: 'Create discounts and promotions' },
    { icon: '✏️', title: 'Custom Fields', desc: 'Capture specific customer information' },
    { icon: '🔗', title: 'API & Webhooks', desc: 'Integrate with your existing tools' },
];

export default function FeaturesSection() {
    return (
        <Section
            id="features"
            heading="Everything you need to run your business."
            subheading="A complete toolkit designed for service businesses."
        >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((f, i) => (
                    <motion.div
                        key={f.title}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.03 }}
                        className="group rounded-xl border border-border bg-white p-4 transition-all duration-200 hover:border-primary/20 hover:shadow-md"
                    >
                        <span className="text-xl">{f.icon}</span>
                        <h3 className="mt-3 text-sm font-semibold text-neutral-900">
                            {f.title}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                            {f.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
