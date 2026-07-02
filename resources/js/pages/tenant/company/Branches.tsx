import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import BranchDeleteDialog from '@/features/company/components/BranchDeleteDialog';
import BranchForm from '@/features/company/components/BranchForm';
import BranchTable from '@/features/company/components/BranchTable';
import { useBranches, useCreateBranch, useUpdateBranch, useDeleteBranch } from '@/features/company/hooks/useBranches';
import type { Branch, BranchFormData } from '@/features/company/types';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';
import Pagination from '@/molecules/Pagination';
import { useToastStore } from '@/stores/toast';

interface BranchesFilters {
    search?: string;
    page?: number;
    per_page?: number;
}

function extractMessage(error: unknown): string | undefined {
    if (!error) {
return undefined;
}

    if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };

        return axiosError.response?.data?.message ?? error.message;
    }

    if (error instanceof Error) {
return error.message;
}

    if (typeof error === 'string') {
return error;
}

    return 'Terjadi kesalahan.';
}

function extractErrors(error: unknown): Record<string, string[]> {
    if (!error) {
return {};
}

    try {
        const axiosError = error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };

        if (axiosError.response?.data?.errors) {
return axiosError.response.data.errors;
}

        if (axiosError.response?.data?.message) {
return { _general: [axiosError.response.data.message] };
}
    } catch {
        //
    }

    return { _general: ['Terjadi kesalahan.'] };
}

const statIcons = {
    building: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
        </svg>
    ),
    check: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    xmark: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
    ),
    clock: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

export default function CompanyBranchesPage() {
    const addToast = useToastStore((s) => s.addToast);
    const [filters, setFilters] = useState<BranchesFilters>({
        page: 1,
        per_page: 15,
        search: '',
    });
    const [searchInput, setSearchInput] = useState('');
    const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

    const [formOpen, setFormOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);

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

    const { data, isLoading, isError, error } = useBranches(filters);
    const createMutation = useCreateBranch();
    const updateMutation = useUpdateBranch();
    const deleteMutation = useDeleteBranch();

    const branches = data?.data ?? [];
    const allBranchesQuery = useBranches({ per_page: 100 });
    const allBranchesData = allBranchesQuery.data?.data ?? [];
    const meta = data?.meta;
    const activeCount = allBranchesData.filter((b) => b.is_active).length;
    const inactiveCount = allBranchesData.length - activeCount;
    const withManager = allBranchesData.filter((b) => b.manager_name).length;

    const createErrors = extractErrors(createMutation.error);
    const updateErrors = extractErrors(updateMutation.error);
    const isSaving = createMutation.isPending || updateMutation.isPending;

    function handlePage(page: number) {
        setFilters((prev) => ({ ...prev, page }));
    }

    function openCreate() {
        setEditingBranch(null);
        createMutation.reset();
        updateMutation.reset();
        setFormOpen(true);
    }

    function openEdit(branch: Branch) {
        setEditingBranch(branch);
        createMutation.reset();
        updateMutation.reset();
        setFormOpen(true);
    }

    function handleSave(data: BranchFormData) {
        if (editingBranch) {
            updateMutation.mutate(
                { id: editingBranch.id, data },
                {
                    onSuccess: () => {
                        setFormOpen(false);
                        setEditingBranch(null);
                        addToast('success', 'Cabang berhasil diperbarui.');
                    },
                },
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => {
                    setFormOpen(false);
                    addToast('success', 'Cabang berhasil ditambahkan.');
                },
            });
        }
    }

    function openDelete(branch: Branch) {
        setBranchToDelete(branch);
        deleteMutation.reset();
        setDeleteOpen(true);
    }

    function handleDelete() {
        if (!branchToDelete) {
return;
}

        deleteMutation.mutate(branchToDelete.id, {
            onSuccess: () => {
                setDeleteOpen(false);
                setBranchToDelete(null);
                addToast('success', 'Cabang berhasil dihapus.');
            },
        });
    }

    function closeForm() {
        setFormOpen(false);
        setEditingBranch(null);
    }

    const deleteError = extractMessage(deleteMutation.error);

    return (
        <TenantLayout>
            <Head title="Cabang" />

            {/* Breadcrumb */}
            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/company/branches" className="transition-colors hover:text-neutral-700">Perusahaan</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Branches</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Cabang</h1>
                        <p className="mt-1.5 text-sm text-neutral-500">
                            Kelola cabang perusahaan Anda. Setiap cabang dapat memiliki pengaturan jam kerja dan hari libur sendiri.
                        </p>
                    </div>
                    <Button onClick={openCreate} className="shrink-0">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah Cabang
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <FadeIn delay={0.03}>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                                {statIcons.building}
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{meta?.total ?? allBranchesData.length}</p>
                                <p className="text-xs text-neutral-500">Total Cabang</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.06}>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success">
                                {statIcons.check}
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{activeCount}</p>
                                <p className="text-xs text-neutral-500">Aktif</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.09}>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                                {statIcons.xmark}
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{inactiveCount}</p>
                                <p className="text-xs text-neutral-500">Nonaktif</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.12}>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-50 text-warning">
                                {statIcons.clock}
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{withManager}</p>
                                <p className="text-xs text-neutral-500">Ada Manajer</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* Filters */}
            <FadeIn delay={0.05}>
                <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Cari cabang..."
                                className="w-full rounded-xl border border-neutral-300 py-2.5 pl-10 pr-3.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                        <div className="flex gap-3">
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
                </div>
            </FadeIn>

            {/* Table Card */}
            <FadeIn delay={0.07}>
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
                        <div className="animate-pulse p-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4 py-4">
                                    <div className="h-9 w-9 rounded-full bg-neutral-200" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3.5 w-40 rounded bg-neutral-200" />
                                        <div className="h-3 w-56 rounded bg-neutral-100" />
                                    </div>
                                    <div className="h-5 w-14 rounded-full bg-neutral-200" />
                                    <div className="flex gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                                        <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <BranchTable
                            branches={branches}
                            onEdit={openEdit}
                            onDelete={openDelete}
                        />
                    )}

                    {meta && (<Pagination meta={meta} onPageChange={handlePage} />)}
                </div>
            </FadeIn>

            {/* Branch Form Modal */}
            {formOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={closeForm} />
                    <div className="relative w-full max-w-2xl animate-[fade-up_0.3s_ease-out] rounded-2xl bg-white p-6 shadow-2xl lg:p-8">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-neutral-900">
                                {editingBranch ? 'Edit Cabang' : 'Tambah Cabang'}
                            </h2>
                            <button onClick={closeForm} className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <BranchForm
                            branch={editingBranch}
                            saving={isSaving}
                            errors={editingBranch ? updateErrors : createErrors}
                            onSave={handleSave}
                        />
                    </div>
                </div>
            )}

            {branchToDelete && (
                <BranchDeleteDialog
                    open={deleteOpen}
                    branch={branchToDelete}
                    deleting={deleteMutation.isPending}
                    error={deleteError}
                    onClose={() => {
                        setDeleteOpen(false);
                        setBranchToDelete(null);
                        deleteMutation.reset();
                    }}
                    onConfirm={handleDelete}
                />
            )}
        </TenantLayout>
    );
}
