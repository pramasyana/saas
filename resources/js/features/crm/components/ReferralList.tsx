import { useState } from 'react';
import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import { useCustomerReferrals, useConvertReferral, useMarkRewardGiven } from '@/features/crm/hooks/useCustomerReferrals';
import Pagination from '@/molecules/Pagination';
import { useToastStore } from '@/stores/toast';

interface ReferralListProps {
    customerId: string;
}

const statusVariants: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
    pending: 'warning',
    converted: 'success',
    expired: 'danger',
};

const statusLabels: Record<string, string> = {
    pending: 'Menunggu',
    converted: 'Terkonversi',
    expired: 'Kadaluarsa',
};

export default function ReferralList({ customerId }: ReferralListProps) {
    const [page, setPage] = useState(1);
    const addToast = useToastStore((s) => s.addToast);

    const { data, isLoading, error } = useCustomerReferrals(customerId, { page, per_page: 10 });
    const convertReferral = useConvertReferral();
    const markRewardGiven = useMarkRewardGiven();

    const referrals = data?.data ?? [];
    const meta = data?.meta;

    function handleConvert(id: string) {
        convertReferral.mutate(id, {
            onSuccess: () => addToast('success', 'Referral berhasil dikonversi'),
        });
    }

    function handleMarkReward(id: string) {
        markRewardGiven.mutate(id, {
            onSuccess: () => addToast('success', 'Reward berhasil ditandai'),
        });
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-3 py-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-light">
                    <svg className="h-6 w-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>
                <p className="text-sm text-danger">Gagal memuat referral</p>
            </div>
        );
    }

    return (
        <FadeIn>
            <div className="space-y-5">
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Referral</h3>
                        <p className="text-xs text-neutral-500">Program referensi pelanggan</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse rounded-xl border border-neutral-200 bg-white p-4">
                                <div className="h-4 w-1/3 rounded bg-neutral-200" />
                                <div className="mt-2 h-3 w-1/4 rounded bg-neutral-100" />
                            </div>
                        ))}
                    </div>
                ) : referrals.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-10">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                            <svg className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                            </svg>
                        </div>
                        <p className="text-sm text-neutral-500">Belum ada referral</p>
                    </div>
                ) : (
                    <>
                        <div className="divide-y divide-neutral-100 lg:hidden">
                            {referrals.map((referral) => (
                                <div key={referral.id} className="px-1 py-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">
                                                {referral.referred_name || referral.referred_email || '-'}
                                            </p>
                                            <p className="mt-0.5 text-xs text-neutral-400">
                                                Kode: <span className="font-mono text-neutral-600">{referral.code}</span>
                                            </p>
                                        </div>
                                        <Badge variant={statusVariants[referral.status] ?? 'default'}>
                                            {statusLabels[referral.status] ?? referral.status}
                                        </Badge>
                                    </div>
                                    <div className="mt-2 flex items-center gap-3">
                                        {referral.reward_given ? (
                                            <span className="inline-flex items-center gap-1 text-xs text-success">
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                                Reward diberikan
                                            </span>
                                        ) : (
                                            <span className="text-xs text-neutral-400">Reward belum diberikan</span>
                                        )}
                                        <span className="text-xs text-neutral-400">
                                            {new Date(referral.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        {referral.status === 'pending' && (
                                            <Button type="button" size="sm" variant="outline" onClick={() => handleConvert(referral.id)} disabled={convertReferral.isPending}>
                                                Konversi
                                            </Button>
                                        )}
                                        {referral.status === 'converted' && !referral.reward_given && (
                                            <Button type="button" size="sm" variant="outline" onClick={() => handleMarkReward(referral.id)} disabled={markRewardGiven.isPending}>
                                                Beri Reward
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <table className="hidden min-w-full divide-y divide-neutral-200 lg:table">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Kode</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Nama/Email</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Reward</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Tanggal</th>
                                    <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 bg-white">
                                {referrals.map((referral) => (
                                    <tr key={referral.id} className="transition-colors hover:bg-neutral-50">
                                        <td className="whitespace-nowrap px-6 py-4 font-mono text-sm text-neutral-700">{referral.code}</td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <p className="text-sm font-medium text-neutral-900">{referral.referred_name || '-'}</p>
                                            {referral.referred_email && (
                                                <p className="text-xs text-neutral-400">{referral.referred_email}</p>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <Badge variant={statusVariants[referral.status] ?? 'default'}>
                                                {statusLabels[referral.status] ?? referral.status}
                                            </Badge>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {referral.reward_given ? (
                                                <span className="inline-flex items-center gap-1 text-sm text-success">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                    Diberikan
                                                </span>
                                            ) : (
                                                <span className="text-sm text-neutral-400">-</span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">
                                            {new Date(referral.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                {referral.status === 'pending' && (
                                                    <Button type="button" size="sm" variant="outline" onClick={() => handleConvert(referral.id)} disabled={convertReferral.isPending}>
                                                        Konversi
                                                    </Button>
                                                )}
                                                {referral.status === 'converted' && !referral.reward_given && (
                                                    <Button type="button" size="sm" variant="outline" onClick={() => handleMarkReward(referral.id)} disabled={markRewardGiven.isPending}>
                                                        Beri Reward
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {meta && meta.last_page > 1 && (
                            <div className="pt-2">
                                <Pagination meta={meta} onPageChange={setPage} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </FadeIn>
    );
}
