import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/atoms/Button';
import MembershipPlanForm from '@/features/crm/components/MembershipPlanForm';
import { useCreateMembershipPlan } from '@/features/crm/hooks/useMembershipPlans';
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

export default function CreateMembershipPlanPage() {
    const addToast = useToastStore((s) => s.addToast);
    const createMutation = useCreateMembershipPlan();
    const [submitted, setSubmitted] = useState(false);

    const errors = extractErrors(createMutation.error);

    function handleSave(data: CustomerMembershipPlanFormData) {
        createMutation.mutate(data, {
            onSuccess: () => {
                addToast('success', 'Paket membership berhasil ditambahkan.');
                setSubmitted(true);
            },
        });
    }

    if (submitted) {
        return (
            <TenantLayout>
                <Head title="Tambah Paket Membership" />

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
                            <span className="font-medium text-neutral-900">Tambah</span>
                        </nav>
                    </motion.div>

                    <motion.div variants={itemAnim} className="flex flex-col items-center justify-center py-20">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-success-50">
                            <svg className="h-10 w-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-xl font-bold text-neutral-900">Paket berhasil ditambahkan!</h2>
                        <p className="mt-2 text-sm text-neutral-500">Paket membership sudah tersedia dan bisa dibeli pelanggan.</p>
                        <div className="mt-8 flex gap-3">
                            <Link href="/crm/membership-plans">
                                <Button variant="secondary">Kembali ke Daftar</Button>
                            </Link>
                            <Link href="/crm/membership-plans/create">
                                <Button>Tambah Lagi</Button>
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </TenantLayout>
        );
    }

    return (
        <TenantLayout>
            <Head title="Tambah Paket Membership" />

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
                        <span className="font-medium text-neutral-900">Tambah</span>
                    </nav>
                </motion.div>

                <motion.div variants={itemAnim} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Tambah Paket Membership</h1>
                        <p className="mt-1 text-sm text-neutral-500">Buat paket membership baru untuk pelanggan.</p>
                    </div>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-3">
                    <motion.div variants={itemAnim} className="lg:col-span-2">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <MembershipPlanForm
                                plan={null}
                                saving={createMutation.isPending}
                                errors={errors}
                                onSave={handleSave}
                                onCancel={() => window.history.back()}
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemAnim} className="space-y-6">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-neutral-900">Tips Pengaturan</h3>
                                    <p className="text-xs text-neutral-500">Panduan singkat</p>
                                </div>
                            </div>
                            <ul className="mt-4 space-y-3">
                                <li className="flex gap-2.5 text-xs text-neutral-600">
                                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[10px] font-bold text-primary">1</span>
                                    Buat paket dengan nama yang jelas dan harga kompetitif.
                                </li>
                                <li className="flex gap-2.5 text-xs text-neutral-600">
                                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[10px] font-bold text-primary">2</span>
                                    Tambahkan keuntungan yang menarik untuk meningkatkan konversi.
                                </li>
                                <li className="flex gap-2.5 text-xs text-neutral-600">
                                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[10px] font-bold text-primary">3</span>
                                    Paket aktif akan muncul saat customer akan membeli membership.
                                </li>
                            </ul>
                        </div>

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
                                <li>• Harga akan di-snapshot saat customer melakukan pembelian.</li>
                                <li>• Perubahan harga tidak mempengaruhi subscription aktif.</li>
                                <li>• Subscription otomatis berakhir sesuai durasi yang ditentukan.</li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </TenantLayout>
    );
}
