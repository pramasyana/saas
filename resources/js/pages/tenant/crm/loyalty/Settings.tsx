import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import { useLoyaltyConfig, useUpdateLoyaltyConfig } from '@/features/crm/hooks/useLoyaltySettings';
import type { LoyaltyConfig } from '@/features/crm/types';
import TenantLayout from '@/layouts/TenantLayout';
import { cn, formatNumber } from '@/lib/utils';
import { useToastStore } from '@/stores/toast';

interface SettingsPageProps {
    title: string;
    config: LoyaltyConfig;
}

function NumberInput({ value, onChange, suffix, min = 1 }: {
    value: number;
    onChange: (v: number) => void;
    suffix?: string;
    min?: number;
}) {
    return (
        <div className="inline-flex items-center overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-sm transition-shadow focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <input
                type="number"
                min={min}
                value={value}
                onChange={(e) => onChange(Math.max(min, Number(e.target.value)))}
                className="w-20 border-none px-3 py-2 text-center text-sm font-semibold text-neutral-900 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            {suffix && (
                <span className="border-l border-neutral-200 bg-neutral-50 px-2.5 py-2 text-xs font-medium text-neutral-500">{suffix}</span>
            )}
        </div>
    );
}

function Skeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <div className="mb-3 h-4 w-24 rounded bg-neutral-200" />
                        <div className="h-8 w-20 rounded bg-neutral-200" />
                        <div className="mt-2 h-3 w-32 rounded bg-neutral-100" />
                    </div>
                ))}
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="mb-5 h-5 w-40 rounded bg-neutral-200" />
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-start gap-4 rounded-xl border border-neutral-200 p-4">
                            <div className="mt-0.5 h-4 w-4 rounded-full bg-neutral-200" />
                            <div className="flex-1 space-y-1.5">
                                <div className="h-4 w-44 rounded bg-neutral-200" />
                                <div className="h-3 w-64 rounded bg-neutral-100" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Settings({ title, config: initialConfig }: SettingsPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const { data: configData, isLoading } = useLoyaltyConfig();
    const mutation = useUpdateLoyaltyConfig();

    const serverConfig = configData?.data ?? initialConfig;

    const [enabled, setEnabled] = useState(serverConfig.enabled);
    const [mode, setMode] = useState<'percentage' | 'fixed'>(serverConfig.mode);
    const [pointsPerAmount, setPointsPerAmount] = useState(serverConfig.points_per_amount);
    const [pointsFixed, setPointsFixed] = useState(serverConfig.points_fixed);

    useEffect(() => {
        setEnabled(serverConfig.enabled);
        setMode(serverConfig.mode);
        setPointsPerAmount(serverConfig.points_per_amount);
        setPointsFixed(serverConfig.points_fixed);
    }, [serverConfig]);

    const hasChanges = enabled !== serverConfig.enabled
        || mode !== serverConfig.mode
        || pointsPerAmount !== serverConfig.points_per_amount
        || pointsFixed !== serverConfig.points_fixed;

    function handleSave() {
        mutation.mutate(
            { enabled, mode, points_per_amount: pointsPerAmount, points_fixed: pointsFixed },
            {
                onSuccess: () => {
                    addToast('success', 'Konfigurasi loyalty berhasil disimpan.');
                },
                onError: () => {
                    addToast('error', 'Gagal menyimpan konfigurasi loyalty.');
                },
            },
        );
    }

    const previewScenarios = mode === 'percentage' && pointsPerAmount > 0
        ? [
            { label: 'Booking Facial Rp 150.000', amount: 150000, points: Math.floor(150000 / pointsPerAmount) },
            { label: 'Booking Paket Relax Rp 350.000', amount: 350000, points: Math.floor(350000 / pointsPerAmount) },
            { label: 'Booking Paket Lengkap Rp 850.000', amount: 850000, points: Math.floor(850000 / pointsPerAmount) },
        ]
        : [
            { label: 'Booking berapapun', amount: 0, points: pointsFixed },
        ];

    return (
        <TenantLayout>
            <Head title={title} />

            {/* Breadcrumb */}
            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/crm/customers" className="transition-colors hover:text-neutral-700">CRM</Link>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Loyalty</span>
            </nav>

            {/* Hero Header */}
            <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-primary-dark/90 shadow-lg">
                <div className="relative px-6 py-8 sm:px-8 sm:py-10">
                    <div className="absolute right-0 top-0 h-full w-1/3 opacity-5">
                        <svg className="h-full w-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="2" />
                            <circle cx="100" cy="100" r="50" stroke="white" strokeWidth="2" />
                            <circle cx="100" cy="100" r="20" fill="white" />
                        </svg>
                    </div>
                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25l-9-5.25-9 5.25m9 5.25l-9-5.25m9 5.25l9-5.25m-9 5.25V21m-9-5.25v5.25m18-5.25v5.25" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight text-white">Loyalty Points</h1>
                            </div>
                            <p className="mt-2 max-w-xl text-sm text-white/70">
                                Atur program loyalitas pelanggan — berikan poin otomatis setiap kali booking selesai.
                                Pelanggan bisa menukarkan poin dengan reward yang tersedia.
                            </p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || mutation.isPending}
                            className={cn(
                                'flex shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-lg transition-all',
                                hasChanges
                                    ? 'bg-white text-primary hover:bg-white/90'
                                    : 'bg-white/20 text-white/60 cursor-not-allowed',
                                mutation.isPending && 'opacity-70 cursor-wait',
                            )}
                        >
                            {mutation.isPending ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    {hasChanges ? 'Simpan Perubahan' : 'Tersimpan'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isLoading ? <Skeleton /> : (
            <FadeIn>
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25l-9-5.25-9 5.25m9 5.25l-9-5.25m9 5.25l9-5.25m-9 5.25V21m-9-5.25v5.25m18-5.25v5.25" />
                                </svg>
                                Status Program
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <span className={cn(
                                    'inline-flex h-2.5 w-2.5 rounded-full',
                                    enabled ? 'bg-success' : 'bg-neutral-300',
                                )} />
                                <p className="text-lg font-bold text-neutral-900">{enabled ? 'Aktif' : 'Nonaktif'}</p>
                            </div>
                            <p className="mt-1 text-xs text-neutral-400">
                                {enabled
                                    ? 'Poin otomatis diberikan saat booking selesai'
                                    : 'Aktifkan untuk mulai memberikan poin'}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Mode Poin
                            </div>
                            <p className="mt-2 text-lg font-bold text-neutral-900">
                                {mode === 'percentage' ? 'Persentase' : 'Tetap'}
                            </p>
                            <p className="mt-1 text-xs text-neutral-400">
                                {mode === 'percentage'
                                    ? `1 poin per Rp ${formatNumber(pointsPerAmount)}`
                                    : `${pointsFixed} poin per booking`
                                }
                            </p>
                        </div>

                        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                </svg>
                                Contoh Perhitungan
                            </div>
                            <p className="mt-2 text-lg font-bold text-amber-600">
                                {mode === 'percentage' && pointsPerAmount > 0
                                    ? `Rp ${formatNumber(pointsPerAmount)} = 1 poin`
                                    : `${formatNumber(pointsFixed)} poin`
                                }
                            </p>
                            <p className="mt-1 text-xs text-neutral-400">
                                {mode === 'percentage'
                                    ? `Booking Rp 150.000 → ${Math.floor(150000 / pointsPerAmount)} poin`
                                    : 'Setiap booking → jumlah tetap'
                                }
                            </p>
                        </div>
                    </div>

                    {/* Main Settings Card */}
                    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
                        {/* On/Off Toggle */}
                        <div className="border-b border-neutral-100 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={cn(
                                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                                        enabled ? 'bg-success/10 text-success' : 'bg-neutral-100 text-neutral-400',
                                    )}>
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-900">Aktifkan Loyalty Points</p>
                                        <p className="mt-0.5 text-xs text-neutral-500">
                                            Berikan poin otomatis ke pelanggan setiap kali status booking berubah menjadi <span className="font-medium text-neutral-700">completed</span>
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setEnabled(!enabled)}
                                    className={cn(
                                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30',
                                        enabled ? 'bg-primary' : 'bg-neutral-300',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200',
                                            enabled ? 'translate-x-5' : 'translate-x-0',
                                        )}
                                    />
                                </button>
                            </div>
                        </div>

                        {enabled && (
                            <div className="p-6 space-y-6">
                                {/* Point Mode Selection */}
                                <div>
                                    <div className="mb-1">
                                        <p className="text-sm font-semibold text-neutral-900">Mode Perolehan Poin</p>
                                        <p className="text-xs text-neutral-500">Pilih cara menghitung poin yang didapat pelanggan dari setiap transaksi</p>
                                    </div>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        <label
                                            className={cn(
                                                'relative flex cursor-pointer items-start gap-4 rounded-xl border-2 p-5 transition-all',
                                                mode === 'percentage'
                                                    ? 'border-primary bg-primary-50/50 shadow-sm'
                                                    : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50',
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name="mode"
                                                value="percentage"
                                                checked={mode === 'percentage'}
                                                onChange={() => setMode('percentage')}
                                                className="sr-only"
                                            />
                                            <div className={cn(
                                                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                                                mode === 'percentage' ? 'border-primary' : 'border-neutral-300',
                                            )}>
                                                {mode === 'percentage' && (
                                                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-neutral-900">Berdasarkan Persentase</p>
                                                    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary">REKOMENDASI</span>
                                                </div>
                                                <p className="mt-1 text-xs text-neutral-500">
                                                    Pelanggan mendapat 1 poin untuk setiap kelipatan nominal transaksi.
                                                    Cocok untuk bisnis dengan range harga bervariasi.
                                                </p>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="text-xs text-neutral-500">1 poin per Rp</span>
                                                    <NumberInput
                                                        value={pointsPerAmount}
                                                        onChange={setPointsPerAmount}
                                                        suffix="poin"
                                                    />
                                                </div>
                                            </div>
                                        </label>

                                        <label
                                            className={cn(
                                                'relative flex cursor-pointer items-start gap-4 rounded-xl border-2 p-5 transition-all',
                                                mode === 'fixed'
                                                    ? 'border-primary bg-primary-50/50 shadow-sm'
                                                    : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50',
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name="mode"
                                                value="fixed"
                                                checked={mode === 'fixed'}
                                                onChange={() => setMode('fixed')}
                                                className="sr-only"
                                            />
                                            <div className={cn(
                                                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                                                mode === 'fixed' ? 'border-primary' : 'border-neutral-300',
                                            )}>
                                                {mode === 'fixed' && (
                                                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-neutral-900">Poin Tetap</p>
                                                <p className="mt-1 text-xs text-neutral-500">
                                                    Setiap booking selesai memberikan jumlah poin yang sama,
                                                    berapapun total transaksinya. Sederhana dan mudah dipahami.
                                                </p>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <NumberInput
                                                        value={pointsFixed}
                                                        onChange={setPointsFixed}
                                                        suffix="poin/booking"
                                                    />
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Preview Calculator */}
                                <div className="overflow-hidden rounded-xl border border-neutral-200">
                                    <div className="border-b border-neutral-100 bg-neutral-50/80 px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5z" />
                                            </svg>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                                Kalkulator Pratinjau
                                            </p>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-neutral-100 px-5 py-2">
                                        {previewScenarios.map((s, i) => (
                                            <div key={i} className="flex items-center justify-between py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold',
                                                        i === 0 ? 'bg-primary-50 text-primary' : i === 1 ? 'bg-amber-50 text-amber-600' : 'bg-violet-50 text-violet-600',
                                                    )}>
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-neutral-900">{s.label}</p>
                                                        {s.amount > 0 && (
                                                            <p className="text-xs text-neutral-400">Total: Rp {formatNumber(s.amount)}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-primary">{formatNumber(s.points)}</p>
                                                    <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">Poin</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-neutral-100 bg-neutral-50/80 px-5 py-3">
                                        <div className="flex items-center justify-between text-xs text-neutral-400">
                                            <span>Rumus: {mode === 'percentage' ? 'floor(total_harga ÷ points_per_amount)' : 'points_fixed'}</span>
                                            <span className="font-medium text-neutral-600">
                                                {mode === 'percentage'
                                                    ? `1 poin = Rp ${formatNumber(pointsPerAmount)}`
                                                    : `${formatNumber(pointsFixed)} poin/booking`
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Info Alert */}
                                <div className="flex items-start gap-3 rounded-xl border border-primary/15 bg-primary-50/50 px-5 py-4">
                                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-primary-dark">Bagaimana cara kerja poin?</p>
                                        <ul className="mt-1.5 space-y-1 text-xs text-primary-dark/70">
                                            <li>• Poin otomatis diberikan saat booking berstatus <span className="font-medium text-primary-dark">completed</span></li>
                                            <li>• Pelanggan bisa melihat poin di halaman profil pelanggan</li>
                                            <li>• Poin bisa ditukarkan dengan reward yang tersedia</li>
                                            <li>• Aturan ini bisa diubah kapan saja — perubahan hanya berlaku untuk booking baru</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!enabled && (
                            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
                                    <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25l-9-5.25-9 5.25m9 5.25l-9-5.25m9 5.25l9-5.25m-9 5.25V21m-9-5.25v5.25m18-5.25v5.25" />
                                    </svg>
                                </div>
                                <h3 className="mt-4 text-sm font-semibold text-neutral-900">Program Loyalty Nonaktif</h3>
                                <p className="mt-1 max-w-sm text-xs text-neutral-500">
                                    Aktifkan program loyalty points untuk memberikan poin otomatis ke pelanggan
                                    setiap kali mereka menyelesaikan booking. Tingkatkan retensi pelanggan
                                    dengan program loyalitas yang menarik.
                                </p>
                                <button
                                    onClick={() => setEnabled(true)}
                                    className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-dark"
                                >
                                    Aktifkan Sekarang
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Save Bar */}
                    <div className={cn(
                        'flex items-center justify-between rounded-2xl border px-6 py-4 shadow-sm transition-all',
                        hasChanges
                            ? 'border-amber-200 bg-amber-50/80'
                            : 'border-neutral-200 bg-white',
                    )}>
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-lg',
                                hasChanges ? 'bg-amber-100 text-amber-600' : 'bg-success/10 text-success',
                            )}>
                                {hasChanges ? (
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                ) : (
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-900">
                                    {hasChanges ? 'Ada perubahan yang belum disimpan' : 'Tidak ada perubahan'}
                                </p>
                                <p className="text-xs text-neutral-500">
                                    {hasChanges
                                        ? 'Jangan lupa simpan agar perubahan diterapkan'
                                        : 'Konfigurasi loyalty sudah tersimpan'
                                    }
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || mutation.isPending}
                            className={cn(
                                'rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all',
                                hasChanges
                                    ? 'bg-primary text-white hover:bg-primary-dark'
                                    : 'bg-neutral-100 text-neutral-400 cursor-not-allowed',
                            )}
                        >
                            {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </div>
            </FadeIn>
            )}
        </TenantLayout>
    );
}
