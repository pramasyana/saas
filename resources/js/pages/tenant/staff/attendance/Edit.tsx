import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import AttendanceForm from '@/features/staff/components/AttendanceForm';
import { useUpdateAttendance } from '@/features/staff/hooks/useAttendance';
import { useAllStaff } from '@/features/staff/hooks/useStaff';
import type { Attendance, AttendanceFormData } from '@/features/staff/types';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/stores/toast';

interface EditPageProps {
    title: string;
    attendance: Attendance;
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

const statusLabels: Record<string, string> = {
    present: 'Hadir',
    late: 'Terlambat',
    absent: 'Absen',
    half_day: 'Setengah Hari',
};

const statusColors: Record<string, string> = {
    present: 'text-success',
    late: 'text-warning',
    absent: 'text-danger',
    half_day: 'text-neutral-600',
};

export default function Edit({ title, attendance }: EditPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const updateMutation = useUpdateAttendance();
    const [saving, setSaving] = useState(false);
    const errors = extractErrors(updateMutation.error);
    const { data: staffData } = useAllStaff();
    const staff = (staffData?.data ?? []).map((s) => ({ value: s.id, label: s.name }));

    function handleSave(data: AttendanceFormData) {
        setSaving(true);
        updateMutation.mutate(
            { id: attendance.id, data },
            {
                onSuccess: () => {
                    addToast('success', 'Absensi berhasil diperbarui.');
                    router.get('/staff/attendance');
                },
                onSettled: () => {
                    setSaving(false);
                },
            },
        );
    }

    function formatTime(t: string | null) {
        if (!t) {
return '-';
}

        return t.slice(0, 5);
    }

    return (
        <TenantLayout>
            <Head title={title} />

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/staff" className="transition-colors hover:text-neutral-700">Staff</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <Link href="/staff/attendance" className="transition-colors hover:text-neutral-700">Absensi</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Edit Absensi</span>
            </nav>

            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Absensi</h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Perbarui data kehadiran karyawan.
                </p>
            </div>

            <FadeIn delay={0.03}>
                <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-6 sm:p-8">
                        <div className="flex items-center gap-5">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white shadow-lg ring-4 ring-white/20">
                                {attendance.staff_name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div className="min-w-0 text-white">
                                <h2 className="text-xl font-bold">{attendance.staff_name || '-'}</h2>
                                <p className="mt-1 text-sm text-white/80">{attendance.date}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 sm:grid-cols-4">
                        {[
                            { label: 'ID', value: attendance.id },
                            { label: 'Status', value: statusLabels[attendance.status] || attendance.status, color: statusColors[attendance.status] },
                            { label: 'Clock In', value: formatTime(attendance.clock_in) },
                            { label: 'Clock Out', value: formatTime(attendance.clock_out) },
                        ].map((item) => (
                            <div key={item.label} className="px-5 py-4">
                                <p className="text-xs font-medium text-neutral-400">{item.label}</p>
                                <p className={cn(
                                    'mt-1 text-sm font-semibold',
                                    item.color || 'text-neutral-900',
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
                    <AttendanceForm
                        attendance={attendance}
                        staff={staff}
                        saving={saving}
                        errors={errors}
                        onSave={handleSave}
                    />
                </div>
            </FadeIn>
        </TenantLayout>
    );
}
