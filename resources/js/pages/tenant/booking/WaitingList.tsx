import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import { useCustomers } from '@/features/crm/hooks/useCustomers';
import { useAllServices } from '@/features/service/hooks/useServices';
import { useWaitingList, useCreateWaitingList, useDeleteWaitingList, useNotifyWaitingList } from '@/features/booking/hooks/useWaitingList';
import type { WaitingList, WaitingListFormData } from '@/features/booking/types';
import TenantLayout from '@/layouts/TenantLayout';
import Pagination from '@/molecules/Pagination';
import { useToastStore } from '@/stores/toast';

interface WaitingListPageProps {
    title: string;
}

function extractMessage(error: unknown): string | undefined {
    if (!error) return undefined;
    if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        return axiosError.response?.data?.message ?? error.message;
    }
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Terjadi kesalahan.';
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

    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
        }, 400);
        return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
    }, [searchInput]);

    const { data, isLoading } = useWaitingList(filters);
    const { data: customersData } = useCustomers({ per_page: 50 });
    const { data: servicesData } = useAllServices();
    const createMutation = useCreateWaitingList();
    const deleteMutation = useDeleteWaitingList();
    const notifyMutation = useNotifyWaitingList();

    const customers = customersData?.data ?? [];
    const services = servicesData?.data ?? [];
    const list = data?.data ?? [];
    const meta = data?.meta;

    const deleteError = extractMessage(deleteMutation.error);

    function handleCreate() {
        if (!formData.customer_id || !formData.preferred_date) return;
        createMutation.mutate(formData, {
            onSuccess: () => {
                addToast('success', 'Berhasil ditambahkan ke waiting list.');
                setShowForm(false);
                setFormData({ customer_id: '', preferred_date: new Date().toISOString().split('T')[0], preferred_time: '', notes: '' });
            },
        });
    }

    function handleDelete(item: WaitingList) {
        if (!confirm(`Hapus ${item.customer_name} dari waiting list?`)) return;
        deleteMutation.mutate(item.id, {
            onSuccess: () => addToast('success', 'Berhasil dihapus.'),
        });
    }

    function handleNotify(item: WaitingList) {
        notifyMutation.mutate(item.id, {
            onSuccess: () => addToast('success', 'Notifikasi dikirim.'),
        });
    }

    return (
        <TenantLayout>
            <Head title={title} />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Waiting List</h1>
                    <p className="mt-1 text-sm text-neutral-500">Antrian pelanggan yang menunggu ketersediaan.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Batal' : 'Tambah'}
                </Button>
            </div>

            {showForm && (
                <FadeIn>
                    <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-neutral-900">Tambah ke Waiting List</h3>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-1">Pelanggan *</label>
                                <select
                                    required
                                    value={formData.customer_id}
                                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                                    className="block w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                                >
                                    <option value="">Pilih</option>
                                    {customers.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-1">Tanggal *</label>
                                <input
                                    type="date"
                                    value={formData.preferred_date}
                                    onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                                    className="block w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-1">Jam</label>
                                <input
                                    type="time"
                                    value={formData.preferred_time || ''}
                                    onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value || undefined })}
                                    className="block w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-1">Catatan</label>
                                <input
                                    type="text"
                                    value={formData.notes || ''}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="block w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                                    placeholder="Catatan"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button onClick={handleCreate} disabled={!formData.customer_id || !formData.preferred_date || createMutation.isPending}>
                                {createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </div>
                </FadeIn>
            )}

            <FadeIn delay={0.05}>
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div className="border-b border-neutral-200 px-4 py-3">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Cari pelanggan..."
                                    className="w-full rounded-xl border border-neutral-300 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))}
                                className="rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                            >
                                <option value="">Semua Status</option>
                                <option value="waiting">Menunggu</option>
                                <option value="notified">Telah Dinotifikasi</option>
                                <option value="booked">Sudah Booking</option>
                                <option value="cancelled">Dibatalkan</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-neutral-200 bg-neutral-50">
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Pelanggan</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Tanggal</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-neutral-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {list.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-neutral-50">
                                        <td className="px-4 py-3 text-sm text-neutral-500">{item.position}</td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-neutral-900">{item.customer_name}</p>
                                            {item.customer_phone && <p className="text-xs text-neutral-400">{item.customer_phone}</p>}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-neutral-700">
                                            {item.preferred_date}
                                            {item.preferred_time && <span className="text-neutral-400"> {item.preferred_time}</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                item.status === 'waiting' ? 'bg-warning-light text-warning' :
                                                item.status === 'notified' ? 'bg-primary-50 text-primary' :
                                                item.status === 'booked' ? 'bg-success-light text-success' :
                                                'bg-neutral-100 text-neutral-500'
                                            }`}>
                                                {item.status === 'waiting' ? 'Menunggu' :
                                                 item.status === 'notified' ? 'Dinotifikasi' :
                                                 item.status === 'booked' ? 'Sudah Booking' : 'Dibatalkan'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {item.status === 'waiting' && (
                                                    <button
                                                        onClick={() => handleNotify(item)}
                                                        disabled={notifyMutation.isPending}
                                                        className="rounded-lg p-2 text-primary transition-colors hover:bg-primary-50"
                                                        title="Notifikasi"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                                        </svg>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(item)}
                                                    disabled={deleteMutation.isPending}
                                                    className="rounded-lg p-2 text-danger transition-colors hover:bg-danger-light"
                                                    title="Hapus"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {list.length === 0 && !isLoading && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-16 text-center text-sm text-neutral-400">
                                            Tidak ada data waiting list
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {meta && <Pagination meta={meta} onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))} />}
                </div>
            </FadeIn>
        </TenantLayout>
    );
}
