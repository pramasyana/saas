import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import { LandingPreview, EditPanel, TemplateModal, SidebarSectionList } from '@/features/booking/components/landing';
import { defaultLandingTemplate } from '@/features/booking/data/defaultLandingTemplate';
import type { LandingConfig, ServiceItem, PackageItem } from '@/features/booking/hooks/useLandingSettings';
import { useLandingSettings, useUpdateLandingSettings, useUploadLandingLogo, useDeleteLandingLogo, useUploadLandingImage } from '@/features/booking/hooks/useLandingSettings';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';

import { useToastStore } from '@/stores/toast';

interface CategoryItem {
    id: string; name: string; slug: string; color: string | null; sort_order: number;
}

interface BranchItem {
    id: string; name: string; address: string | null; phone: string | null; email: string | null; whatsapp: string | null; is_default: boolean;
}

interface LandingSettingsPageProps {
    title: string;
    publicUrl?: string;
    services?: ServiceItem[];
    categories?: CategoryItem[];
    packages?: PackageItem[];
    branches?: BranchItem[];
}

const defaultColors = {
    primary: '#7C3AED',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#FAFAFA',
    text: '#171717',
    text_muted: '#737373',
};

const sectionLabels: Record<string, string> = {
    hero: 'Hero', features: 'Keunggulan', about: 'Tentang', stats: 'Statistik',
    services: 'Layanan', team: 'Tim', testimonials: 'Testimoni',
    faq: 'FAQ', gallery: 'Galeri', cta: 'CTA Banner', contact: 'Kontak',
    branches: 'Cabang', divider: 'Pemisah', logo_cloud: 'Logo Partner', footer: 'Footer',
};

const allSectionKeys: (keyof typeof sectionLabels)[] = Object.keys(sectionLabels) as (keyof typeof sectionLabels)[];

function normalizeOrder(order: string[]): string[] {
    const hasHero = order.includes('hero');
    const hasFooter = order.includes('footer');
    const middle = order.filter((k) => k !== 'hero' && k !== 'footer');
    const result: string[] = [];

    if (hasHero) {
result.push('hero');
}

    result.push(...middle);

    if (hasFooter) {
result.push('footer');
}

    return result;
}

function getDefaultSection(section: string): unknown {
    return (defaultLandingTemplate as Record<string, unknown>)[section] ?? {};
}

export default function LandingSettings({ title, publicUrl, services, categories, packages, branches }: LandingSettingsPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const { data: serverConfig, isLoading } = useLandingSettings();
    const updateSettings = useUpdateLandingSettings();
    const uploadLogo = useUploadLandingLogo();
    const deleteLogo = useDeleteLandingLogo();
    const uploadImage = useUploadLandingImage();

    const [config, setConfig] = useState<LandingConfig>({});
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current && serverConfig && Object.keys(serverConfig).length > 0) {
            setConfig({
                ...serverConfig,
                section_order: normalizeOrder(serverConfig.section_order ?? allSectionKeys as string[]),
            });
            initialized.current = true;
        }
    }, [serverConfig]);

    const set = useCallback((path: string, value: unknown) => {
        setDirty(true);
        setConfig((prev) => {
            const keys = path.split('.');
            const newConfig = structuredClone(prev);
            let current: Record<string, unknown> = newConfig as Record<string, unknown>;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
current[keys[i]] = {};
}

                current = current[keys[i]] as Record<string, unknown>;
            }

            current[keys[keys.length - 1]] = value;

            return newConfig;
        });
    }, []);

    const sectionOrder = useMemo(() => {
        const order = config.section_order ?? [
            'hero', 'features', 'about', 'stats', 'services', 'team',
            'testimonials', 'faq', 'gallery', 'cta', 'contact', 'divider', 'logo_cloud', 'footer',
        ];

        return normalizeOrder(order);
    }, [config.section_order]);

    const visibleSections = useMemo(() => {
        const filtered = sectionOrder.filter((k) => allSectionKeys.includes(k as keyof typeof sectionLabels)) as string[];

        return [...new Set(filtered)];
    }, [sectionOrder]);

    const availableSections = useMemo(() => {
        return allSectionKeys.filter((k) => !visibleSections.includes(k));
    }, [visibleSections]);

    function handleSave() {
        updateSettings.mutate(config, {
            onSuccess: () => {
 addToast('success', 'Pengaturan landing page berhasil disimpan.'); setDirty(false); 
},
            onError: () => addToast('error', 'Gagal menyimpan pengaturan.'),
        });
    }

    function handleOrderChange(newOrder: string[]) {
        setDirty(true);
        setConfig((prev) => ({ ...prev, section_order: normalizeOrder(newOrder) }));
    }

    function addSection(sectionKey: string, insertAt?: number) {
        if (visibleSections.includes(sectionKey)) {
return;
}

        const defaults = getDefaultSection(sectionKey);
        set(sectionKey, defaults);
        setConfig((prev) => {
            const currentOrder = prev.section_order ?? [...allSectionKeys];
            const newOrder = [...currentOrder];

            if (typeof insertAt === 'number' && insertAt >= 0 && insertAt <= newOrder.length) {
                newOrder.splice(insertAt, 0, sectionKey);
            } else {
                newOrder.push(sectionKey);
            }

            return { ...prev, section_order: normalizeOrder(newOrder) };
        });
        setSelectedSection(sectionKey);
        addToast('success', `Bagian "${sectionLabels[sectionKey]}" ditambahkan.`);
    }

    function removeSection(sectionKey: string) {
        setConfig((prev) => ({
            ...prev,
            section_order: normalizeOrder((prev.section_order ?? []).filter((k) => k !== sectionKey)),
        }));

        if (selectedSection === sectionKey) {
setSelectedSection(null);
}

        addToast('success', `Bagian "${sectionLabels[sectionKey]}" dihapus.`);
    }

    function applyTemplate(template: LandingConfig) {
        const normalized = {
            ...template,
            section_order: normalizeOrder(template.section_order ?? allSectionKeys as string[]),
        };
        setConfig(normalized);
        setDirty(true);
        setShowTemplateModal(false);
        addToast('success', 'Template berhasil diterapkan. Jangan lupa simpan.');
    }

    async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) {
return;
}

        uploadLogo.mutate(file, {
            onSuccess: (res) => {
 set('logo', res.data?.logo); addToast('success', 'Logo berhasil diupload.'); 
},
            onError: () => addToast('error', 'Gagal upload logo.'),
        });
    }

    function handleDeleteLogo() {
        deleteLogo.mutate(undefined, {
            onSuccess: () => {
 set('logo', null); addToast('success', 'Logo berhasil dihapus.'); 
},
            onError: () => addToast('error', 'Gagal menghapus logo.'),
        });
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, section: string, index?: number) {
        const file = e.target.files?.[0];

        if (!file) {
return;
}

        uploadImage.mutate({ file, section }, {
            onSuccess: (res) => {
                if (section === 'hero_background') {
                    set('hero.background_image', res?.url);
                } else if (section === 'hero_image') {
                    set('hero.image', res?.url);
                } else if (section === 'hero_carousel' && typeof index === 'number') {
                    setConfig((prev) => {
                        setDirty(true);
                        const newConfig = structuredClone(prev);
                        const items = [...(newConfig.hero?.carousel_items ?? [])];

                        while (items.length <= index) {
                            items.push({ title: '', subtitle: '', cta_text: '', cta_link: '', background_image: null });
                        }

                        items[index] = { ...items[index], background_image: res?.url };
                        newConfig.hero = { ...newConfig.hero, carousel_items: items };

                        return newConfig;
                    });
                } else if (typeof index === 'number') {
                    setConfig((prev) => {
                        setDirty(true);
                        const newConfig = structuredClone(prev);
                        const sectionData = (newConfig as Record<string, unknown>)[section] as Record<string, unknown> ?? {};
                        const items = [...((sectionData['items'] as unknown[] | undefined) ?? [])];
                        items[index] = { ...items[index] as Record<string, unknown>, image: res?.url };
                        (newConfig as Record<string, unknown>)[section] = { ...sectionData, items };

                        return newConfig;
                    });
                } else {
                    set(`${section}.image`, res?.url);
                }

                addToast('success', 'Gambar berhasil diupload.');
            },
            onError: () => addToast('error', 'Gagal upload gambar.'),
        });
    }

    // Close edit panel on ESC
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') {
setSelectedSection(null);
}
        }
        window.addEventListener('keydown', handleKey);

        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    const c = { ...defaultColors, ...config.colors };
    const selectedSectionData = selectedSection ? (config as Record<string, unknown>)[selectedSection] as Record<string, unknown> ?? {} : {};

    if (isLoading) {
        return (
            <TenantLayout>
                <Head title={title} />
                <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                    <Link href="/booking" className="transition-colors hover:text-neutral-700">Booking</Link>
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    <span className="font-medium text-neutral-900">Landing Page</span>
                </nav>
                <div className="animate-pulse space-y-6">
                    <div className="h-8 w-48 rounded bg-neutral-200" />
                    <div className="h-[500px] rounded-2xl bg-neutral-100" />
                </div>
            </TenantLayout>
        );
    }

    if (previewMode) {
        return (
            <TenantLayout>
                <Head title={`Preview - ${title}`} />
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Preview Landing Page</h1>
                    <Button variant="secondary" size="sm" onClick={() => setPreviewMode(false)}>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                        Kembali Edit
                    </Button>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <iframe
                        src={publicUrl || '/'}
                        className="h-[calc(100vh-16rem)] w-full rounded-2xl"
                        title="Preview"
                    />
                </div>
            </TenantLayout>
        );
    }

    return (
        <TenantLayout>
            <Head title={title} />

            <nav className="mb-4 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/booking" className="transition-colors hover:text-neutral-700">Booking</Link>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                <span className="font-medium text-neutral-900">Landing Page</span>
            </nav>

            {/* Main layout: sidebar + preview + edit panel */}
            <div className="flex gap-6" style={{ height: 'calc(100vh - 10rem)' }}>
                {/* Left Sidebar */}
                <div className="flex w-[260px] shrink-0 flex-col gap-4 overflow-y-auto">
                    {/* Section List */}
                    <SidebarSectionList
                        key={config.template || 'custom'}
                        visibleSections={visibleSections}
                        availableSections={availableSections}
                        sectionLabels={sectionLabels}
                        selectedSection={selectedSection}
                        onSelect={(key) => setSelectedSection(selectedSection === key ? null : key)}
                        onRemove={removeSection}
                        onAdd={addSection}
                        onReorder={handleOrderChange}
                    />

                    {/* General Settings */}
                    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
                        <button type="button" onClick={() => setShowSettings(!showSettings)}
                            className="flex w-full items-center justify-between border-b border-neutral-200 px-4 py-3 text-left">
                            <h3 className="text-xs font-semibold tracking-wider text-neutral-500">PENGATURAN</h3>
                            <svg className={cn('h-3 w-3 text-neutral-400 transition-transform', showSettings && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                        {showSettings && (
                            <div className="space-y-4 p-4">
                                {/* Enable toggle */}
                                <div className="rounded-xl border border-neutral-200 bg-white p-3.5">
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-neutral-900">Tampilkan Landing</p>
                                            <p className="mt-0.5 text-xs text-neutral-500">Halaman publik tenant</p>
                                        </div>
                                        <button type="button" onClick={() => set('enabled', !config.enabled)}
                                            className={cn('relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200', config.enabled ? 'bg-primary' : 'bg-neutral-300')}>
                                            <span className={cn('pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200', config.enabled ? 'translate-x-4' : 'translate-x-0')} />
                                        </button>
                                    </div>
                                </div>

                                {/* Logo */}
                                <div className="rounded-xl border border-neutral-200 bg-white p-3.5">
                                    <label className="text-sm font-medium text-neutral-900">Logo</label>
                                    <div className="mt-2.5 flex items-center gap-4">
                                        {config.logo ? (
                                            <div className="relative shrink-0">
                                                <img src={config.logo} alt="Logo" className="h-12 w-12 rounded-xl border border-neutral-200 object-cover" />
                                                <button type="button" onClick={handleDeleteLogo}
                                                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-neutral-400 shadow-sm ring-1 ring-neutral-200 hover:bg-danger hover:text-white">
                                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 text-neutral-400">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-xs text-neutral-500">PNG, JPG, WEBP. Maks 3MB.</span>
                                            <label className="inline-flex cursor-pointer items-center gap-1.5 self-start rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50">
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                                                Upload Logo
                                                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Colors */}
                                <div className="rounded-xl border border-neutral-200 bg-white p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">Warna Tema</p>
                                            <p className="mt-0.5 text-xs text-neutral-500">Palet warna landing page</p>
                                        </div>
                                        <div className="flex -space-x-1">
                                            {(['primary', 'secondary', 'accent', 'background', 'text', 'text_muted'] as const).map((k) => (
                                                <div key={k} className="h-4 w-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c[k] }} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-1">
                                        {([
                                            { key: 'primary', label: 'Utama' },
                                            { key: 'secondary', label: 'Sekunder' },
                                            { key: 'accent', label: 'Aksen' },
                                            { key: 'background', label: 'Latar' },
                                            { key: 'text', label: 'Teks' },
                                            { key: 'text_muted', label: 'Redup' },
                                        ] as const).map(({ key, label }) => (
                                            <div key={key} className="flex min-w-0 items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50/60 px-2.5 py-1.5">
                                                <div className="relative shrink-0">
                                                    <div className="h-6 w-6 rounded-md border border-neutral-200 shadow-sm" style={{ backgroundColor: c[key] }} />
                                                    <input type="color" value={c[key]} onChange={(e) => set(`colors.${key}`, e.target.value)}
                                                        className="absolute inset-0 cursor-pointer opacity-0" />
                                                </div>
                                                <span className="w-14 shrink-0 truncate text-[11px] font-medium text-neutral-600">{label}</span>
                                                <input type="text" value={c[key]} onChange={(e) => set(`colors.${key}`, e.target.value)}
                                                    className="min-w-0 flex-1 rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] font-mono text-neutral-600 placeholder-neutral-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview */}
                <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                    {/* Toolbar */}
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-neutral-900">{title}</h1>
                            <p className="text-xs text-neutral-500">Klik section untuk edit, drag untuk urutkan</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm" onClick={() => setShowTemplateModal(true)}>
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0h-9m9 0H21a.75.75 0 01.75.75v11.25a.75.75 0 01-.75.75h-4.5a5.25 5.25 0 00-5.25 5.25v.75a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75v-.75A5.25 5.25 0 00.75 16.5H3a.75.75 0 01-.75-.75V4.5a.75.75 0 01.75-.75h4.5" /></svg>
                                Template
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => setPreviewMode(true)} disabled={!publicUrl}>
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Preview
                            </Button>
                            <Button size="sm" onClick={handleSave} disabled={updateSettings.isPending || !dirty} className="min-w-[100px]">
                                {updateSettings.isPending ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </div>

                    {/* Scrollable preview area */}
                    <div className="flex-1 overflow-y-auto rounded-2xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm">
                        <FadeIn>
                            <LandingPreview
                                config={config}
                                services={services}
                                packages={packages}
                                categories={categories}
                                branches={branches}
                                tenantName={config.hero?.title ? undefined : 'Your Business'}
                                selectedSection={selectedSection}
                                onSectionClick={setSelectedSection}
                                onRemoveSection={removeSection}
                            />
                        </FadeIn>
                    </div>
                </div>
            </div>

            {/* Edit Panel Drawer */}
            {selectedSection && (
                <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setSelectedSection(null)} />
            )}
            {selectedSection && (
                <EditPanel
                    sectionKey={selectedSection}
                    data={selectedSectionData}
                    set={set}
                    onClose={() => setSelectedSection(null)}
                    handleImageUpload={handleImageUpload}
                />
            )}

            {/* Template Modal */}
            <TemplateModal
                open={showTemplateModal}
                onClose={() => setShowTemplateModal(false)}
                onApply={applyTemplate}
                currentTemplate={config.template}
            />
        </TenantLayout>
    );
}
