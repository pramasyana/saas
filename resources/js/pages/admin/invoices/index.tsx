import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Select from '@/atoms/Select';
import { useInvoices } from '@/features/subscriptions/hooks/useSubscriptions';
import type { InvoiceFilters } from '@/features/subscriptions/types';
import AdminLayout from '@/layouts/AdminLayout';
import { formatPrice } from '@/lib/utils';
import Pagination from '@/molecules/Pagination';

interface InvoicesPageProps {
    title: string;
}

const statusBadge: Record<string, string> = {
    pending: 'bg-warning/10 text-warning',
    paid: 'bg-success-light text-success',
    failed: 'bg-danger-light text-danger',
};

export default function Invoices({ title }: InvoicesPageProps) {
    const [filters, setFilters] = useState<InvoiceFilters>({ page: 1, per_page: 15 });

    const { data, isLoading, isError } = useInvoices(filters);

    const invoices = data?.data ?? [];
    const meta = data?.meta;

    function handlePage(page: number) {
        setFilters((prev) => ({ ...prev, page }));
    }

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Invoices</h1>
                    <p className="mt-1 text-sm text-neutral-500">Daftar semua invoice dari seluruh tenant.</p>
                </div>
                <a
                    href="/admin/export/invoices"
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Export CSV
                </a>
            </div>

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <div className="flex gap-3">
                    <Select
                        value={filters.status ?? ''}
                        onChange={(v) => setFilters((prev) => ({ ...prev, status: v || undefined, page: 1 }))}
                        options={[
                            { value: '', label: 'Semua Status' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'paid', label: 'Lunas' },
                            { value: 'failed', label: 'Gagal' },
                        ]}
                        placeholder="Filter status"
                    />
                    <Select
                        value={String(filters.per_page ?? 15)}
                        onChange={(v) => setFilters((prev) => ({ ...prev, per_page: Number(v), page: 1 }))}
                        options={[
                            { value: '10', label: '10' },
                            { value: '15', label: '15' },
                            { value: '25', label: '25' },
                            { value: '50', label: '50' },
                        ]}
                        placeholder="15"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 rounded-xl bg-neutral-100" />
                    ))}
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-20 text-center shadow-sm">
                    <p className="text-base font-semibold text-neutral-900">Gagal memuat data</p>
                </div>
            ) : invoices.length === 0 ? (
                <div className="flex flex-col items-center gap-5 rounded-2xl border border-neutral-200 bg-white px-6 py-20 shadow-sm">
                    <p className="text-base font-semibold text-neutral-900">Belum ada invoice</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50/50">
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">No. Invoice</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Pelanggan</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Plan</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Jumlah</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Jatuh Tempo</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Dibayar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {invoices.map((inv) => {
                                const sub = inv.subscription;
                                return (
                                    <tr key={inv.id} className="transition-colors hover:bg-neutral-50/50">
                                        <td className="px-5 py-4">
                                            <span className="text-sm font-medium text-neutral-900">{inv.number}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-neutral-900">{sub?.user?.name ?? '-'}</p>
                                                <p className="text-xs text-neutral-500">{sub?.user?.email ?? ''}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-neutral-600">{sub?.plan?.name ?? '-'}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm font-semibold text-neutral-900">{formatPrice(inv.amount)}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge[inv.status] ?? 'bg-neutral-100 text-neutral-600'}`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-neutral-600">
                                            {inv.due_date ? new Date(inv.due_date).toLocaleDateString('id-ID') : '-'}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-neutral-600">
                                            {inv.paid_at ? new Date(inv.paid_at).toLocaleDateString('id-ID') : '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {meta && <Pagination meta={meta} onPageChange={handlePage} />}
        </AdminLayout>
    );
}
