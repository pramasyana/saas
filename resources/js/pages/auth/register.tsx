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

    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong', 'Excellent'];
    const colors = ['bg-danger', 'bg-warning', 'bg-warning', 'bg-success', 'bg-success', 'bg-success'];
    const textColors = ['text-danger', 'text-warning', 'text-warning', 'text-success', 'text-success', 'text-success'];
    const idx = Math.min(strength, 5);

    return (
        <div className="mt-2">
            <div className="flex gap-0.5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-1 flex-1 rounded-full bg-[#cbc3d7]/20 overflow-hidden">
                        <div className={cn('h-full rounded-full transition-all duration-300', colors[idx], i <= idx ? 'w-full' : 'w-0')} />
                    </div>
                ))}
            </div>
            <p className={cn('mt-0.5 text-[11px] font-semibold', textColors[idx])}>{labels[idx]}</p>
        </div>
    );
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

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
        if (selectedPlan.price_monthly === 0) return 'Free';
        if (data.billing_interval === 'yearly' && selectedPlan.price_yearly) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(selectedPlan.price_yearly) + '/yr';
        }
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(selectedPlan.price_monthly) + '/mo';
    }

    return (
        <>
            <Head title="Create Account" />

            <div className="flex min-h-screen w-full bg-[#faf8ff]">
                {/* Left — Mesh Gradient */}
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
                            Start your
                            <br />
                            free trial today.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                            className="mb-16 max-w-md text-lg leading-relaxed text-white/80"
                        >
                            Join thousands of businesses already using BookCRM. No credit card required.
                        </motion.p>

                        {/* Glass Mockup Cards */}
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
                                    <span className="text-sm text-white/60">14-Day Trial</span>
                                    <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="text-lg font-semibold tracking-tight">Full access. No limits.</div>
                                <div className="mt-1 text-sm text-white/70">Explore all features risk-free for 14 days.</div>
                                <div className="mt-4 space-y-2">
                                    {['Booking Management', 'CRM Tools', 'Analytics'].map((f) => (
                                        <div key={f} className="flex items-center gap-2 text-sm text-white/80">
                                            <svg className="h-3.5 w-3.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            {f}
                                        </div>
                                    ))}
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
                                    <span className="text-sm text-white/60">No Credit Card</span>
                                    <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                    </svg>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 text-xs font-bold text-white">
                                        NP
                                    </div>
                                    <span className="text-base text-white">No payment required</span>
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

                {/* Right — Register Form */}
                <div className="flex w-full items-center justify-center overflow-y-auto p-8 lg:w-1/2">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="w-full max-w-md py-8"
                    >
                        <motion.div variants={itemVariants} className="mb-12 flex items-center gap-2 lg:hidden">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6b38d4]">
                                <span className="text-xl font-bold text-white">B</span>
                            </div>
                            <span className="text-2xl font-bold tracking-tighter text-[#131b2e]">BookCRM</span>
                        </motion.div>

                        <motion.div variants={itemVariants} className="mb-10">
                            <h2 className="mb-2 text-4xl font-bold tracking-tight text-[#131b2e]">Create Account</h2>
                            <p className="text-base leading-relaxed text-[#494454]/80">
                                Start your 14-day free trial. No credit card required.
                            </p>
                        </motion.div>

                        <form onSubmit={handleSubmit} noValidate>
                            {/* Plan Selector */}
                            <motion.div variants={itemVariants} className="mb-5">
                                {selectedPlan && (
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setModalOpen(true)}
                                        onKeyDown={(e) => e.key === 'Enter' && setModalOpen(true)}
                                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#cbc3d7]/30 bg-[#f2f3ff] p-3 transition-all hover:border-[#6b38d4]/40"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6b38d4] text-sm font-bold text-white">
                                            {selectedPlan.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold leading-tight text-[#131b2e]">{selectedPlan.name}</p>
                                            <p className="text-[11px] font-semibold text-[#6b38d4]">
                                                {getPriceDisplay()}
                                                {data.billing_interval === 'yearly' && selectedPlan.price_yearly && selectedPlan.price_monthly > 0 && (
                                                    <span className="ml-1 text-success">
                                                        Save {Math.round((1 - selectedPlan.price_yearly / (selectedPlan.price_monthly * 12)) * 100)}%
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <span className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-[#6b38d4] shadow-sm ring-1 ring-[#cbc3d7]/30">
                                            Change
                                        </span>
                                    </div>
                                )}
                            </motion.div>

                            {/* Form Fields */}
                            <div className="space-y-4">
                                <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="ml-1 block text-sm font-semibold text-[#494454]">Full Name</label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7b7486]/50 transition-colors group-focus-within:text-[#6b38d4]">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                </svg>
                                            </span>
                                            <input
                                                id="name"
                                                type="text"
                                                autoComplete="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={cn(
                                                    'w-full rounded-xl border bg-[#f2f3ff] py-3.5 pl-11 pr-4 text-[#131b2e] transition-all placeholder:text-[#7b7486]/40 hover:bg-[#e2e7ff] focus:bg-white',
                                                    errors.name
                                                        ? 'border-danger ring-4 ring-danger/10'
                                                        : 'border-[#cbc3d7]/30 focus:border-[#6b38d4] focus:ring-4 focus:ring-[#8455ef]/20',
                                                )}
                                                placeholder="John Doe"
                                                autoFocus
                                                required
                                            />
                                        </div>
                                        {errors.name && <p className="ml-1 text-xs text-danger">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="ml-1 block text-sm font-semibold text-[#494454]">Email Address</label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7b7486]/50 transition-colors group-focus-within:text-[#6b38d4]">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                                </svg>
                                            </span>
                                            <input
                                                id="email"
                                                type="email"
                                                autoComplete="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={cn(
                                                    'w-full rounded-xl border bg-[#f2f3ff] py-3.5 pl-11 pr-4 text-[#131b2e] transition-all placeholder:text-[#7b7486]/40 hover:bg-[#e2e7ff] focus:bg-white',
                                                    errors.email
                                                        ? 'border-danger ring-4 ring-danger/10'
                                                        : 'border-[#cbc3d7]/30 focus:border-[#6b38d4] focus:ring-4 focus:ring-[#8455ef]/20',
                                                )}
                                                placeholder="john@company.com"
                                                required
                                            />
                                        </div>
                                        {errors.email && <p className="ml-1 text-xs text-danger">{errors.email}</p>}
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="company" className="ml-1 block text-sm font-semibold text-[#494454]">Company</label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7b7486]/50 transition-colors group-focus-within:text-[#6b38d4]">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                                </svg>
                                            </span>
                                            <input
                                                id="company"
                                                type="text"
                                                autoComplete="organization"
                                                value={data.company}
                                                onChange={(e) => setData('company', e.target.value)}
                                                className={cn(
                                                    'w-full rounded-xl border bg-[#f2f3ff] py-3.5 pl-11 pr-4 text-[#131b2e] transition-all placeholder:text-[#7b7486]/40 hover:bg-[#e2e7ff] focus:bg-white',
                                                    errors.company
                                                        ? 'border-danger ring-4 ring-danger/10'
                                                        : 'border-[#cbc3d7]/30 focus:border-[#6b38d4] focus:ring-4 focus:ring-[#8455ef]/20',
                                                )}
                                                placeholder="Acme Corp"
                                                required
                                            />
                                        </div>
                                        {errors.company && <p className="ml-1 text-xs text-danger">{errors.company}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="ml-1 block text-sm font-semibold text-[#494454]">Phone</label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7b7486]/50 transition-colors group-focus-within:text-[#6b38d4]">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                                </svg>
                                            </span>
                                            <input
                                                id="phone"
                                                type="tel"
                                                autoComplete="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className={cn(
                                                    'w-full rounded-xl border bg-[#f2f3ff] py-3.5 pl-11 pr-4 text-[#131b2e] transition-all placeholder:text-[#7b7486]/40 hover:bg-[#e2e7ff] focus:bg-white',
                                                    errors.phone
                                                        ? 'border-danger ring-4 ring-danger/10'
                                                        : 'border-[#cbc3d7]/30 focus:border-[#6b38d4] focus:ring-4 focus:ring-[#8455ef]/20',
                                                )}
                                                placeholder="+62 xxx xxxx"
                                                required
                                            />
                                        </div>
                                        {errors.phone && <p className="ml-1 text-xs text-danger">{errors.phone}</p>}
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="password" className="ml-1 block text-sm font-semibold text-[#494454]">Password</label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7b7486]/50 transition-colors group-focus-within:text-[#6b38d4]">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
                                                    'w-full rounded-xl border bg-[#f2f3ff] py-3.5 pl-11 pr-4 text-[#131b2e] transition-all placeholder:text-[#7b7486]/40 hover:bg-[#e2e7ff] focus:bg-white',
                                                    errors.password
                                                        ? 'border-danger ring-4 ring-danger/10'
                                                        : 'border-[#cbc3d7]/30 focus:border-[#6b38d4] focus:ring-4 focus:ring-[#8455ef]/20',
                                                )}
                                                placeholder="Min. 8 characters"
                                                required
                                            />
                                        </div>
                                        <PasswordStrength password={data.password} />
                                        {errors.password && <p className="ml-1 text-xs text-danger">{errors.password}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="password_confirmation" className="ml-1 block text-sm font-semibold text-[#494454]">Confirm Password</label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7b7486]/50 transition-colors group-focus-within:text-[#6b38d4]">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
                                                    'w-full rounded-xl border bg-[#f2f3ff] py-3.5 pl-11 pr-4 text-[#131b2e] transition-all placeholder:text-[#7b7486]/40 hover:bg-[#e2e7ff] focus:bg-white',
                                                    errors.password_confirmation
                                                        ? 'border-danger ring-4 ring-danger/10'
                                                        : 'border-[#cbc3d7]/30 focus:border-[#6b38d4] focus:ring-4 focus:ring-[#8455ef]/20',
                                                )}
                                                placeholder="Repeat password"
                                                required
                                            />
                                        </div>
                                        {errors.password_confirmation && <p className="ml-1 text-xs text-danger">{errors.password_confirmation}</p>}
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div variants={itemVariants} className="mt-5">
                                <p className="text-xs font-semibold text-[#7b7486]/60">
                                    By signing up, you agree to our{' '}
                                    <Link href="#" className="font-semibold text-[#6b38d4] hover:underline">Terms of Service</Link>{' '}
                                    and{' '}
                                    <Link href="#" className="font-semibold text-[#6b38d4] hover:underline">Privacy Policy</Link>.
                                </p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="mt-5">
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
                                            Creating Account...
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2">
                                            Create Account
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
                                Already have an account?{' '}
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

                {/* Plan Selector Modal */}
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
                                <div className="flex items-center justify-between border-b border-[#cbc3d7]/30 px-6 py-4">
                                    <h2 className="text-lg font-bold text-[#131b2e]">Choose Your Plan</h2>
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7b7486]/50 transition-colors hover:bg-[#f2f3ff] hover:text-[#7b7486]"
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
