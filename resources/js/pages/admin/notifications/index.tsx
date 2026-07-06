import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    useAdminNotifications,
    useCreateNotification,
    useUpdateNotification,
    useDeleteNotification,
    useToggleNotification,
} from '@/features/admin/hooks/useAdminNotifications';
import type { AdminNotification } from '@/features/admin/hooks/useAdminNotifications';
import AdminLayout from '@/layouts/AdminLayout';

interface NotificationsPageProps {
    title: string;
}

const typeStyles: Record<string, string> = {
    info: 'bg-blue-50 text-blue-600 border-blue-200',
    warning: 'bg-warning-light text-warning border-warning/20',
    success: 'bg-success-light text-success border-success/20',
    danger: 'bg-danger-light text-danger border-danger/20',
};

const typeIcons: Record<string, string> = {
    info: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z',
    success: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    danger: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
};

const emptyForm = { title: '', message: '', type: 'info' as const };

export default function AdminNotifications({ title }: NotificationsPageProps) {
    const { data, isLoading, isError } = useAdminNotifications();
    const createMutation = useCreateNotification();
    const updateMutation = useUpdateNotification();
    const deleteMutation = useDeleteNotification();
    const toggleMutation = useToggleNotification();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<{ title: string; message: string; type: 'info' | 'warning' | 'success' | 'danger' }>(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const notifications = data?.data ?? [];

    function resetForm() {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
        setErrors({});
    }

    function openEdit(n: AdminNotification) {
        setForm({ title: n.title, message: n.message, type: n.type });
        setEditingId(n.id);
        setShowForm(true);
        setErrors({});
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrors({});

        if (editingId) {
            updateMutation.mutate(
                { id: editingId, ...form },
                {
                    onSuccess: () => resetForm(),
                    onError: (err: any) => {
                        if (err?.response?.data?.errors) {
                            const ve: Record<string, string> = {};
                            for (const [k, msgs] of Object.entries(err.response.data.errors)) {
                                ve[k] = (msgs as string[])[0];
                            }
                            setErrors(ve);
                        }
                    },
                },
            );
        } else {
            createMutation.mutate(
                { ...form, is_active: true },
                {
                    onSuccess: () => resetForm(),
                    onError: (err: any) => {
                        if (err?.response?.data?.errors) {
                            const ve: Record<string, string> = {};
                            for (const [k, msgs] of Object.entries(err.response.data.errors)) {
                                ve[k] = (msgs as string[])[0];
                            }
                            setErrors(ve);
                        }
                    },
                },
            );
        }
    }

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Notifikasi</h1>
                    <p className="mt-1 text-sm text-neutral-500">Broadcast notifikasi ke semua tenant.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(!showForm); }}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={showForm ? 'M6 18L18 6M6 6l12 12' : 'M12 4.5v15m7.5-7.5h-15'} />
                    </svg>
                    {showForm ? 'Tutup' : 'Buat Notifikasi'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-base font-semibold text-neutral-900">
                        {editingId ? 'Edit Notifikasi' : 'Notifikasi Baru'}
                    </h2>
                    <div className="space-y-5">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Judul</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                required
                            />
                            {errors.title && <p className="mt-1 text-xs text-danger">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Pesan</label>
                            <textarea
                                value={form.message}
                                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                                rows={4}
                                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                required
                            />
                            {errors.message && <p className="mt-1 text-xs text-danger">{errors.message}</p>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Tipe</label>
                            <div className="flex gap-3">
                                {(['info', 'warning', 'success', 'danger'] as const).map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setForm((p) => ({ ...p, type: t }))}
                                        className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-all ${
                                            form.type === t
                                                ? typeStyles[t]
                                                : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={createMutation.isPending || updateMutation.isPending}
                                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
                            >
                                {createMutation.isPending || updateMutation.isPending
                                    ? 'Menyimpan...'
                                    : editingId ? 'Simpan' : 'Buat'}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {isLoading ? (
                <div className="animate-pulse space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-28 rounded-2xl bg-neutral-100" />
                    ))}
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-20 text-center shadow-sm">
                    <p className="text-base font-semibold text-neutral-900">Gagal memuat notifikasi</p>
                </div>
            ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-5 rounded-2xl border border-neutral-200 bg-white px-6 py-20 shadow-sm">
                    <p className="text-base font-semibold text-neutral-900">Belum ada notifikasi</p>
                    <p className="text-sm text-neutral-500">Buat notifikasi pertama untuk tenant Anda.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`rounded-2xl border bg-white p-5 shadow-sm transition-all ${
                                !n.is_active ? 'opacity-60' : ''
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${typeStyles[n.type].split(' ')[0]} ${typeStyles[n.type].split(' ')[1]}`}>
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={typeIcons[n.type]} />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-semibold text-neutral-900">{n.title}</h3>
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                                                n.is_active
                                                    ? 'bg-success-light text-success'
                                                    : 'bg-neutral-100 text-neutral-500'
                                            }`}>
                                                {n.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${typeStyles[n.type]}`}>
                                                {n.type}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-neutral-600 whitespace-pre-wrap">{n.message}</p>
                                        <p className="mt-2 text-xs text-neutral-400">
                                            {new Date(n.created_at).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => toggleMutation.mutate(n.id)}
                                        className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                                        title={n.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            {n.is_active
                                                ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                : <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />}
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => openEdit(n)}
                                        className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                        title="Edit"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => { if (confirm('Hapus notifikasi ini?')) deleteMutation.mutate(n.id); }}
                                        className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-danger"
                                        title="Hapus"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
