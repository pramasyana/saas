import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Select from '@/atoms/Select';
import { useAuditLogs } from '@/features/admin/hooks/useAuditLogs';
import type { AuditLogFilters } from '@/features/admin/hooks/useAuditLogs';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';
import Pagination from '@/molecules/Pagination';

interface AuditLogsPageProps {
    title: string;
}

const actionConfig: Record<string, { label: string; badge: string; icon: string }> = {
    create: { label: 'Buat', badge: 'bg-success-light text-success ring-success/20', icon: 'M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' },
    update: { label: 'Ubah', badge: 'bg-blue-50 text-blue-600 ring-blue-200', icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10' },
    delete: { label: 'Hapus', badge: 'bg-danger-light text-danger ring-danger/20', icon: 'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0' },
    login: { label: 'Login', badge: 'bg-purple-50 text-purple-600 ring-purple-200', icon: 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9' },
    impersonate: { label: 'Impersonate', badge: 'bg-warning-light text-warning ring-warning/20', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0' },
    send_notification: { label: 'Notifikasi', badge: 'bg-cyan-50 text-cyan-600 ring-cyan-200', icon: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0' },
    export: { label: 'Ekspor', badge: 'bg-emerald-50 text-emerald-600 ring-emerald-200', icon: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3' },
};

function getActionConfig(action: string) {
    return actionConfig[action] ?? {
        label: action,
        badge: 'bg-neutral-100 text-neutral-600 ring-neutral-300',
        icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
    };
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

function ClockIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function ShieldIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
    );
}

function ListIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
    );
}

function FilterIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591L15.75 10.5v6.848a2.25 2.25 0 01-1.244 2.013l-3 1.5a2.25 2.25 0 01-3.256-2.013V10.5L2.659 7.409A2.25 2.25 0 012 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
        </svg>
    );
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function getTimeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);

    if (mins < 1) {
return 'Baru saja';
}

    if (mins < 60) {
return `${mins}m lalu`;
}

    const hours = Math.floor(mins / 60);

    if (hours < 24) {
return `${hours}j lalu`;
}

    const days = Math.floor(hours / 24);

    if (days < 7) {
return `${days}h lalu`;
}

    return formatDate(dateStr);
}

function getAdminColor(name: string) {
    const colors = [
        'bg-primary-50 text-primary',
        'bg-blue-50 text-blue-600',
        'bg-success-light text-success',
        'bg-warning-light text-warning',
        'bg-danger-light text-danger',
    ];

    return colors[name.length % colors.length];
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // fallback
        }
    }

    return (
        <button
            onClick={handleCopy}
            className="shrink-0 rounded p-0.5 text-neutral-300 transition-colors hover:text-neutral-500"
            title="Salin IP"
        >
            {copied ? (
                <svg className="h-3 w-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            ) : (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
            )}
        </button>
    );
}

function TableSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="hidden sm:block rounded-xl border border-border bg-white shadow-sm">
                <div className="border-b border-border px-5 py-3.5">
                    <div className="flex gap-6">
                        <div className="h-4 w-28 rounded bg-neutral-200" />
                        <div className="h-4 w-40 rounded bg-neutral-200" />
                        <div className="h-4 w-16 rounded bg-neutral-200" />
                        <div className="h-4 w-1/3 rounded bg-neutral-200" />
                        <div className="h-4 w-24 rounded bg-neutral-200" />
                    </div>
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-6 border-b border-border px-5 py-4">
                        <div className="w-28 space-y-1">
                            <div className="h-3.5 w-16 rounded bg-neutral-200" />
                            <div className="h-3 w-12 rounded bg-neutral-100" />
                        </div>
                        <div className="flex items-center gap-2.5 w-40">
                            <div className="h-7 w-7 rounded-full bg-neutral-200" />
                            <div className="space-y-1 flex-1">
                                <div className="h-3.5 w-20 rounded bg-neutral-200" />
                                <div className="h-3 w-16 rounded bg-neutral-100" />
                            </div>
                        </div>
                        <div className="h-5 w-14 rounded-full bg-neutral-200" />
                        <div className="h-3.5 w-1/3 rounded bg-neutral-200" />
                        <div className="h-3.5 w-24 rounded bg-neutral-200" />
                    </div>
                ))}
            </div>
            <div className="sm:hidden space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl border border-border bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-neutral-200" />
                            <div className="space-y-2 flex-1">
                                <div className="h-4 w-1/2 rounded bg-neutral-200" />
                                <div className="h-3 w-1/3 rounded bg-neutral-100" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AuditLogs({ title }: AuditLogsPageProps) {
    const [filters, setFilters] = useState<AuditLogFilters>({ page: 1, per_page: 25 });

    const { data, isLoading, isError, refetch } = useAuditLogs(filters);

    const logs = data?.data ?? [];
    const meta = data?.meta;
    const actions = data?.actions ?? [];

    function handlePage(page: number) {
        setFilters((prev) => ({ ...prev, page }));
    }

    const uniqueAdmins = new Set(logs.map((l) => l.user?.email)).size;

    return (
        <AdminLayout>
            <Head title={title} />

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                <motion.div variants={itemAnim} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Audit Log</h1>
                        <p className="mt-1 text-sm text-neutral-500">Riwayat aktivitas admin panel.</p>
                    </div>
                    {meta && (
                        <div className="mt-2 text-sm text-neutral-400 sm:mt-0">
                            Total <span className="font-semibold text-neutral-700">{meta.total}</span> catatan aktivitas
                        </div>
                    )}
                </motion.div>

                <motion.div variants={itemAnim} className="grid grid-cols-3 gap-3 sm:gap-4">
                    <div className="rounded-xl border border-border bg-white p-3 sm:p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <ListIcon className="h-3.5 w-3.5 text-neutral-400" />
                            Total Entri
                        </div>
                        <p className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                            {isLoading ? '-' : meta?.total ?? 0}
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-3 sm:p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <ShieldIcon className="h-3.5 w-3.5 text-neutral-400" />
                            Admin Aktif
                        </div>
                        <p className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                            {isLoading ? '-' : uniqueAdmins}
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-3 sm:p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <FilterIcon className="h-3.5 w-3.5 text-neutral-400" />
                            Filter Aksi
                        </div>
                        <p className="mt-1 text-sm sm:text-base font-medium text-neutral-700">
                            {filters.action ? (
                                <span className="inline-flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    {filters.action}
                                </span>
                            ) : (
                                'Semua'
                            )}
                        </p>
                    </div>
                </motion.div>

                <motion.div variants={itemAnim} className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        <Select
                            value={filters.action ?? ''}
                            onChange={(v) => setFilters((prev) => ({ ...prev, action: v || undefined, page: 1 }))}
                            options={[
                                { value: '', label: 'Semua Aksi' },
                                ...actions.map((a) => ({ value: a, label: getActionConfig(a).label })),
                            ]}
                            placeholder="Filter aksi"
                            className="w-44"
                        />
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-medium text-neutral-500">Dari</label>
                            <input
                                type="date"
                                value={filters.from ?? ''}
                                onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value || undefined, page: 1 }))}
                                className="rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-medium text-neutral-500">Ke</label>
                            <input
                                type="date"
                                value={filters.to ?? ''}
                                onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value || undefined, page: 1 }))}
                                className="rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                        <button
                            onClick={() => setFilters({ page: 1, per_page: filters.per_page ?? 25 })}
                            className="rounded-xl border border-neutral-300 px-4 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-50"
                        >
                            Reset
                        </button>
                    </div>
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
                        className="w-24"
                    />
                </motion.div>

                {isLoading ? (
                    <TableSkeleton />
                ) : isError ? (
                    <motion.div variants={itemAnim} className="flex flex-col items-center gap-4 rounded-xl border border-border bg-white px-6 py-16 text-center shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-light text-danger">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-base font-semibold text-neutral-900">Gagal memuat data</p>
                            <p className="mt-1 text-sm text-neutral-500">Terjadi kesalahan saat mengambil log aktivitas.</p>
                        </div>
                        <button
                            onClick={() => refetch()}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
                        >
                            Coba Lagi
                        </button>
                    </motion.div>
                ) : logs.length === 0 ? (
                    <motion.div variants={itemAnim} className="flex flex-col items-center gap-4 rounded-xl border border-border bg-white px-6 py-16 text-center shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                            <ClockIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-base font-semibold text-neutral-900">Belum ada aktivitas</p>
                            <p className="mt-1 text-sm text-neutral-500">
                                {filters.action || filters.from || filters.to
                                    ? 'Tidak ada log yang cocok dengan filter yang dipilih.'
                                    : 'Belum ada aktivitas yang tercatat di admin panel.'}
                            </p>
                        </div>
                        {(filters.action || filters.from || filters.to) && (
                            <button
                                onClick={() => setFilters({ page: 1, per_page: filters.per_page ?? 25 })}
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
                            >
                                Reset Filter
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <motion.div variants={itemAnim} className="hidden sm:block overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border bg-neutral-50/80">
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Waktu</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Admin</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Deskripsi</th>
                                            <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {logs.map((entry, idx) => {
                                            const action = getActionConfig(entry.action);

                                            return (
                                                <tr key={entry.id} className="transition-colors hover:bg-neutral-50/50">
                                                    <td className="whitespace-nowrap px-5 py-4">
                                                        <p className="text-sm font-medium text-neutral-900" title={new Date(entry.created_at).toLocaleString('id-ID')}>
                                                            {getTimeAgo(entry.created_at)}
                                                        </p>
                                                        <p className="text-xs text-neutral-400">
                                                            {formatDate(entry.created_at)} {formatTime(entry.created_at)}
                                                        </p>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        {entry.user ? (
                                                            <div className="flex items-center gap-2.5">
                                                                <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold', getAdminColor(entry.user.name))}>
                                                                    {entry.user.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-medium text-neutral-900 truncate max-w-[160px]">
                                                                        {entry.user.name}
                                                                    </p>
                                                                    <p className="text-xs text-neutral-500 truncate max-w-[160px]">
                                                                        {entry.user.email}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-neutral-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset', action.badge)}>
                                                            <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                                                            </svg>
                                                            {action.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <p className="text-sm text-neutral-600 max-w-xs truncate" title={entry.description}>
                                                            {entry.description}
                                                        </p>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        {entry.ip_address ? (
                                                            <div className="inline-flex items-center gap-1">
                                                                <span className="font-mono text-xs text-neutral-500">{entry.ip_address}</span>
                                                                <CopyButton text={entry.ip_address} />
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-neutral-400">-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>

                        {/* Mobile cards */}
                        <motion.div variants={itemAnim} className="sm:hidden space-y-3">
                            {logs.map((entry) => {
                                const action = getActionConfig(entry.action);

                                return (
                                    <div key={entry.id} className="rounded-xl border border-border bg-white p-4 shadow-sm">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold', getAdminColor(entry.user?.name ?? ''))}>
                                                    {entry.user?.name?.charAt(0).toUpperCase() ?? '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-neutral-900 truncate">{entry.user?.name ?? '-'}</p>
                                                    <p className="text-xs text-neutral-500 truncate">{entry.user?.email ?? ''}</p>
                                                </div>
                                            </div>
                                            <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ring-1 ring-inset shrink-0', action.badge)}>
                                                <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                                                </svg>
                                                {action.label}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-neutral-600">{entry.description}</p>
                                        <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
                                            <span>{getTimeAgo(entry.created_at)}</span>
                                            {entry.ip_address && <span className="font-mono">{entry.ip_address}</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </>
                )}

                {meta && (
                    <motion.div variants={itemAnim}>
                        <Pagination meta={meta} onPageChange={handlePage} />
                    </motion.div>
                )}
            </motion.div>
        </AdminLayout>
    );
}
