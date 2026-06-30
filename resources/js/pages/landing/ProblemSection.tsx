import { motion } from 'framer-motion';
import Section from '@/molecules/Section';

const chapters = [
    {
        time: '08:00',
        emoji: '🔔',
        title: 'Telepon berdering. Tapi Anda sedang melayani klien.',
        desc: 'Ada yang ingin booking. Anda tidak bisa angkat — masih di tengah pelayanan. Saat Anda telepon balik, mereka sudah booking di tempat lain.',
        impact: 'Kehilangan pelanggan',
    },
    {
        time: '10:30',
        emoji: '😬',
        title: 'Dua klien. Jam sama. Kursi sama.',
        desc: 'Resepsionis menulis jadwal hari ini di buku yang salah. Sarah dan Mike datang berdua jam 10:30. Pasti ada yang pulang kecewa.',
        impact: 'Double booking',
    },
    {
        time: '13:00',
        emoji: '🔍',
        title: 'Nomor Maria di mana, ya?',
        desc: 'Pelanggan setia telepon mau reschedule. Anda bolak-balik buka tiga aplikasi, sticky note, dan email lama. Tidak ketemu. Ia tutup telepon dengan kesal.',
        impact: 'Data berantakan',
    },
    {
        time: '15:30',
        emoji: '📉',
        title: 'No-show lagi. Tidak ada pengingat.',
        desc: 'Satu slot Rp150.000 kosong melompong. Lupa kirim pengingat — lagi. Minggu ini sudah Rp600.000 menguap. Semua sebenarnya bisa dicegah.',
        impact: 'Pendapatan hilang',
    },
    {
        time: '18:00',
        emoji: '🤷',
        title: 'Tutup toko. Tapi apa yang berhasil hari ini?',
        desc: 'Minggu paling sibuk dalam sebulan — tapi Anda nol data. Layanan mana yang paling untung? Siapa pelanggan terbaik? Bisnis Anda jalan pakai feeling.',
        impact: 'Tidak ada data',
    },
];

export default function ProblemSection() {
    return (
        <Section
            id="problem"
            heading="Sehari dalam bisnis jasa."
            subheading="Kalau ini terdengar familiar, Anda tidak sendiri. Inilah yang terjadi tanpa sistem yang tepat."
            className="relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-danger/[0.02] blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-danger/[0.01] blur-3xl" />
            <div className="relative mx-auto max-w-3xl">
                <div className="relative">
                    <div className="absolute left-[23px] top-0 h-full w-px bg-gradient-to-b from-danger/30 via-danger/10 to-transparent" />

                    {chapters.map((ch, i) => (
                        <motion.div
                            key={ch.time}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.5, delay: i * 0.12 }}
                            className="relative mb-6 pl-14 last:mb-0"
                        >
                            <div className="absolute left-[15px] top-1 flex h-[17px] w-[17px] items-center justify-center rounded-full border-2 border-danger bg-white">
                                <div className="h-2 w-2 rounded-full bg-danger/60" />
                            </div>

                            <div className="group rounded-2xl border border-border bg-white p-5 transition-all duration-300 hover:border-danger/15 hover:shadow-lg">
                                <div className="flex items-start gap-4">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger/5 text-lg">
                                        {ch.emoji}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-danger">
                                                {ch.time}
                                            </span>
                                            <span className="rounded-full bg-danger/5 px-2 py-0.5 text-[11px] font-medium text-danger">
                                                {ch.impact}
                                            </span>
                                        </div>
                                        <h3 className="mt-1.5 text-sm font-semibold text-neutral-900">
                                            {ch.title}
                                        </h3>
                                        <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                                            {ch.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-10 overflow-hidden rounded-2xl border border-danger/20 bg-gradient-to-br from-danger/5 to-danger/10 p-6 md:p-8"
                >
                    <div className="flex items-start gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger text-lg text-white">
                            !
                        </span>
                        <div>
                            <p className="text-base font-semibold text-danger md:text-lg">
                                Ini bukan hari yang buruk. Ini hari-hari biasa —
                                tanpa sistem yang benar.
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed text-danger/70">
                                Bisnis jasa rata-rata kehilangan lebih dari{' '}
                                <span className="font-semibold">Rp30 juta/tahun</span>{' '}
                                akibat kekacauan booking manual, no-show, dan
                                follow-up yang terlewat. Bagian terburuknya?
                                Sebagian besar bisa dicegah.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}
