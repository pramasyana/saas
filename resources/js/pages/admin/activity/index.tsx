import { Head, Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import Select from '@/atoms/Select';
import { useTenantActivity } from '@/features/tenants/hooks/useTenantActivity';
import type { ActivityFilters } from '@/features/tenants/hooks/useTenantActivity';
import AdminLayout from '@/layouts/AdminLayout';
import { useDebounce } from '@/hooks/useDebounce';
import Pagination from '@/molecules/Pagination';

interface ActivityPageProps {
    title: string;
}

const statusBadge: Record<string, string> = {
    active: 'bg-success-light text-success',
    trialing: 'bg-blue-50 text-blue-600',
    cancelled: 'bg-danger-light text-danger',
    expired: 'bg-neutral-100 text-neutral-600',
};

export default function Activity({ title }: ActivityPageProps) {
    const [filters, setFilters] = useState<ActivityFilters>({ page: 1, per_page: 15 });
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
    const { data, isLoading, isError } = useTenantActivity(queryFilters);

    const tenants = data?.data ?? [];
    const meta = data?.meta;

    function handlePage(page: number) {
        setFilters((prev) => ({ ...prev, page }));
    }

    function formatDate(dateStr: string | null) {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Aktivitas Tenant</h1>
                    <p className="mt-1 text-sm text-neutral-500">Ringkasan aktivitas dan penggunaan semua tenant.</p>
                </div>
            </div>

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Cari tenant atau pemilik..."
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
                            { value: 'trial', label: 'Trial' },
                            { value: 'inactive', label: 'Tidak Aktif' },
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
            ) : tenants.length === 0 ? (
                <div className="flex flex-col items-center gap-5 rounded-2xl border border-neutral-200 bg-white px-6 py-20 shadow-sm">
                    <p className="text-base font-semibold text-neutral-900">Belum ada tenant</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50/50">
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Tenant</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Domain</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Plan</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Users</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Cabang</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Bergabung</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {tenants.map((t) => (
                                <tr key={t.id} className="transition-colors hover:bg-neutral-50/50">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary">
                                                {(t.name ?? '?').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <Link href={`/admin/tenants/${t.id}`} className="text-sm font-medium text-primary hover:underline">
                                                    {t.name ?? 'Tanpa Nama'}
                                                </Link>
                                                <p className="text-xs text-neutral-500">{t.owner?.email ?? t.email ?? '-'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-neutral-600">{t.domain ?? '-'}</td>
                                    <td className="px-5 py-4 text-sm text-neutral-600">{t.subscription?.plan_name ?? '-'}</td>
                                    <td className="px-5 py-4">
                                        {t.subscription ? (
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge[t.subscription.status] ?? 'bg-neutral-100 text-neutral-600'}`}>
                                                {t.subscription.status}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-500">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-neutral-600">{t.users_count}</td>
                                    <td className="px-5 py-4 text-sm text-neutral-600">{t.branches_count}</td>
                                    <td className="px-5 py-4 text-sm text-neutral-600">{formatDate(t.created_at)}</td>
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
