import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import CustomerDeleteDialog from '@/features/crm/components/CustomerDeleteDialog';
import CustomerTable from '@/features/crm/components/CustomerTable';
import { useCustomers, useDeleteCustomer } from '@/features/crm/hooks/useCustomers';
import type { Customer } from '@/features/crm/types';
import TenantLayout from '@/layouts/TenantLayout';
import Pagination from '@/molecules/Pagination';
import { useToastStore } from '@/stores/toast';

interface Stats {
    total: number;
    active: number;
    with_membership: number;
}

interface CustomersIndexPageProps {
    title: string;
    stats: Stats;
}

interface Filters {
    search?: string;
    page?: number;
    per_page?: number;
}

interface StatCard {
    label: string;
    value: number;
    icon: ReactNode;
    color: string;
    bg: string;
}

function extractMessage(error: unknown): string | undefined {
    if (!error) {
        return undefined;
    }

    if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        return axiosError.response?.data?.message ?? error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'Terjadi kesalahan.';
}

const statIcons = {
    users: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
    ),
    check: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    membership: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
    ),
};

const perPageOptions = [
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
];

export default function CustomersIndexPage({ title, stats }: CustomersIndexPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const [filters, setFilters] = useState<Filters>({ page: 1, per_page: 15, search: '' });
    const [searchInput, setSearchInput] = useState('');

    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const { data, isLoading, isError, error } = useCustomers(filters);
    const deleteMutation = useDeleteCustomer();

    const customers = data?.data ?? [];
    const meta = data?.meta;

    const statCards: StatCard[] = [
        { label: 'Total Pelanggan', value: stats.total, icon: statIcons.users, color: 'text-primary', bg: 'bg-primary-50' },
        { label: 'Aktif', value: stats.active, icon: statIcons.check, color: 'text-success', bg: 'bg-success-50' },
        { label: 'Nonaktif', value: stats.total - stats.active, icon: statIcons.users, color: 'text-danger', bg: 'bg-danger-50' },
        { label: 'With Membership', value: stats.with_membership, icon: statIcons.membership, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    function handlePage(page: number) {
        setFilters((prev) => ({ ...prev, page }));
    }

    function openDelete(customer: Customer) {
        setCustomerToDelete(customer);
        deleteMutation.reset();
    }

    function handleDelete() {
        if (!customerToDelete) {
            return;
        }

        deleteMutation.mutate(customerToDelete.id, {
            onSuccess: () => {
                setCustomerToDelete(null);
                addToast('success', 'Pelanggan berhasil dihapus.');
            },
        });
    }

    function handleEdit(customer: Customer) {
        window.location.href = `/crm/customers/${customer.id}/edit`;
    }

    function handleView(customer: Customer) {
        window.location.href = `/crm/customers/${customer.id}`;
    }

    const deleteError = extractMessage(deleteMutation.error);

    function renderSkeleton() {
        return (
            <div className="animate-pulse p-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4 py-4">
                        <div className="h-10 w-10 rounded-full bg-neutral-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-44 rounded bg-neutral-200" />
                            <div className="h-3 w-28 rounded bg-neutral-100" />
                        </div>
                        <div className="h-3 hidden w-24 rounded bg-neutral-100 sm:block" />
                        <div className="h-6 w-16 rounded-full bg-neutral-200" />
                        <div className="flex gap-2">
                            <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                            <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    function renderError() {
        return (
            <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-50">
                    <svg className="h-8 w-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>
                <div>
                    <p className="text-base font-semibold text-neutral-900">Gagal memuat data</p>
                    <p className="mt-1 text-sm text-neutral-500">{(error as Error)?.message || 'Terjadi kesalahan. Coba lagi.'}</p>
                </div>
                <button onClick={() => window.location.reload()} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark">
                    Muat Ulang
                </button>
            </div>
        );
    }

    function renderEmpty() {
        return (
            <div className="flex flex-col items-center gap-5 px-6 py-20">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-100">
                    <svg className="h-10 w-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="text-base font-semibold text-neutral-900">Belum ada pelanggan</p>
                    <p className="mt-1 text-sm text-neutral-500">Tambahkan pelanggan pertama untuk memulai.</p>
                </div>
                <Link href="/crm/customers/create">
                    <Button variant="outline" size="sm">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah Pelanggan
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <TenantLayout>
            <Head title={title} />

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <span className="font-medium text-neutral-900">Pelanggan</span>
            </nav>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{title}</h1>
                    <p className="mt-1 text-sm text-neutral-500">Kelola data pelanggan.</p>
                </div>
                <Link href="/crm/customers/create">
                    <Button className="shrink-0">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah Pelanggan
                    </Button>
                </Link>
            </div>

            <FadeIn delay={0.03}>
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {statCards.map((s) => (
                        <div
                            key={s.label}
                            className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
                        >
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                                {s.icon}
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-bold tracking-tight text-neutral-900">
                                    {s.value.toLocaleString('id-ID')}
                                </p>
                                <p className="text-sm text-neutral-500">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </FadeIn>

            <FadeIn delay={0.06}>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Cari nama atau email..."
                            className="w-full rounded-xl border border-neutral-300 py-2.5 pl-10 pr-3.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Select
                            value={String(filters.per_page ?? 15)}
                            onChange={(v) => setFilters((prev) => ({ ...prev, per_page: Number(v), page: 1 }))}
                            options={perPageOptions}
                            placeholder="Per page"
                        />
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.09}>
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    {isError ? (
                        renderError()
                    ) : isLoading ? (
                        renderSkeleton()
                    ) : customers.length === 0 ? (
                        renderEmpty()
                    ) : (
                        <CustomerTable
                            customers={customers}
                            isLoading={false}
                            onEdit={handleEdit}
                            onDelete={openDelete}
                            onView={handleView}
                        />
                    )}

                    {meta && (<Pagination meta={meta} onPageChange={handlePage} />)}
                </div>
            </FadeIn>

            <CustomerDeleteDialog
                open={!!customerToDelete}
                customer={customerToDelete!}
                deleting={deleteMutation.isPending}
                error={deleteError}
                onClose={() => { setCustomerToDelete(null); deleteMutation.reset(); }}
                onConfirm={handleDelete}
            />
        </TenantLayout>
    );
}
