import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import type { FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import { useWalkIn } from '@/features/booking/hooks/useBookings';
import type { BookingFormData } from '@/features/booking/types';
import { useCustomers } from '@/features/crm/hooks/useCustomers';
import { useAllServices } from '@/features/service/hooks/useServices';
import { useAllStaff } from '@/features/staff/hooks/useStaff';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/stores/toast';

interface WalkInPageProps {
    title: string;
}

function extractErrors(error: unknown): Record<string, string[]> {
    if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as Record<string, unknown>;

        if (data.errors && typeof data.errors === 'object') {
            return data.errors as Record<string, string[]>;
        }

        if (data.message && typeof data.message === 'string') {
            return { _general: [data.message] };
        }
    }

    return {};
}

function inputClass(field: string, errors: Record<string, string[]>, extra?: string) {
    return cn(
        'block w-full rounded-xl border px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2',
        errors[field]
            ? 'border-danger ring-danger/20 focus:border-danger focus:ring-danger/30'
            : 'border-neutral-300 ring-neutral-300 focus:border-primary focus:ring-primary/30',
        'disabled:bg-neutral-50 disabled:text-neutral-500',
        extra,
    );
}

function renderField(label: string, field: string, errors: Record<string, string[]>, children: ReactNode, hint?: string, required?: boolean) {
    const fieldErrors = errors[field];

    return (
        <div>
            <label className="block text-sm font-medium text-neutral-700">
                {label}
                {required && <span className="ml-0.5 text-danger">*</span>}
            </label>
            <div className="relative mt-1.5">{children}</div>
            {hint && !fieldErrors && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
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

export default function WalkIn({ title }: WalkInPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const walkInMutation = useWalkIn();
    const [saving, setSaving] = useState(false);
    const [customerId, setCustomerId] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [staffId, setStaffId] = useState('');
    const [notes, setNotes] = useState('');

    const errors = extractErrors(walkInMutation.error);

    const { data: customersData, isLoading: customersLoading } = useCustomers({ per_page: 50 });
    const customers = customersData?.data ?? [];
    const { data: servicesData, isLoading: servicesLoading } = useAllServices();
    const services = servicesData?.data ?? [];
    const { data: staffData, isLoading: staffLoading } = useAllStaff();
    const staffList = staffData?.data ?? [];

    const formLoading = customersLoading || servicesLoading || staffLoading;

    const customerOptions = customers.map((c) => ({ value: c.id, label: `${c.name} — ${c.phone}` }));
    const serviceOptions = [
        { value: '', label: 'Pilih layanan (opsional)' },
        ...services.map((s) => ({ value: s.id, label: `${s.name} — Rp ${s.price.toLocaleString('id-ID')} (${s.duration} menit)` })),
    ];
    const staffOptions = [
        { value: '', label: 'Pilih staff (opsional)' },
        ...staffList.map((s) => ({ value: s.id, label: s.name })),
    ];

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!customerId) {
return;
}

        setSaving(true);
        const payload: BookingFormData = {
            customer_id: customerId,
            staff_id: staffId || undefined,
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            duration_minutes: 60,
            notes: notes || undefined,
        };

        if (serviceId) {
            payload.services = [{
                service_id: serviceId,
                name: services.find((s) => s.id === serviceId)?.name ?? '',
                price: services.find((s) => s.id === serviceId)?.price ?? 0,
                duration: services.find((s) => s.id === serviceId)?.duration ?? 60,
            }];
        }

        walkInMutation.mutate(payload, {
            onSuccess: () => {
                addToast('success', 'Walk-in booking berhasil.');
                router.get('/booking');
            },
            onSettled: () => setSaving(false),
        });
    }

    return (
        <TenantLayout>
            <Head title={title} />

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/booking" className="transition-colors hover:text-neutral-700">Booking</Link>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Walk In</span>
            </nav>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Walk In Booking</h1>
                    <p className="mt-1 text-sm text-neutral-500">Buat booking untuk pelanggan yang datang langsung.</p>
                </div>
                <Link href="/booking">
                    <Button variant="secondary" size="sm">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                        </svg>
                        Kembali
                    </Button>
                </Link>
            </div>

            <FadeIn delay={0.05}>
                <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
                    {formLoading ? (
                        <div className="animate-pulse space-y-8">
                            <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                                <div className="h-9 w-9 rounded-lg bg-neutral-200" />
                                <div className="flex-1 space-y-1">
                                    <div className="h-4 w-40 rounded bg-neutral-200" />
                                    <div className="h-3 w-56 rounded bg-neutral-100" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                                <div className="h-9 w-9 rounded-lg bg-neutral-200" />
                                <div className="flex-1 space-y-1">
                                    <div className="h-4 w-40 rounded bg-neutral-200" />
                                    <div className="h-3 w-56 rounded bg-neutral-100" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                                <div className="h-9 w-9 rounded-lg bg-neutral-200" />
                                <div className="flex-1 space-y-1">
                                    <div className="h-4 w-40 rounded bg-neutral-200" />
                                    <div className="h-3 w-56 rounded bg-neutral-100" />
                                </div>
                            </div>
                        </div>
                    ) : (
                    <>
                    {errors._general && (
                        <div className="flex items-center gap-2.5 rounded-xl border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
                            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                            <span>{errors._general.join(', ')}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Pelanggan */}
                        <div>
                            <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-neutral-900">Informasi Pelanggan</h3>
                                    <p className="text-xs text-neutral-500">Pilih atau cari pelanggan yang datang.</p>
                                </div>
                            </div>
                            <div className="mt-5">
                                {renderField('Pelanggan', 'customer_id', errors, (
                                    <Select
                                        value={customerId}
                                        onChange={setCustomerId}
                                        options={customerOptions}
                                        placeholder="Cari pelanggan..."
                                        searchable
                                        clearable
                                    />
                                ), undefined, true)}
                            </div>
                        </div>

                        {/* Section 2: Detail Booking */}
                        <div>
                            <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-neutral-900">Detail Layanan</h3>
                                    <p className="text-xs text-neutral-500">Pilih layanan dan staff yang akan menangani.</p>
                                </div>
                            </div>
                            <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                <div>
                                    {renderField('Layanan', 'service_id', errors, (
                                        <Select
                                            value={serviceId}
                                            onChange={setServiceId}
                                            options={serviceOptions}
                                            placeholder="Pilih layanan"
                                        />
                                    ), 'Opsional. Pilih layanan yang akan diberikan.')}
                                </div>
                                <div>
                                    {renderField('Staff', 'staff_id', errors, (
                                        <Select
                                            value={staffId}
                                            onChange={setStaffId}
                                            options={staffOptions}
                                            placeholder="Pilih staff"
                                        />
                                    ), 'Opsional. Biarkan kosong untuk auto-assign.')}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Catatan */}
                        <div>
                            <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-neutral-900">Catatan</h3>
                                    <p className="text-xs text-neutral-500">Informasi tambahan untuk booking ini.</p>
                                </div>
                            </div>
                            <div className="mt-5">
                                {renderField('Catatan', 'notes', errors, (
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        className={inputClass('notes', errors)}
                                        placeholder="Catatan tambahan (opsional)"
                                    />
                                ), 'Contoh: pelanggan minta meja dekat jendela.')}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 border-t border-neutral-200 pt-6">
                            <Link href="/booking">
                                <Button type="button" variant="secondary" disabled={saving}>Batal</Button>
                            </Link>
                            <Button type="submit" disabled={saving || !customerId} className="min-w-[120px]">
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
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        Tambah
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                    </>
                    )}
                </div>
            </FadeIn>
        </TenantLayout>
    );
}
