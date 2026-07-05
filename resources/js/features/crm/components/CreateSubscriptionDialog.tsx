import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useCustomers } from '@/features/crm/hooks/useCustomers';
import { useCreateCustomerSubscription } from '@/features/crm/hooks/useCustomerSubscriptions';
import { useAllMembershipPlans } from '@/features/crm/hooks/useMembershipPlans';
import type { CustomerMembershipPlan } from '@/features/crm/types';

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function CreateSubscriptionDialog({ open, onClose }: Props) {
    const qc = useQueryClient();
    const { data: customersData } = useCustomers({ per_page: 100 });
    const { data: plansData } = useAllMembershipPlans();
    const create = useCreateCustomerSubscription();

    const [customerId, setCustomerId] = useState('');
    const [planId, setPlanId] = useState('');
    const [error, setError] = useState('');

    if (!open) {
return null;
}

    const customers = customersData?.data ?? [];
    const plans = plansData?.data ?? [];

    const selectedPlan = plans.find((p) => p.id === planId) as CustomerMembershipPlan | undefined;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!customerId || !planId) {
            setError('Pilih customer dan paket membership.');

            return;
        }

        create.mutate(
            { customer_id: customerId, plan_id: planId },
            {
                onSuccess: () => {
                    qc.invalidateQueries({ queryKey: ['crm', 'customers'] });
                    setCustomerId('');
                    setPlanId('');
                    onClose();
                },
                onError: (err: unknown) => {
                    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
                    setError(msg || 'Gagal menambahkan langganan.');
                },
            },
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg animate-fade-up rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-neutral-900">Tambah Langganan</h2>
                        <p className="mt-0.5 text-sm text-neutral-500">Buat subscription membership baru untuk customer.</p>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">Customer</label>
                        <select
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            className="block w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-3.5 pr-8 text-sm text-neutral-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                            <option value="">Pilih customer...</option>
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>{c.name} {c.phone ? `(${c.phone})` : ''}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">Paket Membership</label>
                        <select
                            value={planId}
                            onChange={(e) => setPlanId(e.target.value)}
                            className="block w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-3.5 pr-8 text-sm text-neutral-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                            <option value="">Pilih paket...</option>
                            {plans.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} - Rp {p.price.toLocaleString('id-ID')}/{p.billing_interval === 'yearly' ? 'tahun' : 'bulan'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedPlan && (
                        <div className="rounded-xl border border-primary-100 bg-primary-50/50 p-4">
                            <p className="mb-2 text-sm font-semibold text-primary">Benefit {selectedPlan.name}</p>
                            <ul className="space-y-1">
                                {(selectedPlan.benefits ?? []).map((b, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-start gap-2.5 rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger">
                            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 border-t border-neutral-100 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition-all hover:bg-neutral-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={create.isPending}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark disabled:opacity-60"
                        >
                            {create.isPending && (
                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            {create.isPending ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
