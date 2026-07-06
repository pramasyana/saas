import { Head } from '@inertiajs/react';
import { useSystemHealth, useToggleMaintenance } from '@/features/admin/hooks/useSystemHealth';
import AdminLayout from '@/layouts/AdminLayout';

interface SystemPageProps {
    title: string;
}

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${ok ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${ok ? 'bg-success' : 'bg-danger'}`} />
            {label}
        </span>
    );
}

export default function SystemHealth({ title }: SystemPageProps) {
    const { data, isLoading, isError } = useSystemHealth();
    const toggleMutation = useToggleMaintenance();

    const health = data?.data;

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">System Health</h1>
                <p className="mt-1 text-sm text-neutral-500">Monitor status sistem dan maintenance.</p>
            </div>

            {isLoading ? (
                <div className="animate-pulse space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 rounded-2xl bg-neutral-100" />
                    ))}
                </div>
            ) : isError || !health ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-20 text-center shadow-sm">
                    <p className="text-base font-semibold text-neutral-900">Gagal memuat data sistem</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-neutral-500">Queue Pending</p>
                                <StatusBadge ok={health.queue.healthy} label={health.queue.healthy ? 'Sehat' : 'Warning'} />
                            </div>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">{health.queue.pending_jobs}</p>
                        </div>

                        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-neutral-500">Failed Jobs</p>
                            <p className={`mt-2 text-3xl font-bold tracking-tight ${health.failed_jobs.total > 0 ? 'text-danger' : 'text-neutral-900'}`}>
                                {health.failed_jobs.total}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-neutral-500">Cache Driver</p>
                            <p className="mt-2 text-lg font-bold tracking-tight text-neutral-900 uppercase">{health.cache.driver}</p>
                            <StatusBadge ok={health.cache.reachable} label={health.cache.reachable ? 'Reachable' : 'Unreachable'} />
                        </div>

                        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-neutral-500">Maintenance Mode</p>
                            <p className={`mt-2 text-3xl font-bold tracking-tight ${health.maintenance.active ? 'text-warning' : 'text-success'}`}>
                                {health.maintenance.active ? 'Aktif' : 'Nonaktif'}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-neutral-900">Maintenance Mode</h2>
                                <p className="mt-1 text-sm text-neutral-500">
                                    {health.maintenance.active
                                        ? 'Sistem saat ini dalam mode maintenance. Pengguna tidak dapat mengakses aplikasi.'
                                        : 'Sistem berjalan normal. Aktifkan mode maintenance untuk melakukan pemeliharaan.'}
                                </p>
                            </div>
                            <button
                                onClick={() => toggleMutation.mutate()}
                                disabled={toggleMutation.isPending}
                                className={`rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                                    health.maintenance.active
                                        ? 'bg-success hover:bg-success-dark'
                                        : 'bg-warning hover:bg-warning-dark'
                                }`}
                            >
                                {toggleMutation.isPending
                                    ? 'Memproses...'
                                    : health.maintenance.active
                                    ? 'Nonaktifkan Maintenance'
                                    : 'Aktifkan Maintenance'}
                            </button>
                        </div>
                    </div>

                    {health.failed_jobs.recent.length > 0 && (
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-base font-semibold text-neutral-900">Failed Jobs Terbaru</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-neutral-100">
                                            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Queue</th>
                                            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Connection</th>
                                            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Failed At</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {health.failed_jobs.recent.map((job) => (
                                            <tr key={job.id} className="text-sm text-neutral-600">
                                                <td className="px-4 py-3 font-mono">{job.queue}</td>
                                                <td className="px-4 py-3">{job.connection}</td>
                                                <td className="px-4 py-3">{new Date(job.failed_at).toLocaleString('id-ID')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {health.job_batches.length > 0 && (
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-base font-semibold text-neutral-900">Job Batches Terbaru</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-neutral-100">
                                            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Name</th>
                                            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Total</th>
                                            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Pending</th>
                                            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Failed</th>
                                            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {health.job_batches.map((batch) => (
                                            <tr key={batch.id} className="text-sm text-neutral-600">
                                                <td className="px-4 py-3 font-medium text-neutral-900">{batch.name}</td>
                                                <td className="px-4 py-3">{batch.total_jobs}</td>
                                                <td className="px-4 py-3">{batch.pending_jobs}</td>
                                                <td className="px-4 py-3">{batch.failed_jobs}</td>
                                                <td className="px-4 py-3">
                                                    {batch.finished_at ? (
                                                        <StatusBadge ok={batch.failed_jobs === 0} label={batch.failed_jobs > 0 ? 'Failed' : 'Selesai'} />
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">Berjalan</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
