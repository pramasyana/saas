import { usePage } from '@inertiajs/react';
import { type FormEvent, useEffect, useState } from 'react';
import Button from '@/atoms/Button';
import type { User, UserFormData } from '@/features/users/types';
import { cn } from '@/lib/utils';

interface UserFormModalProps {
    open: boolean;
    user: User | null;
    saving: boolean;
    errors?: Record<string, string[]>;
    onClose: () => void;
    onSave: (data: UserFormData) => void;
}

export default function UserFormModal({ open, user, saving, errors = {}, onClose, onSave }: UserFormModalProps) {
    const { auth } = usePage().props as { auth: { user: { is_admin: boolean } } };
    const [form, setForm] = useState<UserFormData>({
        name: '',
        email: '',
        password: '',
        is_admin: false,
    });

    useEffect(() => {
        if (user) {
            setForm({ name: user.name, email: user.email, password: '', is_admin: user.is_admin });
        } else {
            setForm({ name: '', email: '', password: '', is_admin: false });
        }
    }, [user, open]);

    if (!open) return null;

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const payload = { ...form };
        if (user && !payload.password) {
            delete payload.password;
        }
        onSave(payload);
    }

    function renderField(label: string, field: string, children: React.ReactNode) {
        const fieldErrors = errors[field];
        return (
            <div>
                <label className="block text-sm font-medium text-neutral-700">{label}</label>
                {children}
                {fieldErrors && (
                    <p className="mt-1 text-xs text-danger">{fieldErrors[0]}</p>
                )}
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/30" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        {user ? 'Edit User' : 'Tambah User'}
                    </h2>
                    <button onClick={onClose} className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
                    {errors._general && (
                        <div className="rounded-lg bg-danger-light px-4 py-3 text-sm text-danger">
                            {errors._general[0]}
                        </div>
                    )}

                    {renderField('Nama', 'name', (
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className={cn(
                                'mt-1 block w-full rounded-lg border px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm focus:outline-none focus:ring-1',
                                errors.name
                                    ? 'border-danger focus:border-danger focus:ring-danger'
                                    : 'border-neutral-300 focus:border-primary focus:ring-primary',
                            )}
                            placeholder="Nama lengkap"
                        />
                    ))}

                    {renderField('Email', 'email', (
                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className={cn(
                                'mt-1 block w-full rounded-lg border px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm focus:outline-none focus:ring-1',
                                errors.email
                                    ? 'border-danger focus:border-danger focus:ring-danger'
                                    : 'border-neutral-300 focus:border-primary focus:ring-primary',
                            )}
                            placeholder="email@example.com"
                        />
                    ))}

                    {renderField('Password' + (user ? ' (kosongkan jika tidak diganti)' : ''), 'password', (
                        <input
                            type="password"
                            required={!user}
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className={cn(
                                'mt-1 block w-full rounded-lg border px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm focus:outline-none focus:ring-1',
                                errors.password
                                    ? 'border-danger focus:border-danger focus:ring-danger'
                                    : 'border-neutral-300 focus:border-primary focus:ring-primary',
                            )}
                            placeholder="Minimal 8 karakter"
                        />
                    ))}

                    {auth.user.is_admin && (
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_admin"
                                checked={form.is_admin ?? false}
                                onChange={(e) => setForm({ ...form, is_admin: e.target.checked })}
                                className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="is_admin" className="text-sm font-medium text-neutral-700">
                                Admin
                            </label>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 border-t border-neutral-200 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Menyimpan...' : user ? 'Simpan' : 'Tambah'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
