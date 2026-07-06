import { motion } from 'framer-motion';
import {
    Calendar,
    Users,
    BarChart3,
    Bell,
    Mail,
    CreditCard,
    Shield,
    Palette,
    Link,
    FileText,
    Clock,
    Smartphone,
} from 'lucide-react';
import Section from '@/molecules/Section';

const features = [
    { icon: Calendar, title: 'Booking Online', desc: 'Terima booking 24/7 dengan ketersediaan real-time' },
    { icon: Users, title: 'CRM Pelanggan', desc: 'Profil lengkap dengan riwayat dan preferensi' },
    { icon: BarChart3, title: 'Dashboard Analitik', desc: 'Pendapatan, booking, dan tren dalam satu layar' },
    { icon: Bell, title: 'Pengingat WhatsApp', desc: 'Pengingat otomatis yang mengurangi no-show 80%' },
    { icon: Mail, title: 'Notifikasi Email', desc: 'Email profesional untuk setiap event booking' },
    { icon: CreditCard, title: 'Integrasi Pembayaran', desc: 'Terima deposit dan pembayaran online' },
    { icon: Clock, title: 'Manajemen Staf', desc: 'Jadwal, izin akses, dan performa staf' },
    { icon: Shield, title: 'Keamanan Data', desc: 'Enkripsi AES-256 dan TLS 1.3 untuk data Anda' },
    { icon: FileText, title: 'Form Booking Kustom', desc: 'Kumpulkan data yang Anda butuhkan' },
    { icon: Smartphone, title: 'Akses Mobile', desc: 'Kelola bisnis dari mana saja, kapan saja' },
    { icon: Palette, title: 'Branding White-Label', desc: 'Logo, warna, dan domain Anda sendiri' },
    { icon: Link, title: 'API & Webhooks', desc: 'Integrasi dengan tools favorit Anda' },
];

export default function FeaturesSection() {
    return (
        <Section
            id="features"
            heading="Semua yang Anda butuhkan untuk menjalankan bisnis."
            subheading="Toolkit lengkap yang dirancang untuk bisnis jasa."
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
