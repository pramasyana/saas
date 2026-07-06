import { Link } from '@inertiajs/react';
import type { Tenant } from '@/features/tenants/types';

interface TenantTableProps {
    tenants: Tenant[];
    onDelete: (tenant: Tenant) => void;
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

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export default function TenantTable({ tenants, onDelete }: TenantTableProps) {
    if (tenants.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 px-6 py-16">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                    <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-neutral-900">Belum ada tenant</p>
                    <p className="mt-1 text-sm text-neutral-500">Tambahkan tenant baru untuk memulai.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="divide-y divide-neutral-100 lg:hidden">
                {tenants.map((tenant) => (
                    <div key={tenant.id} className="px-4 py-4 transition-colors hover:bg-neutral-50">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getAvatarColor(tenant.name ?? tenant.id)}`}>
                                    {getInitials(tenant.name ?? tenant.id)}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-neutral-900">{tenant.name ?? '-'}</p>
                                    <p className="truncate text-xs text-neutral-500">{tenant.email ?? ''}</p>
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                <Link
                                    href={`/admin/tenants/${tenant.id}`}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                    title="Detail tenant"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </Link>
                                <div className="h-4 w-px bg-neutral-200" />
                                <Link
                                    href={`/admin/tenants/${tenant.id}/edit`}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                    title="Edit tenant"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </Link>
                                <div className="h-4 w-px bg-neutral-200" />
                                <button
                                    onClick={() => onDelete(tenant)}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger"
                                    title="Hapus tenant"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 pl-[52px]">
                            {tenant.domains?.map((d) => (
                                <span key={d} className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                                    {d}
                                </span>
                            ))}
                            <span className="text-xs text-neutral-400">{tenant.users_count} users</span>
                            <span className="text-xs text-neutral-400">{tenant.subscriptions_count} subs</span>
                        </div>
                        <div className="mt-1 pl-[52px] text-xs text-neutral-400">{tenant.joined_at}</div>
                    </div>
                ))}
            </div>

            <table className="hidden min-w-full divide-y divide-neutral-200 lg:table">
                <thead className="bg-neutral-50">
                    <tr>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Tenant</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Domain</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Users</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Subs</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Bergabung</th>
                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                    {tenants.map((tenant) => (
                        <tr key={tenant.id} className="transition-colors hover:bg-neutral-50">
                            <td className="whitespace-nowrap px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getAvatarColor(tenant.name ?? tenant.id)}`}>
                                        {getInitials(tenant.name ?? tenant.id)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-neutral-900">{tenant.name ?? '-'}</p>
                                        <p className="truncate text-sm text-neutral-500">{tenant.email ?? ''}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                    {tenant.domains?.length ? tenant.domains.map((d) => (
                                        <span key={d} className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                                            {d}
                                        </span>
                                    )) : (
                                        <span className="text-sm text-neutral-400">-</span>
                                    )}
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">{tenant.users_count}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">{tenant.subscriptions_count}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{tenant.joined_at}</td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <div className="flex justify-end">
                                    <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                        <Link
                                            href={`/admin/tenants/${tenant.id}`}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                            title="Detail tenant"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </Link>
                                        <div className="h-4 w-px bg-neutral-200" />
                                        <Link
                                            href={`/admin/tenants/${tenant.id}/edit`}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                            title="Edit tenant"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </Link>
                                        <div className="h-4 w-px bg-neutral-200" />
                                        <button
                                            onClick={() => onDelete(tenant)}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger"
                                            title="Hapus tenant"
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
