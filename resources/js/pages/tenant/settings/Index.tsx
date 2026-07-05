import { Head } from '@inertiajs/react';
import { useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import SettingsForm from '@/features/settings/components/SettingsForm';
import { useSettings, useUpdateSettings } from '@/features/settings/hooks/useSettings';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/stores/toast';

type Tab = 'booking' | 'room' | 'recurring';

const tabs: { key: Tab; label: string }[] = [
    { key: 'booking', label: 'Booking' },
    { key: 'room', label: 'Ruangan' },
    { key: 'recurring', label: 'Berulang' },
];

export default function Settings() {
    const addToast = useToastStore((s) => s.addToast);
    const { data: settingsData, isLoading } = useSettings();
    const updateMutation = useUpdateSettings();
    const [activeTab, setActiveTab] = useState<Tab>('booking');

    const allSettings = settingsData?.data ?? [];
    const filtered = allSettings.filter((s) => s.group === activeTab);

    function handleSave(updates: { key: string; value: unknown; type: string; group: string | null }[]) {
        updateMutation.mutate(updates, {
            onSuccess: () => addToast('success', 'Pengaturan berhasil disimpan.'),
            onError: () => addToast('error', 'Gagal menyimpan pengaturan.'),
        });
    }

    return (
        <TenantLayout>
            <Head title="Pengaturan" />

            <div className="space-y-5">
                <FadeIn>
                    <div>
                        <h1 className="text-xl font-bold text-neutral-900">Pengaturan</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">Kelola pengaturan aplikasi.</p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.03}>
                    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b border-neutral-200 bg-neutral-50/50">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={cn(
                                        'px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px',
                                        activeTab === tab.key
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-neutral-500 hover:text-neutral-700',
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="p-5 sm:p-6">
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-12 animate-pulse rounded-lg bg-neutral-100" />
                                    ))}
                                </div>
                            ) : (
                                <SettingsForm
                                    settings={filtered}
                                    saving={updateMutation.isPending}
                                    onSave={handleSave}
                                />
                            )}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </TenantLayout>
    );
}
