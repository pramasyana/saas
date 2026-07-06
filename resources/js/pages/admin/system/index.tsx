import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSystemHealth, useToggleMaintenance } from '@/features/admin/hooks/useSystemHealth';
import AdminLayout from '@/layouts/AdminLayout';

interface Props {
    title: string;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.04 },
    },
};

const itemAnim = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

const accentMap: Record<string, string> = {
    primary: 'border-l-primary',
    success: 'border-l-success',
    warning: 'border-l-warning',
    danger: 'border-l-danger',
    info: 'border-l-blue-500',
    neutral: 'border-l-neutral-400',
};

const iconBgMap: Record<string, string> = {
    primary: 'bg-primary-50 text-primary',
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
    danger: 'bg-danger-light text-danger',
    info: 'bg-blue-50 text-blue-600',
    neutral: 'bg-neutral-100 text-neutral-600',
};

function ClockIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function ExclamationCircleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
    );
}

function ServerIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z" />
        </svg>
    );
}

function WrenchIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-7.5 7.5a2.25 2.25 0 01-3.18-3.18l7.5-7.5m2.68 0a6 6 0 118.49-8.48 4.5 4.5 0 01-3.15 7.85H16.5l-2.83 2.83" />
        </svg>
    );
}

function RefreshIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
        </svg>
    );
}

function CheckCircleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function XCircleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function DotIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 8 8" fill="currentColor">
            <circle cx="4" cy="4" r="3" />
        </svg>
    );
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getRelativeTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'baru saja';
    if (mins < 60) return `${mins} menit lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    return formatDate(dateStr);
}

function TableSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-xl border border-border bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-neutral-200" />
                            <div className="space-y-2 flex-1">
                                <div className="h-3 w-16 rounded bg-neutral-200" />
                                <div className="h-5 w-20 rounded bg-neutral-200" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="h-4 w-36 rounded bg-neutral-200" />
                        <div className="h-3 w-56 rounded bg-neutral-100" />
                    </div>
                    <div className="h-10 w-44 rounded-xl bg-neutral-200" />
                </div>
            </div>
            <div className="rounded-xl border border-border bg-white shadow-sm">
                <div className="border-b border-border px-5 py-3.5">
                    <div className="h-4 w-40 rounded bg-neutral-200" />
                </div>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-6 border-b border-border px-5 py-4">
                        <div className="h-3.5 w-24 rounded bg-neutral-200" />
                        <div className="h-3.5 w-20 rounded bg-neutral-200" />
                        <div className="h-3.5 w-32 rounded bg-neutral-200" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function SystemHealth({ title }: Props) {
    const { data, isLoading, isError, refetch, dataUpdatedAt } = useSystemHealth();
    const toggleMutation = useToggleMaintenance();
    const [lastChecked, setLastChecked] = useState<string>('—');

    const health = data?.data;

    useEffect(() => {
        if (dataUpdatedAt) {
            setLastChecked(getRelativeTime(new Date(dataUpdatedAt).toISOString()));
        }
    }, [dataUpdatedAt]);

    const queuePct = health && health.queue.pending_jobs + health.queue.failed_jobs > 0
        ? Math.round((health.queue.failed_jobs / (health.queue.pending_jobs + health.queue.failed_jobs)) * 100)
        : 0;

    function FailureRateBadge({ ok, label }: { ok: boolean; label: string }) {
        return (
            <span className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
                ok ? 'bg-success-light text-success ring-success/20' : 'bg-danger-light text-danger ring-danger/20',
            )}>
                <span className={cn('h-1.5 w-1.5 rounded-full', ok ? 'bg-success' : 'bg-danger')} />
                {label}
            </span>
        );
    }

    return (
        <AdminLayout>
            <Head title={title} />

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                <motion.div variants={itemAnim} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">System Health</h1>
                        <p className="mt-1 text-sm text-neutral-500">Monitor status sistem dan maintenance.</p>
                    </div>
                    <div className="mt-2 flex items-center gap-3 sm:mt-0">
                        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
                            <RefreshIcon className="h-3 w-3" />
                            Auto-refresh 30 detik
                        </span>
                        {dataUpdatedAt > 0 && (
                            <span className="text-xs text-neutral-400">
                                Diperbarui {lastChecked}
                            </span>
                        )}
                    </div>
                </motion.div>

                {isLoading ? (
                    <TableSkeleton />
                ) : isError || !health ? (
                    <motion.div variants={itemAnim} className="flex flex-col items-center gap-4 rounded-xl border border-border bg-white px-6 py-16 text-center shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-light text-danger">
                            <XCircleIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-base font-semibold text-neutral-900">Gagal memuat data sistem</p>
                            <p className="mt-1 text-sm text-neutral-500">Terjadi kesalahan saat mengambil informasi sistem.</p>
                        </div>
                        <button
                            onClick={() => refetch()}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
                        >
                            Coba Lagi
                        </button>
                    </motion.div>
                ) : (
                    <>
                        <motion.div variants={itemAnim} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                                <div className={cn('absolute left-0 top-0 h-full w-1', health.queue.healthy ? accentMap.success : accentMap.warning)} />
                                <div className="p-5 pl-6">
                                    <div className="flex items-start justify-between">
                                        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', health.queue.healthy ? iconBgMap.success : iconBgMap.warning)}>
                                            <ClockIcon className="h-5 w-5" />
                                        </div>
                                        <FailureRateBadge ok={health.queue.healthy} label={health.queue.healthy ? 'Sehat' : 'Warning'} />
                                    </div>
                                    <p className="mt-3 text-2xl font-bold tracking-tight text-neutral-900">
                                        {health.queue.pending_jobs}
                                    </p>
                                    <p className="mt-0.5 text-sm font-medium text-neutral-600">Queue Pending</p>
                                    <p className="text-xs text-neutral-400">
                                        {health.queue.failed_jobs} failed · {queuePct}% failure rate
                                    </p>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                                <div className={cn('absolute left-0 top-0 h-full w-1', health.failed_jobs.total > 0 ? accentMap.danger : accentMap.success)} />
                                <div className="p-5 pl-6">
                                    <div className="flex items-start justify-between">
                                        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', health.failed_jobs.total > 0 ? iconBgMap.danger : iconBgMap.success)}>
                                            <ExclamationCircleIcon className="h-5 w-5" />
                                        </div>
                                        {health.failed_jobs.total > 0 && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-danger-light px-2.5 py-0.5 text-xs font-medium text-danger ring-1 ring-inset ring-danger/20">
                                                <DotIcon className="h-1.5 w-1.5" />
                                                Perlu Dicek
                                            </span>
                                        )}
                                    </div>
                                    <p className={cn('mt-3 text-2xl font-bold tracking-tight', health.failed_jobs.total > 0 ? 'text-danger' : 'text-neutral-900')}>
                                        {health.failed_jobs.total}
                                    </p>
                                    <p className="mt-0.5 text-sm font-medium text-neutral-600">Failed Jobs</p>
                                    {health.failed_jobs.total > 0 && (
                                        <p className="text-xs text-neutral-400">{health.failed_jobs.recent.length} terbaru ditampilkan</p>
                                    )}
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                                <div className={cn('absolute left-0 top-0 h-full w-1', health.cache.reachable ? accentMap.success : accentMap.danger)} />
                                <div className="p-5 pl-6">
                                    <div className="flex items-start justify-between">
                                        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', health.cache.reachable ? iconBgMap.success : iconBgMap.danger)}>
                                            <ServerIcon className="h-5 w-5" />
                                        </div>
                                        <FailureRateBadge ok={health.cache.reachable} label={health.cache.reachable ? 'Reachable' : 'Unreachable'} />
                                    </div>
                                    <p className="mt-3 text-lg font-bold tracking-tight text-neutral-900 uppercase">
                                        {health.cache.driver}
                                    </p>
                                    <p className="mt-0.5 text-sm font-medium text-neutral-600">Cache Driver</p>
                                    <p className="text-xs text-neutral-400">
                                        {health.cache.reachable ? 'Cache berfungsi normal' : 'Cache tidak dapat dijangkau'}
                                    </p>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                                <div className={cn('absolute left-0 top-0 h-full w-1', health.maintenance.active ? accentMap.warning : accentMap.success)} />
                                <div className="p-5 pl-6">
                                    <div className="flex items-start justify-between">
                                        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', health.maintenance.active ? iconBgMap.warning : iconBgMap.success)}>
                                            <WrenchIcon className="h-5 w-5" />
                                        </div>
                                        <FailureRateBadge ok={!health.maintenance.active} label={health.maintenance.active ? 'Aktif' : 'Nonaktif'} />
                                    </div>
                                    <p className={cn('mt-3 text-2xl font-bold tracking-tight', health.maintenance.active ? 'text-warning' : 'text-success')}>
                                        {health.maintenance.active ? 'Aktif' : 'Nonaktif'}
                                    </p>
                                    <p className="mt-0.5 text-sm font-medium text-neutral-600">Maintenance Mode</p>
                                    <p className="text-xs text-neutral-400">
                                        {health.maintenance.active ? 'Sistem dalam pemeliharaan' : 'Sistem berjalan normal'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemAnim}>
                            <div className="rounded-xl border border-border bg-white shadow-sm">
                                <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                                            health.maintenance.active ? 'bg-warning-light text-warning' : 'bg-success-light text-success',
                                        )}>
                                            <WrenchIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-semibold text-neutral-900">
                                                {health.maintenance.active ? 'Maintenance Sedang Berlangsung' : 'Sistem Berjalan Normal'}
                                            </h2>
                                            <p className="mt-0.5 text-sm text-neutral-500">
                                                {health.maintenance.active
                                                    ? 'Pengguna tidak dapat mengakses aplikasi selama mode maintenance aktif. Nonaktifkan untuk mengembalikan akses.'
                                                    : 'Aktifkan mode maintenance untuk melakukan pemeliharaan sistem. Pengguna tidak akan dapat mengakses aplikasi selama mode ini aktif.'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleMutation.mutate()}
                                        disabled={toggleMutation.isPending}
                                        className={cn(
                                            'inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors disabled:opacity-50',
                                            health.maintenance.active
                                                ? 'bg-success hover:bg-green-700'
                                                : 'bg-warning hover:bg-amber-700',
                                        )}
                                    >
                                        {toggleMutation.isPending ? (
                                            <>
                                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Memproses...
                                            </>
                                        ) : health.maintenance.active ? (
                                            <>
                                                <CheckCircleIcon className="h-4 w-4" />
                                                Nonaktifkan Maintenance
                                            </>
                                        ) : (
                                            <>
                                                <WrenchIcon className="h-4 w-4" />
                                                Aktifkan Maintenance
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {health.failed_jobs.recent.length > 0 && (
                            <motion.div variants={itemAnim}>
                                <div className="rounded-xl border border-border bg-white shadow-sm">
                                    <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger-light text-danger">
                                            <ExclamationCircleIcon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-semibold text-neutral-900">Failed Jobs Terbaru</h2>
                                            <p className="text-xs text-neutral-500">10 gagal terakhir diurutkan berdasarkan waktu</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-border bg-neutral-50/80">
                                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Queue</th>
                                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Connection</th>
                                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Failed At</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {health.failed_jobs.recent.map((job) => (
                                                    <tr key={job.id} className="transition-colors hover:bg-neutral-50/50">
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-mono font-medium text-neutral-700">
                                                                {job.queue}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-neutral-600">{job.connection}</td>
                                                        <td className="px-6 py-4 text-sm text-neutral-500">{formatDate(job.failed_at)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="sm:hidden divide-y divide-border">
                                        {health.failed_jobs.recent.map((job) => (
                                            <div key={job.id} className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-mono font-medium text-neutral-700">
                                                        {job.queue}
                                                    </span>
                                                    <span className="text-xs text-neutral-500">{job.connection}</span>
                                                </div>
                                                <p className="mt-1 text-xs text-neutral-400">{getRelativeTime(job.failed_at)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {health.job_batches.length > 0 && (
                            <motion.div variants={itemAnim}>
                                <div className="rounded-xl border border-border bg-white shadow-sm">
                                    <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary">
                                            <ClockIcon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-semibold text-neutral-900">Job Batches Terbaru</h2>
                                            <p className="text-xs text-neutral-500">5 batch terakhir</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-border bg-neutral-50/80">
                                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Name</th>
                                                    <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Total</th>
                                                    <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Pending</th>
                                                    <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Failed</th>
                                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Progres</th>
                                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {health.job_batches.map((batch) => {
                                                    const completed = batch.total_jobs - batch.pending_jobs - batch.failed_jobs;
                                                    const pct = batch.total_jobs > 0 ? Math.round((completed / batch.total_jobs) * 100) : 0;
                                                    const finished = !!batch.finished_at;
                                                    const hasFailed = batch.failed_jobs > 0;
                                                    return (
                                                        <tr key={batch.id} className="transition-colors hover:bg-neutral-50/50">
                                                            <td className="px-6 py-4 text-sm font-medium text-neutral-900">{batch.name}</td>
                                                            <td className="px-6 py-4 text-right text-sm text-neutral-600">{batch.total_jobs}</td>
                                                            <td className="px-6 py-4 text-right text-sm text-neutral-600">{batch.pending_jobs}</td>
                                                            <td className={cn('px-6 py-4 text-right text-sm', hasFailed ? 'font-medium text-danger' : 'text-neutral-600')}>
                                                                {batch.failed_jobs}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-2 w-24 overflow-hidden rounded-full bg-neutral-200">
                                                                        <div
                                                                            className={cn(
                                                                                'h-full rounded-full transition-all duration-500',
                                                                                finished ? (hasFailed ? 'bg-danger' : 'bg-success') : 'bg-primary',
                                                                            )}
                                                                            style={{ width: `${pct}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-xs font-medium text-neutral-500">{pct}%</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {finished ? (
                                                                    <span className={cn(
                                                                        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
                                                                        hasFailed
                                                                            ? 'bg-danger-light text-danger ring-danger/20'
                                                                            : 'bg-success-light text-success ring-success/20',
                                                                    )}>
                                                                        <span className={cn('h-1.5 w-1.5 rounded-full', hasFailed ? 'bg-danger' : 'bg-success')} />
                                                                        {hasFailed ? 'Failed' : 'Selesai'}
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-100">
                                                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />
                                                                        Berjalan
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="sm:hidden divide-y divide-border">
                                        {health.job_batches.map((batch) => {
                                            const completed = batch.total_jobs - batch.pending_jobs - batch.failed_jobs;
                                            const pct = batch.total_jobs > 0 ? Math.round((completed / batch.total_jobs) * 100) : 0;
                                            const finished = !!batch.finished_at;
                                            const hasFailed = batch.failed_jobs > 0;
                                            return (
                                                <div key={batch.id} className="px-6 py-4">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-neutral-900">{batch.name}</p>
                                                        {finished ? (
                                                            <span className={cn(
                                                                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset',
                                                                hasFailed ? 'bg-danger-light text-danger ring-danger/20' : 'bg-success-light text-success ring-success/20',
                                                            )}>
                                                                <span className={cn('h-1 w-1 rounded-full', hasFailed ? 'bg-danger' : 'bg-success')} />
                                                                {hasFailed ? 'Failed' : 'Selesai'}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 ring-1 ring-inset ring-blue-100">
                                                                <span className="h-1 w-1 animate-pulse rounded-full bg-blue-600" />
                                                                Berjalan
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <div className="flex-1 h-2 overflow-hidden rounded-full bg-neutral-200">
                                                            <div
                                                                className={cn(
                                                                    'h-full rounded-full',
                                                                    finished ? (hasFailed ? 'bg-danger' : 'bg-success') : 'bg-primary',
                                                                )}
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-neutral-500">{pct}%</span>
                                                    </div>
                                                    <div className="mt-1 flex gap-4 text-xs text-neutral-400">
                                                        <span>{batch.total_jobs} total</span>
                                                        <span>{batch.pending_jobs} pending</span>
                                                        {batch.failed_jobs > 0 && <span className="text-danger">{batch.failed_jobs} failed</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {health.failed_jobs.recent.length === 0 && health.job_batches.length === 0 && (
                            <motion.div variants={itemAnim} className="flex flex-col items-center gap-3 rounded-xl border border-border bg-white px-6 py-12 text-center shadow-sm">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-light text-success">
                                    <CheckCircleIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-neutral-900">Sistem dalam kondisi baik</p>
                                    <p className="mt-1 text-sm text-neutral-500">Tidak ada failed jobs atau job batches yang perlu diperiksa.</p>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </motion.div>
        </AdminLayout>
    );
}
