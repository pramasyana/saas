import { Head, Link } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';
import TenantLayout from '@/layouts/TenantLayout';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import Badge from '@/atoms/Badge';
import Pagination from '@/molecules/Pagination';
import DateRangePicker from '@/molecules/DateRangePicker';
import { useLeaves, useUpdateLeaveStatus, useDeleteLeave } from '@/features/staff/hooks/useLeave';
import { useAllStaff } from '@/features/staff/hooks/useStaff';
import { useToastStore } from '@/stores/toast';
import type { Leave } from '@/features/staff/types';
import LeaveDeleteDialog from '@/features/staff/components/LeaveDeleteDialog';

interface Stats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

interface LeavePageProps {
    title: string;
    stats: Stats;
}

interface Filters {
    staff_id?: string;
    status?: string;
    type?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
}

interface StatCard {
    label: string;
    value: number;
    icon: ReactNode;
    color: string;
    bg: string;
}

function extractMessage(error: unknown): string | undefined {
    if (!error) return undefined;
    if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        return axiosError.response?.data?.message ?? error.message;
    }
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Terjadi kesalahan.';
}

const typeOptions = [
    { value: '', label: 'Semua Tipe' },
    { value: 'sick', label: 'Sakit' },
    { value: 'vacation', label: 'Cuti' },
    { value: 'other', label: 'Lainnya' },
];

const statusLabels: Record<string, string> = {
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Ditolak',
};

const statusBadge: Record<string, 'warning' | 'success' | 'danger'> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
};

const perPageOptions = [
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
];

const statIcons = {
    total: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
    ),
    pending: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    approved: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    rejected: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
    ),
};

export default function LeavePage({ title, stats }: LeavePageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const [filters, setFilters] = useState<Filters>({ page: 1, per_page: 15, staff_id: '', status: '', type: '' });

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [leaveToDelete, setLeaveToDelete] = useState<Leave | null>(null);

    const { data: staffData } = useAllStaff();
    const allStaff = staffData?.data ?? [];

    const { data, isLoading, isError, error } = useLeaves(filters);
    const updateStatusMutation = useUpdateLeaveStatus();
    const deleteMutation = useDeleteLeave();

    const leaves = data?.data ?? [];
    const meta = data?.meta;

    const statCards: StatCard[] = [
        { label: 'Total Pengajuan', value: stats.total, icon: statIcons.total, color: 'text-primary', bg: 'bg-primary-50' },
        { label: 'Menunggu', value: stats.pending, icon: statIcons.pending, color: 'text-warning', bg: 'bg-warning-50' },
        { label: 'Disetujui', value: stats.approved, icon: statIcons.approved, color: 'text-success', bg: 'bg-success-50' },
        { label: 'Ditolak', value: stats.rejected, icon: statIcons.rejected, color: 'text-danger', bg: 'bg-danger-50' },
    ];

    function handlePage(page: number) { setFilters((prev) => ({ ...prev, page })); }

    function openDelete(leave: Leave) {
        setLeaveToDelete(leave);
        deleteMutation.reset();
        setDeleteOpen(true);
    }

    function handleDelete() {
        if (!leaveToDelete) return;
        deleteMutation.mutate(leaveToDelete.id, {
            onSuccess: () => {
                setDeleteOpen(false);
                setLeaveToDelete(null);
                addToast('success', 'Pengajuan cuti berhasil dihapus.');
            },
        });
    }

    function handleApprove(leave: Leave) {
        updateStatusMutation.mutate({ id: leave.id, status: 'approved' }, {
            onSuccess: () => addToast('success', 'Cuti berhasil disetujui.'),
        });
    }

    function handleReject(leave: Leave) {
        updateStatusMutation.mutate({ id: leave.id, status: 'rejected' }, {
            onSuccess: () => addToast('success', 'Cuti berhasil ditolak.'),
        });
    }

    const deleteError = extractMessage(deleteMutation.error);

    const staffOptions = [
        { value: '', label: 'Semua Staff' },
        ...allStaff.map((s) => ({ value: s.id, label: s.name })),
    ];

    function formatDate(dateStr: string) {
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
            year: 'numeric', month: 'short', day: 'numeric',
        });
    }

    function calcDuration(start: string, end: string): number {
        const s = new Date(start + 'T00:00:00').getTime();
        const e = new Date(end + 'T00:00:00').getTime();
        return Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
    }

    function renderSkeleton() {
        return (
            <div className="animate-pulse p-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4 py-4">
                        <div className="h-10 w-10 rounded-full bg-neutral-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-36 rounded bg-neutral-200" />
                            <div className="h-3 w-48 rounded bg-neutral-100" />
                        </div>
                        <div className="h-5 w-16 rounded-full bg-neutral-200" />
                        <div className="flex gap-2">
                            <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                            <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    function renderError() {
        return (
            <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-50">
                    <svg className="h-8 w-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>
                <div>
                    <p className="text-base font-semibold text-neutral-900">Gagal memuat data</p>
                    <p className="mt-1 text-sm text-neutral-500">{(error as Error)?.message || 'Terjadi kesalahan. Coba lagi.'}</p>
                </div>
                <button onClick={() => window.location.reload()} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark">
                    Muat Ulang
                </button>
            </div>
        );
    }

    function renderEmpty() {
        return (
            <div className="flex flex-col items-center gap-5 px-6 py-20">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-100">
                    <svg className="h-10 w-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="text-base font-semibold text-neutral-900">Belum ada pengajuan cuti</p>
                    <p className="mt-1 text-sm text-neutral-500">Tambahkan pengajuan cuti baru.</p>
                </div>
                <Link href="/staff/leave/create">
                    <Button variant="outline" size="sm">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah Cuti
                    </Button>
                </Link>
            </div>
        );
    }

    function renderMobileCard(leave: Leave) {
        return (
            <div key={leave.id} className="border-b border-neutral-100 px-4 py-4 transition-colors last:border-b-0 hover:bg-neutral-50">
                <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-neutral-900">{leave.staff_name || '-'}</p>
                        <p className="mt-0.5 text-xs text-neutral-500">{leave.type_label}</p>
                        <p className="mt-0.5 text-xs text-neutral-400">
                            {formatDate(leave.date_start)} - {formatDate(leave.date_end)}
                            <span className="ml-1">· {calcDuration(leave.date_start, leave.date_end)} hari</span>
                        </p>
                    </div>
                    <div className="ml-3 flex items-center gap-2">
                        {leave.status === 'pending' && (
                            <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                <button
                                    onClick={() => handleApprove(leave)}
                                    disabled={updateStatusMutation.isPending}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-success transition-colors hover:bg-success-50"
                                    title="Setujui"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleReject(leave)}
                                    disabled={updateStatusMutation.isPending}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-danger transition-colors hover:bg-danger-50"
                                    title="Tolak"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="h-4 w-px bg-neutral-200" />
                                <button onClick={() => openDelete(leave)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger" title="Hapus">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        {leave.status !== 'pending' && (
                            <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                <button onClick={() => openDelete(leave)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger" title="Hapus">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <Badge variant={statusBadge[leave.status]}>{statusLabels[leave.status]}</Badge>
                    {leave.reason && <span className="truncate text-xs text-neutral-500 max-w-[180px]">{leave.reason}</span>}
                </div>
            </div>
        );
    }

    function renderDesktopRow(leave: Leave) {
        return (
            <tr key={leave.id} className="transition-colors hover:bg-neutral-50">
                <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-semibold text-neutral-900">{leave.staff_name || '-'}</p>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                    <Badge variant="default">{leave.type_label}</Badge>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm text-neutral-700">{formatDate(leave.date_start)}</p>
                    <p className="text-xs text-neutral-400">s.d. {formatDate(leave.date_end)}</p>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700">
                        {calcDuration(leave.date_start, leave.date_end)} hari
                    </span>
                </td>
                <td className="max-w-[200px] truncate px-6 py-4 text-sm text-neutral-500">
                    {leave.reason || <span className="text-neutral-300">-</span>}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                    <Badge variant={statusBadge[leave.status]}>{statusLabels[leave.status]}</Badge>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex justify-end">
                        <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                            {leave.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleApprove(leave)}
                                        disabled={updateStatusMutation.isPending}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-success transition-colors hover:bg-success-50"
                                        title="Setujui"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleReject(leave)}
                                        disabled={updateStatusMutation.isPending}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-danger transition-colors hover:bg-danger-50"
                                        title="Tolak"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <div className="h-5 w-px bg-neutral-200" />
                                </>
                            )}
                            <button onClick={() => openDelete(leave)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger" title="Hapus">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
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
                <span className="font-medium text-neutral-900">Cuti</span>
            </nav>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{title}</h1>
                    <p className="mt-1 text-sm text-neutral-500">Kelola pengajuan cuti karyawan.</p>
                </div>
                <Link href="/staff/leave/create">
                    <Button className="shrink-0">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah Cuti
                    </Button>
                </Link>
            </div>

            <FadeIn delay={0.03}>
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {statCards.map((s) => (
                        <div
                            key={s.label}
                            className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
                        >
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                                {s.icon}
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-bold tracking-tight text-neutral-900">
                                    {s.value.toLocaleString('id-ID')}
                                </p>
                                <p className="text-sm text-neutral-500">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </FadeIn>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Select
                    value={filters.staff_id ?? ''}
                    onChange={(v) => setFilters((prev) => ({ ...prev, staff_id: v, page: 1 }))}
                    options={staffOptions}
                    placeholder="Semua Staff"
                    className="w-full sm:w-44"
                />
                <Select
                    value={filters.status ?? ''}
                    onChange={(v) => setFilters((prev) => ({ ...prev, status: v, page: 1 }))}
                    options={[
                        { value: '', label: 'Semua Status' },
                        { value: 'pending', label: 'Menunggu' },
                        { value: 'approved', label: 'Disetujui' },
                        { value: 'rejected', label: 'Ditolak' },
                    ]}
                    placeholder="Semua Status"
                    className="w-full sm:w-36"
                />
                <Select
                    value={filters.type ?? ''}
                    onChange={(v) => setFilters((prev) => ({ ...prev, type: v, page: 1 }))}
                    options={typeOptions}
                    placeholder="Semua Tipe"
                    className="w-full sm:w-32"
                />
                <DateRangePicker
                    from={filters.date_from ?? ''}
                    to={filters.date_to ?? ''}
                    onFromChange={(v) => setFilters((prev) => ({ ...prev, date_from: v || '', page: 1 }))}
                    onToChange={(v) => setFilters((prev) => ({ ...prev, date_to: v || '', page: 1 }))}
                    fromPlaceholder="Dari"
                    toPlaceholder="Sampai"
                />
                <Select
                    value={String(filters.per_page ?? 15)}
                    onChange={(v) => setFilters((prev) => ({ ...prev, per_page: Number(v), page: 1 }))}
                    options={perPageOptions}
                    placeholder="Per page"
                    className="w-full sm:w-28"
                />
            </div>

            <FadeIn delay={0.09}>
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    {isError ? (
                        renderError()
                    ) : isLoading ? (
                        renderSkeleton()
                    ) : leaves.length === 0 ? (
                        renderEmpty()
                    ) : (
                        <>
                            <div className="divide-y divide-neutral-100 lg:hidden">
                                {leaves.map(renderMobileCard)}
                            </div>

                            <table className="hidden min-w-full divide-y divide-neutral-200 lg:table">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Staff</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Tipe</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Tanggal</th>
                                        <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">Durasi</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Alasan</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 bg-white">
                                    {leaves.map(renderDesktopRow)}
                                </tbody>
                            </table>
                        </>
                    )}

                    {meta && (<Pagination meta={meta} onPageChange={handlePage} />)}
                </div>
            </FadeIn>

            <LeaveDeleteDialog
                open={!!leaveToDelete}
                leave={leaveToDelete!}
                deleting={deleteMutation.isPending}
                error={deleteError}
                onClose={() => { setDeleteOpen(false); setLeaveToDelete(null); deleteMutation.reset(); }}
                onConfirm={handleDelete}
            />
        </TenantLayout>
    );
}
