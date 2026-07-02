import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import TenantLayout from '@/layouts/TenantLayout';
import FadeIn from '@/atoms/FadeIn';
import CommissionForm from '@/features/staff/components/CommissionForm';
import { useUpdateCommission } from '@/features/staff/hooks/useCommission';
import { useAllStaff } from '@/features/staff/hooks/useStaff';
import { useToastStore } from '@/stores/toast';
import { cn } from '@/lib/utils';
import type { Commission, CommissionFormData } from '@/features/staff/types';

interface EditPageProps {
    title: string;
    commission: Commission;
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

const typeLabels: Record<string, string> = {
    service: 'Layanan',
    product: 'Produk',
    bonus: 'Bonus',
};

export default function Edit({ title, commission }: EditPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const updateMutation = useUpdateCommission();
    const [saving, setSaving] = useState(false);
    const errors = extractErrors(updateMutation.error);
    const { data: staffData } = useAllStaff();
    const allStaff = staffData?.data ?? [];
    const staffOptions = allStaff.map((s) => ({ value: s.id, label: s.name }));

    function handleSave(data: CommissionFormData) {
        setSaving(true);
        updateMutation.mutate(
            { id: commission.id, data },
            {
                onSuccess: () => {
                    addToast('success', 'Komisi berhasil diperbarui.');
                    router.get('/staff/commission');
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
                <Link href="/staff" className="transition-colors hover:text-neutral-700">Staff</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <Link href="/staff/commission" className="transition-colors hover:text-neutral-700">Komisi</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Edit Komisi</span>
            </nav>

            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Komisi</h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Perbarui data komisi karyawan.
                </p>
            </div>

            <FadeIn delay={0.03}>
                <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-6 sm:p-8">
                        <div className="flex items-center gap-5">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white shadow-lg ring-4 ring-white/20 backdrop-blur-sm">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="min-w-0 text-white">
                                <h2 className="text-xl font-bold">{commission.staff_name || '-'}</h2>
                                <p className="mt-1 text-sm text-white/80">{typeLabels[commission.type] || commission.type}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 sm:grid-cols-4">
                        {[
                            { label: 'ID', value: `#${commission.id}` },
                            { label: 'Tipe', value: typeLabels[commission.type] || commission.type },
                            { label: 'Tanggal', value: commission.date },
                            { label: 'Jumlah', value: commission.amount_formatted, highlight: true },
                        ].map((item) => (
                            <div key={item.label} className="px-5 py-4">
                                <p className="text-xs font-medium text-neutral-400">{item.label}</p>
                                <p className={cn(
                                    'mt-1 text-sm font-semibold',
                                    item.highlight ? 'text-primary' : 'text-neutral-900',
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
                    <CommissionForm
                        commission={commission}
                        staff={staffOptions}
                        saving={saving}
                        errors={errors}
                        onSave={handleSave}
                    />
                </div>
            </FadeIn>
        </TenantLayout>
    );
}
