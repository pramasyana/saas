import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';
import TenantSubNav from '@/molecules/TenantSubNav';
import { useToastStore } from '@/stores/toast';

interface Holiday {
    id: string;
    name: string;
    date_start: string;
    date_end: string;
    is_recurring_yearly: boolean;
    description: string | null;
    branch_id: string | null;
    branch_name: string | null;
    created_at: string;
}

interface Props {
    tenant_id: string;
    tenant_name?: string | null;
    tenant_email?: string | null;
    holidays: {
        data: Holiday[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
}

export default function CompanyHolidays({ tenant_id, tenant_name, tenant_email, holidays }: Props) {
    const addToast = useToastStore((s) => s.addToast);
    const [showModal, setShowModal] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
    const [deletingHoliday, setDeletingHoliday] = useState<Holiday | null>(null);

    const isEditing = !!editingHoliday;

    const { data, setData, post, put, errors, processing, reset } = useForm({
        name: '',
        date_start: '',
        date_end: '',
        is_recurring_yearly: false,
        description: '',
    });

    const today = new Date().toISOString().split('T')[0];

    function openCreate() {
        setEditingHoliday(null);
        reset();
        setShowModal(true);
    }

    function openEdit(holiday: Holiday) {
        setEditingHoliday(holiday);
        setData({
            name: holiday.name,
            date_start: holiday.date_start,
            date_end: holiday.date_end,
            is_recurring_yearly: holiday.is_recurring_yearly,
            description: holiday.description ?? '',
        });
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setEditingHoliday(null);
        reset();
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload = { ...data };

        if (!payload.description) {
delete payload.description;
}

        if (isEditing && editingHoliday) {
            put(`/admin/tenants/${tenant_id}/company/holidays/${editingHoliday.id}`, {
                onSuccess: () => {
                    addToast('success', 'Hari libur berhasil diperbarui.');
                    closeModal();
                },
            });
        } else {
            post(`/admin/tenants/${tenant_id}/company/holidays`, {
                onSuccess: () => {
                    addToast('success', 'Hari libur berhasil ditambahkan.');
                    closeModal();
                },
            });
        }
    }

    function confirmDelete() {
        if (!deletingHoliday) {
return;
}

        router.delete(`/admin/tenants/${tenant_id}/company/holidays/${deletingHoliday.id}`, {
            onSuccess: () => {
                addToast('success', 'Hari libur berhasil dihapus.');
                setDeletingHoliday(null);
            },
        });
    }

    function goToPage(page: number) {
        router.get(`/admin/tenants/${tenant_id}/company/holidays`, { page });
    }

    function inputClass(field: string) {
        const hasError = errors[field];

        return [
            'block w-full rounded-lg border px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2',
            hasError
                ? 'border-danger ring-danger/20 focus:border-danger focus:ring-danger/30'
                : 'border-neutral-300 ring-neutral-300 focus:border-primary focus:ring-primary/30',
        ].join(' ');
    }

    function formatDate(dateStr: string) {
        const date = new Date(dateStr);

        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    function getStatus(holiday: Holiday) {
        const now = new Date();
        const start = new Date(holiday.date_start);
        const end = new Date(holiday.date_end);

        if (now > end) {
return { label: 'Selesai', className: 'bg-neutral-100 text-neutral-500' };
}

        if (now >= start && now <= end) {
return { label: 'Berlangsung', className: 'bg-warning/10 text-warning' };
}

        return { label: 'Mendatang', className: 'bg-primary-50 text-primary' };
    }

    return (
        <AdminLayout>
            <Head title="Hari Libur" />

            <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/admin/dashboard" className="transition-colors hover:text-neutral-700">Dashboard</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <Link href="/admin/tenants" className="transition-colors hover:text-neutral-700">Tenants</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Hari Libur</span>
            </nav>

            <TenantSubNav tenantId={tenant_id} tenantName={tenant_name} tenantEmail={tenant_email} />

            <div className="mt-6 mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-neutral-900">Hari Libur</h1>
                    <p className="mt-1 text-sm text-neutral-500">Total {holidays.total} hari libur terdaftar.</p>
                </div>
                <Button onClick={openCreate}>
                    <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Tambah Hari Libur
                </Button>
            </div>

            <FadeIn delay={0.03}>
                <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
                    {holidays.data.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-16">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                                <svg className="h-7 w-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-neutral-900">Belum ada hari libur</p>
                            <p className="text-sm text-neutral-500">Tambahkan hari libur baru untuk memulai.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-neutral-100">
                                    <thead>
                                        <tr className="border-b border-neutral-100">
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Nama</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Tanggal</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Berulang</th>
                                            <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-50">
                                        {holidays.data.map((holiday) => {
                                            const status = getStatus(holiday);

                                            return (
                                                <tr key={holiday.id} className="transition-colors hover:bg-neutral-50">
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-neutral-900">{holiday.name}</p>
                                                            {holiday.description && (
                                                                <p className="text-xs text-neutral-500">{holiday.description}</p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <p className="text-sm text-neutral-900">{formatDate(holiday.date_start)}</p>
                                                        {holiday.date_start !== holiday.date_end && (
                                                            <p className="text-xs text-neutral-500">s.d. {formatDate(holiday.date_end)}</p>
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', status.className)}>
                                                            {status.label}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {holiday.is_recurring_yearly ? (
                                                            <span className="inline-flex items-center gap-1.5 text-sm text-neutral-600">
                                                                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                                                </svg>
                                                                Tahunan
                                                            </span>
                                                        ) : (
                                                            <span className="text-sm text-neutral-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right">
                                                        <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5">
                                                            <button
                                                                onClick={() => openEdit(holiday)}
                                                                className="inline-flex h-7 w-7 items-center justify-center rounded text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                                                title="Edit"
                                                            >
                                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                                </svg>
                                                            </button>
                                                            <div className="h-4 w-px bg-neutral-200" />
                                                            <button
                                                                onClick={() => setDeletingHoliday(holiday)}
                                                                className="inline-flex h-7 w-7 items-center justify-center rounded text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger"
                                                                title="Hapus"
                                                            >
                                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {holidays.last_page > 1 && (
                                <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4">
                                    <p className="text-sm text-neutral-500">
                                        Menampilkan halaman {holidays.current_page} dari {holidays.last_page} ({holidays.total} data)
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => goToPage(holidays.current_page - 1)}
                                            disabled={holidays.current_page <= 1}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                            </svg>
                                        </button>
                                        {Array.from({ length: holidays.last_page }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={cn(
                                                    'inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                                                    page === holidays.current_page
                                                        ? 'bg-primary text-white shadow-sm'
                                                        : 'text-neutral-600 hover:bg-neutral-100',
                                                )}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => goToPage(holidays.current_page + 1)}
                                            disabled={holidays.current_page >= holidays.last_page}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </FadeIn>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/30" onClick={closeModal} />
                    <div className="relative z-10 mx-4 w-full max-w-md rounded-xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                            <h2 className="text-base font-semibold text-neutral-900">
                                {isEditing ? 'Edit Hari Libur' : 'Tambah Hari Libur'}
                            </h2>
                            <button onClick={closeModal} className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 p-6">
                            {errors._general && (
                                <div className="flex items-center gap-2.5 rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
                                    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                    <span>{errors._general[0]}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Nama Hari Libur *</label>
                                <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className={inputClass('name')} placeholder="Contoh: Hari Kemerdekaan" />
                                {errors.name && <p className="mt-1 text-xs text-danger">{errors.name[0]}</p>}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700">Tanggal Mulai *</label>
                                    <input type="date" value={data.date_start} onChange={(e) => setData('date_start', e.target.value)} className={inputClass('date_start')} min={isEditing ? undefined : today} />
                                    {errors.date_start && <p className="mt-1 text-xs text-danger">{errors.date_start[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700">Tanggal Selesai *</label>
                                    <input type="date" value={data.date_end} onChange={(e) => setData('date_end', e.target.value)} className={inputClass('date_end')} min={data.date_start || today} />
                                    {errors.date_end && <p className="mt-1 text-xs text-danger">{errors.date_end[0]}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Deskripsi</label>
                                <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} className={inputClass('description') + ' min-h-[80px]'} placeholder="Deskripsi opsional" rows={3} />
                                {errors.description && <p className="mt-1 text-xs text-danger">{errors.description[0]}</p>}
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input type="checkbox" checked={data.is_recurring_yearly} onChange={(e) => setData('is_recurring_yearly', e.target.checked)} className="peer sr-only" />
                                    <div className="h-6 w-11 rounded-full bg-neutral-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-success peer-checked:after:translate-x-full" />
                                </label>
                                <span className="text-sm text-neutral-700">Berulang setiap tahun</span>
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-5">
                                <Button type="button" variant="secondary" onClick={closeModal}>Batal</Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Tambah Hari Libur'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deletingHoliday && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/30" onClick={() => setDeletingHoliday(null)} />
                    <div className="relative z-10 mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-light">
                                <svg className="h-6 w-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold text-neutral-900">Hapus Hari Libur</h3>
                            <p className="mt-2 text-sm text-neutral-500">
                                Apakah Anda yakin ingin menghapus <strong>{deletingHoliday.name}</strong>?
                            </p>
                        </div>
                        <div className="mt-6 flex items-center justify-end gap-3">
                            <Button variant="secondary" onClick={() => setDeletingHoliday(null)}>Batal</Button>
                            <Button variant="danger" onClick={confirmDelete}>Ya, Hapus</Button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
