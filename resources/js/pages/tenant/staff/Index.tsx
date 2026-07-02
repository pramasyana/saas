import { Head, Link } from '@inertiajs/react';
import { useEffect, useState  } from 'react';
import type {ReactNode} from 'react';
import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import StaffDeleteDialog from '@/features/staff/components/StaffDeleteDialog';
import { useStaff, useDeleteStaff } from '@/features/staff/hooks/useStaff';
import type { Staff } from '@/features/staff/types';
import TenantLayout from '@/layouts/TenantLayout';
import Pagination from '@/molecules/Pagination';
import { useToastStore } from '@/stores/toast';

interface Stats {
    total: number;
    active: number;
}

interface StaffIndexPageProps {
    title: string;
    stats: Stats;
}

interface Filters {
    search?: string;
    branch_id?: string;
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
    branch: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
    ),
};

const perPageOptions = [
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
];

export default function StaffIndexPage({ title, stats }: StaffIndexPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const [filters, setFilters] = useState<Filters>({ page: 1, per_page: 15, search: '', branch_id: '' });
    const [searchInput, setSearchInput] = useState('');

    const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const { data, isLoading, isError, error } = useStaff(filters);
    const { data: branchesData } = useAllBranches();
    const branches = branchesData?.data ?? [];
    const deleteMutation = useDeleteStaff();

    const staff = data?.data ?? [];
    const meta = data?.meta;

    const statCards: StatCard[] = [
        { label: 'Total Staff', value: stats.total, icon: statIcons.users, color: 'text-primary', bg: 'bg-primary-50' },
        { label: 'Aktif', value: stats.active, icon: statIcons.check, color: 'text-success', bg: 'bg-success-50' },
        { label: 'Nonaktif', value: stats.total - stats.active, icon: statIcons.minus, color: 'text-danger', bg: 'bg-danger-50' },
        { label: 'Cabang', value: branches.length, icon: statIcons.branch, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    function handlePage(page: number) {
 setFilters((prev) => ({ ...prev, page })); 
}

    function openDelete(staff: Staff) {
        setStaffToDelete(staff);
        deleteMutation.reset();
    }

    function handleDelete() {
        if (!staffToDelete) {
return;
}

        deleteMutation.mutate(staffToDelete.id, {
            onSuccess: () => {
                setStaffToDelete(null);
                addToast('success', 'Staff berhasil dihapus.');
            },
        });
    }

    const deleteError = extractMessage(deleteMutation.error);

    const branchOptions = [
        { value: '', label: 'Semua Cabang' },
        ...branches.map((b) => ({ value: b.id, label: b.name })),
    ];

    function renderSkeleton() {
        return (
            <div className="animate-pulse p-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4 py-4">
                        <div className="h-10 w-10 rounded-full bg-neutral-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-44 rounded bg-neutral-200" />
                            <div className="h-3 w-28 rounded bg-neutral-100" />
                        </div>
                        <div className="h-3 hidden w-24 rounded bg-neutral-100 sm:block" />
                        <div className="h-3 hidden w-20 rounded bg-neutral-100 sm:block" />
                        <div className="h-6 w-16 rounded-full bg-neutral-200" />
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
                    <p className="text-base font-semibold text-neutral-900">Belum ada staff</p>
                    <p className="mt-1 text-sm text-neutral-500">Tambahkan staff pertama untuk memulai.</p>
                </div>
                <Link href="/staff/create">
                    <Button variant="outline" size="sm">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah Staff
                    </Button>
                </Link>
            </div>
        );
    }

    function renderMobileCard(s: Staff) {
        return (
            <div key={s.id} className="border-b border-neutral-100 px-4 py-4 transition-colors last:border-b-0 hover:bg-neutral-50">
                <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getAvatarColor(s.name)}`}>
                        {getInitials(s.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-neutral-900">{s.name}</p>
                                {s.position && <p className="truncate text-xs text-neutral-500">{s.position}</p>}
                            </div>
                            <div className="inline-flex shrink-0 items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                <Link href={`/staff/${s.id}/edit`} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary" title="Edit">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </Link>
                                <div className="h-4 w-px bg-neutral-200" />
                                <button onClick={() => openDelete(s)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger" title="Hapus">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                            {s.is_active ? (
                                <Badge variant="success">Aktif</Badge>
                            ) : (
                                <Badge variant="danger">Nonaktif</Badge>
                            )}
                            {s.branch_name && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                    </svg>
                                    {s.branch_name}
                                </span>
                            )}
                            {s.phone && <span className="text-xs text-neutral-400">{s.phone}</span>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function renderDesktopRow(s: Staff) {
        return (
            <tr key={s.id} className="transition-colors hover:bg-neutral-50">
                <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getAvatarColor(s.name)}`}>
                            {getInitials(s.name)}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-neutral-900">{s.name}</p>
                            {s.email && <p className="text-xs text-neutral-500">{s.email}</p>}
                        </div>
                    </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-700">{s.position || <span className="text-neutral-400">-</span>}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-700">{s.branch_name || <span className="text-neutral-400">-</span>}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{s.phone || <span className="text-neutral-300">-</span>}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{s.hire_date || <span className="text-neutral-300">-</span>}</td>
                <td className="whitespace-nowrap px-6 py-4">
                    {s.is_active ? <Badge variant="success">Aktif</Badge> : <Badge variant="danger">Nonaktif</Badge>}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex justify-end">
                        <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                            <Link href={`/staff/${s.id}/edit`} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary" title="Edit">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </Link>
                            <div className="h-5 w-px bg-neutral-200" />
                            <button onClick={() => openDelete(s)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger" title="Hapus">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
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
                <span className="font-medium text-neutral-900">Staff</span>
            </nav>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{title}</h1>
                    <p className="mt-1 text-sm text-neutral-500">Kelola data karyawan.</p>
                </div>
                <Link href="/staff/create">
                    <Button className="shrink-0">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah Staff
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
                            value={filters.branch_id ?? ''}
                            onChange={(v) => setFilters((prev) => ({ ...prev, branch_id: v, page: 1 }))}
                            options={branchOptions}
                            placeholder="Semua Cabang"
                        />
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
                    ) : staff.length === 0 ? (
                        renderEmpty()
                    ) : (
                        <>
                            <div className="divide-y divide-neutral-100 lg:hidden">
                                {staff.map(renderMobileCard)}
                            </div>

                            <table className="hidden min-w-full divide-y divide-neutral-200 lg:table">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Staff</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Jabatan</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Cabang</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Telepon</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Bergabung</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 bg-white">
                                    {staff.map(renderDesktopRow)}
                                </tbody>
                            </table>
                        </>
                    )}

                    {meta && (<Pagination meta={meta} onPageChange={handlePage} />)}
                </div>
            </FadeIn>

            <StaffDeleteDialog
                open={!!staffToDelete}
                staff={staffToDelete!}
                deleting={deleteMutation.isPending}
                error={deleteError}
                onClose={() => {
 setStaffToDelete(null); deleteMutation.reset(); 
}}
                onConfirm={handleDelete}
            />
        </TenantLayout>
    );
}
