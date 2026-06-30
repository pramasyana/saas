import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const diffs = [
    {
        them: 'Buku & spreadsheet',
        us: 'Booking otomatis dari perangkat apa pun',
        upside: 'No double-booking, tidak ada telepon kelewatan',
    },
    {
        them: 'Tidak ada riwayat pelanggan',
        us: 'CRM lengkap dengan timeline',
        upside: 'Layanan personal setiap kunjungan',
    },
    {
        them: 'WhatsApp & SMS manual',
        us: 'Pengingat & follow-up otomatis',
        upside: 'No-show turun 80%',
    },
    {
        them: 'Tidak ada insight performa',
        us: 'Analitik & laporan real-time',
        upside: 'Keputusan berbasis data',
    },
    {
        them: 'Alat kalender generik',
        us: 'Dibuat khusus bisnis jasa',
        upside: 'Semua dalam satu tempat',
    },
    {
        them: 'Tidak ada pembayaran terintegrasi',
        us: 'Terima deposit & pembayaran online',
        upside: 'Dibayar sebelum mereka datang',
    },
];

export default function DifferentiationSection() {
    return (
        <Section
            id="differentiation"
            heading="Dibuat untuk bisnis jasa. Bukan kalender generik."
            subheading="Kebanyakan tools diadaptasi dari penjadwalan umum. Kami membuatnya khusus untuk Anda."
            className="bg-neutral-50/50"
        >
            <div className="mx-auto max-w-5xl">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {diffs.map((d, i) => (
                        <motion.div
                            key={d.them}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06 }}
                            className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white"
                        >
                            <div className="bg-danger/5 p-4">
                                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-danger">
                                    Mereka
                                </div>
                                <p className="text-sm text-neutral-600">
                                    {d.them}
                                </p>
                            </div>
                            <div className="bg-success/5 p-4">
                                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-success">
                                    Kami
                                </div>
                                <p className="text-sm font-medium text-neutral-900">
                                    {d.us}
                                </p>
                            </div>
                            <div className="bg-primary/5 p-4">
                                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
                                    Keuntungan
                                </div>
                                <p className="text-sm text-neutral-600">
                                    {d.upside}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
