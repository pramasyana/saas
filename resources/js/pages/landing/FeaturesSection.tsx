import { motion } from 'framer-motion';
import {
    Calendar,
    Users,
    BarChart3,
    Bell,
    Mail,
    CreditCard,
    Shield,
    FileText,
    Clock,
    Smartphone,
    Globe,
    Link,
} from 'lucide-react';
import Section from '@/molecules/Section';

const features = [
    { icon: Calendar, title: 'Online Booking', desc: 'Accept bookings 24/7 with real-time availability and instant confirmation' },
    { icon: Users, title: 'Customer CRM', desc: 'Complete profiles with history, preferences, and automated follow-ups' },
    { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Revenue, bookings, and growth trends at a glance' },
    { icon: Bell, title: 'Smart Reminders', desc: 'Automated WhatsApp & email reminders that reduce no-shows by 80%' },
    { icon: Mail, title: 'Email Notifications', desc: 'Professional emails for every booking event and update' },
    { icon: CreditCard, title: 'Payment Integration', desc: 'Accept deposits and online payments with built-in invoicing' },
    { icon: Clock, title: 'Staff Management', desc: 'Schedules, shift assignments, permissions, and performance tracking' },
    { icon: Shield, title: 'Data Security', desc: 'AES-256 encryption and TLS 1.3 for all your business data' },
    { icon: FileText, title: 'Custom Booking Forms', desc: 'Collect the information you need from customers at booking time' },
    { icon: Smartphone, title: 'Mobile Access', desc: 'Manage your business from anywhere, on any device' },
    { icon: Globe, title: 'Business Landing Pages', desc: 'Professional web presence for your business, built-in and customizable' },
    { icon: Link, title: 'API & Webhooks', desc: 'Connect with your favorite tools and build custom integrations' },
];

export default function FeaturesSection() {
    return (
        <Section
            heading="Built for how you actually work."
            subheading="Every tool your business needs, connected and working together."
        >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((f, i) => {
                    const Icon = f.icon;

                    return (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: i * 0.03 }}
                            className="group rounded-xl border border-border bg-white p-5 transition-all duration-200 hover:border-primary/20 hover:shadow-md"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5">
                                <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-neutral-900">
                                {f.title}
                            </h3>
                            <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">
                                {f.desc}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </Section>
    );
}
