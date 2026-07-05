import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import Button from '@/atoms/Button';
import type { CustomerMembershipPlan, CustomerMembershipPlanFormData } from '@/features/crm/types';
import { cn } from '@/lib/utils';

interface MembershipPlanFormProps {
    plan?: CustomerMembershipPlan | null;
    saving: boolean;
    errors: Record<string, string[]>;
    onSave: (data: CustomerMembershipPlanFormData) => void;
    onCancel?: () => void;
}

export default function MembershipPlanForm({ plan, saving, errors = {}, onSave, onCancel }: MembershipPlanFormProps) {
    const [form, setForm] = useState<CustomerMembershipPlanFormData>({
        name: '',
        description: '',
        price: 0,
        billing_interval: 'monthly',
        duration_months: 1,
        benefits: [],
        is_active: true,
        sort_order: 0,
    });
    const [benefitInput, setBenefitInput] = useState('');

    useEffect(() => {
        if (plan) {
            setForm({
                name: plan.name,
                description: plan.description ?? '',
                price: plan.price,
                billing_interval: plan.billing_interval,
                duration_months: plan.duration_months,
                benefits: plan.benefits ?? [],
                is_active: plan.is_active,
                sort_order: plan.sort_order,
            });
        } else {
            setForm({ name: '', description: '', price: 0, billing_interval: 'monthly', duration_months: 1, benefits: [], is_active: true, sort_order: 0 });
        }
    }, [plan]);

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            duration_months: prev.billing_interval === 'yearly' ? 12 : 1,
        }));
    }, [form.billing_interval]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        onSave({ ...form, benefits: form.benefits?.filter((b) => b.trim()) });
    }

    function addBenefit() {
        const val = benefitInput.trim();

        if (!val) return;

        setForm({ ...form, benefits: [...(form.benefits ?? []), val] });
        setBenefitInput('');
    }

    function removeBenefit(index: number) {
        setForm({ ...form, benefits: form.benefits?.filter((_, i) => i !== index) });
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

            {/* Informasi Plan */}
            <div>
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Informasi Paket</h3>
                        <p className="text-xs text-neutral-500">Buat atau edit paket membership customer.</p>
                    </div>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        {renderField('Nama Paket', 'name', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className={inputClass('name', 'pl-10')}
                                    placeholder="Gold Monthly"
                                />
                            </div>
                        ), undefined, true)}
                    </div>
                    <div className="sm:col-span-2">
                        {renderField('Deskripsi', 'description', (
                            <textarea
                                value={form.description ?? ''}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className={inputClass('description')}
                                rows={3}
                                placeholder="Deskripsi paket membership..."
                            />
                        ))}
                    </div>
                    <div>
                        {renderField('Harga', 'price', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <span className="text-sm text-neutral-400">Rp</span>
                                </div>
                                <input
                                    type="number"
                                    min={0}
                                    step={1000}
                                    required
                                    value={form.price ?? 0}
                                    onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                                    className={inputClass('price', 'pl-10')}
                                />
                            </div>
                        ), undefined, true)}
                    </div>
                    <div>
                        {renderField('Interval', 'billing_interval', (
                            <div className="relative">
                                <select
                                    value={form.billing_interval}
                                    onChange={(e) => setForm({ ...form, billing_interval: e.target.value as 'monthly' | 'yearly' })}
                                    className={inputClass('billing_interval', 'appearance-none')}
                                >
                                    <option value="monthly">Bulanan</option>
                                    <option value="yearly">Tahunan</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </div>
                            </div>
                        ), 'Durasi otomatis: 1 bulan (bulanan) / 12 bulan (tahunan)')}
                    </div>
                    <div>
                        {renderField('Urutan', 'sort_order', (
                            <input
                                type="number"
                                min={0}
                                value={form.sort_order ?? 0}
                                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                                className={inputClass('sort_order')}
                            />
                        ), 'Semakin kecil semakin prioritas')}
                    </div>
                    <div className="sm:col-span-2">
                        {renderField('Keuntungan', 'benefits', (
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={benefitInput}
                                        onChange={(e) => setBenefitInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBenefit(); } }}
                                        className={inputClass('benefits', 'flex-1')}
                                        placeholder="Contoh: Diskon 15% semua layanan"
                                    />
                                    <Button type="button" variant="secondary" size="sm" onClick={addBenefit} disabled={!benefitInput.trim()}>
                                        Tambah
                                    </Button>
                                </div>
                                {form.benefits && form.benefits.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {form.benefits.map((benefit, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary"
                                            >
                                                {benefit}
                                                <button
                                                    type="button"
                                                    onClick={() => removeBenefit(index)}
                                                    className="inline-flex rounded-full p-0.5 transition-colors hover:bg-primary/10"
                                                >
                                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
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
                        <p className="text-xs text-neutral-500">Tentukan status paket.</p>
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
                                    {form.is_active ? 'Paket ini aktif dan bisa dibeli.' : 'Paket ini tidak aktif.'}
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

            {/* Action Bar */}
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
                            {plan ? 'Menyimpan...' : 'Menambahkan...'}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2">
                            {plan ? (
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
