import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import type { Branch } from '@/features/company/types';
import PricingRuleDeleteDialog from '@/features/service/components/PricingRuleDeleteDialog';
import PricingRuleTable from '@/features/service/components/PricingRuleTable';
import { usePricingRules, useDeletePricingRule, useUpdatePricingRule } from '@/features/service/hooks/usePricingRules';
import type { PricingRule, PricingRuleFormData } from '@/features/service/types';
import TenantLayout from '@/layouts/TenantLayout';
import Pagination from '@/molecules/Pagination';
import { useToastStore } from '@/stores/toast';

interface PricingRulesPageProps {
    title: string;
    stats: {
        total: number;
        active: number;
        scheduled: number;
    };
}

interface StatCard {
    label: string;
    value: number;
    icon: ReactNode;
    color: string;
    bg: string;
}

function TableSkeleton() {
    return (
        <div className="animate-pulse px-6 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 py-4">
                    <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-40 rounded bg-neutral-200" />
                        <div className="h-3 w-56 rounded bg-neutral-100" />
                    </div>
                    <div className="h-5 w-14 rounded-full bg-neutral-200" />
                    <div className="h-4 w-12 rounded bg-neutral-100" />
                    <div className="h-5 w-14 rounded-full bg-neutral-200" />
                    <div className="flex gap-2">
                        <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                        <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}

const statConfigs: Record<string, { color: string; bg: string }> = {
    total: { color: 'text-primary', bg: 'bg-primary-50' },
    active: { color: 'text-success', bg: 'bg-success-light' },
    scheduled: { color: 'text-warning', bg: 'bg-warning-light' },
};

export default function PricingRulesIndex({ title, stats }: PricingRulesPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const { data: branchesData } = useAllBranches();
    const branches = (branchesData?.data ?? []) as Branch[];
    const [filters, setFilters] = useState<{ page: number; per_page: number; search: string; branch_id: string; is_active?: boolean }>({
        page: 1,
        per_page: 15,
        search: '',
        branch_id: '',
    });
    const [searchInput, setSearchInput] = useState('');
    const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [ruleToDelete, setRuleToDelete] = useState<PricingRule | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    useEffect(() => {
        if (searchTimeout.current) {
clearTimeout(searchTimeout.current);
}

        searchTimeout.current = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
        }, 400);

        return () => {
            if (searchTimeout.current) {
clearTimeout(searchTimeout.current);
}
        };
    }, [searchInput]);

    const { data, isLoading, isError, error } = usePricingRules(filters);
    const deleteMutation = useDeletePricingRule();
    const updateMutation = useUpdatePricingRule();

    const statCards: StatCard[] = [
        { label: 'Total Aturan', value: stats.total, icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
        ), ...statConfigs.total },
        { label: 'Aktif', value: stats.active, icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ), ...statConfigs.active },
        { label: 'Terjadwal', value: stats.scheduled, icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ), ...statConfigs.scheduled },
    ];

    function handlePage(page: number) {
        setFilters((prev) => ({ ...prev, page }));
    }

    function openDelete(rule: PricingRule) {
        setRuleToDelete(rule);
        deleteMutation.reset();
        setDeleteOpen(true);
    }

    function handleDelete() {
        if (!ruleToDelete) {
return;
}

        deleteMutation.mutate(ruleToDelete.id, {
            onSuccess: () => {
                setDeleteOpen(false);
                setRuleToDelete(null);
                addToast('success', 'Aturan harga berhasil dihapus.');
            },
        });
    }

    function handleToggleActive(id: string, current: boolean) {
        setTogglingId(id);
        updateMutation.mutate(
            { id, data: { is_active: !current } as PricingRuleFormData },
            { onSettled: () => setTogglingId(null) }
        );
    }

    const rules = data?.data ?? [];
    const meta = data?.meta;

    return (
        <TenantLayout>
            <Head title={title} />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Aturan Harga</h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Aturan harga dinamis untuk layanan, paket, dan add-on.
                    </p>
                </div>
                <Link href="/service/pricing-rules/create">
                    <Button>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah Aturan
                    </Button>
                </Link>
            </div>

            <FadeIn delay={0.05}>
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    {statCards.map((s) => (
                        <div
                            key={s.label}
                            className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
                        >
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                                {s.icon}
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-bold tracking-tight text-neutral-900">
                                    {s.value.toLocaleString('id-ID')}
                                </p>
                                <p className="text-sm text-neutral-500">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </FadeIn>

            <FadeIn delay={0.1}>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Cari aturan..."
                            className="w-full rounded-xl border border-neutral-300 py-2.5 pl-10 pr-3.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Select
                            value={filters.branch_id ?? ''}
                            onChange={(v) => setFilters((prev) => ({ ...prev, branch_id: v, page: 1 }))}
                            options={[
                                { value: '', label: 'Semua Cabang' },
                                ...branches
                                    .filter((b) => b.is_active)
                                    .map((b) => ({ value: b.id, label: b.name })),
                            ]}
                            placeholder="Semua Cabang"
                        />
                        <Select
                            value={filters.is_active === undefined ? '' : String(filters.is_active)}
                            onChange={(v) => setFilters((prev) => ({ ...prev, is_active: v === '' ? undefined : v === 'true', page: 1 }))}
                            options={[
                                { value: '', label: 'Semua Status' },
                                { value: 'true', label: 'Aktif' },
                                { value: 'false', label: 'Nonaktif' },
                            ]}
                            placeholder="Semua Status"
                        />
                        <Select
                            value={String(filters.per_page ?? 15)}
                            onChange={(v) => setFilters((prev) => ({ ...prev, per_page: Number(v), page: 1 }))}
                            options={[
                                { value: '10', label: '10 per halaman' },
                                { value: '15', label: '15 per halaman' },
                                { value: '25', label: '25 per halaman' },
                                { value: '50', label: '50 per halaman' },
                            ]}
                            placeholder="Per halaman"
                        />
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.15}>
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    {isError ? (
                        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-light">
                                <svg className="h-7 w-7 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-900">Gagal memuat data</p>
                                <p className="mt-1 text-sm text-neutral-500">{(error as Error)?.message || 'Terjadi kesalahan.'}</p>
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                            >
                                Muat Ulang
                            </button>
                        </div>
                    ) : isLoading ? (
                        <TableSkeleton />
                    ) : (
                        <PricingRuleTable
                            rules={rules}
                            onDelete={openDelete}
                            onToggleActive={handleToggleActive}
                            togglingId={togglingId}
                        />
                    )}

                    {meta && <Pagination meta={meta} onPageChange={handlePage} />}
                </div>
            </FadeIn>

            {ruleToDelete && (
                <PricingRuleDeleteDialog
                    open={deleteOpen}
                    pricingRule={ruleToDelete}
                    deleting={deleteMutation.isPending}
                    error={deleteMutation.error ? 'Terjadi kesalahan saat menghapus.' : undefined}
                    onClose={() => {
                        setDeleteOpen(false);
                        setRuleToDelete(null);
                        deleteMutation.reset();
                    }}
                    onConfirm={handleDelete}
                />
            )}
        </TenantLayout>
    );
}
