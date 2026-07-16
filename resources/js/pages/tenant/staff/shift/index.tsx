import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import FadeIn from '@/atoms/FadeIn';
import Button from '@/atoms/Button';
import { useShiftCalendar, useBulkAssignShift, useDeleteShifts } from '@/features/staff/hooks/useShiftAssignment';
import { useAllStaff } from '@/features/staff/hooks/useStaff';
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

    const { data: calendarData, isLoading } = useShiftCalendar({ start_date: startDate, end_date: endDate, branch_id: selectedBranch || undefined });
    const { data: staffData } = useAllStaff();
    const bulkAssignMut = useBulkAssignShift();
    const deleteMut = useDeleteShifts();

    const staffList = (staffData?.data ?? []).filter((s) => s.is_active);
    const assignments = calendarData?.data?.assignments ?? [];

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
        setSelectedStaff((prev) => prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId]);
    }

    function selectAllStaff() {
        setSelectedStaff(staffList.map((s) => s.id));
    }

    async function handleBulkAssign() {
        if (selectedStaff.length === 0) {
            addToast('error', 'Pilih staff terlebih dahulu.');
            return;
        }

        const assignmentsPayload = [];
        for (const staffId of selectedStaff) {
            for (const date of weekDates) {
                assignmentsPayload.push({
                    staff_id: staffId,
                    date: formatDate(date),
                    start_time: shiftStart,
                    end_time: shiftEnd,
                });
            }
        }

        try {
            await bulkAssignMut.mutateAsync(assignmentsPayload);
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

    return (
        <Head title="Shift Assignment">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        </Head>,
        <FadeIn>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">Shift Assignment</h1>
                        <p className="mt-1 text-sm text-neutral-500">Assign shift kerja staff per minggu</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={prevWeek}>
                            <span className="material-symbols-rounded text-sm">chevron_left</span>
                        </Button>
                        <span className="text-sm font-semibold text-neutral-700 min-w-[180px] text-center">
                            {weekDates[0].toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} — {weekDates[6].toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <Button variant="secondary" size="sm" onClick={nextWeek}>
                            <span className="material-symbols-rounded text-sm">chevron_right</span>
                        </Button>
                    </div>
                </div>

                {/* Assign Panel */}
                <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                    <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                        <span className="material-symbols-rounded text-sm">edit_calendar</span>
                        Assign Shift
                    </p>
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <label className="mb-1 block text-xs font-medium text-neutral-500">Staff</label>
                            <div className="flex flex-wrap gap-1.5">
                                <button
                                    type="button"
                                    onClick={selectAllStaff}
                                    className={cn(
                                        'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                                        selectedStaff.length === staffList.length ? 'border-primary bg-primary text-white' : 'border-neutral-200 text-neutral-600 hover:border-primary/50',
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
                                            selectedStaff.includes(s.id) ? 'border-primary bg-primary text-white' : 'border-neutral-200 text-neutral-600 hover:border-primary/50',
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
                                className="rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                style={{ borderColor: 'rgba(0,0,0,0.1)' }}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-neutral-500">Jam Selesai</label>
                            <input
                                type="time"
                                value={shiftEnd}
                                onChange={(e) => setShiftEnd(e.target.value)}
                                className="rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                style={{ borderColor: 'rgba(0,0,0,0.1)' }}
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

                {/* Calendar Grid */}
                <div className="rounded-2xl border bg-white shadow-sm overflow-hidden" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                    {isLoading ? (
                        <div className="p-6 text-center text-sm text-neutral-400">Memuat data...</div>
                    ) : assignments.length === 0 ? (
                        <div className="p-10 text-center">
                            <span className="material-symbols-rounded text-4xl text-neutral-300">calendar_month</span>
                            <p className="mt-2 text-sm text-neutral-400">Belum ada shift assignment minggu ini</p>
                            <p className="text-xs text-neutral-300">Pilih staff dan klik "Assign ke Semua Hari"</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-neutral-50" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-neutral-400">Staff</th>
                                        {weekDates.map((d, i) => (
                                            <th key={i} className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-400 min-w-[120px]">
                                                {formatDayLabel(d)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                                    {assignments.map((a) => (
                                        <tr key={a.staff_id} className="hover:bg-neutral-50/50">
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-neutral-900">{a.staff_name}</p>
                                            </td>
                                            {weekDates.map((d, i) => {
                                                const shift = getShiftForDate(a, formatDate(d));

                                                return (
                                                    <td key={i} className="px-3 py-3 text-center">
                                                        {shift ? (
                                                            <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5" style={{ backgroundColor: 'rgba(107,56,212,0.08)' }}>
                                                                <span className="text-xs font-semibold text-primary">
                                                                    {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveShift(a.staff_id, formatDate(d))}
                                                                    className="ml-1 rounded p-0.5 text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger"
                                                                >
                                                                    <span className="material-symbols-rounded text-xs">close</span>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-neutral-300">—</span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </FadeIn>
    );
}
