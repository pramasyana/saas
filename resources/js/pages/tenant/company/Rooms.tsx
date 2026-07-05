import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import RoomDeleteDialog from '@/features/rooms/components/RoomDeleteDialog';
import RoomTable from '@/features/rooms/components/RoomTable';
import { useRooms, useAllRooms, useDeleteRoom } from '@/features/rooms/hooks/useRooms';
import type { Room } from '@/features/rooms/types';
import TenantLayout from '@/layouts/TenantLayout';
import Pagination from '@/molecules/Pagination';
import { useToastStore } from '@/stores/toast';

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
    if (!error) return undefined;
    if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        return axiosError.response?.data?.message ?? error.message;
    }
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Terjadi kesalahan.';
}

const statIcons = {
    building: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
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
    users: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
    ),
};

const statConfigs: Record<string, { color: string; bg: string }> = {
    total: { color: 'text-primary', bg: 'bg-primary-50' },
    active: { color: 'text-success', bg: 'bg-success-light' },
    inactive: { color: 'text-neutral-500', bg: 'bg-neutral-100' },
    capacity: { color: 'text-warning', bg: 'bg-warning-light' },
};

export default function Rooms() {
    const addToast = useToastStore((s) => s.addToast);
    const [filters, setFilters] = useState<Filters>({
        page: 1,
        per_page: 15,
        search: '',
    });
    const [searchInput, setSearchInput] = useState('');
    const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
        }, 400);
        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [searchInput]);

    const { data, isLoading, isError, error } = useRooms(filters);
    const { data: allRoomsData } = useAllRooms();
    const deleteMutation = useDeleteRoom();

    const rooms = data?.data ?? [];
    const allRooms = allRoomsData?.data ?? [];
    const meta = data?.meta;
    const activeCount = allRooms.filter((r) => r.is_active).length;
    const inactiveCount = allRooms.length - activeCount;
    const totalCapacity = allRooms.reduce((sum, r) => sum + (r.capacity ?? 0), 0);

    const statCards: StatCard[] = [
        { label: 'Total Ruangan', value: meta?.total ?? allRooms.length, icon: statIcons.building, ...statConfigs.total },
        { label: 'Aktif', value: activeCount, icon: statIcons.check, ...statConfigs.active },
        { label: 'Nonaktif', value: inactiveCount, icon: statIcons.xmark, ...statConfigs.inactive },
        { label: 'Total Kapasitas', value: totalCapacity, icon: statIcons.users, ...statConfigs.capacity },
    ];

    function handlePage(page: number) {
        setFilters((prev) => ({ ...prev, page }));
    }

    function openDelete(room: Room) {
        setRoomToDelete(room);
        deleteMutation.reset();
        setDeleteOpen(true);
    }

    function handleDelete() {
        if (!roomToDelete) return;
        deleteMutation.mutate(roomToDelete.id, {
            onSuccess: () => {
                setDeleteOpen(false);
                setRoomToDelete(null);
                addToast('success', 'Ruangan berhasil dihapus.');
            },
        });
    }

    const deleteError = extractMessage(deleteMutation.error);

    return (
        <TenantLayout>
            <Head title="Ruangan" />

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Ruangan</h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Kelola ruangan dan resource untuk booking.
                    </p>
                </div>
                <Link href="/company/rooms/create">
                    <Button>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah Ruangan
                    </Button>
                </Link>
            </div>

            {/* Stat Cards */}
            <FadeIn delay={0.05}>
                <div className="mb-6 grid gap-4 sm:grid-cols-4">
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

            {/* Filters */}
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
                            placeholder="Cari ruangan..."
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
            </FadeIn>

            {/* Table Card */}
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
                    ) : (
                        <RoomTable
                            rooms={rooms}
                            onDelete={openDelete}
                        />
                    )}

                    {meta && <Pagination meta={meta} onPageChange={handlePage} />}
                </div>
            </FadeIn>

            {roomToDelete && (
                <RoomDeleteDialog
                    open={deleteOpen}
                    room={roomToDelete}
                    deleting={deleteMutation.isPending}
                    error={deleteError}
                    onClose={() => {
                        setDeleteOpen(false);
                        setRoomToDelete(null);
                        deleteMutation.reset();
                    }}
                    onConfirm={handleDelete}
                />
            )}
        </TenantLayout>
    );
}
