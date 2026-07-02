import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import PackageDeleteDialog from '@/features/service/components/PackageDeleteDialog';
import PackageTable from '@/features/service/components/PackageTable';
import { usePackages, useDeletePackage, useUpdatePackage } from '@/features/service/hooks/usePackages';
import type { Package, PackageFormData } from '@/features/service/types';
import type { Branch } from '@/features/company/types';
import TenantLayout from '@/layouts/TenantLayout';
import Pagination from '@/molecules/Pagination';
import { useToastStore } from '@/stores/toast';

interface Stats {
    total: number;
    active: number;
}

interface PackagesIndexPageProps {
    title: string;
    stats: Stats;
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
                    <div className="h-4 w-20 rounded bg-neutral-100" />
                    <div className="flex gap-2">
                        <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                        <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function PackagesIndex({ title, stats }: PackagesIndexPageProps) {
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
    const [pkgToDelete, setPkgToDelete] = useState<Package | null>(null);
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

    const { data, isLoading, isError, error } = usePackages(filters);
    const deleteMutation = useDeletePackage();
    const updateMutation = useUpdatePackage();

    const inactiveCount = stats.total - stats.active;

    const statCards: StatCard[] = [
        {
            label: 'Total Paket',
            value: stats.total,
            color: 'text-primary',
            bg: 'bg-primary-50',
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            label: 'Aktif',
            value: stats.active,
            color: 'text-success',
            bg: 'bg-success-light',
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: 'Nonaktif',
            value: inactiveCount,
            color: 'text-danger',
            bg: 'bg-danger-light',
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
            ),
        },
    ];

    function handlePage(page: number) {
        setFilters((prev) => ({ ...prev, page }));
    }

    function openDelete(pkg: Package) {
        setPkgToDelete(pkg);
        deleteMutation.reset();
        setDeleteOpen(true);
    }

    function handleDelete() {
        if (!pkgToDelete) return;
        deleteMutation.mutate(pkgToDelete.id, {
            onSuccess: () => {
                setDeleteOpen(false);
                setPkgToDelete(null);
                addToast('success', 'Paket berhasil dihapus.');
            },
        });
    }

    function handleToggleActive(id: string, current: boolean) {
        setTogglingId(id);
        updateMutation.mutate(
            { id, data: { is_active: !current } as PackageFormData },
            { onSettled: () => setTogglingId(null) }
        );
    }

    const packages = data?.data ?? [];
    const meta = data?.meta;

    return (
        <TenantLayout>
            <Head title={title} />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Manajemen Paket</h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Kelola semua paket layanan yang tersedia.
                    </p>
                </div>
                <Link href="/service/packages/create">
                    <Button>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah Paket
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
                            placeholder="Cari paket..."
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
                        <PackageTable
                            packages={packages}
                            onDelete={openDelete}
                            onToggleActive={handleToggleActive}
                            togglingId={togglingId}
                        />
                    )}

                    {meta && <Pagination meta={meta} onPageChange={handlePage} />}
                </div>
            </FadeIn>

            {pkgToDelete && (
                <PackageDeleteDialog
                    open={deleteOpen}
                    packageData={pkgToDelete}
                    deleting={deleteMutation.isPending}
                    error={deleteMutation.error ? 'Terjadi kesalahan saat menghapus.' : undefined}
                    onClose={() => {
                        setDeleteOpen(false);
                        setPkgToDelete(null);
                        deleteMutation.reset();
                    }}
                    onConfirm={handleDelete}
                />
            )}
        </TenantLayout>
    );
}
