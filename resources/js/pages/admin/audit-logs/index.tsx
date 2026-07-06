import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Select from '@/atoms/Select';
import { useAuditLogs } from '@/features/admin/hooks/useAuditLogs';
import type { AuditLogFilters } from '@/features/admin/hooks/useAuditLogs';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/molecules/Pagination';

interface AuditLogsPageProps {
    title: string;
}

export default function AuditLogs({ title }: AuditLogsPageProps) {
    const [filters, setFilters] = useState<AuditLogFilters>({ page: 1, per_page: 25 });

    const { data, isLoading, isError } = useAuditLogs(filters);

    const logs = data?.data ?? [];
    const meta = data?.meta;
    const actions = data?.actions ?? [];

    function handlePage(page: number) {
        setFilters((prev) => ({ ...prev, page }));
    }

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Audit Log</h1>
                    <p className="mt-1 text-sm text-neutral-500">Riwayat aktivitas admin panel.</p>
                </div>
            </div>

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <div className="flex gap-3">
                    <Select
                        value={filters.action ?? ''}
                        onChange={(v) => setFilters((prev) => ({ ...prev, action: v || undefined, page: 1 }))}
                        options={[
                            { value: '', label: 'Semua Aksi' },
                            ...actions.map((a) => ({ value: a, label: a })),
                        ]}
                        placeholder="Filter aksi"
                    />
                    <input
                        type="date"
                        value={filters.from ?? ''}
                        onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value || undefined, page: 1 }))}
                        className="rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <input
                        type="date"
                        value={filters.to ?? ''}
                        onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value || undefined, page: 1 }))}
                        className="rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                        onClick={() => setFilters({ page: 1, per_page: 25 })}
                        className="rounded-xl border border-neutral-300 px-4 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-50"
                    >
                        Reset
                    </button>
                    <Select
                        value={String(filters.per_page ?? 25)}
                        onChange={(v) => setFilters((prev) => ({ ...prev, per_page: Number(v), page: 1 }))}
                        options={[
                            { value: '10', label: '10' },
                            { value: '25', label: '25' },
                            { value: '50', label: '50' },
                            { value: '100', label: '100' },
                        ]}
                        placeholder="25"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="animate-pulse space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-14 rounded-xl bg-neutral-100" />
                    ))}
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-20 text-center shadow-sm">
                    <p className="text-base font-semibold text-neutral-900">Gagal memuat data</p>
                </div>
            ) : logs.length === 0 ? (
                <div className="flex flex-col items-center gap-5 rounded-2xl border border-neutral-200 bg-white px-6 py-20 shadow-sm">
                    <p className="text-base font-semibold text-neutral-900">Belum ada aktivitas</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50/50">
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Waktu</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Admin</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Deskripsi</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {logs.map((entry) => (
                                <tr key={entry.id} className="transition-colors hover:bg-neutral-50/50">
                                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-neutral-600">
                                        {new Date(entry.created_at).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="text-sm font-medium text-neutral-900">{entry.user?.name ?? '-'}</div>
                                        <div className="text-xs text-neutral-500">{entry.user?.email ?? ''}</div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium capitalize text-neutral-600">
                                            {entry.action}
                                        </span>
                                    </td>
                                    <td className="max-w-xs truncate px-5 py-3.5 text-sm text-neutral-600">
                                        {entry.description}
                                    </td>
                                    <td className="px-5 py-3.5 font-mono text-xs text-neutral-500">
                                        {entry.ip_address ?? '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {meta && <Pagination meta={meta} onPageChange={handlePage} />}
        </AdminLayout>
    );
}
