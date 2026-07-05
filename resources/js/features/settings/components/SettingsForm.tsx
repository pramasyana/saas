import { useEffect, useState } from 'react';
import type { SettingItem } from '@/features/settings/hooks/useSettings';

interface SettingsFormProps {
    settings: SettingItem[];
    saving: boolean;
    onSave: (updates: { key: string; value: unknown; type: string; group: string | null }[]) => void;
}

export default function SettingsForm({ settings, saving, onSave }: SettingsFormProps) {
    const [values, setValues] = useState<Record<string, string>>({});

    useEffect(() => {
        const initial: Record<string, string> = {};

        for (const s of settings) {
            initial[s.key] = formatValue(s.value, s.type);
        }

        setValues(initial);
    }, [settings]);

    function formatValue(value: unknown, type: string): string {
        if (type === 'json' && Array.isArray(value)) {
            return value.join(', ');
        }

        if (type === 'boolean') {
            return value ? 'true' : 'false';
        }

        return String(value ?? '');
    }

    function parseValue(raw: string, type: string): unknown {
        if (type === 'integer') {
            const n = parseInt(raw, 10);

            return isNaN(n) ? 0 : n;
        }

        if (type === 'boolean') {
            return raw === 'true' || raw === '1';
        }

        if (type === 'json') {
            return raw.split(',').map((s) => s.trim()).filter(Boolean);
        }

        return raw;
    }

    function update(key: string, raw: string) {
        setValues((prev) => ({ ...prev, [key]: raw }));
    }

    function handleSave() {
        const updates = settings.map((s) => ({
            key: s.key,
            value: parseValue(values[s.key] ?? '', s.type),
            type: s.type,
            group: s.group,
        }));
        onSave(updates);
    }

    function renderInput(s: SettingItem) {
        const val = values[s.key] ?? '';

        if (s.type === 'boolean') {
            return (
                <label className="relative inline-flex cursor-pointer items-center gap-3">
                    <input
                        type="checkbox"
                        checked={val === 'true'}
                        onChange={(e) => update(s.key, e.target.checked ? 'true' : 'false')}
                        className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-neutral-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
                    <span className="text-sm font-medium">{val === 'true' ? 'Aktif' : 'Nonaktif'}</span>
                </label>
            );
        }

        if (s.type === 'color') {
            return (
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={val || '#7C3AED'}
                        onChange={(e) => update(s.key, e.target.value)}
                        className="h-10 w-10 rounded-lg border border-neutral-300 cursor-pointer"
                    />
                    <input
                        type="text"
                        value={val}
                        onChange={(e) => update(s.key, e.target.value)}
                        className="flex-1 rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            );
        }

        if (s.type === 'json') {
            return (
                <input
                    type="text"
                    value={val}
                    onChange={(e) => update(s.key, e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Pisahkan dengan koma"
                />
            );
        }

        return (
            <input
                type={s.type === 'integer' ? 'number' : 'text'}
                value={val}
                onChange={(e) => update(s.key, e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
        );
    }

    const labels: Record<string, string> = {
        'booking.slot_interval': 'Interval Slot (menit)',
        'booking.code_prefix': 'Prefiks Kode Booking',
        'booking.sources': 'Sumber Booking',
        'booking.enable_staff_filter': 'Filter Staff',
        'booking.enable_rooms': 'Pemilihan Ruangan',
        'booking.enable_group_booking': 'Booking Grup/Kelas',
        'booking.enable_recurring_public': 'Booking Berulang',
        'room.default_color': 'Warna Default Ruangan',
        'recurring.enabled': 'Generate Berulang',
        'recurring.generate_at': 'Jam Generate',
        'recurring.generate_interval': 'Interval Generate (hari)',
    };

    const descriptions: Record<string, string> = {
        'booking.slot_interval': 'Jarak antar slot waktu yang tersedia (dalam menit).',
        'booking.code_prefix': 'Huruf depan kode booking otomatis.',
        'booking.sources': 'Sumber booking yang tersedia (dipisah koma).',
        'booking.enable_staff_filter': 'Hanya tampilkan staff yang bisa menangani layanan yang dipilih.',
        'booking.enable_rooms': 'Izinkan pelanggan memilih ruangan saat booking.',
        'booking.enable_group_booking': 'Izinkan pelanggan membuat booking grup dengan banyak peserta (kelas/workshop).',
        'booking.enable_recurring_public': 'Izinkan pelanggan membuat booking berulang (harian/mingguan/bulanan).',
        'room.default_color': 'Warna default untuk ruangan baru.',
        'recurring.enabled': 'Aktifkan/nonaktifkan generate booking berulang otomatis.',
        'recurring.generate_at': 'Jam berapa generate dijalankan (format 24 jam).',
        'recurring.generate_interval': 'Generate setiap N hari sekali.',
    };

    if (settings.length === 0) {
        return <p className="text-sm text-neutral-400 py-8 text-center">Tidak ada pengaturan.</p>;
    }

    return (
        <div className="space-y-6">
            {settings.map((s) => (
                <div key={s.key}>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                        {labels[s.key] ?? s.key}
                    </label>
                    {descriptions[s.key] && (
                        <p className="text-xs text-neutral-400 mb-2">{descriptions[s.key]}</p>
                    )}
                    {renderInput(s)}
                </div>
            ))}

            <div className="flex justify-end border-t border-neutral-200 pt-5">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50 transition-all"
                >
                    {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                </button>
            </div>
        </div>
    );
}
