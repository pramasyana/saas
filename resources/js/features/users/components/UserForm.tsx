import { Link, usePage } from '@inertiajs/react';
import {  useEffect, useState } from 'react';
import type {FormEvent} from 'react';
import Button from '@/atoms/Button';
import type { User, UserFormData } from '@/features/users/types';
import { cn } from '@/lib/utils';

interface UserFormProps {
    user: User | null;
    saving: boolean;
    errors?: Record<string, string[]>;
    onSave: (data: UserFormData) => void;
}

interface PasswordCheck {
    key: string;
    label: string;
    test: (pw: string) => boolean;
}

const checks: PasswordCheck[] = [
    { key: 'length', label: 'Minimal 8 karakter', test: (pw) => pw.length >= 8 },
    { key: 'upper', label: 'Huruf besar (A-Z)', test: (pw) => /[A-Z]/.test(pw) },
    { key: 'number', label: 'Angka (0-9)', test: (pw) => /[0-9]/.test(pw) },
    { key: 'special', label: 'Karakter khusus (!@#...)', test: (pw) => /[^a-zA-Z0-9]/.test(pw) },
];

function getStrength(pw: string): { score: number; label: string; color: string; width: string } {
    if (!pw) {
return { score: 0, label: '', color: '', width: '0%' };
}

    const passed = checks.filter((c) => c.test(pw)).length;

    if (passed <= 1) {
return { score: 1, label: 'Lemah', color: 'bg-danger', width: '25%' };
}

    if (passed <= 2) {
return { score: 2, label: 'Sedang', color: 'bg-warning', width: '50%' };
}

    if (passed <= 3) {
return { score: 3, label: 'Baik', color: 'bg-primary', width: '75%' };
}

    return { score: 4, label: 'Kuat', color: 'bg-success', width: '100%' };
}

export default function UserForm({ user, saving, errors = {}, onSave }: UserFormProps) {
    const { auth } = usePage().props as { auth: { user: { is_admin: boolean } } };
    const [form, setForm] = useState<UserFormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        is_admin: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({ name: user.name, email: user.email, password: '', password_confirmation: '', is_admin: user.is_admin });
        } else {
            setForm({ name: '', email: '', password: '', password_confirmation: '', is_admin: false });
        }
    }, [user]);

    const pw = form.password ?? '';
    const strength = getStrength(pw);
    const matchError = form.password_confirmation && form.password !== form.password_confirmation;

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const payload = { ...form };

        if (user && !payload.password) {
            delete payload.password;
            delete payload.password_confirmation;
        }

        onSave(payload);
    }

    function inputClass(field: string, extra?: string) {
        return cn(
            'block w-full rounded-xl border px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2',
            errors[field]
                ? 'border-danger ring-danger/20 focus:border-danger focus:ring-danger/30'
                : 'border-neutral-300 ring-neutral-300 focus:border-primary focus:ring-primary/30',
            'disabled:bg-neutral-50 disabled:text-neutral-500',
            extra,
        );
    }

    function renderField(
        label: string,
        field: string,
        children: React.ReactNode,
        hint?: string,
    ) {
        const fieldErrors = errors[field];

        return (
            <div>
                <label className="block text-sm font-medium text-neutral-700">
                    {label}
                    {field !== 'password' && field !== 'password_confirmation' && (
                        <span className="ml-0.5 text-danger">*</span>
                    )}
                </label>
                <div className="relative mt-1.5">{children}</div>
                {hint && !fieldErrors && (
                    <p className="mt-1 text-xs text-neutral-400">{hint}</p>
                )}
                {fieldErrors && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-danger">
                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <span>{fieldErrors[0]}</span>
                    </div>
                )}
            </div>
        );
    }

    function renderPasswordField(
        label: string,
        field: string,
        value: string,
        onChange: (v: string) => void,
        show: boolean,
        onToggle: () => void,
        placeholder: string,
        required?: boolean,
    ) {
        const isConfirm = field === 'password_confirmation';

        return (
            <div>
                <label className="block text-sm font-medium text-neutral-700">{label}</label>
                <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        {isConfirm ? (
                            <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        ) : (
                            <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                            </svg>
                        )}
                    </div>
                    <input
                        type={show ? 'text' : 'password'}
                        required={required}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={cn(
                            inputClass(field, 'pl-10 pr-10'),
                            isConfirm && matchError && 'border-danger ring-danger/20',
                        )}
                        placeholder={placeholder}
                    />
                    <button
                        type="button"
                        onClick={onToggle}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                        tabIndex={-1}
                    >
                        {show ? (
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
                </div>
                {isConfirm && matchError && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-danger">
                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <span>Konfirmasi password tidak cocok.</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {errors._general && (
                <div className="flex items-center gap-2.5 rounded-xl border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
                    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <span>{errors._general[0]}</span>
                </div>
            )}

            {/* Personal Information */}
            <div>
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Informasi Pribadi</h3>
                        <p className="text-xs text-neutral-500">Data dasar pengguna.</p>
                    </div>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        {renderField('Nama Lengkap', 'name', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className={inputClass('name', 'pl-10')}
                                    placeholder="Nama lengkap user"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="sm:col-span-2">
                        {renderField('Alamat Email', 'email', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className={inputClass('email', 'pl-10')}
                                    placeholder="user@example.com"
                                />
                            </div>
                        ), 'Email digunakan untuk login dan notifikasi.')}
                    </div>
                </div>
            </div>

            {/* Security */}
            <div>
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning-light text-warning">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Keamanan</h3>
                        <p className="text-xs text-neutral-500">
                            {user ? 'Kosongkan jika tidak ingin mengganti password.' : 'Buat password yang kuat untuk akun.'}
                        </p>
                    </div>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        {renderPasswordField(
                            'Password',
                            'password',
                            pw,
                            (v) => setForm({ ...form, password: v }),
                            showPassword,
                            () => setShowPassword(!showPassword),
                            user ? 'Kosongkan jika tidak diganti' : 'Minimal 8 karakter',
                            !user,
                        )}
                    </div>

                    {pw && (
                        <div className="sm:col-span-2">
                            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-xs font-medium text-neutral-500">Kekuatan password</span>
                                    {strength.label && (
                                        <span className={cn(
                                            'text-xs font-semibold',
                                            strength.color.replace('bg-', 'text-'),
                                        )}>
                                            {strength.label}
                                        </span>
                                    )}
                                </div>
                                <div className="mb-3 h-2 overflow-hidden rounded-full bg-neutral-200">
                                    <div
                                        className={cn('h-full rounded-full transition-all duration-500 ease-out', strength.color)}
                                        style={{ width: strength.width }}
                                    />
                                </div>
                                <div className="grid gap-1.5 sm:grid-cols-2">
                                    {checks.map((check) => {
                                        const passed = check.test(pw);

                                        return (
                                            <div key={check.key} className="flex items-center gap-2 text-xs">
                                                <div className={cn(
                                                    'flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all duration-300',
                                                    passed
                                                        ? 'bg-success text-white'
                                                        : 'bg-neutral-200 text-neutral-400',
                                                )}>
                                                    {passed ? (
                                                        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className={cn(
                                                    'transition-colors duration-300',
                                                    passed ? 'text-neutral-700' : 'text-neutral-400',
                                                )}>
                                                    {check.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {pw && (
                        <div className="sm:col-span-2">
                            {renderPasswordField(
                                'Konfirmasi Password',
                                'password_confirmation',
                                form.password_confirmation ?? '',
                                (v) => setForm({ ...form, password_confirmation: v }),
                                showConfirm,
                                () => setShowConfirm(!showConfirm),
                                'Ulangi password yang sama',
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Access */}
            {auth.user.is_admin && (
                <div>
                    <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-900">Hak Akses</h3>
                            <p className="text-xs text-neutral-500">Tentukan level akses user ke panel admin.</p>
                        </div>
                    </div>
                    <div className="mt-5">
                        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md">
                            <div className="flex items-start gap-3.5">
                                <div className={cn(
                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300',
                                    form.is_admin
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'bg-neutral-100 text-neutral-400',
                                )}>
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-900">Admin</p>
                                    <p className="mt-0.5 text-xs text-neutral-500">
                                        {form.is_admin
                                            ? 'User ini memiliki akses penuh ke panel admin.'
                                            : 'User ini hanya memiliki akses terbatas.'}
                                    </p>
                                </div>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    checked={form.is_admin ?? false}
                                    onChange={(e) => setForm({ ...form, is_admin: e.target.checked })}
                                    className="peer sr-only"
                                />
                                <div className="h-6 w-10 rounded-full border border-neutral-300 bg-neutral-200 transition-all peer-checked:border-primary peer-checked:bg-primary" />
                                <div className={cn(
                                    'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
                                    form.is_admin ? 'translate-x-4' : 'translate-x-0',
                                )} />
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 border-t border-neutral-200 pt-6">
                <Link
                    href="/admin/users"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Kembali
                </Link>
                <div className="flex items-center gap-3">
                    <Link href="/admin/users">
                        <Button type="button" variant="secondary">
                            Batal
                        </Button>
                    </Link>
                    <Button type="submit" disabled={saving} className="min-w-[120px]">
                        {saving ? (
                            <span className="inline-flex items-center gap-2">
                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                {user ? 'Menyimpan...' : 'Menambahkan...'}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2">
                                {user ? (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        Simpan
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        Tambah
                                    </>
                                )}
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}
