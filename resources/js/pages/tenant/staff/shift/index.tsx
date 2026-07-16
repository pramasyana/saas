import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import { useShiftCalendar, useBulkAssignShift, useDeleteShifts } from '@/features/staff/hooks/useShiftAssignment';
import { useAllStaff } from '@/features/staff/hooks/useStaff';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import TenantLayout from '@/layouts/TenantLayout';
import { useToastStore } from '@/stores/toast';
import { cn } from '@/lib/utils';

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

export default function ShiftIndex() {
    const addToast = useToastStore((s) => s.addToast);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
    const [shiftStart, setShiftStart] = useState('09:00');
    const [shiftEnd, setShiftEnd] = useState('17:00');

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

    const totalShiftsThisWeek = assignments.reduce((sum, a) => sum + a.shifts.length, 0);
    const totalStaffAssigned = assignments.length;

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
            addToast('success', 'Shift berhasil disimpan.');
            setSelectedStaff([]);
        } catch {
            addToast('error', 'Gagal menyimpan shift.');
        }
    }

    async function handleRemoveShift(staffId: string, date: string) {
        try {
            await deleteMut.mutateAsync([{ staff_id: staffId, date }]);
            addToast('success', 'Shift dihapus.');
        } catch {
            addToast('error', 'Gagal menghapus shift.');
        }
    }

    function getShiftForDate(staffAssignments: typeof assignments[0], date: string) {
        return staffAssignments.shifts.find((s) => s.date === date);
    }

    function renderSkeleton() {
        return (
            <div className="animate-pulse p-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4 py-4">
                        <div className="h-9 w-9 rounded-full bg-neutral-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3.5 w-32 rounded bg-neutral-200" />
                        </div>
                        {Array.from({ length: 7 }).map((_, j) => (
                            <div key={j} className="h-8 w-24 rounded-lg bg-neutral-100" />
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
            <div className="flex flex-col items-center gap-5 px-6 py-20">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-100">
                    <svg className="h-10 w-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="text-base font-semibold text-neutral-900">Belum ada shift</p>
                    <p className="mt-1 text-sm text-neutral-500">Pilih staff dan assign shift untuk minggu ini.</p>
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
                        <p className="mt-1 text-xs text-neutral-500">{a.shifts.length} shift minggu ini</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            if (window.confirm(`Hapus semua shift ${a.staff_name} minggu ini?`)) {
                                const items = a.shifts.map((s) => ({ staff_id: a.staff_id, date: s.date }));
                                deleteMut.mutateAsync(items).then(() => addToast('success', 'Semua shift dihapus.')).catch(() => addToast('error', 'Gagal menghapus.'));
                            }
                        }}
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger"
                        title="Hapus semua shift"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {a.shifts.map((s) => (
                        <Badge key={s.date} variant="default">
                            {new Date(s.date + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })} {s.start_time.slice(0, 5)}-{s.end_time.slice(0, 5)}
                        </Badge>
                    ))}
                </div>
            </div>
        );
    }

    function renderDesktopRow(a: typeof assignments[0]) {
        return (
            <tr key={a.staff_id} className="transition-colors hover:bg-neutral-50">
                <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-semibold text-neutral-900">{a.staff_name}</p>
                </td>
                {weekDates.map((d, i) => {
                    const shift = getShiftForDate(a, formatDate(d));
                    return (
                        <td key={i} className="px-3 py-3 text-center">
                            {shift ? (
                                <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5">
                                    <span className="text-xs font-semibold text-primary">
                                        {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveShift(a.staff_id, formatDate(d))}
                                        className="ml-1 rounded p-0.5 text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger"
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
                <td className="whitespace-nowrap px-6 py-4">
                    <Badge variant={a.shifts.length > 0 ? 'success' : 'default'}>
                        {a.shifts.length} shift
                    </Badge>
                </td>
            </tr>
        );
    }

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

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Shift Assignment</h1>
                    <p className="mt-1 text-sm text-neutral-500">Assign shift kerja staff per minggu.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={prevWeek}>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </Button>
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
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-2xl font-bold tracking-tight text-neutral-900">{totalShiftsThisWeek}</p>
                            <p className="text-sm text-neutral-500">Total Shift</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success-50 text-success">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-2xl font-bold tracking-tight text-neutral-900">{totalStaffAssigned}</p>
                            <p className="text-sm text-neutral-500">Staff Di-assign</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md sm:col-span-1">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-2xl font-bold tracking-tight text-neutral-900">{staffList.length}</p>
                            <p className="text-sm text-neutral-500">Staff Aktif</p>
                        </div>
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.06}>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Select
                        value={selectedBranch}
                        onChange={(v) => setSelectedBranch(v)}
                        options={branchOptions}
                        placeholder="Semua Cabang"
                        className="w-full sm:flex-1 sm:min-w-0"
                    />
                </div>
            </FadeIn>

            <FadeIn delay={0.09}>
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                    <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Assign Shift
                    </p>
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="min-w-0 flex-1">
                            <label className="mb-1 block text-xs font-medium text-neutral-500">Staff</label>
                            <div className="flex flex-wrap gap-1.5">
                                <button
                                    type="button"
                                    onClick={selectAllStaff}
                                    className={cn(
                                        'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                                        selectedStaff.length === staffList.length && staffList.length > 0
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-neutral-200 text-neutral-600 hover:border-primary/50',
                                    )}
                                >
                                    Semua
                                </button>
                                {staffList.map((s) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => toggleStaff(s.id)}
                                        className={cn(
                                            'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                                            selectedStaff.includes(s.id)
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-neutral-200 text-neutral-600 hover:border-primary/50',
                                        )}
                                    >
                                        {s.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-neutral-500">Jam Mulai</label>
                            <input
                                type="time"
                                value={shiftStart}
                                onChange={(e) => setShiftStart(e.target.value)}
                                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-neutral-500">Jam Selesai</label>
                            <input
                                type="time"
                                value={shiftEnd}
                                onChange={(e) => setShiftEnd(e.target.value)}
                                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleBulkAssign}
                            disabled={selectedStaff.length === 0 || bulkAssignMut.isPending}
                        >
                            {bulkAssignMut.isPending ? 'Menyimpan...' : 'Assign ke Semua Hari'}
                        </Button>
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.12}>
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

                            <table className="hidden min-w-full divide-y divide-neutral-200 lg:table">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Staff</th>
                                        {weekDates.map((d, i) => (
                                            <th key={i} className="px-3 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 min-w-[120px]">
                                                {formatDayLabel(d)}
                                            </th>
                                        ))}
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 bg-white">
                                    {assignments.map(renderDesktopRow)}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </FadeIn>
        </TenantLayout>
    );
}
