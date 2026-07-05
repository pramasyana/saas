import { router } from '@inertiajs/react';
import type { Room } from '@/features/rooms/types';
import { cn } from '@/lib/utils';

interface RoomTableProps {
    rooms: Room[];
    onDelete: (room: Room) => void;
}

export default function RoomTable({ rooms, onDelete }: RoomTableProps) {
    if (rooms.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 px-6 py-16">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                    <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-neutral-900">Belum ada ruangan</p>
                    <p className="mt-1 text-sm text-neutral-500">Tambahkan ruangan baru untuk mulai mengelola booking.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Mobile: card layout */}
            <div className="divide-y divide-neutral-100 lg:hidden">
                {rooms.map((room) => (
                    <div key={room.id} className="px-4 py-4 transition-colors hover:bg-neutral-50">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <span
                                    className="inline-block h-4 w-4 shrink-0 rounded-full ring-2 ring-white shadow-sm"
                                    style={{ backgroundColor: room.color }}
                                />
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-neutral-900">{room.name}</p>
                                    {room.description && (
                                        <p className="truncate text-xs text-neutral-400">{room.description}</p>
                                    )}
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                <button
                                    type="button"
                                    onClick={() => router.get(`/company/rooms/${room.id}/edit`)}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                    title="Edit ruangan"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </button>
                                <div className="h-4 w-px bg-neutral-200" />
                                <button
                                    onClick={() => onDelete(room)}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger"
                                    title="Hapus ruangan"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 pl-7">
                            {room.branch_name && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 ring-1 ring-inset ring-neutral-200">
                                    <svg className="h-3 w-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                                    </svg>
                                    {room.branch_name}
                                </span>
                            )}
                            {room.capacity && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 ring-1 ring-inset ring-neutral-200">
                                    <svg className="h-3 w-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                    </svg>
                                    {room.capacity} orang
                                </span>
                            )}
                            <span className={cn(
                                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                                room.is_active
                                    ? 'bg-success-light text-success ring-1 ring-inset ring-success/20'
                                    : 'bg-neutral-100 text-neutral-500 ring-1 ring-inset ring-neutral-200',
                            )}>
                                {room.is_active ? 'Aktif' : 'Nonaktif'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop: table layout */}
            <table className="hidden min-w-full divide-y divide-neutral-200 lg:table">
                <thead className="bg-neutral-50">
                    <tr>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Ruangan
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Cabang
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Kapasitas
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Status
                        </th>
                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                    {rooms.map((room) => (
                        <tr key={room.id} className="transition-colors hover:bg-neutral-50">
                            <td className="whitespace-nowrap px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <span
                                        className="inline-block h-4 w-4 shrink-0 rounded-full ring-2 ring-white shadow-sm"
                                        style={{ backgroundColor: room.color }}
                                    />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-neutral-900">{room.name}</p>
                                        {room.description && (
                                            <p className="truncate text-xs text-neutral-400 max-w-[200px]">{room.description}</p>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                {room.branch_name ? (
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-50 text-xs font-bold text-primary">
                                            {room.branch_name.charAt(0)}
                                        </div>
                                        <span className="text-sm text-neutral-700 truncate max-w-[160px]">
                                            {room.branch_name}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-sm text-neutral-400">-</span>
                                )}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                {room.capacity ? (
                                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                                        <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                        </svg>
                                        {room.capacity} orang
                                    </div>
                                ) : (
                                    <span className="text-sm text-neutral-400">-</span>
                                )}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <span className={cn(
                                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                    room.is_active
                                        ? 'bg-success-light text-success ring-1 ring-inset ring-success/20'
                                        : 'bg-neutral-100 text-neutral-500 ring-1 ring-inset ring-neutral-200',
                                )}>
                                    <span className={cn(
                                        'mr-1.5 inline-block h-1.5 w-1.5 rounded-full',
                                        room.is_active ? 'bg-success' : 'bg-neutral-400',
                                    )} />
                                    {room.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <div className="flex justify-end">
                                    <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => router.get(`/company/rooms/${room.id}/edit`)}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                            title="Edit ruangan"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                        <div className="h-4 w-px bg-neutral-200" />
                                        <button
                                            onClick={() => onDelete(room)}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger"
                                            title="Hapus ruangan"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
