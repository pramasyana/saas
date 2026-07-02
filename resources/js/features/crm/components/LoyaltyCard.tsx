import { useState } from 'react';
import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Pagination from '@/molecules/Pagination';
import { useLoyaltyBalance, useLoyaltyTransactions, useEarnPoints, useSpendPoints } from '@/features/crm/hooks/useLoyalty';
import { useToastStore } from '@/stores/toast';

interface LoyaltyCardProps {
    customerId: string;
}

export default function LoyaltyCard({ customerId }: LoyaltyCardProps) {
    const [showForm, setShowForm] = useState<'earn' | 'spend' | null>(null);
    const [points, setPoints] = useState('');
    const [description, setDescription] = useState('');
    const [page, setPage] = useState(1);
    const addToast = useToastStore((s) => s.addToast);

    const { data: balanceData, isLoading: balanceLoading, error: balanceError } = useLoyaltyBalance(customerId);
    const { data: txData, isLoading: txLoading } = useLoyaltyTransactions(customerId, { page, per_page: 10 });
    const earnPoints = useEarnPoints();
    const spendPoints = useSpendPoints();

    const balance = balanceData?.data;
    const transactions = txData?.data ?? [];
    const meta = txData?.meta;

    function handleSubmit(type: 'earn' | 'spend') {
        const pts = parseInt(points, 10);
        if (!pts || pts <= 0) return;
        const mutation = type === 'earn' ? earnPoints : spendPoints;
        mutation.mutate(
            { customerId, data: { points: pts, description: description.trim() || undefined } },
            {
                onSuccess: () => {
                    setShowForm(null);
                    setPoints('');
                    setDescription('');
                    addToast('success', `Poin berhasil ${type === 'earn' ? 'ditambahkan' : 'ditukarkan'}`);
                },
            },
        );
    }

    if (balanceError) {
        return (
            <div className="flex items-center gap-3 rounded-2xl border border-danger/20 bg-danger-light px-5 py-4 text-sm text-danger">
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                Gagal memuat data loyalitas
            </div>
        );
    }

    return (
        <FadeIn>
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-900">Loyalty Points</h3>
                            <p className="text-xs text-neutral-500">Kelola poin loyalitas</p>
                        </div>
                    </div>
                    {!showForm && (
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm('earn')}>
                                Tambah Poin
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm('spend')}>
                                Tukar Poin
                            </Button>
                        </div>
                    )}
                </div>

                <div className="p-6">
                    {balanceLoading ? (
                        <div className="animate-pulse space-y-3">
                            <div className="h-8 w-24 rounded bg-neutral-200" />
                            <div className="h-4 w-32 rounded bg-neutral-100" />
                        </div>
                    ) : balance ? (
                        <div className="mb-6 flex items-center gap-6 rounded-xl bg-primary-50 px-5 py-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                                <span className="text-xl font-bold">{balance.points}</span>
                            </div>
                            <div>
                                <p className="text-sm text-primary/70">Saldo Poin</p>
                                <p className="text-2xl font-bold text-primary">{balance.points.toLocaleString()} pts</p>
                                <p className="text-xs text-primary/60">Total belanja: Rp {balance.total_spent.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    ) : null}

                    {showForm && (
                        <div className="mb-6 rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
                            <h4 className="text-sm font-semibold text-neutral-900">
                                {showForm === 'earn' ? 'Tambah Poin' : 'Tukar Poin'}
                            </h4>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700">Jumlah Poin</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={points}
                                        onChange={(e) => setPoints(e.target.value)}
                                        className="mt-1.5 block w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/30"
                                        placeholder="Masukkan jumlah poin"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700">Deskripsi (opsional)</label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="mt-1.5 block w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/30"
                                        placeholder="Contoh: Bonus referral"
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="secondary" size="sm" onClick={() => setShowForm(null)}>
                                        Batal
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => handleSubmit(showForm)}
                                        disabled={!points || parseInt(points) <= 0 || earnPoints.isPending || spendPoints.isPending}
                                    >
                                        {(earnPoints.isPending || spendPoints.isPending) ? 'Memproses...' : 'Simpan'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <h4 className="mb-3 text-sm font-semibold text-neutral-900">Riwayat Transaksi</h4>
                        {txLoading ? (
                            <div className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="animate-pulse rounded-lg bg-neutral-100 p-3">
                                        <div className="h-3 w-1/3 rounded bg-neutral-200" />
                                    </div>
                                ))}
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 py-6">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                                    <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-neutral-500">Belum ada transaksi</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {transactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between rounded-lg border border-neutral-100 bg-white px-4 py-3 transition-colors hover:bg-neutral-50">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                                tx.type === 'earn' ? 'bg-success-light text-success' : 'bg-warning-light text-warning'
                                            }`}>
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    {tx.type === 'earn' ? (
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                    ) : (
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                                    )}
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-neutral-900">
                                                    {tx.type === 'earn' ? 'Earned' : 'Spent'}
                                                </p>
                                                {tx.description && (
                                                    <p className="text-xs text-neutral-500">{tx.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-semibold ${
                                                tx.type === 'earn' ? 'text-success' : 'text-warning'
                                            }`}>
                                                {tx.type === 'earn' ? '+' : '-'}{tx.points} pts
                                            </p>
                                            <p className="text-xs text-neutral-400">
                                                {new Date(tx.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {meta && meta.last_page > 1 && (
                            <div className="mt-4">
                                <Pagination
                                    meta={meta}
                                    onPageChange={setPage}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FadeIn>
    );
}
