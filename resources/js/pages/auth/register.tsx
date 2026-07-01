import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import PlanCardGroup from '@/organisms/PlanCardGroup';
import type { Plan, BillingInterval } from '@/types';

interface RegisterForm {
    name: string;
    email: string;
    company: string;
    phone: string;
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

function PasswordStrength({ password }: { password: string }) {
    const strength = useMemo(() => {
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    }, [password]);

    if (!password) return null;

    const labels = ['Lemah', 'Cukup', 'Sedang', 'Baik', 'Kuat', 'Sangat Kuat'];
    const colors = [
        'bg-danger',
        'bg-warning',
        'bg-warning',
        'bg-success',
        'bg-success',
        'bg-success',
    ];
    const textColors = [
        'text-danger',
        'text-warning',
        'text-warning',
        'text-success',
        'text-success',
        'text-success',
    ];

    const idx = Math.min(strength, 5);

    return (
        <div className="mt-1.5">
            <div className="flex gap-0.5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-1 flex-1 rounded-full bg-neutral-200 overflow-hidden">
                        <div
                            className={cn(
                                'h-full rounded-full transition-all duration-300',
                                colors[idx],
                                i <= idx ? 'w-full' : 'w-0',
                            )}
                        />
                    </div>
                ))}
            </div>
            <p className={cn('mt-0.5 text-[11px] font-medium', textColors[idx])}>
                {labels[idx]}
            </p>
        </div>
    );
}

function InputField({ id, label, type, value, onChange, error, placeholder, autoComplete, icon, autoFocus }: {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    placeholder: string;
    autoComplete: string;
    icon: React.ReactNode;
    autoFocus?: boolean;
}) {
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-medium text-neutral-600">
                {label}
            </label>
            <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-neutral-400">{icon}</span>
                </div>
                <input
                    id={id}
                    type={type}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={cn(
                        'block w-full rounded-lg border py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm ring-1 ring-inset transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset',
                        error
                            ? 'border-danger ring-danger/30 focus:ring-danger'
                            : 'border-border ring-neutral-300 focus:border-primary focus:ring-primary/30',
                    )}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    required
                />
            </div>
            {error && (
                <p className="mt-1 text-[11px] text-danger">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function Register() {
    const { plans, defaultPlan, defaultBilling } = usePage<{ plans: Plan[]; defaultPlan: string; defaultBilling: BillingInterval }>().props;

    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        company: '',
        phone: '',
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
        if (!selectedPlan) return '';
        if (selectedPlan.price_monthly === 0) return 'Gratis';
        if (data.billing_interval === 'yearly' && selectedPlan.price_yearly) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(selectedPlan.price_yearly) + '/thn';
        }
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(selectedPlan.price_monthly) + '/bln';
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    };

    return (
        <>
            <Head title="Daftar Akun" />

            <div className="flex min-h-screen">
                <div className="relative hidden w-[44%] overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light lg:flex lg:flex-col">
                    <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/[0.06]" />
                    <div className="absolute -bottom-32 -left-16 h-[28rem] w-[28rem] rounded-full bg-white/[0.04]" />
                    <div className="absolute top-1/3 -left-20 h-64 w-64 rounded-full bg-white/[0.03]" />
                    <div className="absolute right-12 bottom-1/4 h-48 w-48 rounded-full bg-white/[0.05]" />

                    <div className="relative flex flex-1 flex-col items-center justify-center px-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="text-center"
                        >
                            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
                                <span className="text-2xl font-bold text-white">B</span>
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-white">
                                BookCRM
                            </h1>
                            <p className="mt-3 text-sm leading-relaxed text-white/70">
                                Booking, CRM, dan analitik
                                <br />
                                dalam satu platform terpadu.
                            </p>

                            <div className="mt-10 space-y-3.5 text-left">
                                {[
                                    { label: 'Manajemen Booking', desc: 'Atur jadwal dan reservasi dengan mudah' },
                                    { label: 'CRM Terpadu', desc: 'Kelola relasi pelanggan dalam satu tempat' },
                                    { label: 'Analitik Real-time', desc: 'Pantau performa bisnis secara langsung' },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10">
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
                        className="w-full max-w-md"
                    >
                        <div className="mb-8 text-center lg:hidden">
                            <Link href="/" className="inline-flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-base font-bold text-white shadow-sm">
                                    B
                                </div>
                            </Link>
                        </div>

                        <motion.div variants={itemVariants} className="mb-6">
                            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
                                Daftar Gratis
                            </h1>
                            <p className="mt-1 text-sm text-neutral-500">
                                Mulai uji coba 14 hari. Tanpa kartu kredit.
                            </p>
                        </motion.div>

                        <form onSubmit={handleSubmit} noValidate>
                            <motion.div variants={itemVariants} className="mb-4">
                                {selectedPlan && (
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setModalOpen(true)}
                                        onKeyDown={(e) => e.key === 'Enter' && setModalOpen(true)}
                                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-primary/20 bg-primary-50/50 p-2.5 transition-all hover:border-primary/40"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
                                            {selectedPlan.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-neutral-900 truncate leading-tight">
                                                {selectedPlan.name}
                                            </p>
                                            <p className="text-[11px] text-primary font-medium">
                                                {getPriceDisplay()}
                                                {data.billing_interval === 'yearly' && selectedPlan.price_yearly && selectedPlan.price_monthly > 0 && (
                                                    <span className="ml-1 text-success">
                                                        Hemat {Math.round((1 - selectedPlan.price_yearly / (selectedPlan.price_monthly * 12)) * 100)}%
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <span className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-primary shadow-sm ring-1 ring-primary/20">
                                            Ganti
                                        </span>
                                    </div>
                                )}
                            </motion.div>

                            <div className="space-y-3">
                                <motion.div variants={itemVariants} className="grid gap-3 sm:grid-cols-2">
                                    <InputField
                                        id="name"
                                        label="Nama Lengkap"
                                        type="text"
                                        value={data.name}
                                        onChange={(v) => setData('name', v)}
                                        error={errors.name}
                                        placeholder="Nama lengkap"
                                        autoComplete="name"
                                        autoFocus
                                        icon={
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                        }
                                    />
                                    <InputField
                                        id="email"
                                        label="Alamat Email"
                                        type="email"
                                        value={data.email}
                                        onChange={(v) => setData('email', v)}
                                        error={errors.email}
                                        placeholder="email@contoh.com"
                                        autoComplete="email"
                                        icon={
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                            </svg>
                                        }
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants} className="grid gap-3 sm:grid-cols-2">
                                    <InputField
                                        id="company"
                                        label="Nama Perusahaan"
                                        type="text"
                                        value={data.company}
                                        onChange={(v) => setData('company', v)}
                                        error={errors.company}
                                        placeholder="Nama perusahaan"
                                        autoComplete="organization"
                                        icon={
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                            </svg>
                                        }
                                    />
                                    <InputField
                                        id="phone"
                                        label="No. Telepon"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(v) => setData('phone', v)}
                                        error={errors.phone}
                                        placeholder="+62 xxx xxxx"
                                        autoComplete="tel"
                                        icon={
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                            </svg>
                                        }
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants} className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <InputField
                                            id="password"
                                            label="Password"
                                            type="password"
                                            value={data.password}
                                            onChange={(v) => setData('password', v)}
                                            error={errors.password}
                                            placeholder="Min. 8 karakter"
                                            autoComplete="new-password"
                                            icon={
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                                </svg>
                                            }
                                        />
                                        <PasswordStrength password={data.password} />
                                    </div>
                                    <InputField
                                        id="password_confirmation"
                                        label="Konfirmasi Password"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(v) => setData('password_confirmation', v)}
                                        error={errors.password_confirmation}
                                        placeholder="Ulangi password"
                                        autoComplete="new-password"
                                        icon={
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                            </svg>
                                        }
                                    />
                                </motion.div>
                            </div>

                            <motion.div variants={itemVariants} className="mt-4">
                                <p className="text-xs text-neutral-500">
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
                            </motion.div>

                            <motion.div variants={itemVariants} className="mt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={cn(
                                        'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200',
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
                                        <>
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                            </svg>
                                            Buat Akun
                                        </>
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
                            className="mt-6 text-center text-[11px] text-neutral-400"
                        >
                            &copy; {new Date().getFullYear()} BookCRM
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
