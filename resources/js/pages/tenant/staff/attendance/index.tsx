import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import AttendanceDeleteDialog from '@/features/staff/components/AttendanceDeleteDialog';
import { useAttendance, useDeleteAttendance } from '@/features/staff/hooks/useAttendance';
import { useAllStaff } from '@/features/staff/hooks/useStaff';
import type { Attendance } from '@/features/staff/types';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';
import Pagination from '@/molecules/Pagination';
import { useToastStore } from '@/stores/toast';

interface Filters {
    staff_id?: string;
    date?: string;
    status?: string;
    page?: number;
    per_page?: number;
}

function extractMessage(error: unknown): string | undefined {
    if (!error) {
return undefined;
}

    if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };

        return axiosError.response?.data?.message ?? error.message;
    }

    if (error instanceof Error) {
return error.message;
}

    if (typeof error === 'string') {
return error;
}

    return 'Terjadi kesalahan.';
}

const statusBadge: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
    present: 'success',
    late: 'warning',
    absent: 'danger',
    half_day: 'default',
};

const statusLabels: Record<string, string> = {
    present: 'Hadir',
    late: 'Terlambat',
    absent: 'Absen',
    half_day: 'Setengah Hari',
};

const perPageOptions = [
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
];

export default function AttendancePage() {
    const addToast = useToastStore((s) => s.addToast);
    const today = new Date().toISOString().slice(0, 10);
    const [filters, setFilters] = useState<Filters>({ page: 1, per_page: 15, staff_id: '', date: today, status: '' });

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [attendanceToDelete, setAttendanceToDelete] = useState<Attendance | null>(null);

    const { data: staffData } = useAllStaff();
    const allStaff = staffData?.data ?? [];

    const { data, isLoading, isError, error } = useAttendance(filters);
    const allQuery = useAttendance({ per_page: 100, date: today });
    const deleteMutation = useDeleteAttendance();

    const records = data?.data ?? [];
    const meta = data?.meta;
    const todayRecords = allQuery.data?.data ?? [];
    const presentCount = todayRecords.filter((r: Attendance) => r.status === 'present').length;
    const lateCount = todayRecords.filter((r: Attendance) => r.status === 'late').length;
    const absentCount = todayRecords.filter((r: Attendance) => r.status === 'absent').length;

    function handlePage(page: number) {
 setFilters((prev) => ({ ...prev, page })); 
}

    function openDelete(record: Attendance) {
        setAttendanceToDelete(record);
        deleteMutation.reset();
        setDeleteOpen(true);
    }

    function handleDelete() {
        if (!attendanceToDelete) {
return;
}

        deleteMutation.mutate(attendanceToDelete.id, {
            onSuccess: () => {
                setDeleteOpen(false);
                setAttendanceToDelete(null);
                addToast('success', 'Absensi berhasil dihapus.');
            },
        });
    }

    const deleteError = extractMessage(deleteMutation.error);

    const staffOptions = [
        { value: '', label: 'Semua Staff' },
        ...allStaff.map((s) => ({ value: s.id, label: s.name })),
    ];

    const statusOptions = [
        { value: '', label: 'Semua Status' },
        { value: 'present', label: 'Hadir' },
        { value: 'late', label: 'Terlambat' },
        { value: 'absent', label: 'Absen' },
        { value: 'half_day', label: 'Setengah Hari' },
    ];

    function formatTime(t: string | null) {
        if (!t) {
return '-';
}

        return t.slice(0, 5);
    }

    return (
        <TenantLayout>
            <Head title="Absensi" />

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/staff" className="transition-colors hover:text-neutral-700">Staff</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Absensi</span>
            </nav>

            <div className="mb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Absensi</h1>
                        <p className="mt-1.5 text-sm text-neutral-500">Catat kehadiran karyawan.</p>
                    </div>
                    <Link href="/staff/attendance/create">
                        <Button className="shrink-0">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Tambah Absensi
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <FadeIn delay={0.03}>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{presentCount}</p>
                                <p className="text-xs text-neutral-500">Hadir</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.06}>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-50 text-warning">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{lateCount}</p>
                                <p className="text-xs text-neutral-500">Terlambat</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.09}>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-50 text-danger">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{absentCount}</p>
                                <p className="text-xs text-neutral-500">Absen</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.12}>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{todayRecords.length}</p>
                                <p className="text-xs text-neutral-500">Total Hari Ini</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>

            <FadeIn delay={0.05}>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Select
                        value={filters.staff_id ?? ''}
                        onChange={(v) => setFilters((prev) => ({ ...prev, staff_id: v, page: 1 }))}
                        options={staffOptions}
                        placeholder="Semua Staff"
                        className="w-full sm:w-44"
                    />
                    <input
                        type="date"
                        value={filters.date || ''}
                        onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value, page: 1 }))}
                        className="w-full rounded-xl border border-neutral-300 px-3 py-[7px] text-sm text-neutral-900 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-40"
                    />
                    <Select
                        value={filters.status ?? ''}
                        onChange={(v) => setFilters((prev) => ({ ...prev, status: v, page: 1 }))}
                        options={statusOptions}
                        placeholder="Semua Status"
                        className="w-full sm:w-40"
                    />
                    <Select
                        value={String(filters.per_page ?? 15)}
                        onChange={(v) => setFilters((prev) => ({ ...prev, per_page: Number(v), page: 1 }))}
                        options={perPageOptions}
                        placeholder="Per page"
                        className="w-full sm:w-28"
                    />
                </div>
            </FadeIn>

            <FadeIn delay={0.07}>
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    {isError ? (
                        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-light">
                                <svg className="h-7 w-7 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-900">Gagal memuat data</p>
                                <p className="mt-1 text-sm text-neutral-500">{(error as Error)?.message || 'Terjadi kesalahan.'}</p>
                            </div>
                            <button onClick={() => window.location.reload()} className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark">Muat Ulang</button>
                        </div>
                    ) : isLoading ? (
                        <div className="animate-pulse p-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4 py-4">
                                    <div className="h-9 w-9 rounded-full bg-neutral-200" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3.5 w-36 rounded bg-neutral-200" />
                                        <div className="h-3 w-24 rounded bg-neutral-100" />
                                    </div>
                                    <div className="h-5 w-16 rounded-full bg-neutral-200" />
                                    <div className="flex gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                                        <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : records.length === 0 ? (
                        <div className="flex flex-col items-center gap-4 px-6 py-16">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                                <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-neutral-900">Belum ada absensi</p>
                                <p className="mt-1 text-sm text-neutral-500">Catat kehadiran karyawan untuk memulai.</p>
                            </div>
                            <Link href="/staff/attendance/create">
                                <Button variant="outline" size="sm">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Tambah Absensi
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-neutral-100 lg:hidden">
                                {records.map((record) => (
                                    <div key={record.id} className="px-4 py-4 transition-colors hover:bg-neutral-50">
                                        <div className="flex items-start justify-between">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-neutral-900">{record.staff_name || '-'}</p>
                                                <p className="mt-0.5 text-xs text-neutral-500">{record.date}</p>
                                            </div>
                                            <div className="ml-3 inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                                <Link href={`/staff/attendance/${record.id}/edit`} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary" title="Edit">
                                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                </Link>
                                                <div className="h-4 w-px bg-neutral-200" />
                                                <button onClick={() => openDelete(record)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger" title="Hapus">
                                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            <Badge variant={statusBadge[record.status]}>{statusLabels[record.status]}</Badge>
                                            <span className="text-xs text-neutral-400">
                                                {formatTime(record.clock_in)} - {formatTime(record.clock_out)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <table className="hidden min-w-full divide-y divide-neutral-200 lg:table">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Staff</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Tanggal</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Masuk</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Pulang</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 bg-white">
                                    {records.map((record) => (
                                        <tr key={record.id} className="transition-colors hover:bg-neutral-50">
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <p className="text-sm font-medium text-neutral-900">{record.staff_name || '-'}</p>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">{record.date}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">{formatTime(record.clock_in)}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">{formatTime(record.clock_out)}</td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <Badge variant={statusBadge[record.status]}>{statusLabels[record.status]}</Badge>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex justify-end">
                                                    <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                                        <Link href={`/staff/attendance/${record.id}/edit`} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary" title="Edit">
                                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                            </svg>
                                                        </Link>
                                                        <div className="h-4 w-px bg-neutral-200" />
                                                        <button onClick={() => openDelete(record)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger" title="Hapus">
                                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {meta && (<Pagination meta={meta} onPageChange={handlePage} />)}
                </div>
            </FadeIn>

            <AttendanceDeleteDialog
                open={!!attendanceToDelete}
                attendance={attendanceToDelete!}
                deleting={deleteMutation.isPending}
                error={deleteError}
                onClose={() => {
 setDeleteOpen(false); setAttendanceToDelete(null); deleteMutation.reset(); 
}}
                onConfirm={handleDelete}
            />
        </TenantLayout>
    );
}
