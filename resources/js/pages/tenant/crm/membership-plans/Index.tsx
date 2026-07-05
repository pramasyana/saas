import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import MembershipPlanDeleteDialog from '@/features/crm/components/MembershipPlanDeleteDialog';
import {
    useDeleteMembershipPlan,
    useMembershipPlanStats,
    useMembershipPlans,
} from '@/features/crm/hooks/useMembershipPlans';
import type { CustomerMembershipPlan } from '@/features/crm/types';
import TenantLayout from '@/layouts/TenantLayout';
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

export default function MembershipPlansIndexPage() {
    const addToast = useToastStore((s) => s.addToast);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [perPage, setPerPage] = useState(15);
    const [planToDelete, setPlanToDelete] = useState<CustomerMembershipPlan | null>(null);

    const { data, isLoading, isError, error } = useMembershipPlans({
        page,
        per_page: perPage,
        search: search || undefined,
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

    return (
        <TenantLayout>
            <Head title="Paket Membership" />

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <span className="text-neutral-400">CRM</span>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Paket Membership</span>
            </nav>

            {/* Stat Cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-500">Total Paket</p>
                            <p className="text-2xl font-bold tracking-tight text-neutral-900">
                                {stats?.total_plans?.toLocaleString('id-ID') ?? '-'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-50 text-success">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-500">Aktif</p>
                            <p className="text-2xl font-bold tracking-tight text-neutral-900">
                                {stats?.active_plans?.toLocaleString('id-ID') ?? '-'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Paket Membership</h1>
                    <p className="mt-1 text-sm text-neutral-500">Kelola paket membership untuk pelanggan.</p>
                </div>
                <Link href="/crm/membership-plans/create">
                    <Button className="shrink-0">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah Paket
                    </Button>
                </Link>
            </div>

            {/* Search + Filter */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
 setSearch(e.target.value); setPage(1); 
}}
                        placeholder="Cari paket..."
                        className="block w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                {isError ? (
                    <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-50">
                            <svg className="h-8 w-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-base font-semibold text-neutral-900">Gagal memuat data</p>
                            <p className="mt-1 text-sm text-neutral-500">{(error as Error)?.message || 'Terjadi kesalahan. Coba lagi.'}</p>
                        </div>
                        <button onClick={() => window.location.reload()} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark">
                            Muat Ulang
                        </button>
                    </div>
                ) : isLoading ? (
                    <div className="animate-pulse p-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4 py-4">
                                <div className="h-8 w-8 rounded-full bg-neutral-200" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-32 rounded bg-neutral-200" />
                                    <div className="h-3 w-20 rounded bg-neutral-100" />
                                </div>
                                <div className="h-6 w-16 rounded-full bg-neutral-200" />
                                <div className="flex gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                                    <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : plans.length === 0 ? (
                    <div className="flex flex-col items-center gap-5 px-6 py-20">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-100">
                            <svg className="h-10 w-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-base font-semibold text-neutral-900">Belum ada paket</p>
                            <p className="mt-1 text-sm text-neutral-500">Buat paket membership pertama untuk memulai.</p>
                        </div>
                        <Link href="/crm/membership-plans/create">
                            <Button variant="outline" size="sm">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Tambah Paket
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-neutral-100 bg-neutral-50/50">
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Paket</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Harga</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Interval</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {plans.map((plan) => (
                                        <tr key={plan.id} className="transition-colors hover:bg-neutral-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-sm font-bold text-primary">
                                                        {plan.name.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-neutral-900">{plan.name}</p>
                                                        {plan.description && (
                                                            <p className="truncate text-xs text-neutral-500 max-w-[200px]">{plan.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold text-neutral-900">
                                                    Rp {plan.price.toLocaleString('id-ID')}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="neutral">
                                                    {plan.billing_interval === 'yearly' ? 'Tahunan' : 'Bulanan'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={plan.is_active ? 'success' : 'danger'}>
                                                    {plan.is_active ? 'Aktif' : 'Nonaktif'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                                    <button
                                                        onClick={() => router.get(`/crm/membership-plans/${plan.id}/edit`)}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                                        title="Edit paket"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                    </button>
                                                    <div className="h-5 w-px bg-neutral-200" />
                                                    <button
                                                        onClick={() => setPlanToDelete(plan)}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger"
                                                        title="Hapus paket"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="divide-y divide-neutral-100 md:hidden">
                            {plans.map((plan) => (
                                <div key={plan.id} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-neutral-50">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-sm font-bold text-primary">
                                        {plan.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-neutral-900">{plan.name}</p>
                                        <p className="text-xs text-neutral-500">
                                            Rp {plan.price.toLocaleString('id-ID')} / {plan.billing_interval === 'yearly' ? 'tahun' : 'bulan'}
                                        </p>
                                    </div>
                                    <Badge variant={plan.is_active ? 'success' : 'danger'}>
                                        {plan.is_active ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                    <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                        <button
                                            onClick={() => router.get(`/crm/membership-plans/${plan.id}/edit`)}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                        <div className="h-5 w-px bg-neutral-200" />
                                        <button
                                            onClick={() => setPlanToDelete(plan)}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Pagination */}
            {meta && (
                <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <p className="text-sm text-neutral-500">
                        {meta.total.toLocaleString('id-ID')} data · Halaman {meta.current_page} dari {meta.last_page}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-500">Per halaman:</span>
                        <select
                            value={perPage}
                            onChange={(e) => {
 setPerPage(Number(e.target.value)); setPage(1); 
}}
                            className="rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={meta.current_page <= 1}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                                    p === meta.current_page
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-neutral-600 hover:bg-neutral-100'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                            disabled={meta.current_page >= meta.last_page}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

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
