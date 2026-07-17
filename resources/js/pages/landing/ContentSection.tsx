import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Network as HubIcon, RefreshCw, Shield } from 'lucide-react';
import Button from '@/atoms/Button';

const features = [
    {
        icon: HubIcon,
        title: 'Dasbor Terpusat',
        desc: 'Pantau semua aspek bisnis Anda dari satu layar. Data yang tersinkronisasi memastikan tidak ada informasi yang terlewat.',
        highlighted: true,
    },
    {
        icon: RefreshCw,
        title: 'Pembaruan Real-time',
        desc: 'Setiap transaksi dan pemesanan tercatat seketika, memberikan Anda keleluasaan dalam mengambil keputusan.',
        highlighted: false,
    },
    {
        icon: Shield,
        title: 'Keamanan Enterprise',
        desc: 'Data bisnis dan pelanggan Anda aman dengan enkripsi standar perbankan di server cloud kami.',
        highlighted: false,
    },
];

export default function ContentSection() {
    return (
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="order-2 lg:order-1"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                        Efisiensi maksimal dengan sistem terintegrasi
                    </h2>
                    <p className="text-neutral-500 mb-8 leading-relaxed">
                        Lupakan cara manual yang memakan waktu. Nusentra
                        memberikan infrastruktur digital yang kokoh untuk
                        bisnis Anda tumbuh lebih cepat.
                    </p>

                    <div className="space-y-4">
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <motion.div
                                    key={f.title}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    className={`p-5 rounded-xl ${
                                        f.highlighted
                                            ? 'bg-primary/5 border-l-4 border-primary'
                                            : 'hover:bg-neutral-50 transition-colors'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${f.highlighted ? 'text-primary' : 'text-neutral-400'}`} />
                                        <div>
                                            <h4 className="font-bold text-lg text-neutral-900">{f.title}</h4>
                                            <p className="text-sm text-neutral-500 mt-1 leading-relaxed">{f.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="mt-8"
                    >
                        <Link href="/register">
                            <Button className="gap-2">Mulai Sekarang</Button>
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative order-1 lg:order-2"
                >
                    <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center overflow-hidden">
                        <div className="text-center px-8">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <HubIcon className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-sm font-semibold text-neutral-500">
                                Ekosistem Terhubung
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
