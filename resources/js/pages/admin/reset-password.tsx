import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
    token: string;
    email: string;
}

function LockIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
    );
}

function ArrowLeftIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg>
    );
}

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
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
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function AdminResetPassword({ token, email }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/reset-password');
    }

    return (
        <>
            <Head title="Reset Password" />

            <div className="flex min-h-screen">
                <div className="relative hidden w-[45%] overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light lg:block">
                    <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/[0.06]" />
                    <div className="absolute -bottom-32 -left-16 h-[28rem] w-[28rem] rounded-full bg-white/[0.04]" />
                    <div className="absolute top-1/3 -left-20 h-64 w-64 rounded-full bg-white/[0.03]" />
                    <div className="absolute right-12 bottom-1/4 h-48 w-48 rounded-full bg-white/[0.05]" />

                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

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
                                Buat password baru untuk akun Anda.
                                <br />
                                Pastikan password kuat dan mudah diingat.
                            </p>
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
                            <Link
                                href="/admin/login"
                                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                            >
                                <ArrowLeftIcon className="h-4 w-4" />
                                Kembali ke Login
                            </Link>
                            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                                Reset Password
                            </h1>
                            <p className="mt-1.5 text-sm text-neutral-500">
                                Masukkan password baru untuk akun Anda.
                            </p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <input type="hidden" name="token" value={data.token} />
                            <input type="hidden" name="email" value={data.email} />

                            <motion.div variants={itemVariants}>
                                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                                    Alamat Email
                                </label>
                                <div className="relative mt-1.5">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <LockIcon className="h-4 w-4 text-neutral-400" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        disabled
                                        className="block w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-3.5 text-sm text-neutral-500 shadow-sm"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                                    Password Baru
                                </label>
                                <div className="relative mt-1.5">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <LockIcon className="h-4 w-4 text-neutral-400" />
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
                                        <CheckIcon className="h-4 w-4 text-neutral-400" />
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
                                        placeholder="Ulangi password baru"
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
                                        <span className="inline-flex items-center gap-2">
                                            <Spinner />
                                            Menyimpan...
                                        </span>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </motion.div>
                        </form>

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
