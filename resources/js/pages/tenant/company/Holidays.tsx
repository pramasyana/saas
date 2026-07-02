import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import TenantLayout from '@/layouts/TenantLayout';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import Badge from '@/atoms/Badge';
import Pagination from '@/molecules/Pagination';
import HolidayForm from '@/features/company/components/HolidayForm';
import { useHolidays, useCreateHoliday, useUpdateHoliday, useDeleteHoliday } from '@/features/company/hooks/useHolidays';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import { useToastStore } from '@/stores/toast';
import type { Holiday, HolidayFormData } from '@/features/company/types';
import { cn } from '@/lib/utils';

interface HolidaysFilters {
    search?: string;
    branch_id?: string;
    page?: number;
    per_page?: number;
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

function extractErrors(error: unknown): Record<string, string[]> {
    if (!error) return {};
    try {
        const axiosError = error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
        if (axiosError.response?.data?.errors) return axiosError.response.data.errors;
        if (axiosError.response?.data?.message) return { _general: [axiosError.response.data.message] };
    } catch {
        //
    }
    return { _general: ['Terjadi kesalahan.'] };
}

function formatDate(dateStr: string) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

const statIcons = {
    calendar: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
    ),
    check: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    year: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
    ),
    upcoming: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
    ),
};

export default function CompanyHolidaysPage() {
    const addToast = useToastStore((s) => s.addToast);
    const [filters, setFilters] = useState<HolidaysFilters>({
        page: 1,
        per_page: 15,
        search: '',
        branch_id: '',
    });
    const [searchInput, setSearchInput] = useState('');
    const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

    const [formOpen, setFormOpen] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Holiday | null>(null);

    const { data: branchesData } = useAllBranches();
    const branches = branchesData?.data ?? [];

    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
        }, 400);
        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [searchInput]);

    const allHolidaysQuery = useHolidays({ per_page: 100 });
    const allHolidays = allHolidaysQuery.data?.data ?? [];
    const thisYear = new Date().getFullYear();
    const upcoming = (() => {
        const today = new Date().toISOString().slice(0, 10);
        return allHolidays.find((h) => h.date_start >= today) ?? null;
    })();

    const { data, isLoading, isError, error } = useHolidays(filters);
    const createMutation = useCreateHoliday();
    const updateMutation = useUpdateHoliday();
    const deleteMutation = useDeleteHoliday();

    const holidays = data?.data ?? [];
    const meta = data?.meta;
    const createErrors = extractErrors(createMutation.error);
    const updateErrors = extractErrors(updateMutation.error);
    const isSaving = createMutation.isPending || updateMutation.isPending;

    const recurringCount = allHolidays.filter((h) => h.is_recurring_yearly).length;

    function handlePage(page: number) {
        setFilters((prev) => ({ ...prev, page }));
    }

    function openCreate() {
        setEditingHoliday(null);
        createMutation.reset();
        updateMutation.reset();
        setFormOpen(true);
    }

    function openEdit(holiday: Holiday) {
        setEditingHoliday(holiday);
        createMutation.reset();
        updateMutation.reset();
        setFormOpen(true);
    }

    function handleSave(data: HolidayFormData) {
        if (editingHoliday) {
            updateMutation.mutate(
                { id: editingHoliday.id, data },
                {
                    onSuccess: () => {
                        setFormOpen(false);
                        setEditingHoliday(null);
                        addToast('success', 'Hari libur berhasil diperbarui.');
                    },
                },
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => {
                    setFormOpen(false);
                    addToast('success', 'Hari libur berhasil ditambahkan.');
                },
            });
        }
    }

    function handleDelete(holiday: Holiday) {
        deleteMutation.mutate(holiday.id, {
            onSuccess: () => {
                setDeleteConfirm(null);
                addToast('success', 'Hari libur berhasil dihapus.');
            },
        });
    }

    function closeForm() {
        setFormOpen(false);
        setEditingHoliday(null);
    }

    const branchOptions = [
        { value: '', label: 'Semua Cabang' },
        { value: '__default__', label: 'Utama' },
        ...branches.map((b) => ({ value: b.id, label: b.name })),
    ];

    return (
        <TenantLayout>
            <Head title="Hari Libur" />

            {/* Breadcrumb */}
            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/company/holidays" className="transition-colors hover:text-neutral-700">Perusahaan</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Holidays</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Hari Libur</h1>
                        <p className="mt-1.5 text-sm text-neutral-500">
                            Kelola hari libur perusahaan, termasuk hari libur nasional dan cuti bersama.
                        </p>
                    </div>
                    <Button onClick={openCreate} className="shrink-0">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah Hari Libur
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <FadeIn delay={0.03}>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                                {statIcons.calendar}
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{meta?.total ?? allHolidays.length}</p>
                                <p className="text-xs text-neutral-500">Total Libur</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.06}>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-50 text-warning">
                                {statIcons.check}
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{recurringCount}</p>
                                <p className="text-xs text-neutral-500">Berulang</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.09}>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success">
                                {statIcons.year}
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{thisYear}</p>
                                <p className="text-xs text-neutral-500">Tahun Aktif</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.12}>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-50 text-danger">
                                {statIcons.upcoming}
                            </div>
                            <div className="min-w-0">
                                {upcoming ? (
                                    <>
                                        <p className="text-sm font-semibold text-neutral-900 truncate">{upcoming.name}</p>
                                        <p className="text-xs text-neutral-500">{formatDate(upcoming.date_start)}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm font-semibold text-neutral-900">-</p>
                                        <p className="text-xs text-neutral-500">Akan Datang</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* Filters */}
            <FadeIn delay={0.05}>
                <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Cari hari libur..."
                                className="w-full rounded-xl border border-neutral-300 py-2.5 pl-10 pr-3.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="w-full sm:w-48">
                                <Select
                                    value={filters.branch_id ?? ''}
                                    onChange={(v) => setFilters((prev) => ({ ...prev, branch_id: v, page: 1 }))}
                                    options={branchOptions}
                                    placeholder="Semua Cabang"
                                />
                            </div>
                            <Select
                                value={String(filters.per_page ?? 15)}
                                onChange={(v) => setFilters((prev) => ({ ...prev, per_page: Number(v), page: 1 }))}
                                options={[
                                    { value: '10', label: '10 per halaman' },
                                    { value: '15', label: '15 per halaman' },
                                    { value: '25', label: '25 per halaman' },
                                    { value: '50', label: '50 per halaman' },
                                ]}
                                placeholder="Per halaman"
                            />
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Table Card */}
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
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                            >
                                Muat Ulang
                            </button>
                        </div>
                    ) : isLoading ? (
                        <div className="animate-pulse p-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4 py-4">
                                    <div className="h-5 w-36 rounded bg-neutral-200" />
                                    <div className="h-5 w-28 rounded bg-neutral-200" />
                                    <div className="h-5 w-20 rounded-full bg-neutral-200" />
                                    <div className="h-5 w-20 rounded bg-neutral-200" />
                                    <div className="flex flex-1 justify-end gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                                        <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : holidays.length === 0 ? (
                        <div className="flex flex-col items-center gap-4 px-6 py-16">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                                <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-neutral-900">Belum ada hari libur</p>
                                <p className="mt-1 text-sm text-neutral-500">Tambahkan hari libur baru untuk memulai.</p>
                            </div>
                            <Button onClick={openCreate} variant="outline" size="sm">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Tambah Hari Libur
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Mobile: Cards */}
                            <div className="divide-y divide-neutral-100 lg:hidden">
                                {holidays.map((holiday) => (
                                    <div key={holiday.id} className={cn(
                                        'px-4 py-4 transition-colors',
                                        upcoming?.id === holiday.id ? 'bg-primary-50/30' : 'hover:bg-neutral-50',
                                    )}>
                                        <div className="flex items-start justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-neutral-900">{holiday.name}</p>
                                                    {upcoming?.id === holiday.id && (
                                                        <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary">Akan datang</span>
                                                    )}
                                                </div>
                                                <p className="mt-0.5 text-xs text-neutral-500">
                                                    {formatDate(holiday.date_start)} - {formatDate(holiday.date_end)}
                                                </p>
                                            </div>
                                            <div className="ml-3 inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                                <button onClick={() => openEdit(holiday)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary dark:hover:bg-neutral-800 dark:hover:text-white" title="Edit">
                                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                </button>
                                                <div className="h-4 w-px bg-neutral-200" />
                                                <button onClick={() => setDeleteConfirm(holiday)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger" title="Hapus">
                                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            {holiday.is_recurring_yearly && <Badge variant="warning">Berulang</Badge>}
                                            {holiday.branch_name && (
                                                <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                                                    {holiday.branch_name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop: Table */}
                            <table className="hidden min-w-full divide-y divide-neutral-200 lg:table">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Nama</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Tanggal</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Berulang</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Cabang</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 bg-white">
                                    {holidays.map((holiday) => (
                                        <tr key={holiday.id} className={cn('transition-colors', upcoming?.id === holiday.id ? 'bg-primary-50/30' : 'hover:bg-neutral-50')}>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-neutral-900">{holiday.name}</p>
                                                    {upcoming?.id === holiday.id && <Badge variant="default">Akan datang</Badge>}
                                                </div>
                                                {holiday.description && <p className="truncate text-sm text-neutral-500 max-w-[200px]">{holiday.description}</p>}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">
                                                {formatDate(holiday.date_start)} - {formatDate(holiday.date_end)}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                {holiday.is_recurring_yearly ? <Badge variant="warning">Berulang</Badge> : <span className="text-sm text-neutral-400">-</span>}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">
                                                {holiday.branch_name || <span className="text-neutral-400">Semua</span>}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex justify-end">
                                                    <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                                        <button onClick={() => openEdit(holiday)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary dark:hover:bg-neutral-800 dark:hover:text-white" title="Edit">
                                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                            </svg>
                                                        </button>
                                                        <div className="h-4 w-px bg-neutral-200" />
                                                        <button onClick={() => setDeleteConfirm(holiday)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger" title="Hapus">
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

            {/* Holiday Form Modal */}
            {formOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={closeForm} />
                    <div className="relative w-full max-w-2xl animate-[fade-up_0.3s_ease-out] rounded-2xl bg-white p-6 shadow-2xl lg:p-8">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-neutral-900">
                                {editingHoliday ? 'Edit Hari Libur' : 'Tambah Hari Libur'}
                            </h2>
                            <button onClick={closeForm} className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <HolidayForm
                            holiday={editingHoliday}
                            saving={isSaving}
                            errors={editingHoliday ? updateErrors : createErrors}
                            onSave={handleSave}
                        />
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
                    <div className="relative w-full max-w-sm animate-[fade-up_0.3s_ease-out] rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-danger-light">
                            <svg className="h-7 w-7 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <h3 className="mb-1 text-center text-lg font-semibold text-neutral-900">Hapus Hari Libur</h3>
                        <p className="mb-6 text-center text-sm text-neutral-600">
                            Apakah Anda yakin ingin menghapus <strong className="text-neutral-900">{deleteConfirm.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        {deleteMutation.isError && (
                            <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-danger-light px-4 py-3 text-sm text-danger">
                                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                                {extractMessage(deleteMutation.error)}
                            </div>
                        )}
                        <div className="flex justify-center gap-3">
                            <Button variant="secondary" onClick={() => setDeleteConfirm(null)} disabled={deleteMutation.isPending}>
                                Batal
                            </Button>
                            <Button onClick={() => handleDelete(deleteConfirm)} disabled={deleteMutation.isPending} className="bg-danger text-white hover:bg-danger">
                                {deleteMutation.isPending ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Menghapus...
                                    </span>
                                ) : 'Hapus'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </TenantLayout>
    );
}
