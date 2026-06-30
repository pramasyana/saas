import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import Button from '@/atoms/Button';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/features/users/hooks/useUsers';
import UserTable from '@/features/users/components/UserTable';
import UserFormModal from '@/features/users/components/UserFormModal';
import UserDeleteDialog from '@/features/users/components/UserDeleteDialog';
import { useToastStore } from '@/stores/toast';
import type { User, UserFilters, UserFormData } from '@/features/users/types';

interface UsersPageProps {
    title: string;
}

function extractErrors(error: unknown): Record<string, string[]> {
    if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as Record<string, unknown>;
        if (data.errors && typeof data.errors === 'object') {
            return data.errors as Record<string, string[]>;
        }
        if (data.message && typeof data.message === 'string') {
            return { _general: [data.message] };
        }
    }
    return {};
}

function extractMessage(error: unknown): string {
    if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as { message?: string };
        return data.message || 'Terjadi kesalahan.';
    }
    return 'Terjadi kesalahan.';
}

export default function Users({ title }: UsersPageProps) {
    const { auth } = usePage().props as { auth: { user: { id: number } } };
    const addToast = useToastStore((s) => s.addToast);
    const [filters, setFilters] = useState<UserFilters>({
        page: 1,
        per_page: 15,
        search: '',
    });
    const [searchInput, setSearchInput] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const { data, isLoading, isError, error } = useUsers(filters);
    const createMutation = useCreateUser();
    const updateMutation = useUpdateUser();
    const deleteMutation = useDeleteUser();

    const formErrors = extractErrors(createMutation.error || updateMutation.error);
    const deleteError = extractMessage(deleteMutation.error);

    function handleSearch() {
        setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }

    function handlePage(page: number) {
        setFilters((prev) => ({ ...prev, page }));
    }

    function openCreate() {
        setSelectedUser(null);
        createMutation.reset();
        updateMutation.reset();
        setFormOpen(true);
    }

    function openEdit(user: User) {
        setSelectedUser(user);
        createMutation.reset();
        updateMutation.reset();
        setFormOpen(true);
    }

    function openDelete(user: User) {
        setUserToDelete(user);
        deleteMutation.reset();
        setDeleteOpen(true);
    }

    function handleSave(formData: UserFormData) {
        if (selectedUser) {
            updateMutation.mutate(
                { id: selectedUser.id, data: formData },
                {
                    onSuccess: () => {
                        setFormOpen(false);
                        addToast('success', 'User berhasil diperbarui.');
                    },
                },
            );
        } else {
            createMutation.mutate(formData, {
                onSuccess: () => {
                    setFormOpen(false);
                    addToast('success', 'User berhasil ditambahkan.');
                },
            });
        }
    }

    function handleDelete() {
        if (!userToDelete) return;
        deleteMutation.mutate(userToDelete.id, {
            onSuccess: () => {
                setDeleteOpen(false);
                setUserToDelete(null);
                addToast('success', 'User berhasil dihapus.');
            },
        });
    }

    const users = data?.data ?? [];
    const meta = data?.meta;

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Manajemen User</h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Kelola semua user yang terdaftar di sistem.
                    </p>
                </div>
                <Button onClick={openCreate}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Tambah User
                </Button>
            </div>

            <div className="mb-4 flex gap-2">
                <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Cari nama atau email..."
                        className="w-full rounded-lg border border-neutral-300 py-2 pl-10 pr-3 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
                <select
                    value={filters.is_admin ?? ''}
                    onChange={(e) => setFilters((prev) => ({ ...prev, is_admin: e.target.value || undefined }))}
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    <option value="">Semua Role</option>
                    <option value="1">Admin</option>
                    <option value="0">User</option>
                </select>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
                {isError ? (
                    <div className="flex flex-col items-center gap-2 py-12 text-center">
                        <span className="text-sm text-danger">Gagal memuat data: {(error as Error)?.message}</span>
                    </div>
                ) : isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <svg className="h-6 w-6 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    </div>
                ) : (
                    <UserTable users={users} currentUserId={auth.user.id} onEdit={openEdit} onDelete={openDelete} />
                )}

                {meta && meta.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
                        <p className="text-sm text-neutral-500">
                            Halaman {meta.current_page} dari {meta.last_page} ({meta.total} total)
                        </p>
                        <div className="flex gap-1">
                            <button
                                disabled={meta.current_page <= 1}
                                onClick={() => handlePage(meta.current_page - 1)}
                                className="rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Prev
                            </button>
                            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePage(page)}
                                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                        page === meta.current_page
                                            ? 'bg-primary text-white'
                                            : 'text-neutral-600 hover:bg-neutral-100'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                disabled={meta.current_page >= meta.last_page}
                                onClick={() => handlePage(meta.current_page + 1)}
                                className="rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <UserFormModal
                open={formOpen}
                user={selectedUser}
                saving={createMutation.isPending || updateMutation.isPending}
                errors={formErrors}
                onClose={() => {
                    setFormOpen(false);
                    createMutation.reset();
                    updateMutation.reset();
                }}
                onSave={handleSave}
            />

            {userToDelete && (
                <UserDeleteDialog
                    open={deleteOpen}
                    user={userToDelete}
                    deleting={deleteMutation.isPending}
                    error={deleteError}
                    onClose={() => {
                        setDeleteOpen(false);
                        setUserToDelete(null);
                        deleteMutation.reset();
                    }}
                    onConfirm={handleDelete}
                />
            )}
        </AdminLayout>
    );
}
