import Badge from '@/atoms/Badge';
import FadeIn from '@/atoms/FadeIn';
import type { Reward } from '@/features/crm/types';

interface RewardTableProps {
    rewards: Reward[];
    isLoading?: boolean;
    onEdit: (reward: Reward) => void;
    onDelete: (reward: Reward) => void;
}

function LoadingSkeleton() {
    return (
        <div className="space-y-4 p-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex animate-pulse items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-neutral-200" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 rounded bg-neutral-200" />
                        <div className="h-3 w-1/2 rounded bg-neutral-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function RewardTable({ rewards, isLoading, onEdit, onDelete }: RewardTableProps) {
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (rewards.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 px-6 py-16">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                    <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h17.25a1.5 1.5 0 001.5-1.5v-1.5a1.5 1.5 0 00-1.5-1.5H3.375a1.5 1.5 0 00-1.5 1.5v1.5a1.5 1.5 0 001.5 1.5z" />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-neutral-900">Belum ada reward</p>
                    <p className="mt-1 text-sm text-neutral-500">Tambahkan reward untuk program loyalitas.</p>
                </div>
            </div>
        );
    }

    return (
        <FadeIn>
            <div className="divide-y divide-neutral-100 lg:hidden">
                {rewards.map((reward) => (
                    <div key={reward.id} className="px-4 py-4 transition-colors hover:bg-neutral-50">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 text-sm font-semibold">
                                    {reward.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-neutral-900">{reward.name}</p>
                                    <p className="text-xs text-neutral-500">{reward.points_required} pts</p>
                                </div>
                            </div>
                            <Badge variant={reward.is_active ? 'success' : 'danger'}>
                                {reward.is_active ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                        </div>
                        {reward.description && (
                            <p className="mt-2 text-xs text-neutral-500 line-clamp-2">{reward.description}</p>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-neutral-400">
                                <span>Stok: {reward.stock ?? 'Tak terbatas'}</span>
                            </div>
                            <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                <button
                                    onClick={() => onEdit(reward)}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                    title="Edit reward"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </button>
                                <div className="h-4 w-px bg-neutral-200" />
                                <button
                                    onClick={() => onDelete(reward)}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger"
                                    title="Hapus reward"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <table className="hidden min-w-full divide-y divide-neutral-200 lg:table">
                <thead className="bg-neutral-50">
                    <tr>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Reward</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Deskripsi</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Poin</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Stok</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                    {rewards.map((reward) => (
                        <tr key={reward.id} className="transition-colors hover:bg-neutral-50">
                            <td className="whitespace-nowrap px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 text-sm font-bold">
                                        {reward.name.charAt(0)}
                                    </div>
                                    <p className="text-sm font-medium text-neutral-900">{reward.name}</p>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <p className="max-w-[240px] truncate text-sm text-neutral-500">
                                    {reward.description || '-'}
                                </p>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {reward.points_required} pts
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">
                                {reward.stock !== null ? reward.stock : 'Tak terbatas'}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <Badge variant={reward.is_active ? 'success' : 'danger'}>
                                    {reward.is_active ? 'Aktif' : 'Nonaktif'}
                                </Badge>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <div className="flex justify-end">
                                    <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                        <button
                                            onClick={() => onEdit(reward)}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                            title="Edit reward"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                        <div className="h-4 w-px bg-neutral-200" />
                                        <button
                                            onClick={() => onDelete(reward)}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger"
                                            title="Hapus reward"
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
        </FadeIn>
    );
}
