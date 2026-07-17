import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import StaffServiceMapping from '@/features/staff/components/StaffServiceMapping';
import { useUpdateStaff } from '@/features/staff/hooks/useStaff';
import type { Staff, StaffFormData } from '@/features/staff/types';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/stores/toast';

interface EditPageProps {
    title: string;
    staff: Staff;
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemAnim = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const avatarColors = [
    'bg-primary text-white',
    'bg-emerald-500 text-white',
    'bg-amber-500 text-white',
    'bg-rose-500 text-white',
    'bg-sky-500 text-white',
    'bg-violet-500 text-white',
];

function getAvatarColor(name: string): string {
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function formatJoined(date: string | null): string {
    if (!date) {
return '-';
}

    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

const inputClass =
    'w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-neutral-50 disabled:text-neutral-500';

export default function Edit({ title, staff }: EditPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const updateMutation = useUpdateStaff();
    const { data: branchesData } = useAllBranches();
    const branches = [
        { value: '', label: 'Semua Cabang' },
        ...(branchesData?.data ?? []).map((b) => ({ value: b.id, label: b.name })),
    ];

    const [form, setForm] = useState<StaffFormData>({
        name: staff.name,
        email: staff.email || '',
        phone: staff.phone || '',
        position: staff.position || '',
        branch_id: staff.branch_id || '',
        hire_date: staff.hire_date || '',
        is_active: staff.is_active,
    });

    const [errors, setErrors] = useState<Record<string, string[]>>({});

    function handleSave() {
        setErrors({});
        updateMutation.mutate(
            { id: staff.id, data: form },
            {
                onSuccess: () => {
                    addToast('success', 'Staff berhasil diperbarui.');
                    router.get('/staff');
                },
                onError: (error: unknown) => {
                    const data = (error as { response?: { data?: { errors?: Record<string, string[]> } } })?.response?.data;

                    if (data?.errors) {
                        setErrors(data.errors);
                    } else {
                        addToast('error', 'Gagal memperbarui staff.');
                    }
                },
            },
        );
    }

    return (
        <TenantLayout>
            <Head title={title} />

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/staff" className="transition-colors hover:text-neutral-700">Staff</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Edit Staff</span>
            </nav>

            <motion.div variants={container} initial="hidden" animate="show">
                {/* Gradient Header */}
                <motion.div variants={itemAnim}>
                    <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                        <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-6 sm:p-8">
                            <div className="flex items-center gap-5">
                                <div
                                    className={cn(
                                        'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold shadow-lg ring-4 ring-white/20',
                                        getAvatarColor(staff.name),
                                    )}
                                >
                                    {getInitials(staff.name)}
                                </div>
                                <div className="min-w-0 text-white">
                                    <h2 className="text-xl font-bold">{staff.name}</h2>
                                    <p className="mt-1 text-sm text-white/80">
                                        {staff.position || 'Tidak ada jabatan'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 sm:grid-cols-4">
                            <div className="px-5 py-4">
                                <p className="text-xs font-medium text-neutral-400">Cabang</p>
                                <p className="mt-1 text-sm font-semibold text-neutral-900">{staff.branch_name || '-'}</p>
                            </div>
                            <div className="px-5 py-4">
                                <p className="text-xs font-medium text-neutral-400">Status</p>
                                <p className={cn('mt-1 text-sm font-semibold', staff.is_active ? 'text-success' : 'text-danger')}>
                                    {staff.is_active ? 'Aktif' : 'Tidak Aktif'}
                                </p>
                            </div>
                            <div className="px-5 py-4">
                                <p className="text-xs font-medium text-neutral-400">Bergabung</p>
                                <p className="mt-1 text-sm font-semibold text-neutral-900">{formatJoined(staff.hire_date || staff.created_at)}</p>
                            </div>
                            <div className="px-5 py-4">
                                <p className="text-xs font-medium text-neutral-400">Email</p>
                                <p className="mt-1 truncate text-sm font-semibold text-neutral-900">{staff.email || '-'}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Informasi Pribadi */}
                <motion.div variants={itemAnim}>
                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white shadow-sm">
                        <div className="border-b border-neutral-200 px-6 py-5 sm:px-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary ring-1 ring-inset ring-primary/10">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-neutral-900">Informasi Pribadi</h3>
                                    <p className="text-sm text-neutral-500">Data dasar staff.</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 sm:p-8">
                            {errors._general && (
                                <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
                                    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                    <span>{errors._general.join(', ')}</span>
                                </div>
                            )}

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                        Nama Lengkap <span className="ml-0.5 text-danger">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                            <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className={cn(inputClass, 'pl-10', errors.name && 'border-danger focus:border-danger focus:ring-danger/30')}
                                            placeholder="Nama lengkap"
                                        />
                                    </div>
                                    {errors.name && <p className="mt-1 text-xs text-danger">{errors.name[0]}</p>}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">Email</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                            <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                            </svg>
                                        </div>
                                        <input
                                            type="email"
                                            value={form.email || ''}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className={cn(inputClass, 'pl-10', errors.email && 'border-danger focus:border-danger focus:ring-danger/30')}
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    {errors.email && <p className="mt-1 text-xs text-danger">{errors.email[0]}</p>}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">Telepon</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                            <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={form.phone || ''}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            className={cn(inputClass, 'pl-10', errors.phone && 'border-danger focus:border-danger focus:ring-danger/30')}
                                            placeholder="0812xxxx"
                                        />
                                    </div>
                                    {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone[0]}</p>}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">Jabatan</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                            <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={form.position || ''}
                                            onChange={(e) => setForm({ ...form, position: e.target.value })}
                                            className={cn(inputClass, 'pl-10')}
                                            placeholder="Staff"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">Cabang</label>
                                    <select
                                        value={form.branch_id || ''}
                                        onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
                                        className={cn(inputClass, 'appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2024%2024%27%20stroke-width%3D%272%27%20stroke%3D%27%236b7280%27%3E%3Cpath%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20d%3D%27M19.5%208.25l-7.5%207.5-7.5-7.5%27/%3E%3C/svg%3E")] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10')}
                                    >
                                        {branches.filter((b) => b.value !== '').map((b) => (
                                            <option key={b.value} value={b.value}>{b.label}</option>
                                        ))}
                                        <option value="">Semua Cabang</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">Tanggal Masuk</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                            <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                            </svg>
                                        </div>
                                        <input
                                            type="date"
                                            value={form.hire_date || ''}
                                            onChange={(e) => setForm({ ...form, hire_date: e.target.value })}
                                            className={cn(inputClass, 'pl-10')}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Status Toggle */}
                            <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4 transition-all duration-200 hover:border-primary/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={cn(
                                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300',
                                                form.is_active ? 'bg-success text-white shadow-sm' : 'bg-neutral-200 text-neutral-400',
                                            )}
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">Status Aktif</p>
                                            <p className="mt-0.5 text-xs text-neutral-500">
                                                {form.is_active ? 'Staff ini aktif dan menerima booking.' : 'Staff ini tidak aktif.'}
                                            </p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            checked={form.is_active ?? true}
                                            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                            className="peer sr-only"
                                        />
                                        <div className="h-6 w-10 rounded-full border border-neutral-300 bg-neutral-200 transition-all peer-checked:border-success peer-checked:bg-success" />
                                        <div
                                            className={cn(
                                                'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
                                                form.is_active ? 'translate-x-4' : 'translate-x-0',
                                            )}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-6">
                                <Link
                                    href="/staff"
                                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                    Kembali
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={updateMutation.isPending}
                                    className={cn(
                                        'inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30',
                                        updateMutation.isPending
                                            ? 'cursor-not-allowed bg-primary/60'
                                            : 'bg-primary hover:bg-primary-dark hover:shadow-md',
                                    )}
                                >
                                    {updateMutation.isPending ? (
                                        <>
                                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            Simpan Perubahan
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Layanan Staff */}
                <motion.div variants={itemAnim}>
                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white shadow-sm">
                        <div className="border-b border-neutral-200 px-6 py-5 sm:px-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary ring-1 ring-inset ring-primary/10">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.049.58.026 1.193-.14 1.743" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-neutral-900">Layanan yang Ditangani</h3>
                                    <p className="text-sm text-neutral-500">Pilih layanan dan atur persentase incentive per staff.</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 sm:p-8">
                            <StaffServiceMapping staffId={staff.id} />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </TenantLayout>
    );
}
