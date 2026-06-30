import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const features = [
    { icon: '📅', title: 'Booking Online', desc: 'Terima booking 24/7 dengan ketersediaan real-time' },
    { icon: '📋', title: 'Manajemen Janji Temu', desc: 'Buat, reschedule, dan batalkan dengan mudah' },
    { icon: '👥', title: 'CRM Pelanggan', desc: 'Profil lengkap dengan riwayat dan preferensi' },
    { icon: '📊', title: 'Timeline Pelanggan', desc: 'Setiap interaksi, dari kunjungan pertama hingga terakhir' },
    { icon: '💬', title: 'Pengingat WhatsApp', desc: 'Pengingat otomatis yang mengurangi no-show 80%' },
    { icon: '📧', title: 'Notifikasi Email', desc: 'Email profesional untuk setiap event booking' },
    { icon: '📈', title: 'Dashboard Analitik', desc: 'Pendapatan, booking, dan tren dalam satu layar' },
    { icon: '💰', title: 'Laporan Pendapatan', desc: 'Keuangan detail dengan format export' },
    { icon: '👤', title: 'Manajemen Staf', desc: 'Jadwal, izin akses, dan performa staf' },
    { icon: '🔐', title: 'Peran & Izin Akses', desc: 'Kontrol akses granular untuk tim Anda' },
    { icon: '📝', title: 'Form Booking Kustom', desc: 'Kumpulkan data yang Anda butuhkan' },
    { icon: '🎨', title: 'Branding White-Label', desc: 'Logo, warna, dan domain Anda sendiri' },
    { icon: '💳', title: 'Integrasi Pembayaran', desc: 'Terima deposit dan pembayaran online' },
    { icon: '🏷️', title: 'Kupon & Promo', desc: 'Buat diskon dan promosi' },
    { icon: '✏️', title: 'Field Kustom', desc: 'Tangkap informasi spesifik pelanggan' },
    { icon: '🔗', title: 'API & Webhooks', desc: 'Integrasi dengan tools yang Anda gunakan' },
];

export default function FeaturesSection() {
    return (
        <Section
            id="features"
            heading="Semua yang Anda butuhkan untuk menjalankan bisnis."
            subheading="Toolkit lengkap yang dirancang untuk bisnis jasa."
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
