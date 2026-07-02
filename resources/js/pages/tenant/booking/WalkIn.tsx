import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import { useCustomers } from '@/features/crm/hooks/useCustomers';
import { useAllServices } from '@/features/service/hooks/useServices';
import { useAllStaff } from '@/features/staff/hooks/useStaff';
import { useWalkIn } from '@/features/booking/hooks/useBookings';
import type { BookingFormData } from '@/features/booking/types';
import TenantLayout from '@/layouts/TenantLayout';
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

export default function WalkIn({ title }: WalkInPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const walkInMutation = useWalkIn();
    const [saving, setSaving] = useState(false);
    const [customerId, setCustomerId] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [staffId, setStaffId] = useState('');
    const [branchId, setBranchId] = useState('');
    const [notes, setNotes] = useState('');

    const errors = extractErrors(walkInMutation.error);

    const { data: customersData } = useCustomers({ per_page: 50 });
    const customers = customersData?.data ?? [];
    const { data: servicesData } = useAllServices();
    const services = servicesData?.data ?? [];
    const { data: staffData } = useAllStaff();
    const staffList = staffData?.data ?? [];

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!customerId) return;

        setSaving(true);
        const payload: BookingFormData = {
            customer_id: customerId,
            staff_id: staffId || undefined,
            branch_id: branchId || undefined,
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
                <Link href="/dashboard" className="transition-colors hover:text-neutral-700">Dashboard</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <Link href="/booking" className="transition-colors hover:text-neutral-700">Booking</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Walk In</span>
            </nav>

            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Walk In Booking</h1>
                <p className="mt-1.5 text-sm text-neutral-500">Buat booking untuk pelanggan yang datang langsung.</p>
            </div>

            <FadeIn delay={0.05}>
                <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
                    {errors._general && (
                        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
                            <span>{errors._general[0]}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Pelanggan *</label>
                            <select
                                required
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                className="block w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                            >
                                <option value="">Pilih pelanggan</option>
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Layanan</label>
                            <select
                                value={serviceId}
                                onChange={(e) => setServiceId(e.target.value)}
                                className="block w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                            >
                                <option value="">Pilih layanan (opsional)</option>
                                {services.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name} - Rp {s.price.toLocaleString('id-ID')} ({s.duration} menit)</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Staff</label>
                            <select
                                value={staffId}
                                onChange={(e) => setStaffId(e.target.value)}
                                className="block w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                            >
                                <option value="">Pilih staff (opsional)</option>
                                {staffList.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Catatan</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                className="block w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                placeholder="Catatan tambahan (opsional)"
                            />
                        </div>

                        <div className="flex items-center justify-between gap-3 border-t border-neutral-200 pt-5">
                            <Link href="/booking" className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700">
                                Kembali
                            </Link>
                            <Button type="submit" disabled={saving || !customerId}>
                                {saving ? 'Menyimpan...' : 'Buat Walk In'}
                            </Button>
                        </div>
                    </form>
                </div>
            </FadeIn>
        </TenantLayout>
    );
}
