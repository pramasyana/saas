import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import CustomerForm from '@/features/crm/components/CustomerForm';
import { useUpdateCustomer } from '@/features/crm/hooks/useCustomers';
import type { Customer, CustomerFormData } from '@/features/crm/types';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/stores/toast';

interface EditPageProps {
    title: string;
    customer: Customer;
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

const avatarColors = [
    'bg-primary text-white',
    'bg-emerald-500 text-white',
    'bg-amber-500 text-white',
    'bg-rose-500 text-white',
    'bg-sky-500 text-white',
    'bg-violet-500 text-white',
];

function getAvatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function Edit({ title, customer }: EditPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const updateMutation = useUpdateCustomer();
    const [saving, setSaving] = useState(false);
    const errors = extractErrors(updateMutation.error);

    function handleSave(data: CustomerFormData) {
        setSaving(true);
        updateMutation.mutate(
            { id: customer.id, data },
            {
                onSuccess: () => {
                    addToast('success', 'Pelanggan berhasil diperbarui.');
                    router.get('/crm/customers');
                },
                onSettled: () => {
                    setSaving(false);
                },
            },
        );
    }

    return (
        <TenantLayout>
            <Head title={title} />

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/crm/customers" className="transition-colors hover:text-neutral-700">Pelanggan</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Edit Pelanggan</span>
            </nav>

            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Pelanggan</h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Perbarui informasi pelanggan yang sudah terdaftar.
                </p>
            </div>

            <FadeIn delay={0.03}>
                <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-6 sm:p-8">
                        <div className="flex items-center gap-5">
                            <div className={cn(
                                'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold shadow-lg ring-4 ring-white/20',
                                getAvatarColor(customer.name),
                            )}>
                                {getInitials(customer.name)}
                            </div>
                            <div className="min-w-0 text-white">
                                <h2 className="text-xl font-bold">{customer.name}</h2>
                                <p className="mt-1 text-sm text-white/80">{customer.email || 'Tidak ada email'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 sm:grid-cols-4">
                        {[
                            { label: 'ID', value: customer.id.slice(0, 8) + '...' },
                            { label: 'Status', value: customer.is_active ? 'Aktif' : 'Tidak Aktif' },
                            { label: 'Member Since', value: customer.membership?.joined_at
                                ? new Date(customer.membership.joined_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
                                : '-' },
                            { label: 'Tags Count', value: `${customer.tags_count ?? 0} tags` },
                        ].map((item) => (
                            <div key={item.label} className="px-5 py-4">
                                <p className="text-xs font-medium text-neutral-400">{item.label}</p>
                                <p className={cn(
                                    'mt-1 text-sm font-semibold',
                                    item.label === 'Status' && customer.is_active ? 'text-success' : item.label === 'Status' && !customer.is_active ? 'text-danger' : 'text-neutral-900',
                                )}>
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.06}>
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
                    <CustomerForm
                        customer={customer}
                        saving={saving}
                        errors={errors}
                        onSave={handleSave}
                    />
                </div>
            </FadeIn>
        </TenantLayout>
    );
}
