import { Link } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Button from '@/atoms/Button';
import { cn } from '@/lib/utils';
import { useAllCategories } from '../hooks/useCategories';
import type { ServiceItem, ServiceFormData } from '../types';

interface ServiceFormProps {
    service: ServiceItem | null;
    saving: boolean;
    errors?: Record<string, string[]>;
    onSave: (data: ServiceFormData) => void;
}

const colorOptions = [
    { value: '#3B82F6', label: 'Biru' },
    { value: '#10B981', label: 'Hijau' },
    { value: '#F59E0B', label: 'Kuning' },
    { value: '#EF4444', label: 'Merah' },
    { value: '#8B5CF6', label: 'Ungu' },
    { value: '#EC4899', label: 'Pink' },
    { value: '#06B6D4', label: 'Cyan' },
    { value: '#84CC16', label: 'Lime' },
    { value: '#F97316', label: 'Oranye' },
    { value: '#6B7280', label: 'Abu-abu' },
];

export default function ServiceForm({ service, saving, errors = {}, onSave }: ServiceFormProps) {
    const { data: categoriesData } = useAllCategories();
    const categories = categoriesData?.data ?? [];

    const [form, setForm] = useState<ServiceFormData>({
        branch_id: service?.branch_id ?? '',
        category_id: service?.category_id ?? '',
        name: service?.name ?? '',
        description: service?.description ?? '',
        duration: service?.duration ?? 60,
        price: service?.price ?? 0,
        color: service?.color ?? '',
        is_active: service?.is_active ?? true,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        onSave({
            ...form,
            category_id: form.category_id || undefined,
            color: form.color || undefined,
        });
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
        required?: boolean,
        hint?: string,
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
                    <span>{errors._general[0]}</span>
                </div>
            )}

            {/* Informasi Layanan */}
            <div>
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Informasi Layanan</h3>
                        <p className="text-xs text-neutral-500">Detail layanan jasa yang ditawarkan.</p>
                    </div>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        {renderField('Nama Layanan', 'name', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className={inputClass('name', 'pl-10')}
                                    placeholder="Nama layanan"
                                />
                            </div>
                        ), true)}
                    </div>
                    <div className="sm:col-span-2">
                        {renderField('Kategori', 'category_id', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                    </svg>
                                </div>
                                <select
                                    value={form.category_id || ''}
                                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                    className={inputClass('category_id', 'pl-10')}
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        ), false)}
                    </div>
                    <div className="sm:col-span-2">
                        {renderField('Deskripsi', 'description', (
                            <textarea
                                value={form.description || ''}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={3}
                                className={inputClass('description')}
                                placeholder="Deskripsi layanan (opsional)"
                            />
                        ))}
                    </div>
                    <div>
                        {renderField('Durasi (menit)', 'duration', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="number"
                                    required
                                    value={form.duration}
                                    onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 0 })}
                                    min={1}
                                    max={1440}
                                    className={inputClass('duration', 'pl-10')}
                                    placeholder="60"
                                />
                            </div>
                        ), true, 'Durasi dalam menit.')}
                    </div>
                    <div>
                        {renderField('Harga', 'price', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <span className="text-sm text-neutral-400">Rp</span>
                                </div>
                                <input
                                    type="number"
                                    required
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                                    min={0}
                                    className={inputClass('price', 'pl-10')}
                                    placeholder="0"
                                />
                            </div>
                        ), true)}
                    </div>
                    <div className="sm:col-span-2">
                        {renderField('Warna', 'color', (
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, color: '' })}
                                    className={cn(
                                        'flex h-9 w-9 items-center justify-center rounded-xl border-2 transition-all duration-200',
                                        !form.color
                                            ? 'border-primary ring-2 ring-primary/30'
                                            : 'border-neutral-200 hover:border-neutral-300',
                                    )}
                                    title="Tanpa warna"
                                >
                                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                {colorOptions.map((c) => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => setForm({ ...form, color: c.value })}
                                        className={cn(
                                            'h-9 w-9 rounded-xl border-2 transition-all duration-200',
                                            form.color === c.value
                                                ? 'border-primary ring-2 ring-primary/30 scale-110'
                                                : 'border-transparent hover:scale-110',
                                        )}
                                        style={{ backgroundColor: c.value }}
                                        title={c.label}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="sm:col-span-2">
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
                                    <p className="text-sm font-medium text-neutral-900">Status Aktif</p>
                                    <p className="mt-0.5 text-xs text-neutral-500">
                                        {form.is_active
                                            ? 'Layanan ini tersedia untuk dipesan.'
                                            : 'Layanan ini tidak tersedia untuk dipesan.'}
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
                                <div className="h-6 w-10 rounded-full border border-neutral-300 bg-neutral-200 transition-all peer-checked:border-primary peer-checked:bg-primary" />
                                <div className={cn(
                                    'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
                                    form.is_active ? 'translate-x-4' : 'translate-x-0',
                                )} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 border-t border-neutral-200 pt-6">
                <Link
                    href="/service/services"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Kembali
                </Link>
                <div className="flex items-center gap-3">
                    <Link href="/service/services">
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
                                {service ? 'Menyimpan...' : 'Menambahkan...'}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2">
                                {service ? (
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
