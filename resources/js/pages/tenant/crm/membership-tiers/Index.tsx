import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import MembershipTierDeleteDialog from '@/features/crm/components/MembershipTierDeleteDialog';
import MembershipTierForm from '@/features/crm/components/MembershipTierForm';
import {
    useCreateMembershipTier,
    useDeleteMembershipTier,
    useMembershipTiers,
    useUpdateMembershipTier,
} from '@/features/crm/hooks/useMembershipTiers';
import type { MembershipTier, MembershipTierFormData } from '@/features/crm/types';
import TenantLayout from '@/layouts/TenantLayout';
import { useToastStore } from '@/stores/toast';

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

export default function MembershipTiersIndexPage() {
    const addToast = useToastStore((s) => s.addToast);

    const [formOpen, setFormOpen] = useState(false);
    const [editingTier, setEditingTier] = useState<MembershipTier | null>(null);
    const [tierToDelete, setTierToDelete] = useState<MembershipTier | null>(null);

    const { data, isLoading, isError, error } = useMembershipTiers({ per_page: 100 });
    const createMutation = useCreateMembershipTier();
    const updateMutation = useUpdateMembershipTier();
    const deleteMutation = useDeleteMembershipTier();

    const tiers = data?.data ?? [];

    const formErrors = extractErrors(createMutation.error || updateMutation.error);
    const saving = createMutation.isPending || updateMutation.isPending;

    function openCreate() {
        setEditingTier(null);
        createMutation.reset();
        updateMutation.reset();
        setFormOpen(true);
    }

    function openEdit(tier: MembershipTier) {
        setEditingTier(tier);
        createMutation.reset();
        updateMutation.reset();
        setFormOpen(true);
    }

    function closeForm() {
        setFormOpen(false);
        setEditingTier(null);
    }

    function handleSave(formData: MembershipTierFormData) {
        if (editingTier) {
            updateMutation.mutate(
                { id: editingTier.id, data: formData },
                {
                    onSuccess: () => {
                        addToast('success', 'Tier berhasil diperbarui.');
                        closeForm();
                    },
                },
            );
        } else {
            createMutation.mutate(formData, {
                onSuccess: () => {
                    addToast('success', 'Tier berhasil ditambahkan.');
                    closeForm();
                },
            });
        }
    }

    function handleDelete() {
        if (!tierToDelete) {
return;
}

        deleteMutation.mutate(tierToDelete.id, {
            onSuccess: () => {
                setTierToDelete(null);
                addToast('success', 'Tier berhasil dihapus.');
            },
        });
    }

    const deleteError = extractMessage(deleteMutation.error);

    return (
        <TenantLayout>
            <Head title="Membership Tiers" />

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <span className="text-neutral-400">CRM</span>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Membership Tiers</span>
            </nav>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Membership Tiers</h1>
                    <p className="mt-1 text-sm text-neutral-500">Kelola tingkat membership pelanggan.</p>
                </div>
                <Button onClick={openCreate} className="shrink-0">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Tambah Tier
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <FadeIn className="lg:col-span-2" delay={0.05}>
                    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                        {isError ? (
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
                        ) : isLoading ? (
                            <div className="animate-pulse p-6">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center gap-4 py-4">
                                        <div className="h-8 w-8 rounded-full bg-neutral-200" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-32 rounded bg-neutral-200" />
                                            <div className="h-3 w-20 rounded bg-neutral-100" />
                                        </div>
                                        <div className="h-6 w-16 rounded-full bg-neutral-200" />
                                        <div className="flex gap-2">
                                            <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                                            <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : tiers.length === 0 ? (
                            <div className="flex flex-col items-center gap-5 px-6 py-20">
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-100">
                                    <svg className="h-10 w-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-base font-semibold text-neutral-900">Belum ada tier</p>
                                    <p className="mt-1 text-sm text-neutral-500">Buat tier membership pertama untuk memulai.</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={openCreate}>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Tambah Tier
                                </Button>
                            </div>
                        ) : (
                            <div className="divide-y divide-neutral-100">
                                {tiers.map((tier) => (
                                    <div key={tier.id} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-neutral-50">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-sm font-bold text-primary">
                                            {tier.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-neutral-900">{tier.name}</p>
                                            <p className="text-xs text-neutral-500">
                                                {tier.min_points.toLocaleString()} pts · Rp {tier.min_total_spent.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                        <Badge variant={tier.is_active ? 'success' : 'danger'}>
                                            {tier.is_active ? 'Aktif' : 'Nonaktif'}
                                        </Badge>
                                        <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                                            <button
                                                onClick={() => openEdit(tier)}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                                title="Edit tier"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </button>
                                            <div className="h-5 w-px bg-neutral-200" />
                                            <button
                                                onClick={() => setTierToDelete(tier)}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger"
                                                title="Hapus tier"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </FadeIn>

                <FadeIn delay={0.1}>
                    {formOpen && (
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <MembershipTierForm
                                tier={editingTier}
                                saving={saving}
                                errors={formErrors}
                                onSave={handleSave}
                                onCancel={closeForm}
                            />
                        </div>
                    )}
                </FadeIn>
            </div>

            {tierToDelete && (
                <MembershipTierDeleteDialog
                    open={!!tierToDelete}
                    tier={tierToDelete}
                    deleting={deleteMutation.isPending}
                    error={deleteError}
                    onClose={() => {
 setTierToDelete(null); deleteMutation.reset(); 
}}
                    onConfirm={handleDelete}
                />
            )}
        </TenantLayout>
    );
}
