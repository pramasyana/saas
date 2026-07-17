import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useState } from 'react';
import MembershipPlanForm from '@/features/crm/components/MembershipPlanForm';
import { useMembershipPlan, useUpdateMembershipPlan } from '@/features/crm/hooks/useMembershipPlans';
import type { CustomerMembershipPlanFormData } from '@/features/crm/types';
import TenantLayout from '@/layouts/TenantLayout';
import { useToastStore } from '@/stores/toast';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemAnim = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

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

interface EditMembershipPlanPageProps {
    planId: string;
}

export default function EditMembershipPlanPage({ planId }: EditMembershipPlanPageProps) {
    const addToast = useToastStore((s) => s.addToast);

    const { data: planData, isLoading, isError, error } = useMembershipPlan(planId);
    const updateMutation = useUpdateMembershipPlan();

    const plan = planData?.data;
    const errors = extractErrors(updateMutation.error);

    function handleSave(formData: CustomerMembershipPlanFormData) {
        updateMutation.mutate(
            { id: planId, data: formData },
            {
                onSuccess: () => {
                    addToast('success', 'Paket membership berhasil diperbarui.');
                },
            },
        );
    }

    return (
        <TenantLayout>
            <Head title="Edit Paket Membership" />

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                <motion.div variants={itemAnim}>
                    <nav className="flex items-center gap-2 text-sm text-neutral-500">
                        <Link href="/crm/membership-plans" className="hover:text-neutral-700">CRM</Link>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        <Link href="/crm/membership-plans" className="hover:text-neutral-700">Paket Membership</Link>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        <span className="font-medium text-neutral-900">Edit</span>
                    </nav>
                </motion.div>

                {isLoading ? (
                    <motion.div variants={itemAnim} className="animate-pulse">
                        <div className="mb-6 h-8 w-48 rounded bg-neutral-200" />
                        <div className="h-96 rounded-2xl bg-neutral-100" />
                    </motion.div>
                ) : isError || !plan ? (
                    <motion.div variants={itemAnim} className="flex flex-col items-center gap-4 py-20 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-50">
                            <svg className="h-8 w-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-base font-semibold text-neutral-900">Gagal memuat paket</p>
                            <p className="mt-1 text-sm text-neutral-500">{(error as Error)?.message || 'Paket tidak ditemukan.'}</p>
                        </div>
                        <Link href="/crm/membership-plans" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark">
                            Kembali
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        {/* Summary Card */}
                        <motion.div variants={itemAnim} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                            <div className="bg-gradient-to-r from-primary to-primary-light px-6 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-2xl font-bold text-white shadow-sm backdrop-blur-sm">
                                        {plan.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">{plan.name}</h2>
                                        <p className="text-sm text-white/80">
                                            Rp {plan.price.toLocaleString('id-ID')} / {plan.billing_interval === 'yearly' ? 'tahun' : 'bulan'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid gap-8 lg:grid-cols-3">
                            <motion.div variants={itemAnim} className="lg:col-span-2">
                                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                                    <MembershipPlanForm
                                        plan={plan}
                                        saving={updateMutation.isPending}
                                        errors={errors}
                                        onSave={handleSave}
                                        onCancel={() => window.history.back()}
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemAnim} className="space-y-6">
                                <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                                            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-neutral-900">Informasi</h3>
                                            <p className="text-xs text-neutral-500">Yang perlu diketahui</p>
                                        </div>
                                    </div>
                                    <ul className="mt-4 space-y-2 text-xs text-neutral-500">
                                        <li>• Perubahan harga hanya berlaku untuk subscription baru.</li>
                                        <li>• Subscription aktif tidak terpengaruh oleh perubahan harga.</li>
                                        <li>• Nonaktifkan paket untuk menyembunyikannya dari pembelian baru.</li>
                                    </ul>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </motion.div>
        </TenantLayout>
    );
}
