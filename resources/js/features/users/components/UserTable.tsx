import Badge from '@/atoms/Badge';
import type { User } from '@/features/users/types';

interface UserTableProps {
    users: User[];
    currentUserId?: number;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export default function UserTable({ users, currentUserId, onEdit, onDelete }: UserTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Nama
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Bergabung
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-4 py-12 text-center text-sm text-neutral-500">
                                Tidak ada data user.
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id} className="transition-colors hover:bg-neutral-50">
                                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-neutral-900">
                                    {user.name}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-600">
                                    {user.email}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    {user.is_admin ? (
                                        <Badge variant="default">Admin</Badge>
                                    ) : (
                                        <Badge variant="success">User</Badge>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-500">
                                    {user.joined_at}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-right">
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="mr-2 rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                        title="Edit user"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    </button>
                                    {currentUserId !== user.id && (
                                        <button
                                            onClick={() => onDelete(user)}
                                            className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger"
                                            title="Hapus user"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
