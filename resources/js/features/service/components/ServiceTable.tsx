import { Link } from '@inertiajs/react';
import type { ServiceItem } from '../types';

interface ServiceTableProps {
    services: ServiceItem[];
    onDelete: (service: ServiceItem) => void;
    onToggleActive: (id: string, current: boolean) => void;
    togglingId: string | null;
}

export default function ServiceTable({ services, onDelete, onToggleActive, togglingId }: ServiceTableProps) {
    if (services.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                    <svg className="h-7 w-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                </div>
                <p className="text-sm font-medium text-neutral-900">Belum ada layanan</p>
                <p className="text-sm text-neutral-500">Tambahkan layanan baru untuk memulai.</p>
                <Link href="/service/services/create" className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark">
                    Tambah Layanan
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* Mobile: card layout */}
            <div className="grid gap-3 lg:hidden">
                {services.map((s) => (
                    <div key={s.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="flex items-start gap-3">
                            <div
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-sm"
                                style={{ backgroundColor: s.color || '#3B82F6' }}
                            >
                                {s.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-neutral-900">{s.name}</p>
                                {s.category_name && (
                                    <p className="mt-0.5 truncate text-xs text-neutral-500">{s.category_name}</p>
                                )}
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary">
                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {s.duration} menit
                                    </span>
                                    <span className="text-xs font-semibold text-neutral-900">
                                        Rp {s.price.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onToggleActive(s.id, s.is_active)}
                                        disabled={togglingId === s.id}
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 ${s.is_active ? 'bg-primary' : 'bg-neutral-300'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${s.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.is_active ? 'bg-success-light text-success' : 'bg-neutral-100 text-neutral-500'}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${s.is_active ? 'bg-success' : 'bg-neutral-400'}`} />
                                        {s.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-end gap-1 border-t border-neutral-100 pt-3">
                            <Link href={`/service/services/${s.id}/edit`} className="rounded-lg p-2 text-primary transition-colors hover:bg-primary-50">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </Link>
                            <button
                                onClick={() => onDelete(s)}
                                disabled={togglingId === s.id}
                                className="rounded-lg p-2 text-danger transition-colors hover:bg-danger-light disabled:opacity-50"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop: table layout */}
            <div className="hidden lg:block">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-neutral-200 bg-neutral-50">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Layanan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Kategori</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">Durasi</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Harga</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {services.map((s) => (
                                <tr key={s.id} className="transition-colors hover:bg-neutral-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white shadow-sm"
                                                style={{ backgroundColor: s.color || '#3B82F6' }}
                                            >
                                                {s.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-neutral-900">{s.name}</p>
                                                {s.description && (
                                                    <p className="truncate text-xs text-neutral-500 max-w-[180px]">{s.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {s.category_name ? (
                                            <div className="flex items-center gap-2">
                                                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-50 text-xs font-bold text-primary">
                                                    {s.category_name.charAt(0)}
                                                </span>
                                                <span className="text-sm text-neutral-700">{s.category_name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-neutral-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary">
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {s.duration} menit
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm font-semibold text-neutral-900">
                                        Rp {s.price.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            type="button"
                                            onClick={() => onToggleActive(s.id, s.is_active)}
                                            disabled={togglingId === s.id}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 ${s.is_active ? 'bg-primary' : 'bg-neutral-300'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${s.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={`/service/services/${s.id}/edit`} className="rounded-lg p-2 text-primary transition-colors hover:bg-primary-50">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => onDelete(s)}
                                                disabled={togglingId === s.id}
                                                className="rounded-lg p-2 text-danger transition-colors hover:bg-danger-light disabled:opacity-50"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
            </div>
        </>
    );
}
