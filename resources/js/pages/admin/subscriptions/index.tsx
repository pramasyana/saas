import { Head } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import Select from '@/atoms/Select';
import { useSubscriptions } from '@/features/subscriptions/hooks/useSubscriptions';
import { useDebounce } from '@/hooks/useDebounce';
import type { SubscriptionFilters } from '@/features/subscriptions/types';

interface SubscriptionsPageProps {
    title: string;
    stats: {
        active: number;
        cancelled: number;
        total_revenue: number | null;
    };
}

function formatPrice(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export default function Subscriptions({ title, stats }: SubscriptionsPageProps) {
    const [filters, setFilters] = useState<SubscriptionFilters>({ page: 1, per_page: 15 });
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebounce(searchInput);
    const prevSearch = useRef(debouncedSearch);

    useEffect(() => {
        if (prevSearch.current !== debouncedSearch) {
            prevSearch.current = debouncedSearch;
            setFilters((prev) => ({ ...prev, search: debouncedSearch || undefined, page: 1 }));
        }
    }, [debouncedSearch]);

    const queryFilters = { ...filters, search: debouncedSearch || undefined };
    const { data, isLoading, isError } = useSubscriptions(queryFilters);

    const subscriptions = data?.data ?? [];
    const meta = data?.meta;

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Subscriptions</h1>
                    <p className="mt-1 text-sm text-neutral-500">Kelola langganan pelanggan.</p>
                </div>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-success/20 bg-gradient-to-br from-success-light to-white p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success-light text-success">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold tracking-tight text-neutral-900">{stats.active}</p>
                            <p className="text-sm text-success font-medium">Aktif</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold tracking-tight text-neutral-900">{stats.cancelled}</p>
                            <p className="text-sm text-neutral-600 font-medium">Dibatalkan</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-warning/20 bg-gradient-to-br from-warning-light to-white p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warning-light text-warning">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold tracking-tight text-neutral-900">
                                {stats.total_revenue ? formatPrice(stats.total_revenue) : 'Rp 0'}
                            </p>
                            <p className="text-sm text-warning font-medium">MRR</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Cari pelanggan atau plan..."
                        className="w-full rounded-xl border border-neutral-300 py-2.5 pl-10 pr-3.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>
                <div className="flex gap-3">
                    <Select
                        value={filters.status ?? ''}
                        onChange={(v) => setFilters((prev) => ({ ...prev, status: v || undefined, page: 1 }))}
                        options={[
                            { value: '', label: 'Semua Status' },
                            { value: 'active', label: 'Aktif' },
                            { value: 'cancelled', label: 'Dibatalkan' },
                            { value: 'expired', label: 'Kadaluarsa' },
                        ]}
                        placeholder="Filter status"
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
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 rounded-xl bg-neutral-100" />
                    ))}
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-20 text-center shadow-sm">
                    <p className="text-base font-semibold text-neutral-900">Gagal memuat data</p>
                </div>
            ) : subscriptions.length === 0 ? (
                <div className="flex flex-col items-center gap-5 rounded-2xl border border-neutral-200 bg-white px-6 py-20 shadow-sm">
                    <p className="text-base font-semibold text-neutral-900">Belum ada subscription</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50/50">
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Pelanggan</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Plan</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Harga</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Interval</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Mulai</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Akhir</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {subscriptions.map((sub) => (
                                <tr key={sub.id} className="transition-colors hover:bg-neutral-50/50">
                                    <td className="px-5 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">{sub.user?.name ?? '-'}</p>
                                            <p className="text-xs text-neutral-500">{sub.user?.email ?? ''}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm text-neutral-900">{sub.plan?.name ?? '-'}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm font-semibold text-neutral-900">{formatPrice(sub.price_amount)}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 capitalize">
                                            {sub.billing_interval}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                            sub.status === 'active'
                                                ? 'bg-success-light text-success'
                                                : sub.status === 'cancelled'
                                                ? 'bg-danger-light text-danger'
                                                : 'bg-neutral-100 text-neutral-600'
                                        }`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-neutral-600">
                                        {sub.starts_at ? new Date(sub.starts_at).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-neutral-600">
                                        {sub.ends_at ? new Date(sub.ends_at).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {meta && (
                <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-6 py-3.5 shadow-sm sm:flex-row">
                    <p className="text-sm text-neutral-500">
                        <span className="font-semibold text-neutral-700">{meta.total}</span> data · Halaman <span className="font-semibold text-neutral-700">{meta.current_page}</span> dari <span className="font-semibold text-neutral-700">{meta.last_page}</span>
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            disabled={meta.current_page <= 1}
                            onClick={() => setFilters((prev) => ({ ...prev, page: meta.current_page - 1 }))}
                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Prev
                        </button>
                        {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setFilters((prev) => ({ ...prev, page }))}
                                className={`flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-sm font-medium transition-all ${
                                    page === meta.current_page
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-neutral-600 hover:bg-neutral-100'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            disabled={meta.current_page >= meta.last_page}
                            onClick={() => setFilters((prev) => ({ ...prev, page: meta.current_page + 1 }))}
                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
