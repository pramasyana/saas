import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';
import TenantSubNav from '@/molecules/TenantSubNav';
import { useToastStore } from '@/stores/toast';

interface Branch {
    id: string;
    name: string;
    slug: string;
    is_default: boolean;
    address: string | null;
    phone: string | null;
    email: string | null;
    whatsapp: string | null;
    manager_name: string | null;
    is_active: boolean;
    created_at: string;
}

interface Props {
    tenant_id: string;
    tenant_name?: string | null;
    tenant_email?: string | null;
    branches: {
        data: Branch[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
}

export default function CompanyBranches({ tenant_id, tenant_name, tenant_email, branches }: Props) {
    const addToast = useToastStore((s) => s.addToast);
    const [showModal, setShowModal] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);
    const [search, setSearch] = useState('');

    const isEditing = !!editingBranch;

    const { data, setData, post, put, errors, processing, reset } = useForm({
        name: '',
        slug: '',
        address: '',
        phone: '',
        email: '',
        whatsapp: '',
        manager_name: '',
        is_active: true,
        sort_order: 0,
    });

    function openCreate() {
        setEditingBranch(null);
        reset();
        setShowModal(true);
    }

    function openEdit(branch: Branch) {
        setEditingBranch(branch);
        setData({
            name: branch.name,
            slug: branch.slug,
            address: branch.address ?? '',
            phone: branch.phone ?? '',
            email: branch.email ?? '',
            whatsapp: branch.whatsapp ?? '',
            manager_name: branch.manager_name ?? '',
            is_active: branch.is_active,
            sort_order: branch.sort_order,
        });
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setEditingBranch(null);
        reset();
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (isEditing && editingBranch) {
            put(`/admin/tenants/${tenant_id}/company/branches/${editingBranch.id}`, {
                onSuccess: () => {
                    addToast('success', 'Cabang berhasil diperbarui.');
                    closeModal();
                },
            });
        } else {
            post(`/admin/tenants/${tenant_id}/company/branches`, {
                onSuccess: () => {
                    addToast('success', 'Cabang berhasil ditambahkan.');
                    closeModal();
                },
            });
        }
    }

    function confirmDelete() {
        if (!deletingBranch) {
return;
}

        router.delete(`/admin/tenants/${tenant_id}/company/branches/${deletingBranch.id}`, {
            onSuccess: () => {
                addToast('success', 'Cabang berhasil dihapus.');
                setDeletingBranch(null);
            },
        });
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get(`/admin/tenants/${tenant_id}/company/branches`, { search, page: 1 });
    }

    function goToPage(page: number) {
        router.get(`/admin/tenants/${tenant_id}/company/branches`, { search, page });
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

    return (
        <AdminLayout>
            <Head title="Cabang" />

            <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/admin/dashboard" className="transition-colors hover:text-neutral-700">Dashboard</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <Link href="/admin/tenants" className="transition-colors hover:text-neutral-700">Tenants</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Cabang</span>
            </nav>

            <TenantSubNav tenantId={tenant_id} tenantName={tenant_name} tenantEmail={tenant_email} />

            <div className="mt-6 mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-neutral-900">Cabang</h1>
                    <p className="mt-1 text-sm text-neutral-500">Total {branches.total} cabang terdaftar.</p>
                </div>
                <Button onClick={openCreate}>
                    <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Tambah Cabang
                </Button>
            </div>

            <FadeIn delay={0.03}>
                <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
                    <div className="border-b border-neutral-100 px-6 py-4">
                        <form onSubmit={handleSearch} className="flex items-center gap-3">
                            <div className="relative flex-1 max-w-xs">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari cabang..."
                                    className="w-full rounded-lg border border-neutral-300 py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                            <Button type="submit" variant="secondary" size="sm">Cari</Button>
                        </form>
                    </div>

                    {branches.data.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-16">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                                <svg className="h-7 w-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-neutral-900">Belum ada cabang</p>
                            <p className="text-sm text-neutral-500">Tambahkan cabang baru untuk memulai.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-neutral-100">
                                    <thead>
                                        <tr className="border-b border-neutral-100">
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Cabang</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Kontak</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Manajer</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                            <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-50">
                                        {branches.data.map((branch) => (
                                            <tr key={branch.id} className="transition-colors hover:bg-neutral-50">
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary">
                                                            {branch.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-neutral-900">{branch.name}</p>
                                                            <p className="text-xs text-neutral-500">{branch.slug}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="space-y-0.5">
                                                        {branch.email && <p className="text-sm text-neutral-600">{branch.email}</p>}
                                                        {branch.phone && <p className="text-sm text-neutral-500">{branch.phone}</p>}
                                                        {!branch.email && !branch.phone && <span className="text-sm text-neutral-400">-</span>}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">
                                                    {branch.manager_name || <span className="text-neutral-400">-</span>}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className={cn(
                                                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                                        branch.is_active
                                                            ? 'bg-success-light text-success'
                                                            : 'bg-neutral-100 text-neutral-500',
                                                    )}>
                                                        {branch.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                                    <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5">
                                                        <button
                                                            onClick={() => openEdit(branch)}
                                                            className="inline-flex h-7 w-7 items-center justify-center rounded text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                                            title="Edit"
                                                        >
                                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                            </svg>
                                                        </button>
                                                        {!branch.is_default && (
                                                            <>
                                                                <div className="h-4 w-px bg-neutral-200" />
                                                                <button
                                                                    onClick={() => setDeletingBranch(branch)}
                                                                    className="inline-flex h-7 w-7 items-center justify-center rounded text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger"
                                                                    title="Hapus"
                                                                >
                                                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                    </svg>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {branches.last_page > 1 && (
                                <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4">
                                    <p className="text-sm text-neutral-500">
                                        Menampilkan halaman {branches.current_page} dari {branches.last_page} ({branches.total} data)
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => goToPage(branches.current_page - 1)}
                                            disabled={branches.current_page <= 1}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                            </svg>
                                        </button>
                                        {Array.from({ length: branches.last_page }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={cn(
                                                    'inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                                                    page === branches.current_page
                                                        ? 'bg-primary text-white shadow-sm'
                                                        : 'text-neutral-600 hover:bg-neutral-100',
                                                )}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => goToPage(branches.current_page + 1)}
                                            disabled={branches.current_page >= branches.last_page}
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
                    <div className="relative z-10 mx-4 w-full max-w-lg rounded-xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                            <h2 className="text-base font-semibold text-neutral-900">
                                {isEditing ? 'Edit Cabang' : 'Tambah Cabang'}
                            </h2>
                            <button onClick={closeModal} className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 p-6 max-h-[70vh] overflow-y-auto">
                            {errors._general && (
                                <div className="flex items-center gap-2.5 rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
                                    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                    <span>{errors._general[0]}</span>
                                </div>
                            )}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700">Nama Cabang *</label>
                                    <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className={inputClass('name')} placeholder="Cabang Utama" />
                                    {errors.name && <p className="mt-1 text-xs text-danger">{errors.name[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700">Slug *</label>
                                    <input type="text" value={data.slug} onChange={(e) => setData('slug', e.target.value)} className={inputClass('slug')} placeholder="cabang-utama" />
                                    {errors.slug && <p className="mt-1 text-xs text-danger">{errors.slug[0]}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Alamat</label>
                                <textarea value={data.address} onChange={(e) => setData('address', e.target.value)} className={inputClass('address') + ' min-h-[80px]'} placeholder="Alamat lengkap cabang" rows={3} />
                                {errors.address && <p className="mt-1 text-xs text-danger">{errors.address[0]}</p>}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700">Email</label>
                                    <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass('email')} placeholder="email@cabang.com" />
                                    {errors.email && <p className="mt-1 text-xs text-danger">{errors.email[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700">Telepon</label>
                                    <input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className={inputClass('phone')} placeholder="021-12345678" />
                                    {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700">WhatsApp</label>
                                    <input type="text" value={data.whatsapp} onChange={(e) => setData('whatsapp', e.target.value)} className={inputClass('whatsapp')} placeholder="+6281234567890" />
                                    {errors.whatsapp && <p className="mt-1 text-xs text-danger">{errors.whatsapp[0]}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700">Nama Manajer</label>
                                    <input type="text" value={data.manager_name} onChange={(e) => setData('manager_name', e.target.value)} className={inputClass('manager_name')} placeholder="John Doe" />
                                    {errors.manager_name && <p className="mt-1 text-xs text-danger">{errors.manager_name[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700">Status</label>
                                    <div className="mt-1.5 flex items-center gap-3">
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="peer sr-only" />
                                            <div className="h-6 w-11 rounded-full bg-neutral-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-success peer-checked:after:translate-x-full" />
                                        </label>
                                        <span className="text-sm text-neutral-600">{data.is_active ? 'Aktif' : 'Nonaktif'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-5">
                                <Button type="button" variant="secondary" onClick={closeModal}>Batal</Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Tambah Cabang'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deletingBranch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/30" onClick={() => setDeletingBranch(null)} />
                    <div className="relative z-10 mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-light">
                                <svg className="h-6 w-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold text-neutral-900">Hapus Cabang</h3>
                            <p className="mt-2 text-sm text-neutral-500">
                                Apakah Anda yakin ingin menghapus <strong>{deletingBranch.name}</strong>?
                            </p>
                        </div>
                        <div className="mt-6 flex items-center justify-end gap-3">
                            <Button variant="secondary" onClick={() => setDeletingBranch(null)}>Batal</Button>
                            <Button variant="danger" onClick={confirmDelete}>Ya, Hapus</Button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
