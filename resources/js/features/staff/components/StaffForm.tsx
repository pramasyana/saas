import type { FormEvent} from 'react';
import { useEffect, useState } from 'react';
import Button from '@/atoms/Button';
import Select from '@/atoms/Select';
import type { Staff, StaffFormData } from '@/features/staff/types';
import { cn } from '@/lib/utils';

interface StaffFormProps {
    staff?: Staff | null;
    branches: { value: string; label: string }[];
    saving: boolean;
    errors: Record<string, string[]>;
    onSave: (data: StaffFormData) => void;
    onCancel?: () => void;
}

export default function StaffForm({ staff, branches, saving, errors = {}, onSave, onCancel }: StaffFormProps) {
    const [form, setForm] = useState<StaffFormData>({
        name: '',
        email: '',
        phone: '',
        position: '',
        branch_id: '',
        hire_date: '',
        is_active: true,
    });

    useEffect(() => {
        if (staff) {
            setForm({
                name: staff.name,
                email: staff.email || '',
                phone: staff.phone || '',
                position: staff.position || '',
                branch_id: staff.branch_id || '__default__',
                hire_date: staff.hire_date || '',
                is_active: staff.is_active,
            });
        } else {
            setForm({ name: '', email: '', phone: '', position: '', branch_id: '', hire_date: '', is_active: true });
        }
    }, [staff]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        onSave({ ...form, branch_id: form.branch_id === '__default__' ? '' : form.branch_id });
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
        required?: boolean,
    ) {
        const fieldErrors = errors[field];

        return (
            <div>
                <label className="block text-sm font-medium text-neutral-700">
                    {label}
                    {required && <span className="ml-0.5 text-danger">*</span>}
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

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {errors._general && (
                <div className="flex items-center gap-2.5 rounded-xl border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
                    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <span>{errors._general.join(', ')}</span>
                </div>
            )}

            <div>
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Informasi Pribadi</h3>
                        <p className="text-xs text-neutral-500">Data dasar staff.</p>
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
                                    placeholder="Nama lengkap"
                                />
                            </div>
                        ), undefined, true)}
                    </div>
                    <div>
                        {renderField('Email', 'email', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    value={form.email || ''}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className={inputClass('email', 'pl-10')}
                                    placeholder="email@example.com"
                                />
                            </div>
                        ))}
                    </div>
                    <div>
                        {renderField('Telepon', 'phone', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={form.phone || ''}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className={inputClass('phone', 'pl-10')}
                                    placeholder="0812xxxx"
                                />
                            </div>
                        ))}
                    </div>
                    <div>
                        {renderField('Jabatan', 'position', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={form.position || ''}
                                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                                    className={inputClass('position', 'pl-10')}
                                    placeholder="Staff"
                                />
                            </div>
                        ))}
                    </div>
                    <div>
                        {renderField('Cabang', 'branch_id', (
                            <Select
                                value={form.branch_id || ''}
                                onChange={(v) => setForm((prev) => ({ ...prev, branch_id: v }))}
                                options={branches}
                                placeholder="Pilih Cabang"
                                error={!!errors.branch_id}
                            />
                        ))}
                    </div>
                    <div>
                        {renderField('Tanggal Masuk', 'hire_date', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                    </svg>
                                </div>
                                <input
                                    type="date"
                                    value={form.hire_date || ''}
                                    onChange={(e) => setForm({ ...form, hire_date: e.target.value })}
                                    className={inputClass('hire_date', 'pl-10')}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Status</h3>
                        <p className="text-xs text-neutral-500">Tentukan status staff.</p>
                    </div>
                </div>
                <div className="mt-5">
                    <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md">
                        <div className="flex items-start gap-3.5">
                            <div className={cn(
                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300',
                                form.is_active ? 'bg-success text-white shadow-sm' : 'bg-neutral-100 text-neutral-400',
                            )}>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-900">Aktif</p>
                                <p className="mt-0.5 text-xs text-neutral-500">
                                    {form.is_active ? 'Staff ini aktif.' : 'Staff ini tidak aktif.'}
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={form.is_active ?? true}
                                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                className="peer sr-only"
                            />
                            <div className="h-6 w-10 rounded-full border border-neutral-300 bg-neutral-200 transition-all peer-checked:border-success peer-checked:bg-success" />
                            <div className={cn(
                                'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
                                form.is_active ? 'translate-x-4' : 'translate-x-0',
                            )} />
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-neutral-200 pt-6">
                {onCancel && <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
                    Batal
                </Button>}
                <Button type="submit" disabled={saving} className="min-w-[120px]">
                    {saving ? (
                        <span className="inline-flex items-center gap-2">
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            {staff ? 'Menyimpan...' : 'Menambahkan...'}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2">
                            {staff ? (
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
        </form>
    );
}
