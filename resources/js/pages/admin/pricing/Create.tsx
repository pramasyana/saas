import { Head, Link, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { useCreatePlan } from '@/features/pricing/hooks/usePlans';
import { useToastStore } from '@/stores/toast';
import type { FeatureDefinition, PlanFormData } from '@/features/pricing/types';

interface CreatePlanPageProps {
    title: string;
    feature_definitions: FeatureDefinition[];
}

export default function CreatePlan({ title, feature_definitions }: CreatePlanPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const createMutation = useCreatePlan();

    const [form, setForm] = useState({
        name: '',
        slug: '',
        description: '',
        price_monthly: '',
        price_yearly: '',
        is_active: true,
        is_popular: false,
        sort_order: 0,
    });

    const [features, setFeatures] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        feature_definitions.forEach((fd) => {
            initial[fd.id] = fd.default_value ?? '';
        });
        return initial;
    });

    function handleNameChange(name: string) {
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        setForm((prev) => ({ ...prev, name, slug }));
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const featuresPayload = Object.entries(features)
            .filter(([, value]) => value !== '')
            .map(([featureDefinitionId, value]) => ({
                feature_definition_id: featureDefinitionId,
                value,
            }));

        const data: PlanFormData = {
            name: form.name,
            slug: form.slug,
            description: form.description,
            price_monthly: Number(form.price_monthly),
            price_yearly: form.price_yearly ? Number(form.price_yearly) : null,
            is_active: form.is_active,
            is_popular: form.is_popular,
            sort_order: form.sort_order,
            features: featuresPayload,
        };

        createMutation.mutate(data, {
            onSuccess: (res) => {
                addToast('success', res.message || 'Plan berhasil dibuat.');
                router.visit('/admin/pricing');
            },
            onError: (err: any) => {
                const message = err?.response?.data?.message || 'Gagal membuat plan.';
                addToast('error', message);
            },
        });
    }

    const categories = [...new Set(feature_definitions.map((fd) => fd.category))];

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="mb-8">
                <Link
                    href="/admin/pricing"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors mb-4"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Kembali ke Pricing
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{title}</h1>
                        <p className="mt-1 text-sm text-neutral-500">Buat paket harga baru dengan fitur-fitur yang tersedia.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-neutral-100 bg-gradient-to-r from-neutral-50 to-white px-6 py-4">
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary ring-1 ring-primary-200/50">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                    </svg>
                                </span>
                                <div>
                                    <h2 className="text-base font-semibold text-neutral-900">Informasi Plan</h2>
                                    <p className="text-xs text-neutral-500">Detail dasar tentang paket harga ini.</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Nama Plan <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        required
                                        placeholder="Contoh: Pro Business"
                                        className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Slug</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={form.slug}
                                            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                                            required
                                            placeholder="pro-business"
                                            className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                                            slug
                                        </span>
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Deskripsi</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                        placeholder="Jelaskan keunggulan dan target pengguna plan ini..."
                                        className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                    <p className="mt-1 text-xs text-neutral-400">{form.description.length}/1000 karakter</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                                <div className="border-b border-neutral-100 bg-gradient-to-r from-success-light to-white px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-light text-success ring-1 ring-success/20">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </span>
                                        <div>
                                            <h2 className="text-base font-semibold text-neutral-900">Harga</h2>
                                            <p className="text-xs text-neutral-500">Tentukan harga bulanan dan tahunan.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                                Harga Bulanan <span className="text-danger">*</span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-500">Rp</span>
                                                <input
                                                    type="number"
                                                    value={form.price_monthly}
                                                    onChange={(e) => setForm((prev) => ({ ...prev, price_monthly: e.target.value }))}
                                                    min={0}
                                                    required
                                                    placeholder="0"
                                                    className="w-full rounded-xl border border-neutral-300 py-2.5 pr-4 pl-10 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                />
                                            </div>
                                            <p className="mt-1 text-xs text-neutral-400">Harga per bulan dalam Rupiah. Isi 0 untuk plan gratis.</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                                Harga Tahunan <span className="text-neutral-400 font-normal">(opsional)</span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-500">Rp</span>
                                                <input
                                                    type="number"
                                                    value={form.price_yearly}
                                                    onChange={(e) => setForm((prev) => ({ ...prev, price_yearly: e.target.value }))}
                                                    min={0}
                                                    placeholder="0"
                                                    className="w-full rounded-xl border border-neutral-300 py-2.5 pr-4 pl-10 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                />
                                            </div>
                                            {Number(form.price_monthly) > 0 && Number(form.price_yearly) > 0 && (
                                                <p className="mt-1 text-xs text-success font-medium">
                                                    Hemat {Math.round((1 - Number(form.price_yearly) / (Number(form.price_monthly) * 12)) * 100)}% dibanding bayar bulanan
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                                <div className="border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-white px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-primary ring-1 ring-primary-200/50">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                            </svg>
                                        </span>
                                        <div>
                                            <h2 className="text-base font-semibold text-neutral-900">Fitur Plan</h2>
                                            <p className="text-xs text-neutral-500">Aktifkan fitur dan tentukan batasan untuk plan ini.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {categories.map((category) => {
                                        const catDefs = feature_definitions.filter((fd) => fd.category === category);
                                        if (catDefs.length === 0) return null;

                                        return (
                                            <div key={category} className="mb-8 last:mb-0">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="h-0.5 flex-1 bg-gradient-to-r from-neutral-200 to-transparent" />
                                                    <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">{category}</span>
                                                    <div className="h-0.5 flex-1 bg-gradient-to-l from-neutral-200 to-transparent" />
                                                </div>
                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    {catDefs.map((fd) => (
                                                        <div key={fd.id} className="group relative flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3.5 shadow-sm transition-all duration-200 hover:border-neutral-300 hover:shadow-md">
                                                            <div className="min-w-0 flex-1 pr-3">
                                                                <p className="text-sm font-medium text-neutral-900">{fd.label}</p>
                                                                {fd.description && (
                                                                    <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{fd.description}</p>
                                                                )}
                                                            </div>
                                                            <div className="shrink-0">
                                                                {fd.type === 'boolean' ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setFeatures((prev) => ({
                                                                            ...prev,
                                                                            [fd.id]: prev[fd.id] === 'true' ? 'false' : 'true',
                                                                        }))}
                                                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                                                                            features[fd.id] === 'true' ? 'bg-success' : 'bg-neutral-300'
                                                                        }`}
                                                                    >
                                                                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ${
                                                                            features[fd.id] === 'true' ? 'translate-x-5' : 'translate-x-0'
                                                                        }`} />
                                                                    </button>
                                                                ) : (
                                                                    <div className="relative">
                                                                        <input
                                                                            type="number"
                                                                            value={features[fd.id] === '' ? 0 : Number(features[fd.id])}
                                                                            onChange={(e) => setFeatures((prev) => ({
                                                                                ...prev,
                                                                                [fd.id]: String(e.target.value),
                                                                            }))}
                                                                            min={0}
                                                                            className="w-24 rounded-lg border border-neutral-300 py-1.5 pl-3 pr-2 text-sm text-neutral-900 text-right shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                                <div className="border-b border-neutral-100 bg-gradient-to-r from-warning-light to-white px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning-light text-warning ring-1 ring-warning/20">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </span>
                                        <div>
                                            <h2 className="text-base font-semibold text-neutral-900">Pengaturan</h2>
                                            <p className="text-xs text-neutral-500">Atur visibilitas dan prioritas plan.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5 space-y-5">
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0 flex-1 pr-3">
                                            <p className="text-sm font-medium text-neutral-900">Status Aktif</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">Tampilkan plan ini di halaman pricing</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setForm((prev) => ({ ...prev, is_active: !prev.is_active }))}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                                                form.is_active ? 'bg-success' : 'bg-neutral-300'
                                            }`}
                                        >
                                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ${
                                                form.is_active ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                        </button>
                                    </div>
                                    <div className="border-t border-neutral-100" />
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0 flex-1 pr-3">
                                            <p className="text-sm font-medium text-neutral-900">Paling Populer</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">Tandai sebagai rekomendasi utama</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setForm((prev) => ({ ...prev, is_popular: !prev.is_popular }))}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                                                form.is_popular ? 'bg-warning' : 'bg-neutral-300'
                                            }`}
                                        >
                                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ${
                                                form.is_popular ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                        </button>
                                    </div>
                                    <div className="border-t border-neutral-100" />
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-900 mb-1">Urutan Tampil</label>
                                        <p className="text-xs text-neutral-400 mb-2">Semakin kecil angka, semakin prioritas.</p>
                                        <input
                                            type="number"
                                            value={form.sort_order}
                                            onChange={(e) => setForm((prev) => ({ ...prev, sort_order: Number(e.target.value) }))}
                                            min={0}
                                            className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm sticky bottom-4 sm:static">
                    <button
                        type="button"
                        onClick={() => router.visit('/admin/pricing')}
                        className="w-full sm:w-auto rounded-xl border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                    >
                        Batal
                    </button>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {createMutation.isPending ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    Simpan Plan
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
