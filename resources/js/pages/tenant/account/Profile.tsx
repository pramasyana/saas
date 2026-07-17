import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import Button from '@/atoms/Button';
import Input from '@/atoms/Input';
import { useTenantProfile, useUpdateTenantProfile } from '@/features/tenant/hooks/useTenantProfile';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';
import Card from '@/molecules/Card';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemAnim = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const inputBase = 'w-full rounded-xl border px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all focus:outline-none focus:ring-2';

const labelClass = 'mb-1.5 block text-sm font-medium text-neutral-700';

function PasswordStrength({ password }: { password: string }) {
    const strength = useMemo(() => {
        let score = 0;

        if (password.length >= 8) {
score++;
}

        if (password.length >= 12) {
score++;
}

        if (/[A-Z]/.test(password)) {
score++;
}

        if (/[a-z]/.test(password)) {
score++;
}

        if (/[0-9]/.test(password)) {
score++;
}

        if (/[^A-Za-z0-9]/.test(password)) {
score++;
}

        return score;
    }, [password]);

    if (!password) {
return null;
}

    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    const barColors = ['bg-danger', 'bg-warning', 'bg-warning', 'bg-success', 'bg-success'];
    const textColors = ['text-danger', 'text-warning', 'text-warning', 'text-success', 'text-success'];
    const idx = Math.min(Math.floor(strength / 1.5), 4);

    return (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2">
            <div className="flex gap-0.5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-1 flex-1 rounded-full bg-neutral-200">
                        <div className={cn('h-full rounded-full transition-all duration-500', barColors[idx], i <= idx ? 'w-full' : 'w-0')} />
                    </div>
                ))}
            </div>
            <p className={cn('mt-0.5 text-[11px] font-semibold', textColors[idx])}>{labels[Math.min(idx, 3)]}</p>
        </motion.div>
    );
}

function PasswordRules({ password }: { password: string }) {
    const rules = useMemo(() => [
        { label: 'Min. 8 characters', check: password.length >= 8 },
        { label: '1 uppercase letter', check: /[A-Z]/.test(password) },
        { label: '1 lowercase letter', check: /[a-z]/.test(password) },
        { label: '1 number', check: /[0-9]/.test(password) },
        { label: '1 special character', check: /[^A-Za-z0-9]/.test(password) },
    ], [password]);

    if (!password) {
return null;
}

    return (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 space-y-1">
            {rules.map((rule) => (
                <div key={rule.label} className="flex items-center gap-1.5 text-xs">
                    {rule.check ? (
                        <svg className="h-3.5 w-3.5 shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    ) : (
                        <svg className="h-3.5 w-3.5 shrink-0 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    )}
                    <span className={cn(rule.check ? 'text-success' : 'text-neutral-400', 'transition-colors duration-200')}>
                        {rule.label}
                    </span>
                </div>
            ))}
        </motion.div>
    );
}

function PasswordField({
    id,
    label,
    value,
    onChange,
    error,
    placeholder,
    autoComplete,
    showToggle,
    showPw,
    onToggle,
    showStrength,
    showRules,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
    autoComplete?: string;
    showToggle?: boolean;
    showPw?: boolean;
    onToggle?: () => void;
    showStrength?: boolean;
    showRules?: boolean;
}) {
    const [localShowPw, setLocalShowPw] = useState(false);
    const isVisible = showPw ?? localShowPw;
    const toggle = onToggle ?? (() => setLocalShowPw(!localShowPw));

    return (
        <div>
            <label htmlFor={id} className={labelClass}>{label}</label>
            <div className="relative">
                <input
                    id={id}
                    type={isVisible ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={cn(
                        inputBase,
                        error
                            ? 'border-danger focus:border-danger focus:ring-danger/30'
                            : 'border-neutral-300 focus:border-primary focus:ring-primary/30',
                        showToggle && 'pr-12',
                    )}
                />
                {showToggle && (
                    <button
                        type="button"
                        onClick={toggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-primary"
                        tabIndex={-1}
                    >
                        {isVisible ? (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="mt-1 text-xs text-danger"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
            {showStrength && <PasswordStrength password={value} />}
            {showRules && <PasswordRules password={value} />}
        </div>
    );
}

function getInitials(name: string) {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function TenantAccountProfile() {
    const { data: res, isLoading } = useTenantProfile();
    const profile = res?.data;
    const mutation = useUpdateTenantProfile();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPw, setShowPw] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (profile) {
            setName(profile.name);
            setEmail(profile.email);
        }
    }, [profile]);

    useEffect(() => {
        if (saved) {
            const t = setTimeout(() => setSaved(false), 3000);

            return () => clearTimeout(t);
        }
    }, [saved]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrors({});
        setSaved(false);

        mutation.mutate(
            {
                name,
                email,
                ...(newPassword ? {
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: newPasswordConfirmation,
                } : {}),
            },
            {
                onSuccess: () => {
                    setSaved(true);
                    setCurrentPassword('');
                    setNewPassword('');
                    setNewPasswordConfirmation('');
                },
                onError: (err: any) => {
                    if (err?.response?.data?.errors) {
                        const validationErrors: Record<string, string> = {};

                        for (const [key, msgs] of Object.entries(err.response.data.errors)) {
                            validationErrors[key] = (msgs as string[])[0];
                        }

                        setErrors(validationErrors);
                    }
                },
            },
        );
    }

    const memberSince = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : null;

    return (
        <TenantLayout>
            <Head title="Account Settings" />

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                <motion.div variants={itemAnim}>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Account Settings</h1>
                    <p className="mt-1 text-sm text-neutral-500">Manage your profile information and security preferences.</p>
                </motion.div>

                {isLoading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 animate-pulse rounded-xl border border-border bg-white p-6 shadow-sm" />
                        ))}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Overview */}
                        <motion.div variants={itemAnim}>
                            <Card>
                                <div className="flex items-center gap-5">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white shadow-sm">
                                        {profile ? getInitials(profile.name) : 'U'}
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-lg font-bold text-neutral-900">{profile?.name}</h2>
                                        </div>
                                        <p className="text-sm text-neutral-500">{profile?.email}</p>
                                        {memberSince && (
                                            <p className="text-xs text-neutral-400">Member since {memberSince}</p>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Profile Information */}
                        <motion.div variants={itemAnim}>
                            <Card className="p-0">
                                <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-neutral-900">Profile Information</h3>
                                        <p className="text-xs text-neutral-500">Your basic account details</p>
                                    </div>
                                </div>
                                <div className="grid gap-5 p-6 sm:grid-cols-2">
                                    <Input
                                        label="Full Name"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        error={errors.name}
                                        placeholder="Your full name"
                                    />
                                    <Input
                                        label="Email Address"
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        error={errors.email}
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </Card>
                        </motion.div>

                        {/* Security */}
                        <motion.div variants={itemAnim}>
                            <Card className="p-0">
                                <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-neutral-900">Security</h3>
                                        <p className="text-xs text-neutral-500">Leave blank to keep your current password</p>
                                    </div>
                                </div>
                                <div className="space-y-5 p-6">
                                    <PasswordField
                                        id="current-password"
                                        label="Current Password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        error={errors.current_password}
                                        placeholder="Enter current password"
                                        autoComplete="current-password"
                                        showToggle
                                        showPw={showPw}
                                        onToggle={() => setShowPw(!showPw)}
                                    />
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <PasswordField
                                            id="new-password"
                                            label="New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            error={errors.new_password}
                                            placeholder="Min. 8 characters"
                                            autoComplete="new-password"
                                            showStrength
                                            showRules
                                        />
                                        <PasswordField
                                            id="new-password-confirm"
                                            label="Confirm New Password"
                                            value={newPasswordConfirmation}
                                            onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                                            error={errors.password_confirmation}
                                            placeholder="Repeat new password"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Actions */}
                        <motion.div variants={itemAnim} className="flex items-center justify-between gap-4">
                            {saved && (
                                <div className="flex items-center gap-2 text-sm font-semibold text-success">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    Changes saved successfully
                                </div>
                            )}
                            <div className="ml-auto flex gap-3">
                                <Button type="button" variant="secondary" onClick={() => router.get('/dashboard')}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={mutation.isPending}>
                                    {mutation.isPending ? (
                                        <>
                                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </form>
                )}
            </motion.div>
        </TenantLayout>
    );
}
