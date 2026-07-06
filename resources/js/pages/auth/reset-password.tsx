import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
    token: string;
    email: string;
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
        transition: { staggerChildren: 0.06 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function TenantResetPassword({ token, email }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/reset-password');
    }

    return (
        <>
            <Head title="Reset Password" />

            <div className="flex min-h-screen w-full bg-[#faf8ff]">
                {/* Left — Mesh Gradient + Glass Cards */}
                <div
                    className="relative hidden w-1/2 items-center justify-center overflow-hidden p-16 lg:flex"
                    style={{
                        backgroundColor: '#6d3bd7',
                        backgroundImage: [
                            'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%)',
                            'radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%)',
                            'radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)',
                            'radial-gradient(at 0% 100%, hsla(321,49%,30%,1) 0, transparent 50%)',
                            'radial-gradient(at 50% 100%, hsla(262,82%,53%,1) 0, transparent 50%)',
                            'radial-gradient(at 100% 100%, hsla(190,49%,30%,1) 0, transparent 50%)',
                        ].join(', '),
                    }}
                >
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] rounded-full bg-[#6b38d4] mix-blend-screen blur-[100px]" />
                        <div className="absolute -bottom-[10%] -right-[10%] h-[60%] w-[60%] rounded-full bg-[#4648d4] mix-blend-screen blur-[100px]" />
                    </div>

                    <div className="relative z-10 w-full max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="mb-12 flex items-center gap-3"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                                <span className="text-2xl font-bold text-[#6b38d4]">B</span>
                            </div>
                            <span className="text-3xl font-bold tracking-tighter text-white">BookCRM</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                            className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-white"
                        >
                            Reset your
                            <br />
                            password
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                            className="mb-16 max-w-md text-lg leading-relaxed text-white/80"
                        >
                            Choose a strong password to keep your account secure. Make sure it's at least 8 characters.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.35, ease: 'easeOut' }}
                            className="relative h-64"
                        >
                            <div
                                className="absolute left-0 top-0 w-80 rotate-[-4deg] rounded-xl p-6 text-white backdrop-blur-md transition-all duration-500 hover:translate-y-[-10px] hover:rotate-0"
                                style={{
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
                                }}
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-sm text-white/60">Password Reset</span>
                                    <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </div>
                                <div className="text-lg font-semibold tracking-tight">Secure your account</div>
                                <div className="mt-2 text-sm text-white/70">Use a password you haven't used on other sites.</div>
                                <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/20">
                                    <div className="h-full w-2/3 rounded-full bg-white" />
                                </div>
                            </div>

                            <div
                                className="absolute left-32 top-12 w-80 rotate-[2deg] rounded-xl p-6 text-white backdrop-blur-md transition-all duration-500 hover:translate-y-[-10px] hover:rotate-0"
                                style={{
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
                                }}
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-sm text-white/60">Tip</span>
                                    <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                                    </svg>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 text-xs font-bold text-white">
                                        PW
                                    </div>
                                    <span className="text-base text-white">Use 8+ characters</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                            className="absolute bottom-16 left-16 text-sm text-white/40"
                        >
                            &copy; {new Date().getFullYear()} BookCRM. Crafted for Visionaries.
                        </motion.p>
                    </div>
                </div>

                {/* Right — Reset Form */}
                <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="w-full max-w-md"
                    >
                        <motion.div variants={itemVariants} className="mb-12 flex items-center gap-2 lg:hidden">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6b38d4]">
                                <span className="text-xl font-bold text-white">B</span>
                            </div>
                            <span className="text-2xl font-bold tracking-tighter text-[#131b2e]">BookCRM</span>
                        </motion.div>

                        <motion.div variants={itemVariants} className="mb-10">
                            <Link
                                href="/login"
                                className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#6b38d4] transition-all hover:underline"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                                </svg>
                                Back to Login
                            </Link>
                            <h2 className="mb-2 text-4xl font-bold tracking-tight text-[#131b2e]">Set New Password</h2>
                            <p className="text-base leading-relaxed text-[#494454]/80">
                                Enter your new password below to regain access to your account.
                            </p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <input type="hidden" name="token" value={data.token} />
                            <input type="hidden" name="email" value={data.email} />

                            <motion.div variants={itemVariants} className="space-y-2">
                                <label htmlFor="email" className="ml-1 block text-sm font-semibold text-[#494454]">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7b7486]/50">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        disabled
                                        className="w-full rounded-xl border border-[#cbc3d7]/30 bg-[#f2f3ff]/50 py-4 pl-12 pr-4 text-[#131b2e]/60"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-2">
                                <label htmlFor="password" className="ml-1 block text-sm font-semibold text-[#494454]">
                                    New Password
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7b7486]/50 transition-colors group-focus-within:text-[#6b38d4]">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                    </span>
                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={cn(
                                            'w-full rounded-xl border bg-[#f2f3ff] py-4 pl-12 pr-4 text-[#131b2e] transition-all placeholder:text-[#7b7486]/40 hover:bg-[#e2e7ff] focus:bg-white',
                                            errors.password
                                                ? 'border-danger ring-4 ring-danger/10'
                                                : 'border-[#cbc3d7]/30 focus:border-[#6b38d4] focus:ring-4 focus:ring-[#8455ef]/20',
                                        )}
                                        placeholder="Min. 8 characters"
                                        required
                                    />
                                </div>
                                {errors.password && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="ml-1 text-xs text-danger"
                                    >
                                        {errors.password}
                                    </motion.p>
                                )}
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-2">
                                <label htmlFor="password_confirmation" className="ml-1 block text-sm font-semibold text-[#494454]">
                                    Confirm Password
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7b7486]/50 transition-colors group-focus-within:text-[#6b38d4]">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                        </svg>
                                    </span>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className={cn(
                                            'w-full rounded-xl border bg-[#f2f3ff] py-4 pl-12 pr-4 text-[#131b2e] transition-all placeholder:text-[#7b7486]/40 hover:bg-[#e2e7ff] focus:bg-white',
                                            errors.password_confirmation
                                                ? 'border-danger ring-4 ring-danger/10'
                                                : 'border-[#cbc3d7]/30 focus:border-[#6b38d4] focus:ring-4 focus:ring-[#8455ef]/20',
                                        )}
                                        placeholder="Repeat new password"
                                        required
                                    />
                                </div>
                                {errors.password_confirmation && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="ml-1 text-xs text-danger"
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
                                        'flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold text-white transition-all',
                                        processing
                                            ? 'cursor-not-allowed bg-[#6b38d4]/70'
                                            : 'bg-[#6b38d4] hover:scale-[1.02] active:scale-[0.98]',
                                    )}
                                    style={!processing ? {
                                        boxShadow: '0 10px 40px -10px rgba(107, 56, 212, 0.4)',
                                    } : undefined}
                                    onMouseEnter={(e) => {
                                        if (!processing) {
                                            e.currentTarget.style.boxShadow = '0 15px 50px -5px rgba(107, 56, 212, 0.6)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!processing) {
                                            e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(107, 56, 212, 0.4)';
                                        }
                                    }}
                                >
                                    {processing ? (
                                        <span className="inline-flex items-center gap-2">
                                            <Spinner />
                                            Resetting Password...
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2">
                                            Reset Password
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        </span>
                                    )}
                                </button>
                            </motion.div>
                        </form>

                        <motion.footer
                            variants={itemVariants}
                            className="mt-12 flex flex-col items-center gap-4"
                        >
                            <p className="text-sm font-semibold text-[#7b7486]/60">
                                Remember your password?{' '}
                                <Link href="/login" className="font-semibold text-[#6b38d4] hover:underline">
                                    Sign In
                                </Link>
                            </p>
                            <div className="flex items-center gap-4">
                                <Link href="#" className="text-xs font-semibold text-[#7b7486]/40 transition-colors hover:text-[#7b7486]">
                                    Privacy Policy
                                </Link>
                                <span className="text-[#cbc3d7]/30">·</span>
                                <Link href="#" className="text-xs font-semibold text-[#7b7486]/40 transition-colors hover:text-[#7b7486]">
                                    Terms of Service
                                </Link>
                            </div>
                        </motion.footer>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
