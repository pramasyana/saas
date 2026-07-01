import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

function Spinner() {
    return (
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 } as const,
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function TenantLogin() {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/login', {
            onSuccess: () => reset('password'),
        });
    }

    return (
        <>
            <Head title="Masuk ke Akun" />

            <div className="flex min-h-screen">
                <div className="relative hidden w-[45%] overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light lg:block">
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
                                Kelola bisnis Anda dengan lebih cerdas.
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
                                Selamat Datang Kembali
                            </h1>
                            <p className="mt-1.5 text-sm text-neutral-500">
                                Masuk ke akun BookCRM Anda
                            </p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-5">
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
                                        autoFocus
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
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={cn(
                                            'block w-full rounded-xl border py-2.5 pl-10 pr-3.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm ring-1 ring-inset transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset',
                                            errors.password
                                                ? 'border-danger ring-danger/30 focus:ring-danger'
                                                : 'border-border ring-neutral-300 focus:border-primary focus:ring-primary/30',
                                        )}
                                        placeholder="••••••••"
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

                            <motion.div variants={itemVariants} className="flex items-center justify-between">
                                <label className="flex cursor-pointer items-center gap-2.5">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="peer sr-only"
                                        />
                                        <div className="h-5 w-5 rounded-md border border-border ring-1 ring-inset ring-neutral-300 transition-all peer-checked:border-primary peer-checked:bg-primary peer-checked:ring-primary/30" />
                                        <svg
                                            className="absolute inset-0 hidden h-5 w-5 text-white peer-checked:block"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={3}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-neutral-600">Ingat saya</span>
                                </label>
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
                                            Memproses...
                                        </>
                                    ) : (
                                        'Masuk ke Akun'
                                    )}
                                </button>
                            </motion.div>
                        </form>

                        <motion.p
                            variants={itemVariants}
                            className="mt-6 text-center text-sm text-neutral-500"
                        >
                            Belum punya akun?{' '}
                            <Link href="/register" className="font-semibold text-primary hover:text-primary-dark">
                                Daftar Gratis
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
            </div>
        </>
    );
}
