import {  useEffect, useState } from 'react';
import type {FormEvent} from 'react';
import Button from '@/atoms/Button';
import Select from '@/atoms/Select';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import type { Holiday, HolidayFormData, Branch } from '@/features/company/types';
import { cn } from '@/lib/utils';

interface HolidayFormProps {
    holiday: Holiday | null;
    saving: boolean;
    errors?: Record<string, string[]>;
    onSave: (data: HolidayFormData) => void;
}

export default function HolidayForm({ holiday, saving, errors = {}, onSave }: HolidayFormProps) {
    const [form, setForm] = useState<HolidayFormData>({
        name: '',
        date_start: '',
        date_end: '',
        is_recurring_yearly: false,
        description: '',
        branch_id: '',
    });

    const { data: branchesData } = useAllBranches();
    const branches: Branch[] = branchesData?.data ?? [];

    useEffect(() => {
        if (holiday) {
            setForm({
                name: holiday.name,
                date_start: holiday.date_start,
                date_end: holiday.date_end,
                is_recurring_yearly: holiday.is_recurring_yearly,
                description: holiday.description ?? '',
                branch_id: holiday.branch_id ?? '',
            });
        } else {
            setForm({
                name: '',
                date_start: '',
                date_end: '',
                is_recurring_yearly: false,
                description: '',
                branch_id: '',
            });
        }
    }, [holiday]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const payload = { ...form };

        if (!payload.description) {
delete payload.description;
}

        if (!payload.branch_id) {
delete payload.branch_id;
}

        if (!payload.is_recurring_yearly) {
payload.is_recurring_yearly = false;
}

        onSave(payload);
    }

    function setField<K extends keyof HolidayFormData>(key: K, value: HolidayFormData[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
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

    const branchOptions = [
        { value: '', label: 'Semua Cabang' },
        ...branches.map((b) => ({ value: b.id, label: b.name })),
    ];

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
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">
                            {holiday ? 'Edit Hari Libur' : 'Informasi Hari Libur'}
                        </h3>
                        <p className="text-xs text-neutral-500">
                            {holiday ? 'Perbarui data hari libur.' : 'Data hari libur baru.'}
                        </p>
                    </div>
                </div>
                <div className="mt-5 space-y-5">
                    {renderField('Nama Hari Libur', 'name', (
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                <svg className="h-4.5 w-4.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setField('name', e.target.value)}
                                className={inputClass('name', 'pl-10')}
                                placeholder="Nama hari libur"
                            />
                        </div>
                    ))}
                    <div className="grid gap-5 sm:grid-cols-2">
                        {renderField('Tanggal Mulai', 'date_start', (
                            <input
                                type="date"
                                required
                                value={form.date_start}
                                onChange={(e) => setField('date_start', e.target.value)}
                                className={inputClass('date_start')}
                            />
                        ))}
                        {renderField('Tanggal Selesai', 'date_end', (
                            <input
                                type="date"
                                required
                                value={form.date_end}
                                onChange={(e) => setField('date_end', e.target.value)}
                                className={inputClass('date_end')}
                            />
                        ))}
                    </div>
                    {renderFieldOptional('Deskripsi', 'description', (
                        <textarea
                            value={form.description ?? ''}
                            onChange={(e) => setField('description', e.target.value)}
                            className={inputClass('description', 'min-h-[80px]')}
                            placeholder="Deskripsi hari libur"
                            rows={3}
                        />
                    ))}
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">
                                Berulang Tahunan
                            </label>
                            <div className="mt-3 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setField('is_recurring_yearly', !form.is_recurring_yearly)}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 ${
                                        form.is_recurring_yearly ? 'bg-primary' : 'bg-neutral-300'
                                    }`}
                                >
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                                        form.is_recurring_yearly ? 'translate-x-5' : 'translate-x-0'
                                    }`} />
                                </button>
                                <span className="text-sm text-neutral-600">
                                    {form.is_recurring_yearly ? 'Ya' : 'Tidak'}
                                </span>
                            </div>
                            <p className="mt-1.5 text-xs text-neutral-400">
                                Jika diaktifkan, hari libur ini akan berulang setiap tahun.
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Cabang</label>
                            <div className="mt-1.5">
                                <Select
                                    value={form.branch_id ?? ''}
                                    onChange={(v) => setField('branch_id', v)}
                                    options={branchOptions}
                                    placeholder="Semua Cabang"
                                />
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
                            {holiday ? 'Simpan' : 'Tambah'}
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
}
