import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import { useBookingSettings, useUpdateBookingSettings } from '@/features/booking/hooks/useBookings';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/stores/toast';

interface OnlinePageProps {
    title: string;
    settings: {
        enabled: boolean;
        show_prices: boolean;
        auto_confirm: boolean;
        enable_addons: boolean;
        enable_multi_service: boolean;
        enable_guests: boolean;
        enable_rooms: boolean;
    };
    publicUrl: string;
}

function Toggle({ label, description, value, onChange, disabled }: {
    label: string;
    description: string;
    value: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex-1 pr-4">
                <p className="text-sm font-medium text-neutral-900">{label}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{description}</p>
            </div>
            <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(!value)}
                className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30',
                    value ? 'bg-primary' : 'bg-neutral-300',
                    disabled && 'cursor-not-allowed opacity-50',
                )}
            >
                <span
                    className={cn(
                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200',
                        value ? 'translate-x-5' : 'translate-x-0',
                    )}
                />
            </button>
        </div>
    );
}

export default function Online({ title, settings: initialSettings, publicUrl }: OnlinePageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const { data: apiSettings, isLoading: settingsLoading } = useBookingSettings();
    const updateSettings = useUpdateBookingSettings();

    const currentSettings = apiSettings?.data ?? initialSettings;

    const [enabled, setEnabled] = useState(currentSettings.enabled);
    const [showPrices, setShowPrices] = useState(currentSettings.show_prices);
    const [autoConfirm, setAutoConfirm] = useState(currentSettings.auto_confirm);
    const [enableAddons, setEnableAddons] = useState(currentSettings.enable_addons);
    const [enableMultiService, setEnableMultiService] = useState(currentSettings.enable_multi_service);
    const [enableGuests, setEnableGuests] = useState(currentSettings.enable_guests);
    const [enableRooms, setEnableRooms] = useState(currentSettings.enable_rooms);

    function handleSave() {
        updateSettings.mutate(
            { enabled, show_prices: showPrices, auto_confirm: autoConfirm, enable_addons: enableAddons, enable_multi_service: enableMultiService, enable_guests: enableGuests, enable_rooms: enableRooms },
            {
                onSuccess: () => {
                    addToast('success', 'Pengaturan online booking berhasil disimpan.');
                },
                onError: () => {
                    addToast('error', 'Gagal menyimpan pengaturan.');
                },
            },
        );
    }

    const hasChanges = enabled !== currentSettings.enabled
        || showPrices !== currentSettings.show_prices
        || autoConfirm !== currentSettings.auto_confirm
        || enableAddons !== currentSettings.enable_addons
        || enableMultiService !== currentSettings.enable_multi_service
        || enableGuests !== currentSettings.enable_guests
        || enableRooms !== currentSettings.enable_rooms;

    return (
        <TenantLayout>
            <Head title={title} />

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/booking" className="transition-colors hover:text-neutral-700">Booking</Link>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Online Booking</span>
            </nav>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Online Booking</h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Konfigurasi halaman booking publik untuk pelanggan.
                    </p>
                </div>
            </div>

            <FadeIn>
                {settingsLoading ? (
                    <div className="animate-pulse space-y-6">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 h-5 w-40 rounded bg-neutral-200" />
                            <div className="h-12 rounded-xl bg-neutral-100" />
                        </div>
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 h-5 w-32 rounded bg-neutral-200" />
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between rounded-xl border border-neutral-200 p-5">
                                        <div className="flex-1 space-y-1">
                                            <div className="h-4 w-44 rounded bg-neutral-200" />
                                            <div className="h-3 w-64 rounded bg-neutral-100" />
                                        </div>
                                        <div className="h-6 w-11 rounded-full bg-neutral-200" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                <div className="space-y-6">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-semibold text-neutral-900">URL Booking Publik</h2>
                        <div className="flex items-center gap-3 rounded-xl bg-neutral-50 px-4 py-3">
                            <svg className="h-5 w-5 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                            </svg>
                            <a
                                href={publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-primary underline underline-offset-2 hover:text-primary-dark"
                            >
                                {publicUrl}
                            </a>
                        </div>
                        <p className="mt-2 text-xs text-neutral-400">
                            Bagikan URL ini ke pelanggan agar mereka bisa booking secara online.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-semibold text-neutral-900">Pengaturan</h2>
                        <div className="space-y-3">
                            <Toggle
                                label="Aktifkan Booking Online"
                                description="Pelanggan bisa mengakses halaman booking publik."
                                value={enabled}
                                onChange={setEnabled}
                                disabled={updateSettings.isPending}
                            />
                            {enabled && (
                                <>
                                    <Toggle
                                        label="Tampilkan Harga"
                                        description="Menampilkan harga layanan di wizard booking."
                                        value={showPrices}
                                        onChange={setShowPrices}
                                        disabled={updateSettings.isPending}
                                    />
                                    <Toggle
                                        label="Auto-confirm Booking"
                                        description="Booking langsung confirmed tanpa perlu persetujuan admin."
                                        value={autoConfirm}
                                        onChange={setAutoConfirm}
                                        disabled={updateSettings.isPending}
                                    />
                                    <Toggle
                                        label="Multi Service"
                                        description="Pelanggan bisa pilih lebih dari satu layanan dalam satu booking."
                                        value={enableMultiService}
                                        onChange={setEnableMultiService}
                                        disabled={updateSettings.isPending}
                                    />
                                    <Toggle
                                        label="Add-ons"
                                        description="Pelanggan bisa menambahkan layanan tambahan (add-on) ke booking."
                                        value={enableAddons}
                                        onChange={setEnableAddons}
                                        disabled={updateSettings.isPending}
                                    />
                                    <Toggle
                                        label="Tamu"
                                        description="Pelanggan bisa menentukan jumlah tamu dan nama tamu saat booking."
                                        value={enableGuests}
                                        onChange={setEnableGuests}
                                        disabled={updateSettings.isPending}
                                    />
                                    <Toggle
                                        label="Pemilihan Ruangan"
                                        description="Pelanggan bisa memilih ruangan yang tersedia saat booking."
                                        value={enableRooms}
                                        onChange={setEnableRooms}
                                        disabled={updateSettings.isPending}
                                    />
                                </>
                            )}
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-5">
                            <p className="text-xs text-neutral-400">
                                {hasChanges ? 'Ada perubahan yang belum disimpan.' : 'Tidak ada perubahan.'}
                            </p>
                            <Button
                                onClick={handleSave}
                                disabled={!hasChanges || updateSettings.isPending}
                            >
                                {updateSettings.isPending ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </div>
                </div>
                )}
            </FadeIn>
        </TenantLayout>
    );
}
