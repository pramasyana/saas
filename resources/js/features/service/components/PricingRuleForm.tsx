import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Button from '@/atoms/Button';
import type { PricingRule, PricingRuleFormData, PricingRuleConditions } from '../types';
import { cn } from '@/lib/utils';

interface PricingRuleFormProps {
    pricingRule: PricingRule | null;
    saving: boolean;
    errors?: Record<string, string[]>;
    onSave: (data: PricingRuleFormData) => void;
}

const actionTypes = [
    { value: 'percentage_discount', label: 'Persentase Diskon (%)' },
    { value: 'fixed_discount', label: 'Diskon Tetap (Rp)' },
    { value: 'percentage_surcharge', label: 'Persentase Tambahan (%)' },
    { value: 'fixed_surcharge', label: 'Tambahan Tetap (Rp)' },
    { value: 'price_override', label: 'Override Harga (Rp)' },
];

const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function PricingRuleForm({ pricingRule, saving, errors = {}, onSave }: PricingRuleFormProps) {
    const defaultConditions: PricingRuleConditions = {
        apply_to: ['service'],
        category_ids: [],
        service_ids: [],
        package_ids: [],
        addon_ids: [],
        branch_ids: [],
        staff_ids: [],
        days_of_week: [],
        time_start: '',
        time_end: '',
        min_price: undefined,
        max_price: undefined,
    };

    const [form, setForm] = useState<PricingRuleFormData>({
        name: '',
        description: '',
        action_type: 'percentage_discount',
        value: 0,
        conditions: defaultConditions,
        priority: 0,
        is_active: true,
        start_date: '',
        end_date: '',
    });

    useEffect(() => {
        if (pricingRule) {
            setForm({
                name: pricingRule.name,
                description: pricingRule.description || '',
                action_type: pricingRule.action_type,
                value: pricingRule.value,
                conditions: pricingRule.conditions || defaultConditions,
                priority: pricingRule.priority,
                is_active: pricingRule.is_active,
                start_date: pricingRule.start_date || '',
                end_date: pricingRule.end_date || '',
            });
        } else {
            setForm({
                name: '',
                description: '',
                action_type: 'percentage_discount',
                value: 0,
                conditions: defaultConditions,
                priority: 0,
                is_active: true,
                start_date: '',
                end_date: '',
            });
        }
    }, [pricingRule]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const cleaned: PricingRuleFormData = {
            ...form,
            conditions: {
                ...form.conditions,
                days_of_week: form.conditions.days_of_week?.length ? form.conditions.days_of_week : undefined,
                time_start: form.conditions.time_start || undefined,
                time_end: form.conditions.time_end || undefined,
                min_price: form.conditions.min_price || undefined,
                max_price: form.conditions.max_price || undefined,
                category_ids: form.conditions.category_ids?.length ? form.conditions.category_ids : undefined,
                service_ids: form.conditions.service_ids?.length ? form.conditions.service_ids : undefined,
                branch_ids: form.conditions.branch_ids?.length ? form.conditions.branch_ids : undefined,
                staff_ids: form.conditions.staff_ids?.length ? form.conditions.staff_ids : undefined,
            },
            start_date: form.start_date || undefined,
            end_date: form.end_date || undefined,
        };
        onSave(cleaned);
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

    function toggleDay(day: number) {
        const current = form.conditions.days_of_week || [];
        setForm({
            ...form,
            conditions: {
                ...form.conditions,
                days_of_week: current.includes(day) ? current.filter((d) => d !== day) : [...current, day],
            },
        });
    }

    function toggleApplyTo(value: string) {
        const current = form.conditions.apply_to || [];
        const next = current.includes(value as 'service' | 'package' | 'addon')
            ? current.filter((v) => v !== value)
            : [...current, value as 'service' | 'package' | 'addon'];
        setForm({
            ...form,
            conditions: { ...form.conditions, apply_to: next.length ? next : undefined },
        });
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

            {/* Basic Information */}
            <div>
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Informasi Aturan</h3>
                        <p className="text-xs text-neutral-500">Nama dan deskripsi aturan harga.</p>
                    </div>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        {renderField('Nama Aturan', 'name', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className={inputClass('name', 'pl-10')}
                                    placeholder="Contoh: Diskon Weekday Pagi"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="sm:col-span-2">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Deskripsi</label>
                            <div className="relative mt-1.5">
                                <textarea
                                    value={form.description || ''}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={2}
                                    className={inputClass('description')}
                                    placeholder="Deskripsi aturan (opsional)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action */}
            <div>
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-light text-success">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Aksi</h3>
                        <p className="text-xs text-neutral-500">Apa yang dilakukan aturan ini terhadap harga.</p>
                    </div>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                        {renderField('Tipe Aksi', 'action_type', (
                            <select
                                value={form.action_type}
                                onChange={(e) => setForm({ ...form, action_type: e.target.value })}
                                className={inputClass('action_type')}
                            >
                                {actionTypes.map((at) => (
                                    <option key={at.value} value={at.value}>{at.label}</option>
                                ))}
                            </select>
                        ))}
                    </div>
                    <div>
                        {renderField('Nilai', 'value', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <span className="text-sm text-neutral-400">
                                        {form.action_type.includes('percentage') ? '%' : 'Rp'}
                                    </span>
                                </div>
                                <input
                                    type="number"
                                    required
                                    value={form.value}
                                    onChange={(e) => setForm({ ...form, value: parseInt(e.target.value) || 0 })}
                                    min={0}
                                    className={inputClass('value', 'pl-10')}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Conditions - Apply To */}
            <div>
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning-light text-warning">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Kondisi — Target</h3>
                        <p className="text-xs text-neutral-500">Jenis item yang terkena aturan ini.</p>
                    </div>
                </div>
                <div className="mt-5">
                    <div className="flex flex-wrap gap-2">
                        {(['service', 'package', 'addon'] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => toggleApplyTo(t)}
                                className={cn(
                                    'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                                    (form.conditions.apply_to || []).includes(t)
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50',
                                )}
                            >
                                {t === 'service' ? 'Layanan' : t === 'package' ? 'Paket' : 'Add-on'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Conditions - Time */}
            <div>
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Kondisi — Waktu</h3>
                        <p className="text-xs text-neutral-500">Hari dan jam berlakunya aturan.</p>
                    </div>
                </div>
                <div className="mt-5 space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-700">Hari</label>
                        <div className="flex flex-wrap gap-1.5">
                            {dayNames.map((name, i) => {
                                const dayNum = i + 1;
                                const active = (form.conditions.days_of_week || []).includes(dayNum);
                                return (
                                    <button
                                        key={dayNum}
                                        type="button"
                                        onClick={() => toggleDay(dayNum)}
                                        className={cn(
                                            'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                                            active
                                                ? 'bg-primary text-white shadow-sm'
                                                : 'border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50',
                                        )}
                                    >
                                        {name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Jam Mulai</label>
                            <input
                                type="time"
                                value={form.conditions.time_start || ''}
                                onChange={(e) => setForm({ ...form, conditions: { ...form.conditions, time_start: e.target.value } })}
                                className={inputClass('conditions.time_start')}
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Jam Selesai</label>
                            <input
                                type="time"
                                value={form.conditions.time_end || ''}
                                onChange={(e) => setForm({ ...form, conditions: { ...form.conditions, time_end: e.target.value } })}
                                className={inputClass('conditions.time_end')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Conditions - Price Range */}
            <div>
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-light text-success">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Kondisi — Harga</h3>
                        <p className="text-xs text-neutral-500">Rentang harga item yang terkena aturan.</p>
                    </div>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">Harga Minimal</label>
                        <input
                            type="number"
                            value={form.conditions.min_price ?? ''}
                            onChange={(e) => setForm({ ...form, conditions: { ...form.conditions, min_price: e.target.value ? parseInt(e.target.value) : undefined } })}
                            min={0}
                            className={inputClass('conditions.min_price')}
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">Harga Maksimal</label>
                        <input
                            type="number"
                            value={form.conditions.max_price ?? ''}
                            onChange={(e) => setForm({ ...form, conditions: { ...form.conditions, max_price: e.target.value ? parseInt(e.target.value) : undefined } })}
                            min={0}
                            className={inputClass('conditions.max_price')}
                            placeholder="999999"
                        />
                    </div>
                </div>
            </div>

            {/* Schedule & Priority */}
            <div>
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Jadwal & Prioritas</h3>
                        <p className="text-xs text-neutral-500">Prioritas dan masa berlaku aturan.</p>
                    </div>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-3">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">Prioritas</label>
                        <input
                            type="number"
                            value={form.priority ?? 0}
                            onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })}
                            min={0}
                            max={9999}
                            className={inputClass('priority')}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">Tanggal Mulai</label>
                        <input
                            type="date"
                            value={form.start_date || ''}
                            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                            className={inputClass('start_date')}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">Tanggal Selesai</label>
                        <input
                            type="date"
                            value={form.end_date || ''}
                            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                            className={inputClass('end_date')}
                        />
                    </div>
                </div>
            </div>

            {/* Status */}
            <div>
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Status</h3>
                        <p className="text-xs text-neutral-500">Aktif atau nonaktifkan aturan.</p>
                    </div>
                </div>
                <div className="mt-5">
                    <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md">
                        <div className="flex items-start gap-3.5">
                            <div className={cn(
                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300',
                                form.is_active
                                    ? 'bg-success text-white shadow-sm'
                                    : 'bg-neutral-100 text-neutral-400',
                            )}>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-900">Aturan Aktif</p>
                                <p className="mt-0.5 text-xs text-neutral-500">
                                    {form.is_active
                                        ? 'Aturan ini aktif dan akan diterapkan pada transaksi.'
                                        : 'Aturan ini tidak aktif dan tidak akan diterapkan.'}
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

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 border-t border-neutral-200 pt-6">
                <Link
                    href="/service/pricing-rules"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Kembali
                </Link>
                <div className="flex items-center gap-3">
                    <Link href="/service/pricing-rules">
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
                                {pricingRule ? 'Menyimpan...' : 'Menambahkan...'}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2">
                                {pricingRule ? (
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
