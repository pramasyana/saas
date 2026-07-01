import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import PlanCardGroup from '@/organisms/PlanCardGroup';
import type { Plan, BillingInterval } from '@/types';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    plan_id: string;
    billing_interval: BillingInterval;
}

function Spinner() {
    return (
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );
}

function formatPrice(value: number): string {
    if (value === 0) {
        return 'Gratis';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 } as const,
    },
};

export default function Register() {
    const { plans, defaultPlan, defaultBilling } = usePage<{ plans: Plan[]; defaultPlan: string; defaultBilling: BillingInterval }>().props;

    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        plan_id: plans.find((p) => p.slug === defaultPlan)?.id ?? plans[0]?.id ?? '',
        billing_interval: defaultBilling,
    });

    const [modalOpen, setModalOpen] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/register', {
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    }

    const selectedPlan = plans.find((p) => p.id === data.plan_id);

    function getPriceDisplay() {
        if (!selectedPlan) {
            return '';
        }

        if (selectedPlan.price_monthly === 0) {
            return 'Gratis';
        }

        if (data.billing_interval === 'yearly' && selectedPlan.price_yearly) {
            return formatPrice(selectedPlan.price_yearly) + '/thn';
        }

        return formatPrice(selectedPlan.price_monthly) + '/bln';
    }

    return (
        <>
            <Head title="Daftar Akun" />

            <div className="flex min-h-screen">
                <div className="relative hidden w-[45%] overflow-hidden bg-gradient-to-br from-[#4C1D95] via-[#5B21B6] to-[#7C3AED] lg:block">
                    <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/[0.06]" />
                    <div className="absolute -bottom-32 -left-16 h-[28rem] w-[28rem] rounded-full bg-white/[0.04]" />
                    <div className="absolute top-1/3 -left-20 h-64 w-64 rounded-full bg-white/[0.03]" />
                    <div className="absolute right-12 bottom-1/4 h-48 w-48 rounded-full bg-white/[0.05]" />

                    <div className="relative flex h-full flex-col items-center justify-center px-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="text-center"
                        >
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
                                <span className="text-2xl font-bold text-white">B</span>
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-white">
                                BookCRM
                            </h1>
                            <p className="mt-4 text-base leading-relaxed text-white/70">
                                Mulai perjalanan bisnis Anda.
                                <br />
                                Booking, CRM, dan analitik dalam satu platform.
                            </p>

                            <div className="mt-12 space-y-4 text-left">
                                {[
                                    { label: 'Manajemen Booking', desc: 'Atur jadwal dan reservasi dengan mudah' },
                                    { label: 'CRM Terpadu', desc: 'Kelola relasi pelanggan dalam satu tempat' },
                                    { label: 'Analitik Real-time', desc: 'Pantau performa bisnis secara langsung' },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-start gap-3">
                                        <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10">
                                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{item.label}</p>
                                            <p className="text-xs text-white/50">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                            className="absolute bottom-8 text-xs text-white/30"
                        >
                            &copy; {new Date().getFullYear()} BookCRM. All rights reserved.
                        </motion.p>
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-center bg-neutral-50 px-6">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="w-full max-w-sm"
                    >
                        <div className="mb-10 text-center lg:hidden">
                            <Link href="/" className="inline-flex items-center gap-2.5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-lg font-bold text-white shadow-sm">
                                    B
                                </div>
                            </Link>
                        </div>

                        <motion.div variants={itemVariants} className="mb-8">
                            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                                Daftar Gratis
                            </h1>
                            <p className="mt-1.5 text-sm text-neutral-500">
                                Mulai uji coba 14 hari, tanpa kartu kredit.
                            </p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {selectedPlan && (
                                <motion.div variants={itemVariants}>
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setModalOpen(true)}
                                        onKeyDown={(e) => e.key === 'Enter' && setModalOpen(true)}
                                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-primary/20 bg-primary-50/60 p-3.5 transition-all hover:border-primary/40 hover:bg-primary-50"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white shadow-sm">
                                            {selectedPlan.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-neutral-900 truncate">
                                                {selectedPlan.name}
                                            </p>
                                            <p className="text-xs text-primary font-medium">
                                                {getPriceDisplay()}
                                                {data.billing_interval === 'yearly' && selectedPlan.price_yearly && selectedPlan.price_monthly > 0 && (
                                                    <span className="ml-1.5 text-emerald-600">
                                                        Hemat {Math.round((1 - selectedPlan.price_yearly / (selectedPlan.price_monthly * 12)) * 100)}%
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-primary shadow-sm ring-1 ring-primary/20">
                                            Ganti
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <motion.div variants={itemVariants}>
                                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                                    Nama Lengkap
                                </label>
                                <div className="relative mt-1.5">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="name"
                                        type="text"
                                        autoComplete="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={cn(
                                            'block w-full rounded-xl border py-2.5 pl-10 pr-3.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm ring-1 ring-inset transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset',
                                            errors.name
                                                ? 'border-danger ring-danger/30 focus:ring-danger'
                                                : 'border-border ring-neutral-300 focus:border-primary focus:ring-primary/30',
                                        )}
                                        placeholder="Nama lengkap"
                                        autoFocus
                                        required
                                    />
                                </div>
                                {errors.name && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1.5 text-xs text-danger"
                                    >
                                        {errors.name}
                                    </motion.p>
                                )}
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                                    Alamat Email
                                </label>
                                <div className="relative mt-1.5">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={cn(
                                            'block w-full rounded-xl border py-2.5 pl-10 pr-3.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm ring-1 ring-inset transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset',
                                            errors.email
                                                ? 'border-danger ring-danger/30 focus:ring-danger'
                                                : 'border-border ring-neutral-300 focus:border-primary focus:ring-primary/30',
                                        )}
                                        placeholder="email@contoh.com"
                                        required
                                    />
                                </div>
                                {errors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1.5 text-xs text-danger"
                                    >
                                        {errors.email}
                                    </motion.p>
                                )}
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                                    Password
                                </label>
                                <div className="relative mt-1.5">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={cn(
                                            'block w-full rounded-xl border py-2.5 pl-10 pr-3.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm ring-1 ring-inset transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset',
                                            errors.password
                                                ? 'border-danger ring-danger/30 focus:ring-danger'
                                                : 'border-border ring-neutral-300 focus:border-primary focus:ring-primary/30',
                                        )}
                                        placeholder="Min. 8 karakter"
                                        required
                                    />
                                </div>
                                {errors.password && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1.5 text-xs text-danger"
                                    >
                                        {errors.password}
                                    </motion.p>
                                )}
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-neutral-700">
                                    Konfirmasi Password
                                </label>
                                <div className="relative mt-1.5">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className={cn(
                                            'block w-full rounded-xl border py-2.5 pl-10 pr-3.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm ring-1 ring-inset transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset',
                                            errors.password_confirmation
                                                ? 'border-danger ring-danger/30 focus:ring-danger'
                                                : 'border-border ring-neutral-300 focus:border-primary focus:ring-primary/30',
                                        )}
                                        placeholder="Ulangi password"
                                        required
                                    />
                                </div>
                                {errors.password_confirmation && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1.5 text-xs text-danger"
                                    >
                                        {errors.password_confirmation}
                                    </motion.p>
                                )}
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <div className="rounded-xl bg-neutral-50 px-4 py-3">
                                    <p className="text-xs leading-relaxed text-neutral-500">
                                        Dengan mendaftar, Anda menyetujui{' '}
                                        <Link href="/" className="font-medium text-primary hover:text-primary-dark underline underline-offset-2">
                                            Syarat & Ketentuan
                                        </Link>{' '}
                                        dan{' '}
                                        <Link href="/" className="font-medium text-primary hover:text-primary-dark underline underline-offset-2">
                                            Kebijakan Privasi
                                        </Link>{' '}
                                        BookCRM.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={cn(
                                        'flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200',
                                        processing
                                            ? 'cursor-not-allowed bg-primary/70'
                                            : 'bg-primary hover:bg-primary-dark hover:shadow-md active:scale-[0.98]',
                                    )}
                                >
                                    {processing ? (
                                        <>
                                            <Spinner />
                                            Mendaftarkan...
                                        </>
                                    ) : (
                                        'Buat Akun'
                                    )}
                                </button>
                            </motion.div>
                        </form>

                        <motion.p
                            variants={itemVariants}
                            className="mt-6 text-center text-sm text-neutral-500"
                        >
                            Sudah punya akun?{' '}
                            <Link href="/login" className="font-semibold text-primary hover:text-primary-dark">
                                Masuk
                            </Link>
                        </motion.p>

                        <motion.p
                            variants={itemVariants}
                            className="mt-8 text-center text-xs text-neutral-400"
                        >
                            &copy; {new Date().getFullYear()} BookCRM. All rights reserved.
                        </motion.p>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {modalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
                            onClick={() => setModalOpen(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="relative w-full max-w-6xl rounded-2xl bg-white shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                                    <h2 className="text-lg font-bold text-neutral-900">Pilih Paket</h2>
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="px-6 py-4 pb-6">
                                    <PlanCardGroup
                                        mode="select"
                                        plans={plans}
                                        billingInterval={data.billing_interval}
                                        onBillingChange={(interval) => setData('billing_interval', interval)}
                                        selectedPlanId={data.plan_id}
                                        onPlanSelect={(planId) => {
                                            setData('plan_id', planId);
                                            setModalOpen(false);
                                        }}
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
