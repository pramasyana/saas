import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import TenantLayout from '@/layouts/TenantLayout';
import FadeIn from '@/atoms/FadeIn';
import StaffForm from '@/features/staff/components/StaffForm';
import { useUpdateStaff } from '@/features/staff/hooks/useStaff';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import { useToastStore } from '@/stores/toast';
import { cn } from '@/lib/utils';
import type { Staff, StaffFormData } from '@/features/staff/types';

interface EditPageProps {
    title: string;
    staff: Staff;
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
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export default function Edit({ title, staff }: EditPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const updateMutation = useUpdateStaff();
    const [saving, setSaving] = useState(false);
    const errors = extractErrors(updateMutation.error);
    const { data: branchesData } = useAllBranches();
    const branches = [
        { value: '__default__', label: 'Utama' },
        ...(branchesData?.data ?? []).map((b) => ({ value: b.id, label: b.name })),
    ];

    function handleSave(data: StaffFormData) {
        setSaving(true);
        updateMutation.mutate(
            { id: staff.id, data },
            {
                onSuccess: () => {
                    addToast('success', 'Staff berhasil diperbarui.');
                    router.get('/staff');
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
                <span className="font-medium text-neutral-900">Edit Staff</span>
            </nav>

            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Staff</h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Perbarui informasi karyawan yang sudah terdaftar.
                </p>
            </div>

            <FadeIn delay={0.03}>
                <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-6 sm:p-8">
                        <div className="flex items-center gap-5">
                            <div className={cn(
                                'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold shadow-lg ring-4 ring-white/20',
                                getAvatarColor(staff.name),
                            )}>
                                {getInitials(staff.name)}
                            </div>
                            <div className="min-w-0 text-white">
                                <h2 className="text-xl font-bold">{staff.name}</h2>
                                <p className="mt-1 text-sm text-white/80">{staff.position || 'Tidak ada jabatan'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 sm:grid-cols-4">
                        {[
                            { label: 'ID', value: staff.id },
                            { label: 'Cabang', value: staff.branch_name || '-' },
                            { label: 'Status', value: staff.is_active ? 'Aktif' : 'Tidak Aktif' },
                            { label: 'Bergabung', value: staff.hire_date || staff.created_at?.slice(0, 10) || '-' },
                        ].map((item) => (
                            <div key={item.label} className="px-5 py-4">
                                <p className="text-xs font-medium text-neutral-400">{item.label}</p>
                                <p className={cn(
                                    'mt-1 text-sm font-semibold',
                                    item.label === 'Status' && staff.is_active ? 'text-success' : item.label === 'Status' && !staff.is_active ? 'text-danger' : 'text-neutral-900',
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
                    <StaffForm
                        staff={staff}
                        branches={branches}
                        saving={saving}
                        errors={errors}
                        onSave={handleSave}
                    />
                </div>
            </FadeIn>
        </TenantLayout>
    );
}
