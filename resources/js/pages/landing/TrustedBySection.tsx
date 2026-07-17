import { motion } from 'framer-motion';
import { Scissors, Store, Stethoscope, Dumbbell, Sparkles } from 'lucide-react';

const clients = [
    { name: 'Bloom Creative', icon: Scissors, color: 'text-pink-500' },
    { name: 'Jaya Retail', icon: Store, color: 'text-emerald-600' },
    { name: 'Klinik Sehat', icon: Stethoscope, color: 'text-blue-500' },
    { name: 'FitStudio', icon: Dumbbell, color: 'text-orange-500' },
    { name: 'Salon Luxe', icon: Sparkles, color: 'text-violet-500' },
];

export default function TrustedBySection() {
    return (
        <section className="py-14 bg-white border-y border-neutral-200/50">
            <div className="max-w-7xl mx-auto px-6">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-xs font-semibold text-neutral-400 mb-10"
                >
                    Telah dipercaya oleh ribuan bisnis di Indonesia
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-wrap justify-center items-center gap-x-14 gap-y-8"
                >
                    {clients.map((client) => {
                        const Icon = client.icon;
                        return (
                            <div key={client.name} className="flex items-center gap-2.5 opacity-40 hover:opacity-70 transition-opacity">
                                <Icon className={`h-5 w-5 ${client.color}`} />
                                <span className="text-sm font-bold text-neutral-700 tracking-tight">
                                    {client.name}
                                </span>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
