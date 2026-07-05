import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import RoomForm from '@/features/rooms/components/RoomForm';
import { useRoom, useUpdateRoom } from '@/features/rooms/hooks/useRooms';
import type { RoomFormData } from '@/features/rooms/types';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/stores/toast';

interface Props {
    id: string;
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

export default function RoomEdit({ id }: Props) {
    const addToast = useToastStore((s) => s.addToast);
    const { data: roomData, isLoading } = useRoom(id);
    const updateMutation = useUpdateRoom();
    const [saving, setSaving] = useState(false);
    const errors = extractErrors(updateMutation.error);
    const [data, setData] = useState<RoomFormData | null>(null);

    const room = roomData?.data;
    const formData = data ?? room ? {
        name: room?.name ?? '',
        description: room?.description ?? '',
        capacity: room?.capacity ?? undefined,
        color: room?.color ?? '#7C3AED',
        branch_id: room?.branch_id ?? undefined,
        is_active: room?.is_active ?? true,
    } : null;

    function handleSave() {
        if (!formData) {
return;
}

        setSaving(true);
        updateMutation.mutate(
            { id, data: formData },
            {
                onSuccess: () => {
                    addToast('success', 'Ruangan berhasil diperbarui.');
                    router.get('/company/rooms');
                },
                onSettled: () => {
                    setSaving(false);
                },
            },
        );
    }

    return (
        <TenantLayout>
            <Head title="Edit Ruangan" />

            {/* Breadcrumb */}
            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/company/rooms" className="transition-colors hover:text-neutral-700">Ruangan</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Edit Ruangan</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Ruangan</h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Perbarui informasi ruangan yang sudah terdaftar.
                </p>
            </div>

            {isLoading ? (
                <div className="h-40 animate-pulse rounded-2xl bg-neutral-100" />
            ) : !room ? (
                <p className="text-sm text-danger">Ruangan tidak ditemukan.</p>
            ) : (
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Form */}
                    <FadeIn className="lg:col-span-2" delay={0.05}>
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
                            <RoomForm
                                room={room}
                                saving={saving}
                                errors={errors}
                                data={formData!}
                                onChange={setData}
                                onSave={handleSave}
                            />
                        </div>
                    </FadeIn>

                    {/* Summary Card */}
                    <FadeIn delay={0.1}>
                        <div className="space-y-5">
                            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                                <div
                                    className="p-6 sm:p-8"
                                    style={{ background: `linear-gradient(135deg, ${room.color}dd, ${room.color}88)` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-lg ring-4 ring-white/20"
                                            style={{ backgroundColor: room.color }}
                                        >
                                            {room.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 text-white">
                                            <h2 className="text-lg font-bold">{room.name}</h2>
                                            <p className="mt-0.5 text-sm text-white/80">{room.branch_name ?? 'Semua Cabang'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 sm:grid-cols-3">
                                    <div className="px-5 py-4">
                                        <p className="text-xs font-medium text-neutral-400">Kapasitas</p>
                                        <p className="mt-1 text-sm font-semibold text-neutral-900">{room.capacity ?? '-'} orang</p>
                                    </div>
                                    <div className="px-5 py-4">
                                        <p className="text-xs font-medium text-neutral-400">Status</p>
                                        <p className={cn('mt-1 text-sm font-semibold', room.is_active ? 'text-success' : 'text-neutral-500')}>
                                            {room.is_active ? 'Aktif' : 'Nonaktif'}
                                        </p>
                                    </div>
                                    <div className="px-5 py-4">
                                        <p className="text-xs font-medium text-neutral-400">Warna</p>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="inline-block h-4 w-4 rounded-full" style={{ backgroundColor: room.color }} />
                                            <span className="text-sm font-semibold text-neutral-900">{room.color}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-900">Pengaturan Lanjutan</p>
                                        <p className="text-xs text-neutral-500">Atur jam operasional dan availability.</p>
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-neutral-500">
                                    Pengaturan jam operasional, slot interval, dan hari libur bisa diatur setelah ruangan tersimpan. Buka halaman edit ruangan dan gunakan tab Availability.
                                </p>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            )}
        </TenantLayout>
    );
}
