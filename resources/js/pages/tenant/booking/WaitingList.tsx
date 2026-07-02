import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import { useWaitingList, useCreateWaitingList, useDeleteWaitingList, useNotifyWaitingList } from '@/features/booking/hooks/useWaitingList';
import type { WaitingList, WaitingListFormData } from '@/features/booking/types';
import { useCustomers } from '@/features/crm/hooks/useCustomers';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';
import Pagination from '@/molecules/Pagination';
import { useToastStore } from '@/stores/toast';

interface WaitingListPageProps {
    title: string;
}

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'new'> = {
    waiting: 'warning',
    notified: 'new',
    booked: 'success',
    cancelled: 'danger',
};

const statusLabel: Record<string, string> = {
    waiting: 'Menunggu',
    notified: 'Dinotifikasi',
    booked: 'Sudah Booking',
    cancelled: 'Dibatalkan',
};

const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'waiting', label: 'Menunggu' },
    { value: 'notified', label: 'Dinotifikasi' },
    { value: 'booked', label: 'Sudah Booking' },
    { value: 'cancelled', label: 'Dibatalkan' },
];

const perPageOptions = [
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
];

function inputClass(field: string, errors: Record<string, string[]>, extra?: string) {
    return cn(
        'block w-full rounded-xl border px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2',
        errors[field]
            ? 'border-danger ring-danger/20 focus:border-danger focus:ring-danger/30'
            : 'border-neutral-300 ring-neutral-300 focus:border-primary focus:ring-primary/30',
        'disabled:bg-neutral-50 disabled:text-neutral-500',
        extra,
    );
}

function renderField(label: string, field: string, errors: Record<string, string[]>, children: ReactNode, hint?: string, required?: boolean) {
    const fieldErrors = errors[field];

    return (
        <div>
            <label className="block text-sm font-medium text-neutral-700">
                {label}
                {required && <span className="ml-0.5 text-danger">*</span>}
            </label>
            <div className="relative mt-1.5">{children}</div>
            {hint && !fieldErrors && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
            {fieldErrors && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-danger">
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <span>{fieldErrors[0]}</span>
                </div>
            )}
        </div>
    );
}

export default function WaitingListIndex({ title }: WaitingListPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const [filters, setFilters] = useState<{ page: number; per_page: number; search: string; status: string }>({
        page: 1,
        per_page: 15,
        search: '',
        status: '',
    });
    const [searchInput, setSearchInput] = useState('');
    const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<WaitingListFormData>({
        customer_id: '',
        preferred_date: new Date().toISOString().split('T')[0],
        preferred_time: '',
        notes: '',
    });
    const [selectedCustomerId, setSelectedCustomerId] = useState('');

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    }, []);

    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
        }, 400);

        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, [searchInput]);

    const { data, isLoading } = useWaitingList(filters);
    const { data: customersData } = useCustomers({ per_page: 50 });
    const createMutation = useCreateWaitingList();
    const deleteMutation = useDeleteWaitingList();
    const notifyMutation = useNotifyWaitingList();

    const customers = customersData?.data ?? [];
    const customerOptions = customers.map((c) => ({ value: c.id, label: `${c.name} — ${c.phone}` }));
    const list = data?.data ?? [];
    const meta = data?.meta;

    function handleCreate() {
        const cid = selectedCustomerId || formData.customer_id;

        if (!cid || !formData.preferred_date) {
            return;
        }

        createMutation.mutate({ ...formData, customer_id: cid }, {
            onSuccess: () => {
                addToast('success', 'Berhasil ditambahkan ke waiting list.');
                setShowForm(false);
                setSelectedCustomerId('');
                setFormData({ customer_id: '', preferred_date: new Date().toISOString().split('T')[0], preferred_time: '', notes: '' });
            },
        });
    }

    function handleDelete(item: WaitingList) {
        if (!confirm(`Hapus ${item.customer_name} dari waiting list?`)) {
            return;
        }

        deleteMutation.mutate(item.id, {
            onSuccess: () => addToast('success', 'Berhasil dihapus.'),
        });
    }

    function handleNotify(item: WaitingList) {
        notifyMutation.mutate(item.id, {
            onSuccess: () => addToast('success', 'Notifikasi dikirim.'),
        });
    }

    const countByStatus = {
        waiting: list.filter((i: WaitingList) => i.status === 'waiting').length,
        notified: list.filter((i: WaitingList) => i.status === 'notified').length,
        booked: list.filter((i: WaitingList) => i.status === 'booked').length,
        cancelled: list.filter((i: WaitingList) => i.status === 'cancelled').length,
    };

    return (
        <TenantLayout>
            <Head title={title} />

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/booking" className="transition-colors hover:text-neutral-700">Booking</Link>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Waiting List</span>
            </nav>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{title}</h1>
                    <p className="mt-1 text-sm text-neutral-500">Antrian pelanggan yang menunggu ketersediaan.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {showForm ? 'Batal' : 'Tambah'}
                </Button>
            </div>

            <FadeIn delay={0.03}>
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                        { label: 'Menunggu', value: countByStatus.waiting, icon: (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ), color: 'text-warning', bg: 'bg-warning-light' },
                        { label: 'Dinotifikasi', value: countByStatus.notified, icon: (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                            </svg>
                        ), color: 'text-primary', bg: 'bg-primary-50' },
                        { label: 'Sudah Booking', value: countByStatus.booked, icon: (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ), color: 'text-success', bg: 'bg-success-light' },
                        { label: 'Dibatalkan', value: countByStatus.cancelled, icon: (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        ), color: 'text-danger', bg: 'bg-danger-light' },
                    ].map((s) => (
                        <div key={s.label} className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                                {s.icon}
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-bold tracking-tight text-neutral-900">{s.value.toLocaleString('id-ID')}</p>
                                <p className="text-sm text-neutral-500">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </FadeIn>

            {showForm && (
                <FadeIn>
                    <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
                        <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-neutral-900">Tambah ke Waiting List</h3>
                                <p className="text-xs text-neutral-500">Isi data pelanggan yang ingin menunggu.</p>
                            </div>
                        </div>
                        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                {renderField('Pelanggan', 'customer_id', {}, (
                                    <Select
                                        value={selectedCustomerId}
                                        onChange={(v) => {
 setSelectedCustomerId(v); setFormData((prev) => ({ ...prev, customer_id: v })); 
}}
                                        options={customerOptions}
                                        placeholder="Cari pelanggan..."
                                        searchable
                                        clearable
                                    />
                                ), undefined, true)}
                            </div>
                            <div>
                                {renderField('Tanggal', 'preferred_date', {}, (
                                    <input
                                        type="date"
                                        value={formData.preferred_date}
                                        onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                                        className={inputClass('preferred_date', {})}
                                    />
                                ), undefined, true)}
                            </div>
                            <div>
                                {renderField('Jam', 'preferred_time', {}, (
                                    <input
                                        type="time"
                                        value={formData.preferred_time || ''}
                                        onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value || undefined })}
                                        className={inputClass('preferred_time', {})}
                                    />
                                ), 'Opsional. Biarkan kosong jika fleksibel.')}
                            </div>
                            <div>
                                {renderField('Catatan', 'notes', {}, (
                                    <input
                                        type="text"
                                        value={formData.notes || ''}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className={inputClass('notes', {})}
                                        placeholder="Catatan (opsional)"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 border-t border-neutral-200 pt-6">
                            <Button type="button" variant="secondary" onClick={() => setShowForm(false)} disabled={createMutation.isPending}>Batal</Button>
                            <Button type="submit" onClick={handleCreate} disabled={!formData.preferred_date || createMutation.isPending} className="min-w-[120px]">
                                {createMutation.isPending ? (
                                    <span className="inline-flex items-center gap-2">
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Menyimpan...
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        Tambah
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </FadeIn>
            )}

            <FadeIn delay={0.06}>
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center gap-3 border-b border-neutral-200 px-5 py-4">
                        <div className="relative flex-1">
                            <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={handleSearchChange}
                                placeholder="Cari pelanggan..."
                                className="w-full rounded-xl border border-neutral-300 py-2.5 pl-10 pr-3.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="w-40">
                                <Select
                                    value={filters.status}
                                    onChange={(v) => setFilters((prev) => ({ ...prev, status: v, page: 1 }))}
                                    options={statusOptions}
                                    placeholder="Filter status"
                                />
                            </div>
                            <div className="w-28">
                                <Select
                                    value={String(filters.per_page)}
                                    onChange={(v) => setFilters((prev) => ({ ...prev, per_page: Number(v), page: 1 }))}
                                    options={perPageOptions}
                                    placeholder="Per page"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="animate-pulse space-y-4 p-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-neutral-200" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-1/3 rounded bg-neutral-200" />
                                            <div className="h-3 w-1/2 rounded bg-neutral-100" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : list.length === 0 ? (
                            <div className="flex flex-col items-center gap-5 px-6 py-16 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
                                    <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-neutral-900">Belum ada waiting list</p>
                                    <p className="mt-1 text-sm text-neutral-500">Tambahkan pelanggan yang ingin menunggu ketersediaan.</p>
                                </div>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-neutral-100 bg-neutral-50">
                                        <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">#</th>
                                        <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Pelanggan</th>
                                        <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Tanggal</th>
                                        <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                        <th className="whitespace-nowrap px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {list.map((item: WaitingList) => (
                                        <tr key={item.id} className="transition-colors hover:bg-neutral-50">
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{item.position}</td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <p className="text-sm font-medium text-neutral-900">{item.customer_name}</p>
                                                {item.customer_phone && <p className="text-xs text-neutral-400">{item.customer_phone}</p>}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-700">
                                                {item.preferred_date}
                                                {item.preferred_time && <span className="ml-1 text-neutral-400">{item.preferred_time}</span>}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <Badge variant={statusVariant[item.status] ?? 'default'}>
                                                    {statusLabel[item.status] ?? item.status}
                                                </Badge>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    {item.status === 'waiting' && (
                                                        <button
                                                            onClick={() => handleNotify(item)}
                                                            disabled={notifyMutation.isPending}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary-50"
                                                            title="Notifikasi"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(item)}
                                                        disabled={deleteMutation.isPending}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-danger transition-colors hover:bg-danger-light"
                                                        title="Hapus"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {meta && (
                        <Pagination
                            meta={meta}
                            onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
                        />
                    )}
                </div>
            </FadeIn>
        </TenantLayout>
    );
}
