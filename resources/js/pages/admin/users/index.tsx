import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import { useUsers, useDeleteUser } from '@/features/users/hooks/useUsers';
import UserTable from '@/features/users/components/UserTable';
import UserDeleteDialog from '@/features/users/components/UserDeleteDialog';
import { useToastStore } from '@/stores/toast';
import type { User, UserFilters } from '@/features/users/types';

interface UsersPageProps {
    title: string;
    stats: {
        total_users: number;
        total_admins: number;
        new_this_month: number;
    };
}

interface StatCard {
    label: string;
    value: number;
    icon: ReactNode;
    color: string;
    bg: string;
}

function extractMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return 'Terjadi kesalahan.';
}

function TableSkeleton() {
    return (
        <div className="animate-pulse px-6 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 py-4">
                    <div className="h-9 w-9 rounded-full bg-neutral-200" />
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

const statIcons = {
    users: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
    ),
    shield: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
    ),
    trending: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
    ),
};

const statConfigs: Record<string, { color: string; bg: string }> = {
    total_users: { color: 'text-primary', bg: 'bg-primary-50' },
    total_admins: { color: 'text-amber-600', bg: 'bg-warning-light' },
    new_this_month: { color: 'text-emerald-600', bg: 'bg-success-light' },
};

export default function Users({ title, stats }: UsersPageProps) {
    const { auth } = usePage().props as { auth: { user: { id: number } } };
    const addToast = useToastStore((s) => s.addToast);
    const [filters, setFilters] = useState<UserFilters>({
        page: 1,
        per_page: 15,
        search: '',
    });
    const [searchInput, setSearchInput] = useState('');
    const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
        }, 400);
        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [searchInput]);

    const { data, isLoading, isError, error } = useUsers(filters);
    const deleteMutation = useDeleteUser();

    const deleteError = extractMessage(deleteMutation.error);

    const statCards: StatCard[] = [
        { label: 'Total Users', value: stats.total_users, icon: statIcons.users, ...statConfigs.total_users },
        { label: 'Administrator', value: stats.total_admins, icon: statIcons.shield, ...statConfigs.total_admins },
        { label: 'Barang Bulan Ini', value: stats.new_this_month, icon: statIcons.trending, ...statConfigs.new_this_month },
    ];

    function handlePage(page: number) {
        setFilters((prev) => ({ ...prev, page }));
    }

    function openDelete(user: User) {
        setUserToDelete(user);
        deleteMutation.reset();
        setDeleteOpen(true);
    }

    function handleDelete() {
        if (!userToDelete) return;
        deleteMutation.mutate(userToDelete.id, {
            onSuccess: () => {
                setDeleteOpen(false);
                setUserToDelete(null);
                addToast('success', 'User berhasil dihapus.');
            },
        });
    }

    const users = data?.data ?? [];
    const meta = data?.meta;

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Manajemen User</h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Kelola semua user yang terdaftar di sistem.
                    </p>
                </div>
                <Link href="/admin/users/create">
                    <Button>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah User
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
                            placeholder="Cari nama atau email..."
                            className="w-full rounded-xl border border-neutral-300 py-2.5 pl-10 pr-3.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Select
                            value={filters.is_admin ?? ''}
                            onChange={(v) => setFilters((prev) => ({ ...prev, is_admin: v || undefined }))}
                            options={[
                                { value: '', label: 'Semua Role' },
                                { value: '1', label: 'Admin' },
                                { value: '0', label: 'User' },
                            ]}
                            placeholder="Filter role"
                            searchable
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
                        <UserTable users={users} currentUserId={auth.user.id} onDelete={openDelete} />
                    )}

                    {meta && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-neutral-200 px-6 py-3.5 sm:flex-row">
                            <p className="text-sm text-neutral-500">
                                <span className="font-medium text-neutral-700">{meta.total}</span> data · Halaman <span className="font-medium text-neutral-700">{meta.current_page}</span> dari <span className="font-medium text-neutral-700">{meta.last_page}</span>
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    disabled={meta.current_page <= 1}
                                    onClick={() => handlePage(meta.current_page - 1)}
                                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                    Prev
                                </button>
                                <div className="flex gap-1">
                                    {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePage(page)}
                                            className={`flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-sm font-medium transition-all ${
                                                page === meta.current_page
                                                    ? 'bg-primary text-white shadow-sm'
                                                    : 'text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    disabled={meta.current_page >= meta.last_page}
                                    onClick={() => handlePage(meta.current_page + 1)}
                                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </FadeIn>

            {userToDelete && (
                <UserDeleteDialog
                    open={deleteOpen}
                    user={userToDelete}
                    deleting={deleteMutation.isPending}
                    error={deleteError}
                    onClose={() => {
                        setDeleteOpen(false);
                        setUserToDelete(null);
                        deleteMutation.reset();
                    }}
                    onConfirm={handleDelete}
                />
            )}
        </AdminLayout>
    );
}
