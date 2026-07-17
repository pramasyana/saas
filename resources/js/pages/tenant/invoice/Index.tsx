import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Badge from '@/atoms/Badge';
import Select from '@/atoms/Select';
import { useCustomerInvoices, useCustomerInvoiceStats } from '@/features/invoice/hooks/useCustomerInvoices';
import type { CustomerInvoiceFilters } from '@/features/invoice/types';
import TenantLayout from '@/layouts/TenantLayout';
import { cn, formatPrice } from '@/lib/utils';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemAnim = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

const statusColors: Record<string, 'success' | 'warning' | 'default' | 'info' | 'danger'> = {
    paid: 'success',
    pending: 'warning',
    partial: 'info',
    draft: 'default',
    cancelled: 'danger',
};

const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'pending', label: 'Belum Bayar' },
    { value: 'paid', label: 'Lunas' },
    { value: 'partial', label: 'Bayar Sebagian' },
    { value: 'cancelled', label: 'Dibatalkan' },
];

const perPageOptions = [
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
];

function formatDate(date: string | null): string {
    if (!date) {
return '-';
}

    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isOverdue(date: string | null): boolean {
    if (!date) {
return false;
}

    return new Date(date) < new Date();
}

export default function InvoiceIndex() {
    const [filters, setFilters] = useState<CustomerInvoiceFilters>({ page: 1, per_page: 15, status: '', search: '' });
    const [searchInput, setSearchInput] = useState('');

    const { data, isLoading } = useCustomerInvoices(filters);
    const { data: stats } = useCustomerInvoiceStats();

    const invoices = data?.data ?? [];
    const meta = data?.meta;

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }

    function handlePageChange(page: number) {
        setFilters((prev) => ({ ...prev, page }));
    }

    const statCards = [
        {
            label: 'Total Invoice',
            value: stats?.total ?? 0,
            format: 'number',
            accent: 'border-l-primary',
            iconBg: 'bg-primary-50 text-primary',
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            ),
        },
        {
            label: 'Terbayar',
            value: stats?.paid_amount ?? 0,
            format: 'currency',
            subtitle: `${stats?.paid_count ?? 0} invoice`,
            accent: 'border-l-success',
            iconBg: 'bg-success-light text-success',
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: 'Belum Bayar',
            value: stats?.pending_amount ?? 0,
            format: 'currency',
            subtitle: `${stats?.pending_count ?? 0} invoice`,
            accent: 'border-l-warning',
            iconBg: 'bg-warning-light text-warning',
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: 'Jatuh Tempo',
            value: stats?.overdue_count ?? 0,
            format: 'number',
            accent: 'border-l-danger',
            iconBg: 'bg-danger-light text-danger',
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            ),
        },
    ];

    return (
        <TenantLayout>
            <Head title="Invoice" />

            <motion.div variants={container} initial="hidden" animate="show">
                {/* Header */}
                <motion.div variants={itemAnim} className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Invoice</h1>
                    <p className="mt-1.5 text-sm text-neutral-500">Kelola invoice untuk customer Anda.</p>
                </motion.div>

                {/* Stat Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((card) => (
                        <motion.div
                            key={card.label}
                            variants={itemAnim}
                            className={cn(
                                'rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md border-l-4',
                                card.accent,
                            )}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">{card.label}</p>
                                    <p className="mt-1.5 text-2xl font-bold text-neutral-900">
                                        {card.format === 'currency' ? formatPrice(card.value) : card.value}
                                    </p>
                                    {card.subtitle && <p className="mt-1 text-xs text-neutral-400">{card.subtitle}</p>}
                                </div>
                                <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', card.iconBg)}>
                                    {card.icon}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Filters */}
                <motion.div variants={itemAnim} className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Cari nomor invoice atau nama customer..."
                                    className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 shadow-sm transition-all placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-80"
                                />
                            </div>
                        </form>
                        <div className="flex items-center gap-3">
                            <div className="w-44">
                                <Select
                                    value={filters.status ?? ''}
                                    onChange={(v) => setFilters((prev) => ({ ...prev, status: v, page: 1 }))}
                                    options={statusOptions}
                                    placeholder="Semua Status"
                                />
                            </div>
                            <div className="w-20">
                                <Select
                                    value={String(filters.per_page ?? 15)}
                                    onChange={(v) => setFilters((prev) => ({ ...prev, per_page: Number(v), page: 1 }))}
                                    options={perPageOptions}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Table */}
                <motion.div variants={itemAnim} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    {isLoading ? (
                        <div className="space-y-4 p-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
                                    <div className="h-4 flex-1 animate-pulse rounded bg-neutral-100" />
                                    <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
                                </div>
                            ))}
                        </div>
                    ) : invoices.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-16">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                                <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-neutral-900">Belum ada invoice</p>
                            <p className="text-xs text-neutral-500">Invoice akan dibuat otomatis saat booking selesai.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden overflow-x-auto lg:block">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-neutral-100 bg-neutral-50/80">
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">No. Invoice</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Customer</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Booking</th>
                                            <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Jumlah</th>
                                            <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Jatuh Tempo</th>
                                            <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {invoices.map((inv) => (
                                            <tr key={inv.id} className="transition-colors hover:bg-neutral-50">
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <p className="font-mono text-sm font-semibold text-primary">{inv.number}</p>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <p className="text-sm font-medium text-neutral-900">{inv.customer_name || '-'}</p>
                                                    <p className="text-xs text-neutral-500">{inv.customer_email || ''}</p>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <p className="text-sm text-neutral-700">{inv.booking_code || '-'}</p>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                                    <p className="text-sm font-bold text-neutral-900">{formatPrice(inv.total_amount)}</p>
                                                    {inv.paid_amount > 0 && inv.paid_amount < inv.total_amount && (
                                                        <p className="text-xs text-success">Dibayar: {formatPrice(inv.paid_amount)}</p>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                                    <Badge variant={statusColors[inv.status] ?? 'default'}>{inv.status_label}</Badge>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <p className={cn(
                                                        'text-sm',
                                                        inv.is_overdue ? 'font-semibold text-danger' : 'text-neutral-700',
                                                    )}>
                                                        {formatDate(inv.due_date)}
                                                    </p>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                                    <Link
                                                        href={`/invoice/${inv.id}`}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm transition-all hover:border-primary/30 hover:bg-primary-50 hover:text-primary"
                                                    >
                                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="divide-y divide-neutral-100 lg:hidden">
                                {invoices.map((inv) => (
                                    <Link key={inv.id} href={`/invoice/${inv.id}`} className="block px-4 py-4 transition-colors hover:bg-neutral-50">
                                        <div className="flex items-start justify-between">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-mono text-sm font-semibold text-primary">{inv.number}</p>
                                                <p className="mt-1 text-sm font-medium text-neutral-900">{inv.customer_name || '-'}</p>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <Badge variant={statusColors[inv.status] ?? 'default'}>{inv.status_label}</Badge>
                                                    {inv.is_overdue && <span className="text-xs font-medium text-danger">Jatuh Tempo</span>}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-neutral-900">{formatPrice(inv.total_amount)}</p>
                                                <p className="mt-1 text-xs text-neutral-500">{formatDate(inv.due_date)}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {meta && meta.last_page > 1 && (
                                <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4">
                                    <p className="text-xs text-neutral-500">
                                        {meta.total} data &middot; Halaman {meta.current_page} dari {meta.last_page}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={cn(
                                                    'inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-xs font-medium transition-all',
                                                    page === meta.current_page
                                                        ? 'bg-primary text-white shadow-sm'
                                                        : 'text-neutral-600 hover:bg-neutral-100',
                                                )}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            </motion.div>
        </TenantLayout>
    );
}
