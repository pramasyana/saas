import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';

interface SettingsPageProps {
    title: string;
    phpVersion: string;
    appVersion: string;
    laravelVersion: string;
}

interface InfoItem {
    label: string;
    value: string;
}

export default function Settings({ title, phpVersion, appVersion, laravelVersion }: SettingsPageProps) {
    const infoItems: InfoItem[] = [
        { label: 'App Version', value: appVersion },
        { label: 'Laravel Version', value: laravelVersion },
        { label: 'PHP Version', value: phpVersion },
    ];

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
        </AdminLayout>
    );
}
