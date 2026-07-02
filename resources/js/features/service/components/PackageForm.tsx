import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Button from '@/atoms/Button';
import { useAllServices } from '@/features/service/hooks/useServices';
import type { Package, PackageFormData } from '@/features/service/types';
import { cn } from '@/lib/utils';

interface PackageFormProps {
    packageData: Package | null;
    saving: boolean;
    errors?: Record<string, string[]>;
    onSave: (data: PackageFormData) => void;
}

export default function PackageForm({ packageData, saving, errors = {}, onSave }: PackageFormProps) {
    const { data: servicesData } = useAllServices();
    const allServices = servicesData?.data ?? [];

    const initialServices = packageData?.services?.map((s) => ({
        service_id: s.service_id,
        quantity: s.quantity,
        sort_order: s.sort_order,
    })) || [];

    const [form, setForm] = useState<PackageFormData>({
        name: packageData?.name || '',
        description: packageData?.description || '',
        price: packageData?.price || 0,
        duration: packageData?.duration || 0,
        is_active: packageData?.is_active ?? true,
        services: initialServices,
    });

    useEffect(() => {
        if (packageData) {
            setForm({
                name: packageData.name,
                description: packageData.description || '',
                price: packageData.price,
                duration: packageData.duration || 0,
                is_active: packageData.is_active,
                services: packageData.services?.map((s) => ({
                    service_id: s.service_id,
                    quantity: s.quantity,
                    sort_order: s.sort_order,
                })) || [],
            });
        } else {
            setForm({
                name: '',
                description: '',
                price: 0,
                duration: 0,
                is_active: true,
                services: [],
            });
        }
    }, [packageData]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        onSave(form);
    }

    function inputClass(field: string, extra?: string) {
        return cn(
            'block w-full rounded-xl border px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2',
            errors[field]
                ? 'border-danger ring-danger/20 focus:border-danger focus:ring-danger/30'
                : 'border-neutral-300 focus:border-primary focus:ring-primary/30',
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

    function addService() {
        setForm((prev) => ({
            ...prev,
            services: [...(prev.services || []), { service_id: '', quantity: 1, sort_order: prev.services?.length || 0 }],
        }));
    }

    function removeService(index: number) {
        setForm((prev) => ({
            ...prev,
            services: prev.services?.filter((_, i) => i !== index) || [],
        }));
    }

    function updateService(index: number, field: string, value: string | number) {
        setForm((prev) => ({
            ...prev,
            services: prev.services?.map((s, i) => (i === index ? { ...s, [field]: value } : s)) || [],
        }));
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

            {/* Informasi Paket */}
            <div>
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Informasi Paket</h3>
                        <p className="text-xs text-neutral-500">Data dasar paket layanan.</p>
                    </div>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        {renderField('Nama Paket', 'name', (
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
                                    placeholder="Nama paket layanan"
                                />
                            </div>
                        ), undefined, true)}
                    </div>
                    <div className="sm:col-span-2">
                        {renderField('Deskripsi', 'description', (
                            <textarea
                                value={form.description || ''}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={3}
                                className={inputClass('description')}
                                placeholder="Deskripsi paket (opsional)"
                            />
                        ), 'Penjelasan singkat tentang paket.')}
                    </div>
                    <div>
                        {renderField('Harga Paket', 'price', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <span className="text-sm text-neutral-400">Rp</span>
                                </div>
                                <input
                                    type="number"
                                    required
                                    min={0}
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                                    className={inputClass('price', 'pl-10')}
                                    placeholder="0"
                                />
                            </div>
                        ), undefined, true)}
                    </div>
                    <div>
                        {renderField('Estimasi Durasi (menit)', 'duration', (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="number"
                                    min={0}
                                    value={form.duration ?? 0}
                                    onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 0 })}
                                    className={inputClass('duration', 'pl-10')}
                                    placeholder="0"
                                />
                            </div>
                        ), 'Perkiraan waktu pengerjaan paket.')}
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700">Status</label>
                        <div className="mt-1.5">
                            <div
                                className={cn(
                                    'flex cursor-pointer items-center justify-between rounded-xl border px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md',
                                    form.is_active
                                        ? 'border-success/30 bg-success-light/50'
                                        : 'border-neutral-200 bg-white',
                                )}
                                onClick={() => setForm({ ...form, is_active: !form.is_active })}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className={cn(
                                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300',
                                        form.is_active ? 'bg-success text-white shadow-sm' : 'bg-neutral-100 text-neutral-400',
                                    )}>
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900">
                                            {form.is_active ? 'Aktif' : 'Nonaktif'}
                                        </p>
                                        <p className="mt-0.5 text-xs text-neutral-500">
                                            {form.is_active
                                                ? 'Paket ini tersedia dan bisa dipesan.'
                                                : 'Paket ini tidak tersedia untuk dipesan.'}
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
                </div>
            </div>

            {/* Layanan dalam Paket */}
            <div>
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Layanan dalam Paket</h3>
                        <p className="text-xs text-neutral-500">Pilih layanan yang termasuk dalam paket ini.</p>
                    </div>
                </div>

                <div className="mt-5">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-xs font-medium text-neutral-500">
                            {form.services?.length || 0} layanan dipilih
                        </span>
                        <Button type="button" variant="secondary" size="sm" onClick={addService}>
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Tambah Layanan
                        </Button>
                    </div>

                    {(!form.services || form.services.length === 0) && (
                        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-neutral-50/50 py-10">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                                <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-neutral-900">Belum ada layanan</p>
                                <p className="mt-0.5 text-xs text-neutral-500">Klik "Tambah Layanan" untuk menambahkan layanan ke paket.</p>
                            </div>
                        </div>
                    )}

                    {form.services && form.services.length > 0 && (
                        <div className="space-y-3">
                            {form.services.map((s, i) => (
                                <div key={i} className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary">
                                        {i + 1}
                                    </div>
                                    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                                        <div className="flex-1">
                                            <select
                                                value={s.service_id}
                                                onChange={(e) => updateService(i, 'service_id', e.target.value)}
                                                className={cn(
                                                    'w-full rounded-xl border px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2',
                                                    errors[`services.${i}.service_id`]
                                                        ? 'border-danger ring-danger/20'
                                                        : 'border-neutral-300 focus:border-primary focus:ring-primary/30',
                                                )}
                                            >
                                                <option value="">Pilih Layanan</option>
                                                {allServices.map((svc) => (
                                                    <option key={svc.id} value={svc.id}>
                                                        {svc.name} (Rp {svc.price.toLocaleString('id-ID')} · {svc.duration} mnt)
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="relative w-24">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={s.quantity}
                                                    onChange={(e) => updateService(i, 'quantity', parseInt(e.target.value) || 1)}
                                                    className={cn(
                                                        'w-full rounded-xl border px-3 py-2.5 text-sm text-neutral-900 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2',
                                                        errors[`services.${i}.quantity`]
                                                            ? 'border-danger ring-danger/20'
                                                            : 'border-neutral-300 focus:border-primary focus:ring-primary/30',
                                                    )}
                                                    placeholder="Qty"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeService(i)}
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger"
                                                title="Hapus layanan"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 border-t border-neutral-200 pt-6">
                <Link
                    href="/service/packages"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Kembali
                </Link>
                <div className="flex items-center gap-3">
                    <Link href="/service/packages">
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
                                {packageData ? 'Menyimpan...' : 'Menambahkan...'}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2">
                                {packageData ? (
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
