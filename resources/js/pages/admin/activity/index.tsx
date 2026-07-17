import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Badge from '@/atoms/Badge';
import Select from '@/atoms/Select';
import { useTenantActivity } from '@/features/tenants/hooks/useTenantActivity';
import type { ActivityFilters } from '@/features/tenants/hooks/useTenantActivity';
import { useDebounce } from '@/hooks/useDebounce';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';
import Pagination from '@/molecules/Pagination';

interface ActivityPageProps {
    title: string;
}

const statusConfig: Record<string, { label: string; dot: string; badge: 'success' | 'warning' | 'danger' | 'default' }> = {
    active: { label: 'Aktif', dot: 'bg-success', badge: 'success' },
    trialing: { label: 'Trial', dot: 'bg-blue-500', badge: 'default' },
    cancelled: { label: 'Berhenti', dot: 'bg-danger', badge: 'danger' },
    expired: { label: 'Kadaluarsa', dot: 'bg-neutral-400', badge: 'default' },
    inactive: { label: 'Tidak Aktif', dot: 'bg-neutral-300', badge: 'default' },
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

function BuildingIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
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

function StoreIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 0a3 3 0 00-1.02 2.047L6.75 15v-1.5" />
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

function ExternalIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
    );
}

function formatDate(dateStr: string | null) {
    if (!dateStr) {
return '-';
}

    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getAvatarColor(name: string | null) {
    const colors = [
        'bg-primary-50 text-primary',
        'bg-blue-50 text-blue-600',
        'bg-success-light text-success',
        'bg-warning-light text-warning',
        'bg-danger-light text-danger',
    ];
    const idx = (name ?? '').length % colors.length;

    return colors[idx];
}

function TableSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="hidden sm:block">
                <div className="rounded-xl border border-border bg-white shadow-sm">
                    <div className="border-b border-border px-6 py-4">
                        <div className="flex gap-4">
                            <div className="h-4 w-1/4 rounded bg-neutral-200" />
                            <div className="h-4 w-1/6 rounded bg-neutral-200" />
                            <div className="h-4 w-1/6 rounded bg-neutral-200" />
                            <div className="h-4 w-1/12 rounded bg-neutral-200" />
                            <div className="h-4 w-1/12 rounded bg-neutral-200" />
                            <div className="h-4 w-1/12 rounded bg-neutral-200" />
                            <div className="h-4 w-1/12 rounded bg-neutral-200" />
                        </div>
                    </div>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 border-b border-border px-6 py-4">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                                <div className="space-y-1.5 flex-1">
                                    <div className="h-3.5 w-1/3 rounded bg-neutral-200" />
                                    <div className="h-3 w-1/4 rounded bg-neutral-100" />
                                </div>
                            </div>
                            <div className="h-3.5 w-1/6 rounded bg-neutral-200" />
                            <div className="h-3.5 w-1/6 rounded bg-neutral-200" />
                            <div className="h-5 w-16 rounded-full bg-neutral-200" />
                            <div className="h-3.5 w-8 rounded bg-neutral-200" />
                            <div className="h-3.5 w-8 rounded bg-neutral-200" />
                            <div className="h-3.5 w-20 rounded bg-neutral-200" />
                        </div>
                    ))}
                </div>
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
    const { data, isLoading, isError, refetch } = useTenantActivity(queryFilters);

    const tenants = data?.data ?? [];
    const meta = data?.meta;

    function handlePage(page: number) {
        setFilters((prev) => ({ ...prev, page }));
    }

    const activeCount = tenants.filter((t) => t.subscription?.status === 'active').length;
    const trialCount = tenants.filter((t) => t.subscription?.status === 'trialing').length;
    const inactiveCount = tenants.filter((t) => !t.subscription || t.subscription.status === 'cancelled' || t.subscription.status === 'expired').length;

    return (
        <AdminLayout>
            <Head title={title} />

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                <motion.div variants={itemAnim} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                            Aktivitas Tenant
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500">
                            Ringkasan aktivitas dan penggunaan semua tenant.
                        </p>
                    </div>
                    {meta && (
                        <div className="mt-2 text-sm text-neutral-400 sm:mt-0">
                            Total <span className="font-semibold text-neutral-700">{meta.total}</span> tenant
                        </div>
                    )}
                </motion.div>

                <motion.div variants={itemAnim} className="grid grid-cols-3 gap-3 sm:gap-4">
                    <div className="rounded-xl border border-border bg-white p-3 sm:p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <span className="h-2 w-2 rounded-full bg-success" />
                            Aktif
                        </div>
                        <p className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                            {isLoading ? '-' : activeCount}
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-3 sm:p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                            Trial
                        </div>
                        <p className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                            {isLoading ? '-' : trialCount}
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-3 sm:p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <span className="h-2 w-2 rounded-full bg-neutral-300" />
                            Tidak Aktif
                        </div>
                        <p className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                            {isLoading ? '-' : inactiveCount}
                        </p>
                    </div>
                </motion.div>

                <motion.div variants={itemAnim} className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Cari tenant atau pemilik..."
                            className="w-full rounded-xl border border-neutral-300 py-2.5 pl-10 pr-3.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <SearchIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
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
                            <p className="mt-1 text-sm text-neutral-500">Terjadi kesalahan saat mengambil data tenant.</p>
                        </div>
                        <button
                            onClick={() => refetch()}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
                        >
                            Coba Lagi
                        </button>
                    </motion.div>
                ) : tenants.length === 0 ? (
                    <motion.div variants={itemAnim} className="flex flex-col items-center gap-4 rounded-xl border border-border bg-white px-6 py-16 text-center shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                            <BuildingIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-base font-semibold text-neutral-900">Belum ada tenant</p>
                            <p className="mt-1 text-sm text-neutral-500">
                                {filters.search || filters.status
                                    ? 'Tidak ada tenant yang cocok dengan filter yang dipilih.'
                                    : 'Belum ada tenant yang terdaftar di platform.'}
                            </p>
                        </div>
                        {(filters.search || filters.status) && (
                            <button
                                onClick={() => {
 setSearchInput(''); setFilters({ page: 1, per_page: 15 }); 
}}
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
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Tenant</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Domain</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Plan</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                            <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">Users</th>
                                            <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">Cabang</th>
                                            <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Bergabung</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {tenants.map((t, idx) => {
                                            const status = statusConfig[t.subscription?.status ?? 'inactive'];

                                            return (
                                                <tr
                                                    key={t.id}
                                                    className="transition-colors hover:bg-neutral-50/50"
                                                    style={{ animationDelay: `${idx * 40}ms` }}
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold', getAvatarColor(t.name))}>
                                                                {(t.name ?? '?').charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <Link
                                                                    href={`/admin/tenants/${t.id}`}
                                                                    className="text-sm font-medium text-neutral-900 hover:text-primary transition-colors"
                                                                >
                                                                    {t.name ?? 'Tanpa Nama'}
                                                                </Link>
                                                                <p className="text-xs text-neutral-500 truncate max-w-[180px]">
                                                                    {t.owner?.email ?? t.email ?? '-'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        {t.domain ? (
                                                            <a
                                                                href={`https://${t.domain}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-primary transition-colors"
                                                            >
                                                                {t.domain}
                                                                <ExternalIcon className="h-3 w-3 shrink-0" />
                                                            </a>
                                                        ) : (
                                                            <span className="text-sm text-neutral-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        {t.subscription?.plan_name ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-sm font-medium text-neutral-900">
                                                                    {t.subscription.plan_name}
                                                                </span>
                                                                {t.subscription.price_amount > 0 && (
                                                                    <span className="text-xs text-neutral-400">
                                                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(t.subscription.price_amount)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-neutral-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        {t.subscription ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', status.dot)} />
                                                                <Badge variant={status.badge}>
                                                                    {status.label}
                                                                </Badge>
                                                            </div>
                                                        ) : (
                                                            <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-500">
                                                                N/A
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className="inline-flex items-center gap-1 text-sm text-neutral-600">
                                                            <UsersIcon className="h-3.5 w-3.5 text-neutral-400" />
                                                            {t.users_count}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className="inline-flex items-center gap-1 text-sm text-neutral-600">
                                                            <StoreIcon className="h-3.5 w-3.5 text-neutral-400" />
                                                            {t.branches_count}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-right text-sm text-neutral-500">
                                                        {formatDate(t.created_at)}
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
                            {tenants.map((t) => {
                                const status = statusConfig[t.subscription?.status ?? 'inactive'];

                                return (
                                    <div key={t.id} className="rounded-xl border border-border bg-white p-4 shadow-sm">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold', getAvatarColor(t.name))}>
                                                    {(t.name ?? '?').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <Link
                                                        href={`/admin/tenants/${t.id}`}
                                                        className="text-sm font-medium text-neutral-900 hover:text-primary transition-colors"
                                                    >
                                                        {t.name ?? 'Tanpa Nama'}
                                                    </Link>
                                                    <p className="text-xs text-neutral-500 truncate">{t.owner?.email ?? t.email ?? '-'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                                <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
                                                <Badge variant={status.badge}>{status.label}</Badge>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                                            {t.subscription?.plan_name && (
                                                <span className="font-medium text-neutral-700">{t.subscription.plan_name}</span>
                                            )}
                                            {t.domain && <span>{t.domain}</span>}
                                            <span>{t.users_count} pengguna</span>
                                            <span>{t.branches_count} cabang</span>
                                            <span>{formatDate(t.created_at)}</span>
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
