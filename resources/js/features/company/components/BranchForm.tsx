import {  useEffect, useState } from 'react';
import type {FormEvent} from 'react';
import Button from '@/atoms/Button';
import type { Branch, BranchFormData } from '@/features/company/types';
import { cn } from '@/lib/utils';

interface BranchFormProps {
    branch: Branch | null;
    saving: boolean;
    errors?: Record<string, string[]>;
    onSave: (data: BranchFormData) => void;
}

export default function BranchForm({ branch, saving, errors = {}, onSave }: BranchFormProps) {
    const [form, setForm] = useState<BranchFormData>({
        name: '',
        slug: '',
        address: '',
        phone: '',
        email: '',
        manager_name: '',
        is_active: true,
        sort_order: 0,
    });

    useEffect(() => {
        if (branch) {
            setForm({
                name: branch.name,
                slug: branch.slug,
                address: branch.address ?? '',
                phone: branch.phone ?? '',
                email: branch.email ?? '',
                manager_name: branch.manager_name ?? '',
                is_active: branch.is_active,
                sort_order: branch.sort_order,
            });
        } else {
            setForm({
                name: '',
                slug: '',
                address: '',
                phone: '',
                email: '',
                manager_name: '',
                is_active: true,
                sort_order: 0,
            });
        }
    }, [branch]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const payload = { ...form };

        if (!payload.address) {
delete payload.address;
}

        if (!payload.phone) {
delete payload.phone;
}

        if (!payload.email) {
delete payload.email;
}

        if (!payload.manager_name) {
delete payload.manager_name;
}

        onSave(payload);
    }

    function setField<K extends keyof BranchFormData>(key: K, value: BranchFormData[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function handleNameChange(name: string) {
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setForm((prev) => ({ ...prev, name, slug }));
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
                    <span className="ml-0.5 text-danger">*</span>
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

    function renderFieldOptional(
        label: string,
        field: string,
        children: React.ReactNode,
        hint?: string,
    ) {
        const fieldErrors = errors[field];

        return (
            <div>
                <label className="block text-sm font-medium text-neutral-700">{label}</label>
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
                    <span>{errors._general[0]}</span>
                </div>
            )}

            <div>
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">
                            {branch ? 'Edit Cabang' : 'Informasi Cabang'}
                        </h3>
                        <p className="text-xs text-neutral-500">
                            {branch ? 'Perbarui data cabang.' : 'Data cabang baru.'}
                        </p>
                    </div>
                </div>
                <div className="mt-5 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        {renderField('Nama Cabang', 'name', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <svg className="h-4.5 w-4.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    className={inputClass('name', 'pl-10')}
                                    placeholder="Nama cabang"
                                />
                            </div>
                        ))}
                        {renderField('Slug', 'slug', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <svg className="h-4.5 w-4.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={form.slug}
                                    onChange={(e) => setField('slug', e.target.value)}
                                    className={inputClass('slug', 'pl-10')}
                                    placeholder="nama-cabang"
                                />
                            </div>
                        ))}
                    </div>
                    {renderFieldOptional('Alamat', 'address', (
                        <div className="relative">
                            <div className="pointer-events-none absolute top-3 left-0 flex items-start pl-3.5 pt-0.5">
                                <svg className="h-4.5 w-4.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                            </div>
                            <textarea
                                value={form.address ?? ''}
                                onChange={(e) => setField('address', e.target.value)}
                                className={inputClass('address', 'pl-10 min-h-[80px]')}
                                placeholder="Alamat lengkap cabang"
                                rows={3}
                            />
                        </div>
                    ))}
                    <div className="grid gap-5 sm:grid-cols-2">
                        {renderFieldOptional('No. Telepon', 'phone', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <svg className="h-4.5 w-4.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={form.phone ?? ''}
                                    onChange={(e) => setField('phone', e.target.value)}
                                    className={inputClass('phone', 'pl-10')}
                                    placeholder="+62 xxx xxxx"
                                />
                            </div>
                        ))}
                        {renderFieldOptional('Email', 'email', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <svg className="h-4.5 w-4.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    value={form.email ?? ''}
                                    onChange={(e) => setField('email', e.target.value)}
                                    className={inputClass('email', 'pl-10')}
                                    placeholder="cabang@example.com"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        {renderFieldOptional('No. WhatsApp', 'whatsapp', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <svg className="h-4.5 w-4.5 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={form.whatsapp ?? ''}
                                    onChange={(e) => setField('whatsapp', e.target.value)}
                                    className={inputClass('whatsapp', 'pl-10')}
                                    placeholder="6281234567890"
                                />
                            </div>
                        ))}
                        {renderFieldOptional('Nama Manajer', 'manager_name', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <svg className="h-4.5 w-4.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={form.manager_name ?? ''}
                                    onChange={(e) => setField('manager_name', e.target.value)}
                                    className={inputClass('manager_name', 'pl-10')}
                                    placeholder="Nama manajer cabang"
                                />
                            </div>
                        ))}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Aktif</label>
                            <div className="mt-3 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setField('is_active', !form.is_active)}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 ${
                                        form.is_active ? 'bg-primary' : 'bg-neutral-300'
                                    }`}
                                >
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                                        form.is_active ? 'translate-x-5' : 'translate-x-0'
                                    }`} />
                                </button>
                                <span className="text-sm text-neutral-600">
                                    {form.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-6">
                <Button type="submit" disabled={saving} className="min-w-[120px]">
                    {saving ? (
                        <span className="inline-flex items-center gap-2">
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Menyimpan...
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            {branch ? 'Simpan' : 'Tambah'}
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
}
