import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Button from '@/atoms/Button';
import { useAdminSettings, useUpdateAdminSettings } from '@/features/settings/hooks/useAdminSettings';
import AdminLayout from '@/layouts/AdminLayout';

interface SettingsPageProps {
    title: string;
    phpVersion: string;
    appVersion: string;
    laravelVersion: string;
    baseDomain: string;
}

interface InfoItem {
    label: string;
    value: string;
}

export default function Settings({ title, phpVersion, appVersion, laravelVersion, baseDomain: initialBaseDomain }: SettingsPageProps) {
    const { data: settingsData, isLoading } = useAdminSettings();
    const updateSettings = useUpdateAdminSettings();

    const [baseDomain, setBaseDomain] = useState(initialBaseDomain);

    const currentBaseDomain = settingsData?.data?.base_domain ?? initialBaseDomain;
    const hasChanged = baseDomain !== currentBaseDomain;

    const infoItems: InfoItem[] = [
        { label: 'App Version', value: appVersion },
        { label: 'Laravel Version', value: laravelVersion },
        { label: 'PHP Version', value: phpVersion },
    ];

    function handleSave(e: React.FormEvent) {
        e.preventDefault();

        if (!baseDomain.trim()) {
return;
}

        updateSettings.mutate({ base_domain: baseDomain.trim() });
    }

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Pengaturan</h1>
                <p className="mt-1 text-sm text-neutral-500">
                    Informasi sistem dan pengaturan aplikasi.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-neutral-900">Informasi Sistem</h2>
                    <div className="space-y-3">
                        {infoItems.map((item) => (
                            <div key={item.label} className="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3">
                                <span className="text-sm font-medium text-neutral-600">{item.label}</span>
                                <span className="text-sm font-semibold text-neutral-900">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Domain Tenant</h2>
                        <p className="mb-5 text-sm text-neutral-500">
                            Domain utama yang digunakan untuk subdomain tenant. Contoh: <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-700">bookcms.com</code>
                        </p>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">
                                    Base Domain
                                </label>
                                <div className="relative mt-1.5">
                                    <input
                                        type="text"
                                        value={baseDomain}
                                        onChange={(e) => setBaseDomain(e.target.value)}
                                        placeholder={isLoading ? 'Memuat...' : 'bookcms.com'}
                                        className="block w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                                <p className="mt-1.5 text-xs text-neutral-400">
                                    Tenant akan mendapatkan domain: <span className="font-mono font-medium text-neutral-600">{'{nama}'}.{baseDomain || 'bookcms.com'}</span>
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {hasChanged && (
                                        <span className="text-xs text-warning">Belum disimpan</span>
                                    )}
                                    {updateSettings.isSuccess && !hasChanged && (
                                        <span className="flex items-center gap-1 text-xs text-success">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            Tersimpan
                                        </span>
                                    )}
                                </div>
                                <Button type="submit" disabled={updateSettings.isPending || !baseDomain.trim() || !hasChanged}>
                                    {updateSettings.isPending ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Fitur Mendatang</h2>
                        <ul className="space-y-2">
                            {[
                                'Pengaturan jadwal kerja & hari libur',
                                'Konfigurasi notifikasi (Email & WhatsApp)',
                                'Pengaturan durasi booking & buffer time',
                                'Manajemen komisi & harga layanan',
                                'Pengaturan tampilan & branding',
                            ].map((feature) => (
                                <li key={feature} className="flex items-center gap-3 rounded-lg bg-neutral-50 px-4 py-3">
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50">
                                        <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-neutral-600">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
