import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Button from '@/atoms/Button';
import Section from '@/molecules/Section';
import { usePage } from '@inertiajs/react';

function formatPrice(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export default function PricingSection() {
    const { plans } = usePage<{ plans: any[] }>().props;
    const [yearly, setYearly] = useState(false);

    return (
        <Section
            id="pricing"
            heading="Harga sederhana dan transparan."
            subheading="Mulai gratis. Upgrade saat berkembang. Tanpa kejutan."
            className="bg-neutral-50/50"
        >
            <div className="mx-auto max-w-6xl">
                <div className="mb-10 flex items-center justify-center gap-4">
                    <button
                        onClick={() => setYearly(false)}
                        className={`text-sm font-medium transition-colors ${
                            !yearly
                                ? 'text-neutral-900'
                                : 'text-neutral-400 hover:text-neutral-600'
                        }`}
                    >
                        Bulanan
                    </button>
                    <button
                        onClick={() => setYearly(!yearly)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                            yearly ? 'bg-primary' : 'bg-neutral-200'
                        }`}
                        aria-label="Toggle billing"
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                                yearly ? 'translate-x-5' : ''
                            }`}
                        />
                    </button>
                    <button
                        onClick={() => setYearly(true)}
                        className={`text-sm font-medium transition-colors ${
                            yearly
                                ? 'text-neutral-900'
                                : 'text-neutral-400 hover:text-neutral-600'
                        }`}
                    >
                        Tahunan
                        <span className="ml-1.5 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                            Hemat 20%
                        </span>
                    </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-4">
                    {plans.map((plan: any, i: number) => {
                        const price = yearly && plan.price_yearly ? plan.price_yearly : plan.price_monthly;
                        const displayFeatures = plan.features?.filter((f: any) => !(f.definition.type === 'boolean' && f.value !== 'true')) ?? [];
                        return (
                            <motion.div
                                key={plan.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -4 }}
                                className={`relative rounded-2xl border-2 bg-white p-6 transition-shadow ${
                                    plan.is_popular
                                        ? 'border-primary shadow-xl shadow-primary/10'
                                        : 'border-border shadow-sm hover:shadow-lg'
                                }`}
                            >
                                {plan.is_popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary to-primary-light px-3 py-1 text-xs font-semibold text-white shadow-lg">
                                            Paling Populer
                                        </span>
                                    </div>
                                )}
                                {!plan.is_active && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px]">
                                        <span className="rounded-full bg-neutral-200/80 px-4 py-1.5 text-xs font-semibold text-neutral-500 backdrop-blur-sm">
                                            Tidak Tersedia
                                        </span>
                                    </div>
                                )}
                                <h3 className="text-lg font-bold text-neutral-900">
                                    {plan.name}
                                </h3>
                                <p className="mt-1 text-sm text-neutral-400">
                                    {plan.description}
                                </p>
                                <div className="mt-5 flex items-baseline gap-0.5">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={yearly ? 'yearly' : 'monthly'}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.15 }}
                                            className="text-3xl font-bold text-neutral-900"
                                        >
                                            {price === 0 ? 'Gratis' : formatPrice(price)}
                                        </motion.span>
                                    </AnimatePresence>
                                    {price > 0 && (
                                        <span className="text-sm text-neutral-400">
                                            /{yearly ? 'thn' : 'bln'}
                                        </span>
                                    )}
                                </div>
                                {yearly && plan.price_yearly && plan.price_monthly > 0 && (
                                    <p className="mt-1 text-xs text-emerald-600 font-medium">
                                        Hemat {Math.round((1 - plan.price_yearly / (plan.price_monthly * 12)) * 100)}%
                                    </p>
                                )}
                                <hr className="my-5 border-border" />
                                <ul className="space-y-3">
                                    {displayFeatures.map((f: any) => (
                                        <li
                                            key={f.id}
                                            className="flex items-start gap-2.5 text-sm"
                                        >
                                            <svg
                                                className="mt-0.5 h-4 w-4 shrink-0 text-success"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2.5}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4.5 12.75l6 6 9-13.5"
                                                />
                                            </svg>
                                            <span className="text-neutral-600">
                                                {f.definition.type === 'boolean'
                                                    ? f.definition.label
                                                    : <>{f.value} <span className="text-neutral-400">{f.definition.label.toLowerCase()}</span></>
                                                }
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6">
                                    <Button
                                        variant={plan.is_popular ? 'primary' : 'outline'}
                                        className="w-full"
                                    >
                                        Mulai Uji Coba
                                    </Button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                <p className="mt-8 text-center text-sm text-neutral-400">
                    Semua paket termasuk uji coba 14 hari. Tanpa kartu kredit.
                </p>
            </div>
        </Section>
    );
}
