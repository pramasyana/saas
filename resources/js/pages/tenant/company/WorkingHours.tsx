import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import WorkingHourEditor from '@/features/company/components/WorkingHourEditor';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import { useWorkingHours, useUpdateWorkingHours } from '@/features/company/hooks/useWorkingHours';
import type { WorkingHour } from '@/features/company/types';
import TenantLayout from '@/layouts/TenantLayout';
import { useToastStore } from '@/stores/toast';

const DAY_LABELS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function defaultHours(): WorkingHour[] {
    return DAY_LABELS.map((_, i) => ({
        day_of_week: i,
        is_open: i !== 0,
        open_time: i !== 0 ? '08:00' : null,
        close_time: i !== 0 ? '17:00' : null,
    }));
}

function getSummary(hours: { day_of_week: number; is_open: boolean; open_time?: string | null }[]): string {
    const openDays = hours.filter((h) => h.is_open);

    if (openDays.length === 0) {
return 'Tutup setiap hari';
}

    if (openDays.length === 7) {
return 'Buka setiap hari';
}

    const dayNames = openDays.map((h) => DAY_LABELS[h.day_of_week].slice(0, 3));

    if (openDays.length <= 3) {
return `Buka: ${dayNames.join(', ')}`;
}

    return `Buka ${openDays.length} hari/minggu`;
}

function getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function CompanyWorkingHoursPage() {
    const addToast = useToastStore((s) => s.addToast);
    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const hasAutoSelected = useRef(false);

    const { data: branchesData } = useAllBranches();
    const branches = branchesData?.data ?? [];
    const showBranchSelector = branches.length > 0;

    // Auto-select "Utama" sebagai default
    useEffect(() => {
        if (!selectedBranch && !hasAutoSelected.current) {
            setSelectedBranch('__default__');
            hasAutoSelected.current = true;
        }
    }, [selectedBranch]);

    const branchId = selectedBranch === '__default__' ? null : selectedBranch;
    const { data: hours = [], isLoading } = useWorkingHours(branchId);
    const mutation = useUpdateWorkingHours();

    function handleSave(items: Partial<WorkingHour>[]) {
        mutation.mutate(
            { branch_id: branchId ?? undefined, hours: items },
            {
                onSuccess: () => {
                    addToast('success', 'Jam kerja berhasil diperbarui.');
                    router.get('/company/working-hours');
                },
            },
        );
    }

    const branchOptions = [
        { value: '__default__', label: 'Utama' },
        ...branches.map((b) => ({ value: b.id, label: b.name })),
    ];
    // Use same fallback defaults as WorkingHourEditor for consistent summary
    const resolvedHours: WorkingHour[] = !isLoading && hours.length === 0 ? defaultHours() : hours;
    const summary = isLoading ? '' : getSummary(resolvedHours);
    const openCount = isLoading ? 0 : resolvedHours.filter((h) => h.is_open).length;

    return (
        <TenantLayout>
            <Head title="Jam Kerja" />

            {/* Breadcrumb */}
            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/company/working-hours" className="transition-colors hover:text-neutral-700">Perusahaan</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Working Hours</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Jam Kerja</h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Atur jam operasional perusahaan agar pelanggan tahu kapan Anda buka.
                </p>
            </div>

            {/* Summary Card */}
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
                                <h2 className="text-xl font-bold truncate">Jam Operasional</h2>
                                {summary && <p className="mt-1 text-sm text-white/80">{summary}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 sm:grid-cols-4">
                        {isLoading ? (
                            <>
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="animate-pulse px-5 py-4">
                                        <div className="mb-1.5 h-3 w-12 rounded bg-neutral-200" />
                                        <div className="h-4 w-16 rounded bg-neutral-300" />
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                <div className="px-5 py-4">
                                    <p className="text-xs font-medium text-neutral-400">Hari Buka</p>
                                    <p className="mt-1 text-sm font-semibold text-success">{openCount} hari</p>
                                </div>
                                <div className="px-5 py-4">
                                    <p className="text-xs font-medium text-neutral-400">Hari Libur</p>
                                    <p className="mt-1 text-sm font-semibold text-neutral-900">{7 - openCount} hari</p>
                                </div>
                                <div className="px-5 py-4">
                                    <p className="text-xs font-medium text-neutral-400">Total Hari</p>
                                    <p className="mt-1 text-sm font-semibold text-neutral-900">7 hari</p>
                                </div>
                                <div className="px-5 py-4">
                                    <p className="text-xs font-medium text-neutral-400">Cabang</p>
                                    <p className="mt-1 text-sm font-semibold text-neutral-900 truncate">
                                        {selectedBranch === '__default__'
                                            ? 'Utama'
                                            : selectedBranch
                                                ? branches.find((b) => b.id === selectedBranch)?.name ?? '-'
                                                : '-'}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </FadeIn>

            {/* Branch Selector */}
            {showBranchSelector && (
                <FadeIn delay={0.05}>
                    <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-neutral-900">Pilih Cabang</h3>
                                <p className="text-xs text-neutral-500">Atur jam kerja per cabang secara terpisah.</p>
                            </div>
                            <div className="w-full sm:w-64">
                                <Select
                                    value={selectedBranch}
                                    onChange={setSelectedBranch}
                                    options={branchOptions}
                                    placeholder="Cabang utama"
                                />
                            </div>
                        </div>
                    </div>
                </FadeIn>
            )}

            {/* Editor Card */}
            <FadeIn delay={0.06}>
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
                    <div className="mb-6 flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-900">
                                {selectedBranch === '__default__'
                                    ? 'Jam Kerja - Utama'
                                    : selectedBranch
                                        ? `Jam Kerja - ${branches.find((b) => b.id === selectedBranch)?.name ?? ''}`
                                        : 'Jam Kerja'}
                            </h3>
                            <p className="text-xs text-neutral-500">Atur jam buka dan tutup untuk setiap hari.</p>
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
                        <WorkingHourEditor
                            hours={hours}
                            saving={mutation.isPending}
                            onSave={handleSave}
                        />
                    )}
                </div>
            </FadeIn>
        </TenantLayout>
    );
}
