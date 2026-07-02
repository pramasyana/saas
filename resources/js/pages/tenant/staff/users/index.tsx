import { Head, Link } from '@inertiajs/react';
import { useEffect, useState  } from 'react';
import type {ReactNode} from 'react';
import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import TenantUserDeleteDialog from '@/features/staff/components/TenantUserDeleteDialog';
import { useTenantUsers, useDeleteTenantUser } from '@/features/staff/hooks/useTenantUsers';
import type { TenantUser } from '@/features/staff/types';
import TenantLayout from '@/layouts/TenantLayout';
import Pagination from '@/molecules/Pagination';
import { useToastStore } from '@/stores/toast';

interface Stats {
    total: number;
    active: number;
    unverified: number;
    new_this_month: number;
}

interface UsersPageProps {
    title: string;
    currentUserId: string;
    tenantOwnerId: string;
    stats: Stats;
}

interface Filters {
    search?: string;
    page?: number;
    per_page?: number;
}

interface StatCard {
    label: string;
    value: number;
    icon: ReactNode;
    color: string;
    bg: string;
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

function getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

const avatarColors = [
    'bg-primary text-white',
    'bg-emerald-500 text-white',
    'bg-amber-500 text-white',
    'bg-rose-500 text-white',
    'bg-sky-500 text-white',
    'bg-violet-500 text-white',
];

function getAvatarColor(name: string): string {
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return avatarColors[Math.abs(hash) % avatarColors.length];
}

const statIcons = {
    users: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
    ),
    check: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    minus: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
    ),
    trending: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
    ),
};

const perPageOptions = [
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
];

export default function TenantUsersPage({ title, currentUserId, tenantOwnerId, stats }: UsersPageProps) {

    function isProtected(user: TenantUser): boolean {
        return user.id === currentUserId || user.id === tenantOwnerId;
    }
    const addToast = useToastStore((s) => s.addToast);
    const [filters, setFilters] = useState<Filters>({ page: 1, per_page: 15, search: '' });
    const [searchInput, setSearchInput] = useState('');

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<TenantUser | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const { data, isLoading, isError, error } = useTenantUsers(filters);
    const deleteMutation = useDeleteTenantUser();

    const users = data?.data ?? [];
    const meta = data?.meta;
    const deleteError = extractMessage(deleteMutation.error);

    const statCards: StatCard[] = [
        { label: 'Total User', value: stats.total, icon: statIcons.users, color: 'text-primary', bg: 'bg-primary-50' },
        { label: 'Aktif', value: stats.active, icon: statIcons.check, color: 'text-success', bg: 'bg-success-50' },
        { label: 'Nonaktif', value: stats.total - stats.active, icon: statIcons.minus, color: 'text-danger', bg: 'bg-danger-50' },
        { label: 'Baru Bulan Ini', value: stats.new_this_month, icon: statIcons.trending, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    function handlePage(page: number) {
 setFilters((prev) => ({ ...prev, page })); 
}

    function openDelete(user: TenantUser) {
        setUserToDelete(user);
        deleteMutation.reset();
        setDeleteOpen(true);
    }

    function handleDelete() {
        if (!userToDelete) {
return;
}

        deleteMutation.mutate(userToDelete.id, {
            onSuccess: () => {
                setDeleteOpen(false);
                setUserToDelete(null);
                addToast('success', 'User berhasil dihapus.');
            },
        });
    }

    function renderSkeleton() {
        return (
            <div className="animate-pulse p-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4 py-4">
                        <div className="h-10 w-10 rounded-full bg-neutral-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-44 rounded bg-neutral-200" />
                            <div className="h-3 w-60 rounded bg-neutral-100" />
                        </div>
                        <div className="h-6 w-16 rounded-full bg-neutral-200" />
                        <div className="h-6 w-24 rounded-full bg-neutral-200" />
                        <div className="h-3 w-24 rounded bg-neutral-100" />
                        <div className="flex gap-2">
                            <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                            <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    function renderError() {
        return (
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
        );
    }

    function renderEmpty() {
        return (
            <div className="flex flex-col items-center gap-5 px-6 py-20">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-100">
                    <svg className="h-10 w-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="text-base font-semibold text-neutral-900">Belum ada user</p>
                    <p className="mt-1 text-sm text-neutral-500">Tambahkan user pertama untuk memberikan akses panel.</p>
                </div>
                <Link href="/staff/users/create">
                    <Button variant="outline" size="sm">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah User
                    </Button>
                </Link>
            </div>
        );
    }

    function renderMobileCard(user: TenantUser) {
        return (
            <div key={user.id} className="border-b border-neutral-100 px-4 py-4 transition-colors last:border-b-0 hover:bg-neutral-50">
                <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getAvatarColor(user.name)}`}>
                        {getInitials(user.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-neutral-900">{user.name}</p>
                                <p className="truncate text-xs text-neutral-500">{user.email}</p>
                            </div>
                            <div className="inline-flex shrink-0 items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                <Link href={`/staff/users/${user.id}/edit`} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary" title="Edit">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </Link>
                                {!isProtected(user) && (
                                    <>
                                        <div className="h-4 w-px bg-neutral-200" />
                                        <button onClick={() => openDelete(user)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger" title="Hapus">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                            {user.is_active ? (
                                <Badge variant="success">Aktif</Badge>
                            ) : (
                                <Badge variant="danger">Nonaktif</Badge>
                            )}
                            {user.is_verified ? (
                                <Badge variant="default">Terverifikasi</Badge>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-500">
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Belum Verifikasi
                                </span>
                            )}
                            <span className="text-xs text-neutral-400">{user.joined_at}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function renderDesktopRow(user: TenantUser) {
        return (
            <tr key={user.id} className="transition-colors hover:bg-neutral-50">
                <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getAvatarColor(user.name)}`}>
                            {getInitials(user.name)}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-neutral-900">{user.name}</p>
                        </div>
                    </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">{user.email}</td>
                <td className="whitespace-nowrap px-6 py-4">
                    {user.is_active ? (
                        <Badge variant="success">Aktif</Badge>
                    ) : (
                        <Badge variant="danger">Nonaktif</Badge>
                    )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                    {user.is_verified ? (
                        <div className="inline-flex items-center gap-1.5 text-sm text-success">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Terverifikasi
                        </div>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 text-sm text-neutral-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Belum Verifikasi
                        </span>
                    )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{user.joined_at}</td>
                <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex justify-end">
                        <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                            <Link href={`/staff/users/${user.id}/edit`} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary" title="Edit">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </Link>
                            {!isProtected(user) && (
                                <>
                                    <div className="h-5 w-px bg-neutral-200" />
                                    <button onClick={() => openDelete(user)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger" title="Hapus">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </td>
            </tr>
        );
    }

    return (
        <TenantLayout>
            <Head title={title} />

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/staff" className="transition-colors hover:text-neutral-700">Staff</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">User</span>
            </nav>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{title}</h1>
                    <p className="mt-1 text-sm text-neutral-500">Kelola pengguna yang memiliki akses ke panel.</p>
                </div>
                <Link href="/staff/users/create">
                    <Button className="shrink-0">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah User
                    </Button>
                </Link>
            </div>

            <FadeIn delay={0.03}>
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {statCards.map((s) => (
                        <div
                            key={s.label}
                            className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
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

            <FadeIn delay={0.06}>
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
                    <div className="flex flex-wrap gap-3">
                        <Select
                            value={String(filters.per_page ?? 15)}
                            onChange={(v) => setFilters((prev) => ({ ...prev, per_page: Number(v), page: 1 }))}
                            options={perPageOptions}
                            placeholder="Per page"
                        />
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.09}>
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    {isError ? (
                        renderError()
                    ) : isLoading ? (
                        renderSkeleton()
                    ) : users.length === 0 ? (
                        renderEmpty()
                    ) : (
                        <>
                            <div className="divide-y divide-neutral-100 lg:hidden">
                                {users.map(renderMobileCard)}
                            </div>

                            <table className="hidden min-w-full divide-y divide-neutral-200 lg:table">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">User</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Email</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Verifikasi</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Bergabung</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 bg-white">
                                    {users.map(renderDesktopRow)}
                                </tbody>
                            </table>
                        </>
                    )}

                    {meta && (<Pagination meta={meta} onPageChange={handlePage} />)}
                </div>
            </FadeIn>

            <TenantUserDeleteDialog
                open={!!userToDelete}
                user={userToDelete!}
                deleting={deleteMutation.isPending}
                error={deleteError}
                onClose={() => {
 setDeleteOpen(false); setUserToDelete(null); deleteMutation.reset(); 
}}
                onConfirm={handleDelete}
            />
        </TenantLayout>
    );
}
