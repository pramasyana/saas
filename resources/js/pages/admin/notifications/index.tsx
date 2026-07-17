import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Badge from '@/atoms/Badge';
import Select from '@/atoms/Select';
import {
    useAdminNotifications,
    useCreateNotification,
    useUpdateNotification,
    useDeleteNotification,
    useToggleNotification,
} from '@/features/admin/hooks/useAdminNotifications';
import type { AdminNotification, NotificationFilters } from '@/features/admin/hooks/useAdminNotifications';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';
import Modal from '@/molecules/Modal';
import Pagination from '@/molecules/Pagination';

interface Props {
    title: string;
}

const typeConfig: Record<string, { label: string; badge: 'default' | 'success' | 'warning' | 'danger'; icon: string; dot: string }> = {
    info: { label: 'Info', badge: 'default', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', dot: 'bg-primary' },
    warning: { label: 'Warning', badge: 'warning', icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z', dot: 'bg-warning' },
    success: { label: 'Success', badge: 'success', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z', dot: 'bg-success' },
    danger: { label: 'Danger', badge: 'danger', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', dot: 'bg-danger' },
};

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.04 },
    },
};

const itemAnim = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

const emptyForm = { title: '', message: '', type: 'info' as const, active_from: '', active_until: '' };

function BellIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
    );
}

function CheckCircleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function XCircleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function ClockIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function SearchIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
    );
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    );
}

function EyeSlashIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
    );
}

function EyeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function PencilIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
    );
}

function TrashIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
    );
}

function formatDate(dateStr: string | null) {
    if (!dateStr) {
return '-';
}

    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr: string | null) {
    if (!dateStr) {
return '-';
}

    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getRelativeTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);

    if (mins < 1) {
return 'baru saja';
}

    if (mins < 60) {
return `${mins} menit lalu`;
}

    const hours = Math.floor(mins / 60);

    if (hours < 24) {
return `${hours} jam lalu`;
}

    const days = Math.floor(hours / 24);

    if (days < 7) {
return `${days} hari lalu`;
}

    return formatDateTime(dateStr);
}

function isScheduled(n: AdminNotification) {
    return n.active_from && new Date(n.active_from) > new Date();
}

function TableSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="hidden sm:block overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                <div className="border-b border-border px-5 py-3.5">
                    <div className="flex gap-6">
                        <div className="h-4 w-48 rounded bg-neutral-200" />
                        <div className="h-4 w-20 rounded bg-neutral-200" />
                        <div className="h-4 w-16 rounded bg-neutral-200" />
                        <div className="h-4 w-24 rounded bg-neutral-200" />
                        <div className="h-4 w-24 rounded bg-neutral-200" />
                        <div className="h-4 w-20 rounded bg-neutral-200" />
                    </div>
                </div>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-6 border-b border-border px-5 py-4">
                        <div className="w-48 space-y-1">
                            <div className="h-3.5 w-36 rounded bg-neutral-200" />
                            <div className="h-3 w-28 rounded bg-neutral-100" />
                        </div>
                        <div className="h-5 w-16 rounded-full bg-neutral-200" />
                        <div className="h-5 w-14 rounded-full bg-neutral-200" />
                        <div className="h-3.5 w-20 rounded bg-neutral-200" />
                        <div className="h-3.5 w-24 rounded bg-neutral-200" />
                        <div className="flex gap-2">
                            <div className="h-7 w-7 rounded bg-neutral-200" />
                            <div className="h-7 w-7 rounded bg-neutral-200" />
                            <div className="h-7 w-7 rounded bg-neutral-200" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="sm:hidden space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl border border-border bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                            <div className="space-y-2 flex-1">
                                <div className="h-4 w-3/4 rounded bg-neutral-200" />
                                <div className="h-3 w-1/2 rounded bg-neutral-100" />
                            </div>
                            <div className="h-5 w-14 rounded-full bg-neutral-200" />
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                            <div className="h-3 w-20 rounded bg-neutral-100" />
                            <div className="flex gap-2">
                                <div className="h-7 w-7 rounded bg-neutral-200" />
                                <div className="h-7 w-7 rounded bg-neutral-200" />
                                <div className="h-7 w-7 rounded bg-neutral-200" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AdminNotifications({ title }: Props) {
    const [filters, setFilters] = useState<NotificationFilters>({ page: 1, per_page: 15 });
    const { data, isLoading, isError, refetch } = useAdminNotifications(filters);
    const createMutation = useCreateNotification();
    const updateMutation = useUpdateNotification();
    const deleteMutation = useDeleteNotification();
    const toggleMutation = useToggleNotification();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<{ title: string; message: string; type: 'info' | 'warning' | 'success' | 'danger'; active_from: string; active_until: string }>(emptyForm);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const notifications = data?.data ?? [];
    const meta = data?.meta;

    const total = meta?.total ?? 0;
    const activeCount = notifications.filter((n) => n.is_active && !isScheduled(n)).length;
    const inactiveCount = notifications.filter((n) => !n.is_active).length;
    const scheduledCount = notifications.filter((n) => isScheduled(n)).length;

    function resetForm() {
        setForm(emptyForm);
        setEditingId(null);
        setFormErrors({});
    }

    function openCreate() {
        resetForm();
        setModalOpen(true);
    }

    function openEdit(n: AdminNotification) {
        setForm({
            title: n.title,
            message: n.message,
            type: n.type,
            active_from: n.active_from ?? '',
            active_until: n.active_until ?? '',
        });
        setEditingId(n.id);
        setFormErrors({});
        setModalOpen(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormErrors({});
        const payload = {
            ...form,
            active_from: form.active_from || null,
            active_until: form.active_until || null,
        };

        if (editingId) {
            updateMutation.mutate(
                { id: editingId, ...payload },
                {
                    onSuccess: () => {
 resetForm(); setModalOpen(false); 
},
                    onError: (err: any) => {
                        if (err?.response?.data?.errors) {
                            const ve: Record<string, string> = {};

                            for (const [k, msgs] of Object.entries(err.response.data.errors)) {
                                ve[k] = (msgs as string[])[0];
                            }

                            setFormErrors(ve);
                        }
                    },
                },
            );
        } else {
            createMutation.mutate(
                { ...payload, is_active: true },
                {
                    onSuccess: () => {
 resetForm(); setModalOpen(false); 
},
                    onError: (err: any) => {
                        if (err?.response?.data?.errors) {
                            const ve: Record<string, string> = {};

                            for (const [k, msgs] of Object.entries(err.response.data.errors)) {
                                ve[k] = (msgs as string[])[0];
                            }

                            setFormErrors(ve);
                        }
                    },
                },
            );
        }
    }

    function handlePage(page: number) {
        setFilters((prev) => ({ ...prev, page }));
    }

    return (
        <AdminLayout>
            <Head title={title} />

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                <motion.div variants={itemAnim} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Notifikasi</h1>
                        <p className="mt-1 text-sm text-neutral-500">Broadcast notifikasi ke semua tenant.</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark sm:mt-0"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Buat Notifikasi
                    </button>
                </motion.div>

                <motion.div variants={itemAnim} className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    <div className="rounded-xl border border-border bg-white p-3 shadow-sm sm:p-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <BellIcon className="h-3.5 w-3.5 text-neutral-400" />
                            Total
                        </div>
                        <p className="mt-1 text-lg font-bold tracking-tight text-neutral-900 sm:text-xl">
                            {isLoading ? '-' : total}
                        </p>
                        <p className="text-xs text-neutral-400">Semua notifikasi</p>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-3 shadow-sm sm:p-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <CheckCircleIcon className="h-3.5 w-3.5 text-success" />
                            Aktif
                        </div>
                        <p className="mt-1 text-lg font-bold tracking-tight text-success sm:text-xl">
                            {isLoading ? '-' : activeCount}
                        </p>
                        <p className="text-xs text-neutral-400">Sedang tayang</p>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-3 shadow-sm sm:p-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <XCircleIcon className="h-3.5 w-3.5 text-neutral-400" />
                            Nonaktif
                        </div>
                        <p className="mt-1 text-lg font-bold tracking-tight text-neutral-500 sm:text-xl">
                            {isLoading ? '-' : inactiveCount}
                        </p>
                        <p className="text-xs text-neutral-400">Tidak ditampilkan</p>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-3 shadow-sm sm:p-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <ClockIcon className="h-3.5 w-3.5 text-primary" />
                            Terjadwal
                        </div>
                        <p className="mt-1 text-lg font-bold tracking-tight text-primary sm:text-xl">
                            {isLoading ? '-' : scheduledCount}
                        </p>
                        <p className="text-xs text-neutral-400">Akan datang</p>
                    </div>
                </motion.div>

                <motion.div variants={itemAnim} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Cari judul atau pesan..."
                            value={filters.search ?? ''}
                            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value || undefined, page: 1 }))}
                            className="w-full rounded-xl border border-neutral-300 py-2.5 pl-9 pr-4 text-sm shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select
                            value={filters.type ?? ''}
                            onChange={(v) => setFilters((prev) => ({ ...prev, type: v || undefined, page: 1 }))}
                            options={[
                                { value: '', label: 'Semua Tipe' },
                                { value: 'info', label: 'Info' },
                                { value: 'warning', label: 'Warning' },
                                { value: 'success', label: 'Success' },
                                { value: 'danger', label: 'Danger' },
                            ]}
                            placeholder="Filter tipe"
                            className="w-36"
                        />
                        <Select
                            value={filters.is_active ?? ''}
                            onChange={(v) => setFilters((prev) => ({ ...prev, is_active: v || undefined, page: 1 }))}
                            options={[
                                { value: '', label: 'Semua Status' },
                                { value: 'true', label: 'Aktif' },
                                { value: 'false', label: 'Nonaktif' },
                            ]}
                            placeholder="Filter status"
                            className="w-36"
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
                            className="w-24"
                        />
                    </div>
                </motion.div>

                <Modal open={modalOpen} onClose={() => {
 setModalOpen(false); resetForm(); 
}} size="lg">
                    <form onSubmit={handleSubmit}>
                        <div className="border-b border-border px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-semibold text-neutral-900">
                                    {editingId ? 'Edit Notifikasi' : 'Notifikasi Baru'}
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => {
 setModalOpen(false); resetForm(); 
}}
                                    className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="space-y-5 px-6 py-5">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Judul</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                    className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    required
                                />
                                {formErrors.title && <p className="mt-1 text-xs text-danger">{formErrors.title}</p>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Pesan</label>
                                <textarea
                                    value={form.message}
                                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                                    rows={4}
                                    className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    required
                                />
                                {formErrors.message && <p className="mt-1 text-xs text-danger">{formErrors.message}</p>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Tipe</label>
                                <div className="flex gap-3">
                                    {(['info', 'warning', 'success', 'danger'] as const).map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setForm((p) => ({ ...p, type: t }))}
                                            className={cn(
                                                'flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-all',
                                                form.type === t
                                                    ? 'border-primary bg-primary-50 text-primary'
                                                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50',
                                            )}
                                        >
                                            <span className={cn('h-2 w-2 rounded-full', typeConfig[t].dot)} />
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">Mulai</label>
                                    <input
                                        type="datetime-local"
                                        value={form.active_from}
                                        onChange={(e) => setForm((p) => ({ ...p, active_from: e.target.value }))}
                                        className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                    {formErrors.active_from && <p className="mt-1 text-xs text-danger">{formErrors.active_from}</p>}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">Sampai</label>
                                    <input
                                        type="datetime-local"
                                        value={form.active_until}
                                        onChange={(e) => setForm((p) => ({ ...p, active_until: e.target.value }))}
                                        className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                    {formErrors.active_until && <p className="mt-1 text-xs text-danger">{formErrors.active_until}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
                            <button
                                type="button"
                                onClick={() => {
 setModalOpen(false); resetForm(); 
}}
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
                                    : editingId
                                        ? 'Simpan Perubahan'
                                        : 'Buat Notifikasi'}
                            </button>
                        </div>
                    </form>
                </Modal>

                {isLoading ? (
                    <TableSkeleton />
                ) : isError ? (
                    <motion.div variants={itemAnim} className="flex flex-col items-center gap-4 rounded-xl border border-border bg-white px-6 py-16 text-center shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-light text-danger">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-base font-semibold text-neutral-900">Gagal memuat data</p>
                            <p className="mt-1 text-sm text-neutral-500">Terjadi kesalahan saat mengambil daftar notifikasi.</p>
                        </div>
                        <button
                            onClick={() => refetch()}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
                        >
                            Coba Lagi
                        </button>
                    </motion.div>
                ) : notifications.length === 0 ? (
                    <motion.div variants={itemAnim} className="flex flex-col items-center gap-4 rounded-xl border border-border bg-white px-6 py-16 text-center shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                            <BellIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-base font-semibold text-neutral-900">Belum ada notifikasi</p>
                            <p className="mt-1 text-sm text-neutral-500">
                                {filters.search || filters.type || filters.is_active
                                    ? 'Tidak ada notifikasi yang cocok dengan filter yang dipilih.'
                                    : 'Buat notifikasi pertama untuk tenant Anda.'}
                            </p>
                        </div>
                        {(filters.search || filters.type || filters.is_active) && (
                            <button
                                onClick={() => setFilters({ page: 1, per_page: filters.per_page ?? 15 })}
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
                            >
                                Reset Filter
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <>
                        <motion.div variants={itemAnim} className="hidden sm:block overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border bg-neutral-50/80">
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Judul &amp; Pesan</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Tipe</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Dibuat</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Jadwal</th>
                                            <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {notifications.map((n) => {
                                            const tc = typeConfig[n.type] ?? typeConfig.info;
                                            const scheduled = isScheduled(n);

                                            return (
                                                <tr key={n.id} className={cn('transition-colors hover:bg-neutral-50/50', !n.is_active && 'opacity-60')}>
                                                    <td className="px-5 py-4">
                                                        <p className="text-sm font-medium text-neutral-900">{n.title}</p>
                                                        <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500 max-w-xs">{n.message}</p>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <Badge variant={tc.badge}>{tc.label}</Badge>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className={cn('h-1.5 w-1.5 rounded-full', n.is_active ? (scheduled ? 'bg-primary' : 'bg-success') : 'bg-neutral-300')} />
                                                            <span className="text-xs font-medium text-neutral-600">
                                                                {scheduled ? 'Terjadwal' : n.is_active ? 'Aktif' : 'Nonaktif'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className="text-sm text-neutral-600">{getRelativeTime(n.created_at)}</span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className="text-xs text-neutral-500">
                                                            {n.active_from || n.active_until
                                                                ? `${formatDate(n.active_from)} — ${formatDate(n.active_until)}`
                                                                : '-'}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <button
                                                                onClick={() => toggleMutation.mutate(n.id)}
                                                                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                                                                title={n.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                            >
                                                                {n.is_active ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                                            </button>
                                                            <button
                                                                onClick={() => openEdit(n)}
                                                                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                                                title="Edit"
                                                            >
                                                                <PencilIcon className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
 if (confirm('Hapus notifikasi ini?')) {
deleteMutation.mutate(n.id);
} 
}}
                                                                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-danger"
                                                                title="Hapus"
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>

                        <motion.div variants={itemAnim} className="sm:hidden space-y-3">
                            {notifications.map((n) => {
                                const tc = typeConfig[n.type] ?? typeConfig.info;
                                const scheduled = isScheduled(n);

                                return (
                                    <div key={n.id} className={cn('rounded-xl border border-border bg-white p-4 shadow-sm', !n.is_active && 'opacity-60')}>
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="truncate text-sm font-semibold text-neutral-900">{n.title}</p>
                                                    <Badge variant={tc.badge}>{tc.label}</Badge>
                                                </div>
                                                <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">{n.message}</p>
                                            </div>
                                            <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize shrink-0', scheduled ? 'bg-primary-50 text-primary ring-1 ring-inset ring-primary/10' : n.is_active ? 'bg-success-light text-success ring-1 ring-inset ring-success/20' : 'bg-neutral-100 text-neutral-500 ring-1 ring-inset ring-neutral-300')}>
                                                <span className={cn('h-1 w-1 rounded-full', scheduled ? 'bg-primary' : n.is_active ? 'bg-success' : 'bg-neutral-300')} />
                                                {scheduled ? 'Terjadwal' : n.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                                            <div className="text-[11px] text-neutral-400 space-y-0.5">
                                                <p>{getRelativeTime(n.created_at)}</p>
                                                {(n.active_from || n.active_until) && (
                                                    <p>{formatDate(n.active_from)} — {formatDate(n.active_until)}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => toggleMutation.mutate(n.id)}
                                                    className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                                                >
                                                    {n.is_active ? <EyeSlashIcon className="h-3.5 w-3.5" /> : <EyeIcon className="h-3.5 w-3.5" />}
                                                </button>
                                                <button
                                                    onClick={() => openEdit(n)}
                                                    className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                                >
                                                    <PencilIcon className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => {
 if (confirm('Hapus notifikasi ini?')) {
deleteMutation.mutate(n.id);
} 
}}
                                                    className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-danger"
                                                >
                                                    <TrashIcon className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </>
                )}

                {meta && (
                    <motion.div variants={itemAnim}>
                        <Pagination meta={meta} onPageChange={handlePage} />
                    </motion.div>
                )}
            </motion.div>
        </AdminLayout>
    );
}
