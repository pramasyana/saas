import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import type { Reminder } from '@/features/booking/hooks/useReminders';
import { useReminders } from '@/features/booking/hooks/useReminders';
import TenantLayout from '@/layouts/TenantLayout';
import Pagination from '@/molecules/Pagination';

interface RemindersPageProps {
    title: string;
    stats: {
        total: number;
        pending: number;
        sent: number;
        failed: number;
    };
}

const badgeVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'new'> = {
    pending: 'warning',
    sent: 'success',
    failed: 'danger',
    cancelled: 'default',
};

const statusLabel: Record<string, string> = {
    pending: 'Tertunda',
    sent: 'Terkirim',
    failed: 'Gagal',
    cancelled: 'Dibatalkan',
    email: 'Email',
    whatsapp: 'WhatsApp',
};

function formatDate(d: string | null) {
    if (!d) {
return '-';
}

    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const perPageOptions = [
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
];

const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'pending', label: 'Tertunda' },
    { value: 'sent', label: 'Terkirim' },
    { value: 'failed', label: 'Gagal' },
    { value: 'cancelled', label: 'Dibatalkan' },
];

export default function Reminders({ title, stats }: RemindersPageProps) {
    const [filters, setFilters] = useState<{ status: string; page: number; per_page: number }>({ status: '', page: 1, per_page: 15 });

    const { data, isLoading } = useReminders({ status: filters.status || undefined, page: filters.page, per_page: filters.per_page });
    const reminders: Reminder[] = data?.data ?? [];
    const meta = data?.meta;

    function handlePage(page: number) {
 setFilters((prev) => ({ ...prev, page })); 
}

    const statCards = [
        { label: 'Total Reminder', value: stats.total, icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
        ), color: 'text-primary', bg: 'bg-primary-50' },
        { label: 'Tertunda', value: stats.pending, icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ), color: 'text-warning', bg: 'bg-warning-light' },
        { label: 'Terkirim', value: stats.sent, icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ), color: 'text-success', bg: 'bg-success-light' },
        { label: 'Gagal', value: stats.failed, icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
        ), color: 'text-danger', bg: 'bg-danger-light' },
    ];

    return (
        <TenantLayout>
            <Head title={title} />

            {/* Breadcrumb */}
            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/booking" className="transition-colors hover:text-neutral-700">Booking</Link>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Monitoring Reminder</span>
            </nav>

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{title}</h1>
                    <p className="mt-1 text-sm text-neutral-500">Pantau status pengingat otomatis booking.</p>
                </div>
                <Link href="/booking">
                    <Button variant="secondary" size="sm">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                        </svg>
                        Kembali
                    </Button>
                </Link>
            </div>

            {/* Stat Cards */}
            <FadeIn delay={0.03}>
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {statCards.map((s) => (
                        <div key={s.label} className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                                {s.icon}
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-bold tracking-tight text-neutral-900">{s.value.toLocaleString('id-ID')}</p>
                                <p className="text-sm text-neutral-500">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </FadeIn>

            {/* Table Card */}
            <FadeIn delay={0.06}>
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    {/* Filter Bar */}
                    <div className="flex flex-wrap items-center gap-3 border-b border-neutral-200 px-5 py-4">
                        <div className="w-40">
                            <Select
                                value={filters.status}
                                onChange={(v) => setFilters((prev) => ({ ...prev, status: v, page: 1 }))}
                                options={statusOptions}
                                placeholder="Filter status"
                            />
                        </div>
                        <div className="w-28">
                            <Select
                                value={String(filters.per_page)}
                                onChange={(v) => setFilters((prev) => ({ ...prev, per_page: Number(v), page: 1 }))}
                                options={perPageOptions}
                                placeholder="Per page"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="space-y-4 p-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex animate-pulse items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-neutral-200" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-1/3 rounded bg-neutral-200" />
                                            <div className="h-3 w-1/2 rounded bg-neutral-100" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : reminders.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                                    <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-neutral-600">Belum ada data reminder</p>
                                <p className="text-xs text-neutral-400">Reminder akan muncul otomatis setelah booking dibuat.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-neutral-100 bg-neutral-50">
                                        <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Kode Booking</th>
                                        <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Pelanggan</th>
                                        <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Tipe</th>
                                        <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                        <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Dijadwalkan</th>
                                        <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Terkirim</th>
                                        <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Error</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {reminders.map((r) => (
                                        <tr key={r.id} className="transition-colors hover:bg-neutral-50">
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className="font-medium text-neutral-900">{r.booking_code}</span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-neutral-700">{r.customer_name || '-'}</td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium capitalize text-neutral-600">
                                                    {r.type === 'email' ? (
                                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                                                        </svg>
                                                    )}
                                                    {statusLabel[r.type] ?? r.type}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <Badge variant={badgeVariant[r.status] ?? 'default'}>
                                                    {statusLabel[r.status] ?? r.status}
                                                </Badge>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-neutral-500">{formatDate(r.scheduled_at)}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-neutral-500">{formatDate(r.sent_at)}</td>
                                            <td className="max-w-[200px] truncate px-6 py-4 text-xs text-danger">
                                                {r.error_message ? (
                                                    <span className="inline-flex items-center gap-1" title={r.error_message}>
                                                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                                        </svg>
                                                        <span className="truncate">{r.error_message}</span>
                                                    </span>
                                                ) : <span className="text-neutral-300">-</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {meta && (<Pagination meta={meta} onPageChange={handlePage} />)}
                </div>
            </FadeIn>
        </TenantLayout>
    );
}
