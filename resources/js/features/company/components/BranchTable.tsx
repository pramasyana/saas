import type { Branch } from '@/features/company/types';

interface BranchTableProps {
    branches: Branch[];
    onEdit: (branch: Branch) => void;
    onDelete: (branch: Branch) => void;
}

export default function BranchTable({ branches, onEdit, onDelete }: BranchTableProps) {
    if (branches.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 px-6 py-16">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                    <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-neutral-900">Belum ada cabang</p>
                    <p className="mt-1 text-sm text-neutral-500">Tambahkan cabang baru untuk memulai.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="divide-y divide-neutral-100 lg:hidden">
                {branches.map((branch) => (
                    <div key={branch.id} className="px-4 py-4 transition-colors hover:bg-neutral-50">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary">
                                    {branch.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-neutral-900">{branch.name}</p>
                                    <p className="truncate text-xs text-neutral-500">{branch.slug}</p>
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                <button
                                    onClick={() => onEdit(branch)}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                    title="Edit cabang"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </button>
                                <div className="h-4 w-px bg-neutral-200" />
                                <button
                                    onClick={() => onDelete(branch)}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger"
                                    title="Hapus cabang"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 pl-[52px]">
                            {branch.address && (
                                <span className="text-xs text-neutral-500">{branch.address}</span>
                            )}
                            {branch.phone && (
                                <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                                    {branch.phone}
                                </span>
                            )}
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                branch.is_active
                                    ? 'bg-success-light text-success ring-1 ring-inset ring-success/20'
                                    : 'bg-neutral-100 text-neutral-500'
                            }`}>
                                {branch.is_active ? 'Aktif' : 'Nonaktif'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <table className="hidden min-w-full divide-y divide-neutral-200 lg:table">
                <thead className="bg-neutral-50">
                    <tr>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Cabang</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Kontak</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Manajer</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                    {branches.map((branch) => (
                        <tr key={branch.id} className="transition-colors hover:bg-neutral-50">
                            <td className="whitespace-nowrap px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary">
                                        {branch.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-neutral-900">{branch.name}</p>
                                        <p className="truncate text-sm text-neutral-500">{branch.slug}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <div className="space-y-1">
                                    {branch.email && (
                                        <p className="text-sm text-neutral-600">{branch.email}</p>
                                    )}
                                    {branch.phone && (
                                        <p className="text-sm text-neutral-500">{branch.phone}</p>
                                    )}
                                    {!branch.email && !branch.phone && (
                                        <span className="text-sm text-neutral-400">-</span>
                                    )}
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">
                                {branch.manager_name || <span className="text-neutral-400">-</span>}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    branch.is_active
                                        ? 'bg-success-light text-success ring-1 ring-inset ring-success/20'
                                        : 'bg-neutral-100 text-neutral-500'
                                }`}>
                                    <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                                        branch.is_active ? 'bg-success' : 'bg-neutral-400'
                                    }`} />
                                    {branch.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <div className="flex justify-end">
                                    <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                        <button
                                            onClick={() => onEdit(branch)}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                            title="Edit cabang"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                        <div className="h-4 w-px bg-neutral-200" />
                                        <button
                                            onClick={() => onDelete(branch)}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger"
                                            title="Hapus cabang"
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
