import { Head, Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import Pagination from '@/molecules/Pagination';
import { usePlans, useTogglePopular, useDeletePlan } from '@/features/pricing/hooks/usePlans';
import { useToastStore } from '@/stores/toast';
import { useDebounce } from '@/hooks/useDebounce';
import type { PlanFilters } from '@/features/pricing/types';

interface PricingPageProps {
    title: string;
    stats: {
        total_plans: number;
        active_plans: number;
        cheapest_price: number | null;
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

function CardsSkeleton() {
    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <div className="h-5 w-24 rounded bg-neutral-200" />
                    <div className="mt-4 h-10 w-32 rounded bg-neutral-200" />
                    <div className="mt-3 h-3 w-full rounded bg-neutral-100" />
                    <div className="mt-6 space-y-3">
                        {[1, 2, 3, 4, 5].map((j) => (
                            <div key={j} className="h-4 w-full rounded bg-neutral-100" />
                        ))}
                    </div>
                    <div className="mt-6 flex gap-2">
                        <div className="h-9 w-20 rounded-lg bg-neutral-200" />
                        <div className="h-9 w-20 rounded-lg bg-neutral-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Pricing({ title, stats }: PricingPageProps) {
    const [filters, setFilters] = useState<PlanFilters>({ page: 1, per_page: 15 });
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
    const { data, isLoading, isError, error } = usePlans(queryFilters);
    const deleteMutation = useDeletePlan();
    const togglePopularMutation = useTogglePopular();
    const addToast = useToastStore((s) => s.addToast);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

    const plans = data?.data ?? [];
    const meta = data?.meta;

    function handlePage(page: number) {
        setFilters((prev) => ({ ...prev, page }));
    }

    function handleDelete() {
        if (!deleteTarget) return;
        deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => {
                setDeleteTarget(null);
                addToast('success', 'Plan berhasil dihapus.');
            },
            onError: () => {
                setDeleteTarget(null);
                addToast('error', 'Gagal menghapus plan.');
            },
        });
    }

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Pricing</h1>
                    <p className="mt-1 text-sm text-neutral-500">Kelola paket harga dan fitur untuk setiap plan.</p>
                </div>
                <Link
                    href="/admin/pricing/create"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark self-start"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Tambah Plan
                </Link>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold tracking-tight text-neutral-900">{stats.total_plans}</p>
                            <p className="text-sm text-neutral-600 font-medium">Total Plan</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-success/20 bg-gradient-to-br from-success-light to-white p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success-light text-success">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold tracking-tight text-neutral-900">{stats.active_plans}</p>
                            <p className="text-sm text-success font-medium">Plan Aktif</p>
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
                                {stats.cheapest_price ? formatPrice(stats.cheapest_price) : '-'}
                            </p>
                            <p className="text-sm text-warning font-medium">Harga Termurah</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Cari plan..."
                        className="w-full rounded-xl border border-neutral-300 py-2.5 pl-10 pr-3.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                </div>
                <div className="flex gap-3">
                    <Select
                        value={filters.is_active ?? ''}
                        onChange={(v) => setFilters((prev) => ({ ...prev, is_active: v || undefined, page: 1 }))}
                        options={[
                            { value: '', label: 'Semua Status' },
                            { value: '1', label: 'Aktif' },
                            { value: '0', label: 'Nonaktif' },
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

            {isError ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-20 text-center shadow-sm">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-light ring-1 ring-danger/20">
                        <svg className="h-8 w-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-base font-semibold text-neutral-900">Gagal memuat data</p>
                        <p className="mt-1 text-sm text-neutral-500">{(error as Error)?.message || 'Terjadi kesalahan.'}</p>
                    </div>
                </div>
            ) : isLoading ? (
                <CardsSkeleton />
            ) : plans.length === 0 ? (
                <div className="flex flex-col items-center gap-5 rounded-2xl border border-neutral-200 bg-white px-6 py-20 shadow-sm">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-50 ring-1 ring-neutral-200">
                        <svg className="h-10 w-10 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="text-base font-semibold text-neutral-900">
                            {searchInput || filters.is_active ? 'Tidak ada plan yang cocok' : 'Belum ada plan'}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500">
                            {searchInput || filters.is_active
                                ? 'Coba ubah filter atau kata kunci pencarian.'
                                : 'Buat plan pertama untuk mulai menawarkan paket harga.'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {plans.map((plan) => {
                        const visibleFeatures = plan.features.filter(f => !(f.definition.type === 'boolean' && f.value !== 'true'));
                        return (
                            <div
                                key={plan.id}
                                className={`group relative flex flex-col rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:shadow-lg ${
                                    plan.is_active
                                        ? plan.is_popular ? 'border-warning/40 ring-2 ring-warning/20' : 'border-neutral-200'
                                        : 'border-neutral-200/60 bg-neutral-50/50'
                                }`}
                            >
                                {!plan.is_active && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px]">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-200/80 px-4 py-1.5 text-xs font-semibold text-neutral-500 backdrop-blur-sm">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                            </svg>
                                            Tidak Aktif
                                        </span>
                                    </div>
                                )}

                                <div className="flex-1 p-5">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-bold text-neutral-900">{plan.name}</h3>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        togglePopularMutation.mutate(plan.id, {
                                                            onSuccess: (res) => {
                                                                addToast('success', res.message || 'Plan populer diperbarui.');
                                                            },
                                                            onError: () => {
                                                                addToast('error', 'Gagal mengubah plan populer.');
                                                            },
                                                        });
                                                    }}
                                                    disabled={togglePopularMutation.isPending}
                                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-all ${
                                                        plan.is_popular
                                                            ? 'bg-warning-light text-warning hover:bg-warning/20'
                                                            : 'bg-neutral-100 text-neutral-400 hover:bg-warning-light hover:text-warning'
                                                    }`}
                                                >
                                                    <svg className={`h-3 w-3 ${plan.is_popular ? 'fill-warning' : 'fill-none stroke-current'}`} viewBox="0 0 20 20" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    {plan.is_popular ? 'Populer' : 'Jadikan Populer'}
                                                </button>
                                                <span className="inline-flex items-center justify-center rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-500">
                                                    #{plan.sort_order}
                                                </span>
                                            </div>
                                            {plan.description && (
                                                <p className="mt-1 text-xs leading-relaxed text-neutral-500 line-clamp-2">{plan.description}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold tracking-tight text-neutral-900">
                                                {plan.price_monthly === 0 ? (
                                                    <span className="text-2xl font-semibold text-success">Gratis</span>
                                                ) : (
                                                    formatPrice(plan.price_monthly)
                                                )}
                                            </span>
                                            {plan.price_monthly > 0 && (
                                                <span className="text-sm font-medium text-neutral-400">/bulan</span>
                                            )}
                                        </div>
                                        {plan.price_yearly && (
                                            <p className="mt-0.5 text-xs text-neutral-500">
                                                {formatPrice(plan.price_yearly)}
                                                <span className="text-neutral-400">/tahun</span>
                                                {plan.price_monthly > 0 && (
                                                    <span className="ml-1.5 inline-flex items-center rounded-full bg-success-light px-2 py-0.5 text-[10px] font-semibold text-success">
                                                        Hemat {Math.round((1 - plan.price_yearly / (plan.price_monthly * 12)) * 100)}%
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-5 border-t border-neutral-100 pt-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Fitur</p>
                                        <ul className="space-y-2.5">
                                            {visibleFeatures.map((f) => (
                                                <li key={f.id} className="flex items-start gap-2.5 text-sm">
                                                    {f.definition.type === 'boolean' ? (
                                                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                        </svg>
                                                    ) : (
                                                        <span className="inline-flex mt-0.5 h-4 w-4 shrink-0 items-center justify-center rounded bg-neutral-100 text-[10px] font-bold text-neutral-500">
                                                            #
                                                        </span>
                                                    )}
                                                    <span className="text-neutral-700">
                                                        {f.definition.type === 'boolean'
                                                            ? f.definition.label
                                                            : <>
                                                                <span className="font-semibold text-neutral-900">{f.value}</span>
                                                                <span className="text-neutral-400"> {f.definition.label.toLowerCase()}</span>
                                                            </>
                                                        }
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex gap-2 border-t border-neutral-100 p-4">
                                    <Link
                                        href={`/admin/pricing/${plan.id}/edit`}
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => setDeleteTarget({ id: plan.id, name: plan.name })}
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-danger/30 px-4 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger-light"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {meta && (<Pagination meta={meta} onPageChange={handlePage} />)}

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}>
                    <div className="mx-4 w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-light ring-1 ring-danger/20">
                            <svg className="h-6 w-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-base font-semibold text-neutral-900">Hapus Plan</h3>
                        <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                            Yakin ingin menghapus <span className="font-medium text-neutral-700">{deleteTarget.name}</span>? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                disabled={deleteMutation.isPending}
                                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                                className="inline-flex items-center gap-2 rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-danger-dark disabled:opacity-50 shadow-sm"
                            >
                                {deleteMutation.isPending ? (
                                    <>
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                        </svg>
                                        Menghapus...
                                    </>
                                ) : (
                                    'Ya, Hapus'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
