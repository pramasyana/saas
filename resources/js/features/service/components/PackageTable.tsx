import { Link } from '@inertiajs/react';
import type { Package } from '../types';

interface PackageTableProps {
    packages: Package[];
    onDelete: (pkg: Package) => void;
    onToggleActive: (id: string, current: boolean) => void;
    togglingId: string | null;
}

export default function PackageTable({ packages, onDelete, onToggleActive, togglingId }: PackageTableProps) {
    if (packages.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                    <svg className="h-7 w-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <p className="text-sm font-medium text-neutral-900">Belum ada paket</p>
                <p className="text-sm text-neutral-500">Tambahkan paket layanan baru untuk memulai.</p>
                <Link href="/service/packages/create" className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark">
                    Tambah Paket
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* Mobile: card layout */}
            <div className="grid gap-3 lg:hidden">
                {packages.map((p) => (
                    <div key={p.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="flex items-start gap-3">
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-neutral-900">{p.name}</p>
                                {p.description && <p className="mt-0.5 truncate text-xs text-neutral-500">{p.description}</p>}
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary">{p.services_count ?? 0} layanan</span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                                        <svg className="h-3 w-3 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {p.duration} menit
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-neutral-900">Rp {p.price?.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => onToggleActive(p.id, p.is_active)}
                                    disabled={togglingId === p.id}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 ${p.is_active ? 'bg-primary' : 'bg-neutral-300'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${p.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${p.is_active ? 'bg-success-light text-success' : 'bg-neutral-100 text-neutral-500'}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${p.is_active ? 'bg-success' : 'bg-neutral-400'}`} />
                                    {p.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                                <Link href={`/service/packages/${p.id}/edit`} className="rounded-lg p-2 text-primary transition-colors hover:bg-primary-50">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </Link>
                                <button
                                    onClick={() => onDelete(p)}
                                    disabled={togglingId === p.id}
                                    className="rounded-lg p-2 text-danger transition-colors hover:bg-danger-light disabled:opacity-50"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
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
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Paket</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">Layanan</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">Durasi</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Harga</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {packages.map((p) => (
                                <tr key={p.id} className="transition-colors hover:bg-neutral-50">
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">{p.name}</p>
                                            {p.description && <p className="max-w-[220px] truncate text-xs text-neutral-500">{p.description}</p>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm text-neutral-700">{p.services_count ?? 0}</td>
                                    <td className="px-4 py-3 text-center text-sm text-neutral-700">{p.duration} menit</td>
                                    <td className="px-4 py-3 text-right text-sm font-medium text-neutral-900">Rp {p.price?.toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            type="button"
                                            onClick={() => onToggleActive(p.id, p.is_active)}
                                            disabled={togglingId === p.id}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 ${p.is_active ? 'bg-primary' : 'bg-neutral-300'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${p.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={`/service/packages/${p.id}/edit`} className="rounded-lg p-2 text-primary transition-colors hover:bg-primary-50">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => onDelete(p)}
                                                disabled={togglingId === p.id}
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
