import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Select from '@/atoms/Select';
import { useInvoices } from '@/features/subscriptions/hooks/useSubscriptions';
import type { InvoiceFilters } from '@/features/subscriptions/types';
import AdminLayout from '@/layouts/AdminLayout';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Pagination from '@/molecules/Pagination';

interface InvoicesPageProps {
    title: string;
}

const statusConfig: Record<string, { label: string; dot: string; badge: string }> = {
    pending: { label: 'Pending', dot: 'bg-warning', badge: 'bg-warning-light text-warning ring-warning/20' },
    paid: { label: 'Lunas', dot: 'bg-success', badge: 'bg-success-light text-success ring-success/20' },
    failed: { label: 'Gagal', dot: 'bg-danger', badge: 'bg-danger-light text-danger ring-danger/20' },
    refunded: { label: 'Refund', dot: 'bg-neutral-400', badge: 'bg-neutral-100 text-neutral-600 ring-neutral-300' },
};

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

function DocumentIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
    );
}

function UsersIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
    );
}

function DollarIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function ExclamationIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
    );
}

function SearchIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
    );
}

function DownloadIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
    );
}

function formatDate(dateStr: string | null) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isOverdue(dueDate: string | null, status: string) {
    if (!dueDate || status !== 'pending') return false;
    return new Date(dueDate) < new Date();
}

function getInitials(name: string) {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(name: string) {
    const colors = [
        'bg-primary-50 text-primary',
        'bg-blue-50 text-blue-600',
        'bg-success-light text-success',
        'bg-warning-light text-warning',
        'bg-danger-light text-danger',
    ];
    return colors[name.length % colors.length];
}

function TableSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="hidden sm:block rounded-xl border border-border bg-white shadow-sm">
                <div className="border-b border-border px-5 py-3.5">
                    <div className="flex gap-6">
                        <div className="h-4 w-32 rounded bg-neutral-200" />
                        <div className="h-4 w-40 rounded bg-neutral-200" />
                        <div className="h-4 w-20 rounded bg-neutral-200" />
                        <div className="h-4 w-24 rounded bg-neutral-200" />
                        <div className="h-4 w-14 rounded bg-neutral-200" />
                        <div className="h-4 w-24 rounded bg-neutral-200" />
                        <div className="h-4 w-24 rounded bg-neutral-200" />
                    </div>
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-6 border-b border-border px-5 py-4">
                        <div className="w-32 space-y-1">
                            <div className="h-3.5 w-24 rounded bg-neutral-200" />
                        </div>
                        <div className="flex items-center gap-2.5 w-40">
                            <div className="h-7 w-7 rounded-full bg-neutral-200" />
                            <div className="space-y-1 flex-1">
                                <div className="h-3.5 w-20 rounded bg-neutral-200" />
                                <div className="h-3 w-16 rounded bg-neutral-100" />
                            </div>
                        </div>
                        <div className="h-3.5 w-16 rounded bg-neutral-200" />
                        <div className="h-3.5 w-20 rounded bg-neutral-200" />
                        <div className="h-5 w-16 rounded-full bg-neutral-200" />
                        <div className="h-3.5 w-20 rounded bg-neutral-200" />
                        <div className="h-3.5 w-20 rounded bg-neutral-200" />
                    </div>
                ))}
            </div>
            <div className="sm:hidden space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl border border-border bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-neutral-200" />
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

export default function Invoices({ title }: InvoicesPageProps) {
    const [filters, setFilters] = useState<InvoiceFilters>({ page: 1, per_page: 15 });

    const { data, isLoading, isError, refetch } = useInvoices(filters);

    const invoices = data?.data ?? [];
    const meta = data?.meta;

    function handlePage(page: number) {
        setFilters((prev) => ({ ...prev, page }));
    }

    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const pendingAmount = invoices.filter((inv) => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
    const paidAmount = invoices.filter((inv) => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
    const overdueCount = invoices.filter((inv) => isOverdue(inv.due_date, inv.status)).length;
    const uniqueTenants = new Set(invoices.map((inv) => inv.subscription?.user?.email)).size;

    return (
        <AdminLayout>
            <Head title={title} />

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                <motion.div variants={itemAnim} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Invoices</h1>
                        <p className="mt-1 text-sm text-neutral-500">Daftar semua invoice dari seluruh tenant.</p>
                    </div>
                    <div className="mt-2 flex items-center gap-3 sm:mt-0">
                        {meta && (
                            <span className="text-sm text-neutral-400">
                                Total <span className="font-semibold text-neutral-700">{meta.total}</span> invoice
                            </span>
                        )}
                        <a
                            href="/admin/export/invoices"
                            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
                        >
                            <DownloadIcon className="h-4 w-4" />
                            Export CSV
                        </a>
                    </div>
                </motion.div>

                <motion.div variants={itemAnim} className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    <div className="rounded-xl border border-border bg-white p-3 sm:p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <DollarIcon className="h-3.5 w-3.5 text-neutral-400" />
                            Total Tagihan
                        </div>
                        <p className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-neutral-900">
                            {isLoading ? '-' : formatPrice(totalAmount)}
                        </p>
                        <p className="text-xs text-neutral-400">
                            {invoices.length} invoice di halaman ini
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-3 sm:p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <span className="h-2 w-2 rounded-full bg-warning" />
                            Tertunda
                        </div>
                        <p className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-warning">
                            {isLoading ? '-' : formatPrice(pendingAmount)}
                        </p>
                        <p className="text-xs text-neutral-400">
                            {invoices.filter((i) => i.status === 'pending').length} invoice pending
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-3 sm:p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <span className="h-2 w-2 rounded-full bg-success" />
                            Terbayar
                        </div>
                        <p className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-success">
                            {isLoading ? '-' : formatPrice(paidAmount)}
                        </p>
                        <p className="text-xs text-neutral-400">
                            {invoices.filter((i) => i.status === 'paid').length} invoice lunas
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-3 sm:p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <ExclamationIcon className="h-3.5 w-3.5 text-neutral-400" />
                            Pelanggan
                        </div>
                        <p className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-neutral-900">
                            {isLoading ? '-' : uniqueTenants}
                        </p>
                        <p className="text-xs text-neutral-400">
                            {overdueCount > 0 && (
                                <span className="text-danger font-medium">{overdueCount} overdue</span>
                            )}
                            {overdueCount === 0 && 'Tidak ada overdue'}
                        </p>
                    </div>
                </motion.div>

                <motion.div variants={itemAnim} className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex flex-wrap items-center gap-3">
                        <Select
                            value={filters.status ?? ''}
                            onChange={(v) => setFilters((prev) => ({ ...prev, status: v || undefined, page: 1 }))}
                            options={[
                                { value: '', label: 'Semua Status' },
                                { value: 'pending', label: 'Pending' },
                                { value: 'paid', label: 'Lunas' },
                                { value: 'failed', label: 'Gagal' },
                                { value: 'refunded', label: 'Refund' },
                            ]}
                            placeholder="Filter status"
                            className="w-40"
                        />
                        <Select
                            value={String(filters.per_page ?? 15)}
                            onChange={(v) => setFilters((prev) => ({ ...prev, per_page: Number(v), page: 1 }))}
                            options={[
                                { value: '10', label: '10' },
                                { value: '15', label: '15' },
                                { value: '25', label: '25' },
                                { value: '50', label: '50' },
                            ]}
                            placeholder="15"
                            className="w-24"
                        />
                    </div>
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
                            <p className="mt-1 text-sm text-neutral-500">Terjadi kesalahan saat mengambil daftar invoice.</p>
                        </div>
                        <button
                            onClick={() => refetch()}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
                        >
                            Coba Lagi
                        </button>
                    </motion.div>
                ) : invoices.length === 0 ? (
                    <motion.div variants={itemAnim} className="flex flex-col items-center gap-4 rounded-xl border border-border bg-white px-6 py-16 text-center shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                            <DocumentIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-base font-semibold text-neutral-900">Belum ada invoice</p>
                            <p className="mt-1 text-sm text-neutral-500">
                                {filters.status
                                    ? 'Tidak ada invoice yang cocok dengan filter yang dipilih.'
                                    : 'Belum ada invoice yang tercatat.'}
                            </p>
                        </div>
                        {filters.status && (
                            <button
                                onClick={() => setFilters({ page: 1, per_page: filters.per_page ?? 15 })}
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
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">No. Invoice</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Pelanggan</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Plan</th>
                                            <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Jumlah</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Jatuh Tempo</th>
                                            <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Dibayar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {invoices.map((inv) => {
                                            const sub = inv.subscription;
                                            const status = statusConfig[inv.status] ?? statusConfig.pending;
                                            const overdue = isOverdue(inv.due_date, inv.status);
                                            return (
                                                <tr key={inv.id} className="transition-colors hover:bg-neutral-50/50">
                                                    <td className="px-5 py-4">
                                                        <span className="text-sm font-mono font-medium text-neutral-900">
                                                            {inv.number}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        {sub?.user ? (
                                                            <div className="flex items-center gap-2.5">
                                                                <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold', getAvatarColor(sub.user.name))}>
                                                                    {getInitials(sub.user.name)}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-medium text-neutral-900 truncate max-w-[160px]">
                                                                        {sub.user.name}
                                                                    </p>
                                                                    <p className="text-xs text-neutral-500 truncate max-w-[160px]">
                                                                        {sub.user.email}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-neutral-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className="text-sm text-neutral-600">{sub?.plan?.name ?? '-'}</span>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <span className="text-sm font-semibold text-neutral-900">
                                                            {formatPrice(inv.amount)}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', status.dot)} />
                                                            <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset', status.badge)}>
                                                                {status.label}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className={cn(
                                                            'text-sm',
                                                            overdue ? 'font-semibold text-danger' : 'text-neutral-600',
                                                        )}>
                                                            {formatDate(inv.due_date)}
                                                            {overdue && (
                                                                <span className="ml-1.5 inline-flex items-center gap-1 text-xs text-danger">
                                                                    <ExclamationIcon className="h-3 w-3" />
                                                                    Lewat
                                                                </span>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <span className="text-sm text-neutral-600">
                                                            {inv.paid_at ? (
                                                                <span className="text-success font-medium">{formatDate(inv.paid_at)}</span>
                                                            ) : inv.status === 'paid' ? (
                                                                <span className="text-success font-medium">-</span>
                                                            ) : (
                                                                '-'
                                                            )}
                                                        </span>
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
                            {invoices.map((inv) => {
                                const sub = inv.subscription;
                                const status = statusConfig[inv.status] ?? statusConfig.pending;
                                const overdue = isOverdue(inv.due_date, inv.status);
                                return (
                                    <div key={inv.id} className="rounded-xl border border-border bg-white p-4 shadow-sm">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-mono font-semibold text-neutral-900">{inv.number}</p>
                                                <p className="text-xs text-neutral-500 mt-0.5">{sub?.user?.name ?? '-'}</p>
                                            </div>
                                            <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ring-1 ring-inset shrink-0', status.badge)}>
                                                <span className={cn('h-1 w-1 rounded-full', status.dot)} />
                                                {status.label}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                                            <div className="text-xs text-neutral-500 space-y-0.5">
                                                <p>{sub?.plan?.name ?? '-'}</p>
                                                <p className={cn(overdue && 'text-danger font-medium')}>
                                                    Jatuh tempo {formatDate(inv.due_date)}
                                                    {overdue && ' ⚠'}
                                                </p>
                                                {inv.paid_at && <p className="text-success">Lunas {formatDate(inv.paid_at)}</p>}
                                            </div>
                                            <span className="text-sm font-bold text-neutral-900">{formatPrice(inv.amount)}</span>
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
