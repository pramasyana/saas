import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import { useShiftCalendar, useBulkAssignShift, useDeleteShifts } from '@/features/staff/hooks/useShiftAssignment';
import { useAllStaff } from '@/features/staff/hooks/useStaff';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/stores/toast';

function getWeekDates(date: Date): Date[] {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1);

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(d.getDate() + i);

        return d;
    });
}

function formatDate(d: Date): string {
    return d.toISOString().split('T')[0];
}

function formatDayLabel(d: Date): string {
    return d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
}

function formatFullDate(d: Date): string {
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
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

export default function ShiftIndex() {
    const addToast = useToastStore((s) => s.addToast);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
    const [shiftStart, setShiftStart] = useState('09:00');
    const [shiftEnd, setShiftEnd] = useState('17:00');
    const [deleteTarget, setDeleteTarget] = useState<{ staffId: string; staffName: string; date: string } | null>(null);
    const [deleteAllTarget, setDeleteAllTarget] = useState<{ staffId: string; staffName: string; count: number } | null>(null);

    const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);
    const startDate = formatDate(weekDates[0]);
    const endDate = formatDate(weekDates[6]);

    const { data: calendarData, isLoading, isError, error } = useShiftCalendar({
        start_date: startDate,
        end_date: endDate,
        branch_id: selectedBranch || undefined,
    });
    const { data: staffData } = useAllStaff();
    const { data: branchesData } = useAllBranches();
    const bulkAssignMut = useBulkAssignShift();
    const deleteMut = useDeleteShifts();

    const staffList = (staffData?.data ?? []).filter((s) => s.is_active);
    const branches = branchesData?.data ?? [];
    const assignments = calendarData?.data?.assignments ?? [];

    const totalShifts = assignments.reduce((sum, a) => sum + a.shifts.length, 0);
    const staffWithShifts = assignments.length;
    const staffWithoutShifts = staffList.length - staffWithShifts;

    const branchOptions = [
        { value: '', label: 'Semua Cabang' },
        ...branches.map((b) => ({ value: b.id, label: b.name })),
    ];

    function prevWeek() {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - 7);
        setCurrentDate(d);
    }

    function nextWeek() {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + 7);
        setCurrentDate(d);
    }

    function goToThisWeek() {
        setCurrentDate(new Date());
    }

    function toggleStaff(staffId: string) {
        setSelectedStaff((prev) =>
            prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId],
        );
    }

    function selectAllStaff() {
        setSelectedStaff(staffList.map((s) => s.id));
    }

    async function handleBulkAssign() {
        if (selectedStaff.length === 0) {
            addToast('error', 'Pilih staff terlebih dahulu.');

            return;
        }

        const payload = [];

        for (const staffId of selectedStaff) {
            for (const date of weekDates) {
                payload.push({
                    staff_id: staffId,
                    date: formatDate(date),
                    start_time: shiftStart,
                    end_time: shiftEnd,
                });
            }
        }

        try {
            await bulkAssignMut.mutateAsync(payload);
            addToast('success', `${selectedStaff.length} staff berhasil di-assign shift.`);
            setSelectedStaff([]);
        } catch {
            addToast('error', 'Gagal menyimpan shift.');
        }
    }

    function confirmDeleteShift(staffId: string, staffName: string, date: string) {
        setDeleteTarget({ staffId, staffName, date });
    }

    async function handleDeleteShift() {
        if (!deleteTarget) {
return;
}

        try {
            await deleteMut.mutateAsync([{ staff_id: deleteTarget.staffId, date: deleteTarget.date }]);
            addToast('success', `Shift ${deleteTarget.staffName} dihapus.`);
            setDeleteTarget(null);
        } catch {
            addToast('error', 'Gagal menghapus shift.');
        }
    }

    function confirmDeleteAll(staffId: string, staffName: string, count: number) {
        setDeleteAllTarget({ staffId, staffName, count });
    }

    async function handleDeleteAll() {
        if (!deleteAllTarget) {
return;
}

        const items = assignments
            .find((a) => a.staff_id === deleteAllTarget.staffId)
            ?.shifts.map((s) => ({ staff_id: deleteAllTarget.staffId, date: s.date })) ?? [];

        try {
            await deleteMut.mutateAsync(items);
            addToast('success', `Semua shift ${deleteAllTarget.staffName} dihapus.`);
            setDeleteAllTarget(null);
        } catch {
            addToast('error', 'Gagal menghapus shift.');
        }
    }

    function getShiftForDate(a: typeof assignments[0], date: string) {
        return a.shifts.find((s) => s.date === date);
    }

    function renderSkeleton() {
        return (
            <div className="animate-pulse p-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4 py-4">
                        <div className="h-9 w-9 rounded-full bg-neutral-200" />
                        <div className="h-3.5 w-32 rounded bg-neutral-200" />
                        {Array.from({ length: 7 }).map((_, j) => (
                            <div key={j} className="ml-auto h-8 w-20 rounded-lg bg-neutral-100" />
                        ))}
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
                    <p className="mt-1 text-sm text-neutral-500">{extractMessage(error) || 'Terjadi kesalahan. Coba lagi.'}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90"
                >
                    Muat Ulang
                </button>
            </div>
        );
    }

    function renderEmpty() {
        return (
            <div className="flex flex-col items-center gap-5 px-6 py-16">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
                    <svg className="h-10 w-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="text-base font-semibold text-neutral-900">Belum ada shift minggu ini</p>
                    <p className="mt-1 text-sm text-neutral-500">Pilih staff di atas lalu klik "Assign Shift" untuk memulai.</p>
                </div>
            </div>
        );
    }

    function renderMobileCard(a: typeof assignments[0]) {
        return (
            <div key={a.staff_id} className="border-b border-neutral-100 px-4 py-4 transition-colors last:border-b-0 hover:bg-neutral-50">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-neutral-900">{a.staff_name}</p>
                        <p className="mt-0.5 text-xs text-neutral-500">{a.shifts.length} shift minggu ini</p>
                    </div>
                    <div className="inline-flex shrink-0 items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                        <button
                            onClick={() => confirmDeleteAll(a.staff_id, a.staff_name, a.shifts.length)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger"
                            title="Hapus semua shift"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {a.shifts.map((s) => (
                        <span
                            key={s.date}
                            className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/10"
                        >
                            {new Date(s.date + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })} {s.start_time.slice(0, 5)}-{s.end_time.slice(0, 5)}
                        </span>
                    ))}
                </div>
            </div>
        );
    }

    function renderDesktopRow(a: typeof assignments[0]) {
        return (
            <tr key={a.staff_id} className="transition-colors hover:bg-neutral-50">
                <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary">
                            {a.staff_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-neutral-900">{a.staff_name}</p>
                            <p className="text-xs text-neutral-500">{a.shifts.length} shift</p>
                        </div>
                    </div>
                </td>
                {weekDates.map((d, i) => {
                    const shift = getShiftForDate(a, formatDate(d));
                    const isToday = formatDate(d) === formatDate(new Date());

                    return (
                        <td key={i} className="px-2 py-3 text-center">
                            {shift ? (
                                <div className={cn(
                                    'group relative inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5',
                                    isToday ? 'bg-primary text-white' : 'bg-primary-50',
                                )}>
                                    <span className={cn(
                                        'text-xs font-semibold',
                                        isToday ? 'text-white' : 'text-primary',
                                    )}>
                                        {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => confirmDeleteShift(a.staff_id, a.staff_name, formatDate(d))}
                                        className={cn(
                                            'ml-0.5 rounded p-0.5 transition-colors',
                                            isToday ? 'text-white/70 hover:bg-white/20 hover:text-white' : 'text-neutral-400 hover:bg-danger-50 hover:text-danger',
                                        )}
                                    >
                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <span className="text-xs text-neutral-300">—</span>
                            )}
                        </td>
                    );
                })}
                <td className="whitespace-nowrap px-6 py-4 text-right">
                    <button
                        onClick={() => confirmDeleteAll(a.staff_id, a.staff_name, a.shifts.length)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger"
                        title="Hapus semua shift minggu ini"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </td>
            </tr>
        );
    }

    const isThisWeek = formatDate(weekDates[0]) === formatDate(getWeekDates(new Date())[0]);

    return (
        <TenantLayout>
            <Head title="Shift Assignment" />

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/staff" className="transition-colors hover:text-neutral-700">Staff</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Shift</span>
            </nav>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Shift Assignment</h1>
                    <p className="mt-1.5 text-sm text-neutral-500">Atur jadwal shift kerja staff per minggu.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={prevWeek}>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </Button>
                    {!isThisWeek && (
                        <Button variant="ghost" size="sm" onClick={goToThisWeek}>
                            Hari Ini
                        </Button>
                    )}
                    <span className="min-w-[200px] text-center text-sm font-semibold text-neutral-700">
                        {weekDates[0].toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} — {weekDates[6].toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <Button variant="secondary" size="sm" onClick={nextWeek}>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </Button>
                </div>
            </div>

            <FadeIn delay={0.03}>
                <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-6 sm:p-8">
                        <div className="flex items-center gap-5">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white shadow-lg ring-4 ring-white/20 backdrop-blur-sm">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                            </div>
                            <div className="min-w-0 text-white">
                                <h2 className="text-xl font-bold truncate">Shift Minggu Ini</h2>
                                <p className="mt-1 text-sm text-white/80">{formatFullDate(weekDates[0])} — {formatFullDate(weekDates[6])}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 sm:grid-cols-4">
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Total Shift</p>
                            <p className="mt-1 text-sm font-semibold text-neutral-900">{totalShifts} shift</p>
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Staff Di-assign</p>
                            <p className="mt-1 text-sm font-semibold text-success">{staffWithShifts} staff</p>
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Belum Di-assign</p>
                            <p className={cn('mt-1 text-sm font-semibold', staffWithoutShifts > 0 ? 'text-warning' : 'text-neutral-900')}>{staffWithoutShifts} staff</p>
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Staff Aktif</p>
                            <p className="mt-1 text-sm font-semibold text-neutral-900">{staffList.length} staff</p>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {branches.length > 0 && (
                <FadeIn delay={0.04}>
                    <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-neutral-900">Cabang</h3>
                                <p className="text-xs text-neutral-500">Filter staff berdasarkan cabang.</p>
                            </div>
                            <div className="w-full sm:w-64">
                                <Select
                                    value={selectedBranch}
                                    onChange={(v) => setSelectedBranch(v)}
                                    options={branchOptions}
                                    placeholder="Semua Cabang"
                                />
                            </div>
                        </div>
                    </div>
                </FadeIn>
            )}

            <FadeIn delay={0.05}>
                <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="mb-4 flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-900">Pilih Staff</h3>
                            <p className="text-xs text-neutral-500">Pilih staff yang akan di-assign shift minggu ini.</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        <button
                            type="button"
                            onClick={selectAllStaff}
                            className={cn(
                                'rounded-lg border px-3.5 py-2 text-xs font-medium transition-all duration-200',
                                selectedStaff.length === staffList.length && staffList.length > 0
                                    ? 'border-primary bg-primary text-white shadow-sm'
                                    : 'border-neutral-200 text-neutral-600 hover:border-primary/50 hover:bg-primary-50',
                            )}
                        >
                            Pilih Semua
                        </button>
                        {staffList.map((s) => {
                            const hasShift = assignments.some((a) => a.staff_id === s.id);

                            return (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => toggleStaff(s.id)}
                                    className={cn(
                                        'inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition-all duration-200',
                                        selectedStaff.includes(s.id)
                                            ? 'border-primary bg-primary text-white shadow-sm'
                                            : 'border-neutral-200 text-neutral-600 hover:border-primary/50 hover:bg-primary-50',
                                    )}
                                >
                                    {s.name}
                                    {hasShift && !selectedStaff.includes(s.id) && (
                                        <span className="inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-success-50 px-1 text-[10px] font-bold text-success">
                                            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.06}>
                <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="mb-4 flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-900">Atur Jam Kerja</h3>
                            <p className="text-xs text-neutral-500">Tentukan jam masuk dan pulang untuk shift.</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-end gap-4">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-neutral-500">Jam Masuk</label>
                            <input
                                type="time"
                                value={shiftStart}
                                onChange={(e) => setShiftStart(e.target.value)}
                                className="w-32 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-neutral-500">Jam Pulang</label>
                            <input
                                type="time"
                                value={shiftEnd}
                                onChange={(e) => setShiftEnd(e.target.value)}
                                className="w-32 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                        <div className="flex-1" />
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleBulkAssign}
                            disabled={selectedStaff.length === 0 || bulkAssignMut.isPending}
                        >
                            {bulkAssignMut.isPending ? (
                                <span className="flex items-center gap-2">
                                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Menyimpan...
                                </span>
                            ) : (
                                <>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Assign Shift
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.09}>
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    {isError ? (
                        renderError()
                    ) : isLoading ? (
                        renderSkeleton()
                    ) : assignments.length === 0 ? (
                        renderEmpty()
                    ) : (
                        <>
                            <div className="divide-y divide-neutral-100 lg:hidden">
                                {assignments.map(renderMobileCard)}
                            </div>

                            <div className="hidden overflow-x-auto lg:block">
                                <table className="w-full text-sm">
                                    <thead className="bg-neutral-50">
                                        <tr>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Staff</th>
                                            {weekDates.map((d, i) => {
                                                const isToday = formatDate(d) === formatDate(new Date());

                                                return (
                                                    <th key={i} className={cn(
                                                        'px-3 py-3.5 text-center text-xs font-semibold uppercase tracking-wider min-w-[110px]',
                                                        isToday ? 'bg-primary-50 text-primary' : 'text-neutral-500',
                                                    )}>
                                                        {formatDayLabel(d)}
                                                    </th>
                                                );
                                            })}
                                            <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 bg-white">
                                        {assignments.map(renderDesktopRow)}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </FadeIn>

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
                    <div className="relative w-full max-w-sm animate-[fade-up_0.3s_ease-out] rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-danger-light">
                            <svg className="h-7 w-7 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </div>
                        <h3 className="mb-1 text-center text-lg font-semibold text-neutral-900">Hapus Shift</h3>
                        <p className="mb-6 text-center text-sm text-neutral-600">
                            Hapus shift <strong>{deleteTarget.staffName}</strong> pada <strong>{new Date(deleteTarget.date + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>?
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button variant="secondary" onClick={() => setDeleteTarget(null)} disabled={deleteMut.isPending}>Batal</Button>
                            <Button onClick={handleDeleteShift} disabled={deleteMut.isPending} className="bg-danger text-white hover:bg-danger">
                                {deleteMut.isPending ? 'Menghapus...' : 'Hapus'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {deleteAllTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteAllTarget(null)} />
                    <div className="relative w-full max-w-sm animate-[fade-up_0.3s_ease-out] rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-danger-light">
                            <svg className="h-7 w-7 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </div>
                        <h3 className="mb-1 text-center text-lg font-semibold text-neutral-900">Hapus Semua Shift</h3>
                        <p className="mb-6 text-center text-sm text-neutral-600">
                            Hapus <strong>{deleteAllTarget.count} shift</strong> milik <strong>{deleteAllTarget.staffName}</strong> minggu ini?
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button variant="secondary" onClick={() => setDeleteAllTarget(null)} disabled={deleteMut.isPending}>Batal</Button>
                            <Button onClick={handleDeleteAll} disabled={deleteMut.isPending} className="bg-danger text-white hover:bg-danger">
                                {deleteMut.isPending ? 'Menghapus...' : 'Hapus Semua'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </TenantLayout>
    );
}
