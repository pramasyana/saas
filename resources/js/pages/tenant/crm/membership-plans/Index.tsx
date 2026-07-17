import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Badge from '@/atoms/Badge';
import Select from '@/atoms/Select';
import MembershipPlanDeleteDialog from '@/features/crm/components/MembershipPlanDeleteDialog';
import {
    useDeleteMembershipPlan,
    useMembershipPlanStats,
    useMembershipPlans,
} from '@/features/crm/hooks/useMembershipPlans';
import type { CustomerMembershipPlan } from '@/features/crm/types';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';
import Pagination from '@/molecules/Pagination';
import { useToastStore } from '@/stores/toast';

function extractErrors(error: unknown): Record<string, string[]> {
    if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as Record<string, unknown>;

        if (data.errors && typeof data.errors === 'object') {
            return data.errors as Record<string, string[]>;
        }

        if (data.message && typeof data.message === 'string') {
            return { _general: [data.message] };
        }
    }

    return {};
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

function ShieldCheckIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
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

function UsersIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
    );
}

function CreditCardIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
    );
}

function PencilIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
    );
}

function TrashIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
    );
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
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

function formatPrice(price: number): string {
    if (price >= 1000000) {
        return `Rp ${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1).replace('.', ',')}jt`;
    }

    if (price >= 1000) {
        return `Rp ${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 0).replace('.', ',')}rb`;
    }

    return `Rp ${price.toLocaleString('id-ID')}`;
}

function TableSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="hidden sm:block">
                <div className="border-b border-neutral-100 bg-neutral-50/50 px-6 py-3.5">
                    <div className="flex gap-6">
                        <div className="h-3.5 w-40 rounded bg-neutral-200" />
                        <div className="h-3.5 w-20 rounded bg-neutral-200" />
                        <div className="h-3.5 w-16 rounded bg-neutral-200" />
                        <div className="h-3.5 w-16 rounded bg-neutral-200" />
                        <div className="h-3.5 w-20 rounded bg-neutral-200" />
                        <div className="h-3.5 w-16 rounded bg-neutral-200" />
                        <div className="h-3.5 w-16 rounded bg-neutral-200" />
                        <div className="h-3.5 w-16 rounded bg-neutral-200" />
                    </div>
                </div>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-6 border-b border-neutral-100 px-6 py-4">
                        <div className="flex items-center gap-3 w-40">
                            <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                            <div className="space-y-1.5 flex-1">
                                <div className="h-3.5 w-28 rounded bg-neutral-200" />
                                <div className="h-3 w-20 rounded bg-neutral-100" />
                            </div>
                        </div>
                        <div className="h-4 w-16 rounded bg-neutral-200" />
                        <div className="h-5 w-14 rounded-full bg-neutral-200" />
                        <div className="h-4 w-12 rounded bg-neutral-200" />
                        <div className="h-5 w-16 rounded-full bg-neutral-200" />
                        <div className="h-4 w-14 rounded bg-neutral-200" />
                        <div className="h-5 w-12 rounded-full bg-neutral-200" />
                        <div className="h-8 w-16 rounded-lg bg-neutral-200" />
                    </div>
                ))}
            </div>
            <div className="sm:hidden space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-neutral-200" />
                            <div className="space-y-2 flex-1">
                                <div className="h-4 w-3/4 rounded bg-neutral-200" />
                                <div className="h-3 w-1/2 rounded bg-neutral-100" />
                            </div>
                            <div className="h-5 w-14 rounded-full bg-neutral-200" />
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
                            <div className="flex gap-2">
                                <div className="h-3 w-12 rounded bg-neutral-100" />
                                <div className="h-3 w-10 rounded bg-neutral-100" />
                            </div>
                            <div className="flex gap-2">
                                <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                                <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function MembershipPlansIndexPage() {
    const addToast = useToastStore((s) => s.addToast);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [billingInterval, setBillingInterval] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [perPage, setPerPage] = useState(15);
    const [planToDelete, setPlanToDelete] = useState<CustomerMembershipPlan | null>(null);

    const { data, isLoading, isError, error, refetch } = useMembershipPlans({
        page,
        per_page: perPage,
        search: search || undefined,
        billing_interval: billingInterval || undefined,
        is_active: statusFilter || undefined,
    });
    const { data: statsData } = useMembershipPlanStats();
    const deleteMutation = useDeleteMembershipPlan();

    const plans = data?.data ?? [];
    const meta = data?.meta;
    const stats = statsData?.data;

    function handleDelete() {
        if (!planToDelete) {
return;
}

        deleteMutation.mutate(planToDelete.id, {
            onSuccess: () => {
                setPlanToDelete(null);
                addToast('success', 'Paket membership berhasil dihapus.');
            },
        });
    }

    const deleteError = (() => {
        const err = deleteMutation.error;

        if (!err) {
return undefined;
}

        if (err instanceof Error && 'response' in err) {
            const axiosErr = err as { response?: { data?: { message?: string } } };

            return axiosErr.response?.data?.message ?? err.message;
        }

        return String(err);
    })();

    function handlePage(p: number) {
        setPage(p);
    }

    function handleResetFilter() {
        setSearch('');
        setBillingInterval('');
        setStatusFilter('');
        setPage(1);
    }

    const hasActiveFilter = search || billingInterval || statusFilter;
    const isLoadingStats = !stats;

    return (
        <TenantLayout>
            <Head title="Paket Membership" />

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                <motion.div variants={itemAnim}>
                    <nav className="flex items-center gap-2 text-sm text-neutral-500">
                        <span className="text-neutral-400">CRM</span>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        <span className="font-medium text-neutral-900">Paket Membership</span>
                    </nav>
                </motion.div>

                {/* Stat Cards */}
                <motion.div variants={itemAnim} className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                                <CreditCardIcon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-neutral-500">Total Paket</p>
                                <p className="text-xl font-bold tracking-tight text-neutral-900">
                                    {isLoadingStats ? '-' : stats!.total_plans.toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success-50 text-success">
                                <CheckCircleIcon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-neutral-500">Aktif</p>
                                <p className="text-xl font-bold tracking-tight text-success">
                                    {isLoadingStats ? '-' : stats!.active_plans.toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
                                <XCircleIcon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-neutral-500">Nonaktif</p>
                                <p className="text-xl font-bold tracking-tight text-neutral-500">
                                    {isLoadingStats ? '-' : stats!.inactive_plans.toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                                <UsersIcon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-neutral-500">Pelanggan</p>
                                <p className="text-xl font-bold tracking-tight text-violet-600">
                                    {isLoadingStats ? '-' : stats!.total_subscribers.toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Header */}
                <motion.div variants={itemAnim} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Paket Membership</h1>
                        <p className="mt-1 text-sm text-neutral-500">Kelola paket membership untuk pelanggan.</p>
                    </div>
                    <Link href="/crm/membership-plans/create">
                        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark">
                            <PlusIcon className="h-4 w-4" />
                            Tambah Paket
                        </button>
                    </Link>
                </motion.div>

                {/* Search + Filters */}
                <motion.div variants={itemAnim} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
 setSearch(e.target.value); setPage(1); 
}}
                            placeholder="Cari paket..."
                            className="w-full rounded-xl border border-neutral-300 py-2.5 pl-9 pr-4 text-sm shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select
                            value={billingInterval}
                            onChange={(v) => {
 setBillingInterval(v); setPage(1); 
}}
                            options={[
                                { value: '', label: 'Semua Interval' },
                                { value: 'monthly', label: 'Bulanan' },
                                { value: 'yearly', label: 'Tahunan' },
                            ]}
                            placeholder="Filter interval"
                            className="w-40"
                        />
                        <Select
                            value={statusFilter}
                            onChange={(v) => {
 setStatusFilter(v); setPage(1); 
}}
                            options={[
                                { value: '', label: 'Semua Status' },
                                { value: 'true', label: 'Aktif' },
                                { value: 'false', label: 'Nonaktif' },
                            ]}
                            placeholder="Filter status"
                            className="w-36"
                        />
                        <Select
                            value={String(perPage)}
                            onChange={(v) => {
 setPerPage(Number(v)); setPage(1); 
}}
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

                {/* Content */}
                {isLoading ? (
                    <motion.div variants={itemAnim}>
                        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm p-6">
                            <TableSkeleton />
                        </div>
                    </motion.div>
                ) : isError ? (
                    <motion.div variants={itemAnim} className="flex flex-col items-center gap-4 rounded-xl border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-light text-danger">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-base font-semibold text-neutral-900">Gagal memuat data</p>
                            <p className="mt-1 text-sm text-neutral-500">{(error as Error)?.message || 'Terjadi kesalahan saat mengambil daftar paket.'}</p>
                        </div>
                        <button onClick={() => refetch()} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark">
                            Coba Lagi
                        </button>
                    </motion.div>
                ) : plans.length === 0 ? (
                    <motion.div variants={itemAnim} className="flex flex-col items-center gap-4 rounded-xl border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100">
                            <CreditCardIcon className="h-7 w-7 text-neutral-400" />
                        </div>
                        <div>
                            <p className="text-base font-semibold text-neutral-900">
                                {hasActiveFilter ? 'Tidak ada paket ditemukan' : 'Belum ada paket'}
                            </p>
                            <p className="mt-1 text-sm text-neutral-500">
                                {hasActiveFilter
                                    ? 'Tidak ada paket yang cocok dengan filter yang dipilih.'
                                    : 'Buat paket membership pertama untuk memulai.'}
                            </p>
                        </div>
                        {hasActiveFilter ? (
                            <button onClick={handleResetFilter} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark">
                                Reset Filter
                            </button>
                        ) : (
                            <Link href="/crm/membership-plans/create">
                                <button className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50">
                                    <PlusIcon className="h-4 w-4" />
                                    Tambah Paket
                                </button>
                            </Link>
                        )}
                    </motion.div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <motion.div variants={itemAnim} className="hidden sm:block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-neutral-100 bg-neutral-50/80">
                                            <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Paket</th>
                                            <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Harga</th>
                                            <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Interval</th>
                                            <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Durasi</th>
                                            <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Keuntungan</th>
                                            <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Pelanggan</th>
                                            <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                            <th className="whitespace-nowrap px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {plans.map((plan) => (
                                            <tr key={plan.id} className="transition-colors hover:bg-neutral-50">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold shadow-sm',
                                                            plan.is_active ? 'bg-primary-50 text-primary' : 'bg-neutral-100 text-neutral-400',
                                                        )}>
                                                            {plan.name.charAt(0)}
                                                        </div>
                                                        <div className="min-w-0 max-w-[180px]">
                                                            <p className="truncate text-sm font-semibold text-neutral-900">{plan.name}</p>
                                                            {plan.description && (
                                                                <p className="truncate text-xs text-neutral-500">{plan.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-semibold text-neutral-900">
                                                        {formatPrice(plan.price)}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={cn(
                                                        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium',
                                                        plan.billing_interval === 'yearly'
                                                            ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200'
                                                            : 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
                                                    )}>
                                                        {plan.billing_interval === 'yearly' ? 'Tahunan' : 'Bulanan'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="text-sm text-neutral-600">
                                                        {plan.duration_months} bln
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                        {plan.benefits?.length ?? 0} benefit
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="text-sm text-neutral-600">
                                                        {(plan as CustomerMembershipPlan & { subscriptions_count?: number }).subscriptions_count ?? 0}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <Badge variant={plan.is_active ? 'success' : 'danger'}>
                                                        {plan.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </Badge>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                                        <button
                                                            onClick={() => router.get(`/crm/membership-plans/${plan.id}/edit`)}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                                            title="Edit paket"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </button>
                                                        <div className="h-5 w-px bg-neutral-200" />
                                                        <button
                                                            onClick={() => setPlanToDelete(plan)}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger"
                                                            title="Hapus paket"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {meta && <Pagination meta={meta} onPageChange={handlePage} />}
                        </motion.div>

                        {/* Mobile Cards */}
                        <motion.div variants={itemAnim} className="sm:hidden space-y-3">
                            {plans.map((plan) => (
                                <div key={plan.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className={cn(
                                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold',
                                                plan.is_active ? 'bg-primary-50 text-primary' : 'bg-neutral-100 text-neutral-400',
                                            )}>
                                                {plan.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-neutral-900">{plan.name}</p>
                                                <p className="text-xs text-neutral-500">
                                                    {formatPrice(plan.price)} · {plan.billing_interval === 'yearly' ? 'Tahunan' : 'Bulanan'}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={plan.is_active ? 'success' : 'danger'}>
                                            {plan.is_active ? 'Aktif' : 'Nonaktif'}
                                        </Badge>
                                    </div>

                                    {plan.description && (
                                        <p className="mt-2 line-clamp-2 text-xs text-neutral-500">{plan.description}</p>
                                    )}

                                    <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
                                        <div className="flex items-center gap-3 text-xs text-neutral-500">
                                            <span className="inline-flex items-center gap-1">
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {plan.duration_months} bln
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                                </svg>
                                                {(plan as CustomerMembershipPlan & { subscriptions_count?: number }).subscriptions_count ?? 0}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                                </svg>
                                                {plan.benefits?.length ?? 0} benefit
                                            </span>
                                        </div>
                                        <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                            <button
                                                onClick={() => router.get(`/crm/membership-plans/${plan.id}/edit`)}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                                title="Edit paket"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <div className="h-5 w-px bg-neutral-200" />
                                            <button
                                                onClick={() => setPlanToDelete(plan)}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger"
                                                title="Hapus paket"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {meta && (
                                <div className="pt-2">
                                    <Pagination meta={meta} onPageChange={handlePage} />
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </motion.div>

            {planToDelete && (
                <MembershipPlanDeleteDialog
                    open={!!planToDelete}
                    plan={planToDelete}
                    deleting={deleteMutation.isPending}
                    error={deleteError}
                    onClose={() => {
 setPlanToDelete(null); deleteMutation.reset(); 
}}
                    onConfirm={handleDelete}
                />
            )}
        </TenantLayout>
    );
}
