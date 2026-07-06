import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useAdminProfile, useUpdateAdminProfile } from '@/features/admin/hooks/useAdminProfile';
import AdminLayout from '@/layouts/AdminLayout';

interface ProfilePageProps {
    title: string;
}

export default function AdminProfile({ title }: ProfilePageProps) {
    const { data: profile, isLoading } = useAdminProfile();
    const mutation = useUpdateAdminProfile();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (profile) {
            setName(profile.name);
            setEmail(profile.email);
        }
    }, [profile]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrors({});

        mutation.mutate(
            {
                name,
                email,
                ...(newPassword ? {
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: newPasswordConfirmation,
                } : {}),
            },
            {
                onSuccess: () => {
                    setCurrentPassword('');
                    setNewPassword('');
                    setNewPasswordConfirmation('');
                },
                onError: (err: any) => {
                    if (err?.response?.data?.errors) {
                        const validationErrors: Record<string, string> = {};
                        for (const [key, msgs] of Object.entries(err.response.data.errors)) {
                            validationErrors[key] = (msgs as string[])[0];
                        }
                        setErrors(validationErrors);
                    }
                },
            },
        );
    }

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Profil Saya</h1>
                <p className="mt-1 text-sm text-neutral-500">Kelola informasi akun admin Anda.</p>
            </div>

            <div className="mx-auto max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-base font-semibold text-neutral-900">Informasi Dasar</h2>
                        <div className="space-y-5">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Nama</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                                {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                                {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-1 text-base font-semibold text-neutral-900">Ganti Password</h2>
                        <p className="mb-5 text-sm text-neutral-500">Kosongkan jika tidak ingin mengubah password.</p>
                        <div className="space-y-5">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Password Saat Ini</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                                {errors.current_password && <p className="mt-1 text-xs text-danger">{errors.current_password}</p>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Password Baru</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                                {errors.new_password && <p className="mt-1 text-xs text-danger">{errors.new_password}</p>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Konfirmasi Password Baru</label>
                                <input
                                    type="password"
                                    value={newPasswordConfirmation}
                                    onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                                    className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.get('/admin/dashboard')}
                            className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
                        >
                            {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
