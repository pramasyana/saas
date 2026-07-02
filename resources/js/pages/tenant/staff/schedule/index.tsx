import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import TenantLayout from '@/layouts/TenantLayout';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import Button from '@/atoms/Button';
import Badge from '@/atoms/Badge';
import { useSchedules, useUpdateSchedules } from '@/features/staff/hooks/useSchedule';
import { useAllStaff } from '@/features/staff/hooks/useStaff';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import { useWorkingHours } from '@/features/company/hooks/useWorkingHours';
import { useToastStore } from '@/stores/toast';
import type { StaffSchedule } from '@/features/staff/types';
import type { WorkingHour } from '@/features/company/types';
import { cn } from '@/lib/utils';

const DAY_LABELS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function defaultSchedules(): StaffSchedule[] {
    return DAY_LABELS.map((_, i) => ({
        staff_id: '',
        day_of_week: i,
        is_active: i !== 0,
        start_time: i !== 0 ? '08:00' : null,
        end_time: i !== 0 ? '17:00' : null,
    }));
}

function getSummary(schedules: StaffSchedule[]): string {
    const activeDays = schedules.filter((s) => s.is_active);
    if (activeDays.length === 0) return 'Tidak bekerja';
    if (activeDays.length === 7) return 'Bekerja setiap hari';
    const dayNames = activeDays.map((s) => DAY_LABELS[s.day_of_week].slice(0, 3));
    if (activeDays.length <= 3) return `Bekerja: ${dayNames.join(', ')}`;
    return `Bekerja ${activeDays.length} hari/minggu`;
}

function getBranchSummary(hours: WorkingHour[]): { openCount: number; summary: string } {
    const openDays = hours.filter((h) => h.is_open);
    const count = openDays.length;
    if (openDays.length === 0) return { openCount: count, summary: 'Tutup setiap hari' };
    if (openDays.length === 7) return { openCount: count, summary: 'Buka setiap hari' };
    const dayNames = openDays.map((h) => DAY_LABELS[h.day_of_week].slice(0, 3));
    if (openDays.length <= 3) return { openCount: count, summary: `Buka: ${dayNames.join(', ')}` };
    return { openCount: count, summary: `Buka ${openDays.length} hari/minggu` };
}

export default function StaffSchedulePage() {
    const addToast = useToastStore((s) => s.addToast);
    const queryClient = useQueryClient();
    const [selectedStaff, setSelectedStaff] = useState<string>('');
    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const hasAutoSelected = useRef(false);

    const { data: staffData } = useAllStaff();
    const allStaff = staffData?.data ?? [];

    const { data: branchesData } = useAllBranches();
    const branches = branchesData?.data ?? [];
    const showBranchSelector = branches.length > 0;

    const branchId = selectedBranch === '__default__' ? null : selectedBranch || null;
    const { data: workingHours = [], isLoading: whLoading } = useWorkingHours(branchId);

    useEffect(() => {
        if (!selectedBranch && !hasAutoSelected.current) {
            setSelectedBranch('__default__');
            hasAutoSelected.current = true;
        }
    }, [selectedBranch]);

    useEffect(() => {
        if (selectedBranch) {
            queryClient.refetchQueries({ queryKey: ['company', 'working-hours', branchId] });
        }
    }, [selectedBranch, branchId, queryClient]);

    const filteredStaff = selectedBranch === '__default__'
        ? allStaff.filter((s) => !s.branch_id)
        : selectedBranch
            ? allStaff.filter((s) => s.branch_id === selectedBranch)
            : allStaff;

    const { openCount, summary: branchSummary } = workingHours.length > 0
        ? getBranchSummary(workingHours)
        : { openCount: 0, summary: '' };

    const { data: schedules = [], isLoading } = useSchedules(selectedStaff || null);
    const mutation = useUpdateSchedules();

    const [localSchedules, setLocalSchedules] = useState<StaffSchedule[]>(defaultSchedules());

    useEffect(() => {
        if (schedules.length > 0) {
            const merged = DAY_LABELS.map((_, i) => {
                const existing = schedules.find((s: StaffSchedule) => s.day_of_week === i);
                return existing || { staff_id: selectedStaff, day_of_week: i, is_active: true, start_time: '08:00', end_time: '17:00' };
            });
            setLocalSchedules(merged);
        } else if (!isLoading && selectedStaff) {
            setLocalSchedules(defaultSchedules());
        }
    }, [schedules, isLoading, selectedStaff]);

    function toggleDay(index: number) {
        setLocalSchedules((prev) =>
            prev.map((s, i) => (i === index ? { ...s, is_active: !s.is_active } : s)),
        );
    }

    function updateTime(index: number, field: 'start_time' | 'end_time', value: string) {
        setLocalSchedules((prev) =>
            prev.map((s, i) => (i === index ? { ...s, [field]: value || null } : s)),
        );
    }

    function handleBranchChange(v: string) {
        setSelectedBranch(v);
        setSelectedStaff('');
    }

    function handleSave() {
        if (!selectedStaff) return;
        mutation.mutate(
            { staff_id: selectedStaff, schedules: localSchedules },
            {
                onSuccess: () => {
                    addToast('success', 'Jadwal berhasil diperbarui.');
                },
            },
        );
    }

    const summary = selectedStaff ? getSummary(localSchedules) : '';
    const staffName = selectedStaff ? allStaff.find((s) => s.id === selectedStaff)?.name ?? '-' : '-';

    const branchOptions = [
        { value: '__default__', label: 'Utama' },
        ...branches.map((b) => ({ value: b.id, label: b.name })),
    ];

    const staffOptions = filteredStaff.map((s) => ({ value: s.id, label: s.name }));

    const branchName = selectedBranch === '__default__'
        ? 'Utama'
        : selectedBranch
            ? branches.find((b) => b.id === selectedBranch)?.name ?? '-'
            : '-';

    return (
        <TenantLayout>
            <Head title="Jadwal Staff" />

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/staff" className="transition-colors hover:text-neutral-700">Staff</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Jadwal</span>
            </nav>

            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Jadwal Staff</h1>
                <p className="mt-1.5 text-sm text-neutral-500">Atur jadwal kerja karyawan.</p>
            </div>

            <FadeIn delay={0.03}>
                <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-6 sm:p-8">
                        <div className="flex items-center gap-5">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white shadow-lg ring-4 ring-white/20 backdrop-blur-sm">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="min-w-0 text-white">
                                <h2 className="text-xl font-bold truncate">Jadwal Kerja</h2>
                                <p className="mt-1 text-sm text-white/80">{selectedStaff ? summary : branchSummary || 'Pilih cabang terlebih dahulu'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 sm:grid-cols-4">
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Staff</p>
                            <p className="mt-1 text-sm font-semibold text-neutral-900 truncate">{staffName}</p>
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Hari Kerja</p>
                            <p className="mt-1 text-sm font-semibold text-success">{openCount} hari</p>
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Hari Libur</p>
                            <p className="mt-1 text-sm font-semibold text-neutral-900">{7 - openCount} hari</p>
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-xs font-medium text-neutral-400">Cabang</p>
                            <p className="mt-1 text-sm font-semibold text-neutral-900 truncate">{branchName}</p>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {showBranchSelector && (
                <FadeIn delay={0.04}>
                    <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-neutral-900">Pilih Cabang</h3>
                                <p className="text-xs text-neutral-500">Filter staff berdasarkan cabang.</p>
                            </div>
                            <div className="w-full sm:w-64">
                                <Select
                                    value={selectedBranch}
                                    onChange={handleBranchChange}
                                    options={branchOptions}
                                    placeholder="Cabang utama"
                                />
                            </div>
                        </div>
                    </div>
                </FadeIn>
            )}

            {showBranchSelector && selectedBranch && (
                <FadeIn delay={0.05}>
                    <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-neutral-900">Pilih Staff</h3>
                                <p className="text-xs text-neutral-500">Atur jadwal per staff secara terpisah.</p>
                            </div>
                            <div className="w-full sm:w-64">
                                <Select
                                    value={selectedStaff}
                                    onChange={setSelectedStaff}
                                    options={staffOptions}
                                    placeholder="Pilih staff..."
                                />
                            </div>
                        </div>
                    </div>
                </FadeIn>
            )}

            {selectedStaff && (
                <FadeIn delay={0.06}>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
                        <div className="mb-6 flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-neutral-900">Jam Kerja - {staffName}</h3>
                                <p className="text-xs text-neutral-500">Atur jam kerja untuk setiap hari.</p>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {localSchedules.map((schedule, index) => (
                                    <div key={schedule.day_of_week} className={cn(
                                        'rounded-xl border p-4 transition-all duration-200',
                                        schedule.is_active
                                            ? 'border-primary/20 bg-primary-50/30'
                                            : 'border-neutral-200 bg-neutral-50',
                                    )}>
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleDay(index)}
                                                    className={cn(
                                                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/30',
                                                        schedule.is_active ? 'bg-primary' : 'bg-neutral-300',
                                                    )}
                                                >
                                                    <span className={cn(
                                                        'inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                                                        schedule.is_active ? 'translate-x-5' : 'translate-x-0',
                                                    )} />
                                                </button>
                                                <div>
                                                    <p className={cn(
                                                        'text-sm font-medium',
                                                        schedule.is_active ? 'text-neutral-900' : 'text-neutral-400',
                                                    )}>
                                                        {DAY_LABELS[schedule.day_of_week]}
                                                    </p>
                                                    {schedule.is_active && schedule.start_time && schedule.end_time && (
                                                        <p className="text-xs text-neutral-500">
                                                            {schedule.start_time} - {schedule.end_time}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {schedule.is_active && (
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <label className="block text-xs text-neutral-500 mb-0.5">Masuk</label>
                                                        <input
                                                            type="time"
                                                            value={schedule.start_time || '08:00'}
                                                            onChange={(e) => updateTime(index, 'start_time', e.target.value)}
                                                            className="w-32 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-neutral-500 mb-0.5">Pulang</label>
                                                        <input
                                                            type="time"
                                                            value={schedule.end_time || '17:00'}
                                                            onChange={(e) => updateTime(index, 'end_time', e.target.value)}
                                                            className="w-32 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-end pt-4 border-t border-neutral-200">
                                    <Button onClick={handleSave} disabled={mutation.isPending}>
                                        {mutation.isPending ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Menyimpan...
                                            </span>
                                        ) : 'Simpan Jadwal'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </FadeIn>
            )}

            {!selectedStaff && (
                <FadeIn delay={0.06}>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
                        <div className="flex flex-col items-center gap-4 py-12">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                                <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-neutral-900">Pilih Staff</p>
                                <p className="mt-1 text-sm text-neutral-500">Pilih staff terlebih dahulu untuk mengatur jadwal kerja.</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            )}
        </TenantLayout>
    );
}
