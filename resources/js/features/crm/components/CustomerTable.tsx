import Badge from '@/atoms/Badge';
import type { Customer } from '@/features/crm/types';

interface CustomerTableProps {
    customers: Customer[];
    isLoading?: boolean;
    onEdit: (customer: Customer) => void;
    onDelete: (customer: Customer) => void;
    onView: (customer: Customer) => void;
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

function LoadingSkeleton() {
    return (
        <div className="space-y-4 p-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex animate-pulse items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-neutral-200" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 rounded bg-neutral-200" />
                        <div className="h-3 w-1/2 rounded bg-neutral-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function CustomerTable({ customers, isLoading, onEdit, onDelete, onView }: CustomerTableProps) {
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (customers.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 px-6 py-16">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                    <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-neutral-900">Belum ada pelanggan</p>
                    <p className="mt-1 text-sm text-neutral-500">Tambahkan pelanggan baru untuk memulai.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="divide-y divide-neutral-100 lg:hidden">
                {customers.map((customer) => (
                    <div key={customer.id} className="px-4 py-4 transition-colors hover:bg-neutral-50">
                        <div className="flex items-start justify-between">
                            <button onClick={() => onView(customer)} className="flex items-center gap-3 text-left">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getAvatarColor(customer.name)}`}>
                                    {getInitials(customer.name)}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-neutral-900">{customer.name}</p>
                                    <p className="truncate text-sm text-neutral-500">{customer.email || customer.phone || '-'}</p>
                                </div>
                            </button>
                            <div className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                <button
                                    onClick={() => onView(customer)}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                    title="Lihat detail"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                                <div className="h-4 w-px bg-neutral-200" />
                                <button
                                    onClick={() => onEdit(customer)}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                    title="Edit pelanggan"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </button>
                                <div className="h-4 w-px bg-neutral-200" />
                                <button
                                    onClick={() => onDelete(customer)}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger"
                                    title="Hapus pelanggan"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 pl-[52px]">
                            {customer.tags && customer.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {customer.tags.map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                                            style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <Badge variant={customer.is_active ? 'success' : 'danger'}>
                                {customer.is_active ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                            {customer.membership?.tier && (
                                <Badge variant="default">{customer.membership.tier.name}</Badge>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <table className="hidden min-w-full divide-y divide-neutral-200 lg:table">
                <thead className="bg-neutral-50">
                    <tr>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Pelanggan</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Kontak</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Tags</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Membership</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                    {customers.map((customer) => (
                        <tr key={customer.id} className="transition-colors hover:bg-neutral-50">
                            <td className="whitespace-nowrap px-6 py-4">
                                <button onClick={() => onView(customer)} className="flex items-center gap-3 text-left">
                                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getAvatarColor(customer.name)}`}>
                                        {getInitials(customer.name)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-neutral-900">{customer.name}</p>
                                        <p className="truncate text-sm text-neutral-400">{customer.company || '-'}</p>
                                    </div>
                                </button>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <div className="space-y-1">
                                    {customer.email && (
                                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                                            <svg className="h-3.5 w-3.5 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                            </svg>
                                            <span className="truncate max-w-[180px]">{customer.email}</span>
                                        </div>
                                    )}
                                    {customer.phone && (
                                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                                            <svg className="h-3.5 w-3.5 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                            </svg>
                                            <span>{customer.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                    {customer.tags && customer.tags.length > 0 ? customer.tags.map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                                            style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                                        >
                                            {tag.name}
                                        </span>
                                    )) : (
                                        <span className="text-sm text-neutral-400">-</span>
                                    )}
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                {customer.membership?.tier ? (
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-50 text-xs font-bold text-primary">
                                            {customer.membership.tier.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-700">{customer.membership.tier.name}</p>
                                            <p className="text-xs text-neutral-400">{customer.membership.points} pts</p>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-sm text-neutral-400">-</span>
                                )}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <Badge variant={customer.is_active ? 'success' : 'danger'}>
                                    {customer.is_active ? 'Aktif' : 'Nonaktif'}
                                </Badge>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <div className="flex justify-end">
                                    <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                        <button
                                            onClick={() => onView(customer)}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                            title="Lihat detail"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>
                                        <div className="h-4 w-px bg-neutral-200" />
                                        <button
                                            onClick={() => onEdit(customer)}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                            title="Edit pelanggan"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                        <div className="h-4 w-px bg-neutral-200" />
                                        <button
                                            onClick={() => onDelete(customer)}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger"
                                            title="Hapus pelanggan"
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
