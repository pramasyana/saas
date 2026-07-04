import type { LandingConfig, FeatureItem, StatItem, FAQItem, GalleryItem, LogoCloudItem } from '@/features/booking/hooks/useLandingSettings';
import { cn } from '@/lib/utils';

interface Props {
    sectionKey: string;
    data: Record<string, unknown>;
    set: (path: string, value: unknown) => void;
    onClose: () => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, section: string, index?: number) => void;
}

function Field({ label, hint, children, icon }: { label: string; hint?: string; children: React.ReactNode; icon?: string }) {
    return (
        <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-neutral-700">
                {icon && <span className="text-xs text-neutral-400">{icon}</span>}
                {label}
            </label>
            <div className="mt-1.5">{children}</div>
            {hint && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
        </div>
    );
}

function SectionInfo({ title, description }: { title: string; description: string }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-primary/10 bg-primary/[0.03] p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
            </div>
            <div>
                <p className="text-sm font-semibold text-neutral-700">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">{description}</p>
            </div>
        </div>
    );
}

function ic() {
    return 'block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30';
}

const sectionIcons: Record<string, string> = {
    hero: '🏠', features: '⭐', about: 'ℹ️', stats: '📊', services: '🛠️',
    team: '👥', testimonials: '💬', faq: '❓', gallery: '🖼️', cta: '📢',
    contact: '📞', branches: '📍', divider: '➖', logo_cloud: '🏢', footer: '📄',
};

const sectionLabels: Record<string, string> = {
    hero: 'Hero', features: 'Keunggulan', about: 'Tentang', stats: 'Statistik',
    services: 'Layanan', team: 'Tim', testimonials: 'Testimoni',
    faq: 'FAQ', gallery: 'Galeri', cta: 'CTA Banner', contact: 'Kontak',
    divider: 'Pemisah', logo_cloud: 'Logo Partner', footer: 'Footer',
};

export default function EditPanel({ sectionKey, data, set, onClose, handleImageUpload }: Props) {
    return (
        <div className="fixed right-0 top-0 z-50 flex h-full w-[420px] flex-col bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                <div className="flex items-center gap-2.5">
                    <span className="text-lg">{sectionIcons[sectionKey] ?? '📋'}</span>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">{sectionLabels[sectionKey] ?? sectionKey}</h3>
                        <p className="text-xs text-neutral-500">Klik di luar panel atau tekan ESC untuk tutup</p>
                    </div>
                </div>
                <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            {/* Scrollable form */}
            <div className="flex-1 overflow-y-auto p-5">
                <div className="space-y-5">
                    <SectionForm sectionKey={sectionKey} data={data} set={set} handleImageUpload={handleImageUpload} />
                </div>
            </div>
        </div>
    );
}

function SectionForm({ sectionKey, data, set, handleImageUpload }: {
    sectionKey: string;
    data: Record<string, unknown>;
    set: (path: string, value: unknown) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, section: string, index?: number) => void;
}) {
    switch (sectionKey) {
        case 'hero': return <HeroForm data={data} set={set} handleImageUpload={handleImageUpload} />;
        case 'about': return <AboutForm data={data} set={set} handleImageUpload={handleImageUpload} />;
        case 'features': return <FeaturesForm data={data} set={set} />;
        case 'stats': return <StatsForm data={data} set={set} />;
        case 'services': return <ServicesForm data={data} set={set} />;
        case 'team': return <TeamForm data={data} set={set} />;
        case 'testimonials': return <TestimonialsForm data={data} set={set} />;
        case 'faq': return <FAQForm data={data} set={set} />;
        case 'gallery': return <GalleryForm data={data} set={set} handleImageUpload={handleImageUpload} />;
        case 'cta': return <CTAForm data={data} set={set} />;
        case 'contact': return <ContactForm data={data} set={set} />;
        case 'branches': return <BranchesForm data={data} set={set} />;
        case 'divider': return <DividerForm data={data} set={set} />;
        case 'logo_cloud': return <LogoCloudForm data={data} set={set} handleImageUpload={handleImageUpload} />;
        case 'footer': return <FooterForm data={data} set={set} />;
        default: return null;
    }
}

function HeroForm({ data, set, handleImageUpload }: { data: Record<string, unknown>; set: (path: string, v: unknown) => void; handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, section: string, index?: number) => void }) {
    const d = data as LandingConfig['hero'];
    const bgType = (d as any)?.background_type ?? 'color';

    return (
        <div className="space-y-5">
            <SectionInfo
                title="Hero Section"
                description="Bagian paling atas halaman landing. Tampilkan headline, subheadline, dan ajakan bertindak yang menarik."
            />

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Konten Utama</p>
                <Field label="Judul" hint="Judul besar yang muncul pertama kali. Gunakan {nama} untuk nama bisnis.">
                    <input type="text" value={d?.title ?? ''} onChange={(e) => set('hero.title', e.target.value)} className={ic()} placeholder="Selamat Datang di {nama}" />
                </Field>
                <Field label="Subjudul" hint="Deskripsi pendukung di bawah judul.">
                    <textarea value={d?.subtitle ?? ''} onChange={(e) => set('hero.subtitle', e.target.value)} rows={2} className={ic()} placeholder="Deskripsi singkat bisnis Anda..." />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Teks Tombol" hint="Biarkan kosong untuk menyembunyikan tombol.">
                        <input type="text" value={d?.cta_text ?? ''} onChange={(e) => set('hero.cta_text', e.target.value)} className={ic()} placeholder="Booking Sekarang" />
                    </Field>
                    <Field label="Link Tombol" hint="URL tujuan saat tombol diklik.">
                        <input type="text" value={d?.cta_link ?? ''} onChange={(e) => set('hero.cta_link', e.target.value)} className={ic()} placeholder="/booking" />
                    </Field>
                </div>
            </div>

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Latar Belakang</p>
                <div className="flex gap-2">
                    {(['color', 'image', 'carousel'] as const).map((type) => {
                        const icons = { color: '🎨', image: '🖼️', carousel: '🎠' };
                        return (
                            <button key={type} type="button" onClick={() => set('hero.background_type', type)}
                                className={cn('flex-1 rounded-xl border-2 px-3 py-2.5 text-xs font-semibold transition-all flex flex-col items-center gap-1', bgType === type
                                    ? 'border-primary bg-primary/[0.06] text-primary'
                                    : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-700')}
                            >
                                <span className="text-base">{icons[type]}</span>
                                {type === 'color' ? 'Warna' : type === 'image' ? 'Gambar' : 'Carousel'}
                            </button>
                        );
                    })}
                </div>

                {bgType === 'image' && (
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-3">
                        <Field label="Upload Gambar" hint="Rekomendasi: 1920x1080px, format JPG/PNG/WebP, maks 3MB.">
                            <div className="flex items-center gap-3">
                                {(d as any)?.background_image ? (
                                    <div className="relative group">
                                        <img src={(d as any).background_image} alt="" className="h-16 w-28 rounded-lg border border-neutral-200 object-cover shadow-sm" />
                                        <button type="button" onClick={() => set('hero.background_image', null)}
                                            className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-white text-neutral-300">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                                    </div>
                                )}
                                <label className="cursor-pointer rounded-lg bg-white px-3.5 py-2 text-xs font-medium text-neutral-700 ring-1 ring-inset ring-neutral-300 transition-colors hover:bg-neutral-50">
                                    Pilih File
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'hero_background')} />
                                </label>
                            </div>
                        </Field>
                        <Field label="Gelap Overlay" hint="Semakin tinggi nilai, semakin gelap efek bayangan di atas gambar.">
                            <div className="flex items-center gap-3">
                                {(() => {
                                    const overlayVal = (d as any)?.overlay_opacity ?? 50;
                                    return (
                                        <>
                                            <input type="range" min={0} max={100} value={overlayVal}
                                                onChange={(e) => set('hero.overlay_opacity', Number(e.target.value))}
                                                className="flex-1 accent-primary cursor-pointer" />
                                            <span className="w-10 text-right text-xs font-semibold text-neutral-600">{overlayVal}%</span>
                                        </>
                                    );
                                })()}
                            </div>
                        </Field>
                    </div>
                )}

                {bgType === 'carousel' && (
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-4">
                        <Field label="Interval" hint="Waktu perpindahan antar slide dalam detik.">
                            <div className="flex items-center gap-3">
                                <input type="range" min={2} max={10} step={1} value={((d as any)?.carousel_interval ?? 5000) / 1000}
                                    onChange={(e) => set('hero.carousel_interval', Number(e.target.value) * 1000)}
                                    className="flex-1 accent-primary cursor-pointer" />
                                <span className="w-14 text-right text-xs font-semibold text-neutral-600">{(d as any)?.carousel_interval ?? 5000 / 1000} dtk</span>
                            </div>
                        </Field>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-neutral-500">Slide ({((d as any)?.carousel_items ?? []).length}/5)</span>
                                <button type="button" onClick={() => {
                                    const items = [...((d as any)?.carousel_items ?? [])];
                                    if (items.length >= 5) return;
                                    items.push({ title: '', subtitle: '', cta_text: '', cta_link: '', background_image: null });
                                    set('hero.carousel_items', items);
                                }}
                                    className="rounded-lg border border-primary/30 bg-primary/[0.06] px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/10 disabled:opacity-30"
                                    disabled={((d as any)?.carousel_items ?? []).length >= 5}
                                >
                                    + Tambah Slide
                                </button>
                            </div>
                            {((d as any)?.carousel_items ?? []).length === 0 && (
                                <div className="flex flex-col items-center gap-2 py-6 text-center">
                                    <span className="text-2xl">🖼️</span>
                                    <p className="text-xs text-neutral-400">Belum ada slide. Klik <strong>Tambah Slide</strong> untuk memulai.</p>
                                </div>
                            )}
                            {((d as any)?.carousel_items ?? []).map((item: NonNullable<NonNullable<LandingConfig['hero']>['carousel_items']>[number], i: number) => (
                                <div key={i} className="rounded-xl border border-neutral-200 bg-white p-3 space-y-2.5 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                                            <span className="text-[11px] font-semibold text-neutral-500">Slide {i + 1}</span>
                                        </div>
                                        <button type="button" onClick={() => {
                                            const items = [...((d as any)?.carousel_items ?? [])];
                                            items.splice(i, 1);
                                            set('hero.carousel_items', items);
                                        }}
                                            className="flex h-5 w-5 items-center justify-center rounded text-neutral-400 hover:bg-red-50 hover:text-danger transition-colors">
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="shrink-0">
                                            {item.background_image ? (
                                                <div className="relative group">
                                                    <img src={item.background_image} alt="" className="h-12 w-20 rounded-lg border border-neutral-200 object-cover" />
                                                    <button type="button" onClick={() => {
                                                        const items = [...((d as any)?.carousel_items ?? [])];
                                                        items[i] = { ...items[i], background_image: null };
                                                        set('hero.carousel_items', items);
                                                    }}
                                                        className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-danger text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <svg className="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex h-12 w-20 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 text-neutral-300">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                                                </div>
                                            )}
                                            <label className="mt-1 flex cursor-pointer items-center justify-center gap-0.5 text-[10px] text-primary hover:underline">
                                                <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                                                Ganti
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'hero_carousel', i)} />
                                            </label>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input type="text" value={item.title} onChange={(e) => {
                                                const items = [...((d as any)?.carousel_items ?? [])];
                                                items[i] = { ...items[i], title: e.target.value };
                                                set('hero.carousel_items', items);
                                            }} className="block w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-xs text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Judul slide" />
                                            <input type="text" value={item.subtitle} onChange={(e) => {
                                                const items = [...((d as any)?.carousel_items ?? [])];
                                                items[i] = { ...items[i], subtitle: e.target.value };
                                                set('hero.carousel_items', items);
                                            }} className="block w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-xs text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Subjudul slide" />
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <input type="text" value={item.cta_text} onChange={(e) => {
                                                    const items = [...((d as any)?.carousel_items ?? [])];
                                                    items[i] = { ...items[i], cta_text: e.target.value };
                                                    set('hero.carousel_items', items);
                                                }} className="block w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-xs text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Teks tombol" />
                                                <input type="text" value={item.cta_link} onChange={(e) => {
                                                    const items = [...((d as any)?.carousel_items ?? [])];
                                                    items[i] = { ...items[i], cta_link: e.target.value };
                                                    set('hero.carousel_items', items);
                                                }} className="block w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-xs text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="/booking" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function AboutForm({ data, set, handleImageUpload }: { data: Record<string, unknown>; set: (path: string, v: unknown) => void; handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, section: string) => void }) {
    const d = data as LandingConfig['about'];

    return (
        <div className="space-y-5">
            <SectionInfo
                title="Tentang Kami"
                description="Bagian yang menceritakan kisah bisnis Anda. Tampilkan foto dan cerita untuk membangun kepercayaan dengan calon pelanggan."
            />

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Konten</p>
                <Field label="Judul" hint="Judul bagian tentang kami.">
                    <input type="text" value={d?.title ?? ''} onChange={(e) => set('about.title', e.target.value)} className={ic()} placeholder="Tentang Kami" />
                </Field>
                <Field label="Konten" hint="Ceritakan sejarah, visi, misi, atau nilai unik bisnis Anda.">
                    <textarea value={d?.content ?? ''} onChange={(e) => set('about.content', e.target.value)} rows={5} className={ic()} placeholder="Cerita bisnis Anda..." />
                </Field>
            </div>

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Gambar</p>
                <Field label="Foto" hint="Rekomendasi: 800x600px, format persegi panjang. Tampilkan foto tim, tempat, atau produk.">
                    <div className="flex items-center gap-4">
                        {d?.image && (
                            <div className="relative group">
                                <img src={d.image} alt="About" className="h-20 w-32 rounded-lg border border-neutral-200 object-cover shadow-sm" />
                                <button type="button" onClick={() => set('about.image', null)}
                                    className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        )}
                        <label className="cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-700 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50">
                            Pilih File <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'about')} />
                        </label>
                    </div>
                </Field>
            </div>
        </div>
    );
}

function FeaturesForm({ data, set }: { data: Record<string, unknown>; set: (path: string, v: unknown) => void }) {
    const d = data as LandingConfig['features'];
    const items = d?.items ?? [];

    function setItem(i: number, field: string, value: string) {
        const newItems = [...items];
        newItems[i] = { ...newItems[i], [field]: value };
        set('features.items', newItems);
    }

    function addItem() {
        set('features.items', [...items, { icon: 'star', title: '', description: '' }]);
    }

    function removeItem(i: number) {
        set('features.items', items.filter((_: unknown, idx: number) => idx !== i));
    }

    return (
        <div className="space-y-5">
            <SectionInfo
                title="Keunggulan"
                description="Soroti keunggulan atau nilai jual bisnis Anda. Setiap fitur ditampilkan dengan ikon, judul, dan deskripsi singkat."
            />

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Konten Utama</p>
                <Field label="Judul" hint="Judul utama bagian keunggulan.">
                    <input type="text" value={d?.title ?? ''} onChange={(e) => set('features.title', e.target.value)} className={ic()} placeholder="Mengapa Memilih Kami" />
                </Field>
                <Field label="Subjudul" hint="Deskripsi pendukung di bawah judul.">
                    <input type="text" value={d?.subtitle ?? ''} onChange={(e) => set('features.subtitle', e.target.value)} className={ic()} placeholder="Keunggulan bisnis kami" />
                </Field>
            </div>

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Daftar Fitur</p>
                {items.map((item: FeatureItem, i: number) => (
                    <div key={i} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                                <span className="text-xs font-semibold text-neutral-500">Fitur #{i + 1}</span>
                            </div>
                            <button type="button" onClick={() => removeItem(i)} className="text-xs text-danger hover:underline">Hapus</button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                            <Field label="Ikon" hint="Nama ikon Feather Icons (contoh: star, heart, shield).">
                                <input type="text" value={item.icon ?? ''} onChange={(e) => setItem(i, 'icon', e.target.value)} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="star" />
                            </Field>
                            <Field label="Judul" hint="Nama fitur.">
                                <input type="text" value={item.title} onChange={(e) => setItem(i, 'title', e.target.value)} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="Nama fitur" />
                            </Field>
                            <Field label="Deskripsi" hint="Penjelasan singkat fitur.">
                                <input type="text" value={item.description} onChange={(e) => setItem(i, 'description', e.target.value)} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="Deskripsi fitur" />
                            </Field>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addItem} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-500 transition-colors hover:border-primary hover:text-primary">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Tambah Fitur
                </button>
            </div>
        </div>
    );
}

function StatsForm({ data, set }: { data: Record<string, unknown>; set: (path: string, v: unknown) => void }) {
    const d = data as LandingConfig['stats'];
    const items = d?.items ?? [];

    function setItem(i: number, field: string, value: string) {
        const newItems = [...items];
        newItems[i] = { ...newItems[i], [field]: value };
        set('stats.items', newItems);
    }

    function addItem() {
        set('stats.items', [...items, { number: '', label: '' }]);
    }

    function removeItem(i: number) {
        set('stats.items', items.filter((_: unknown, idx: number) => idx !== i));
    }

    return (
        <div className="space-y-5">
            <SectionInfo
                title="Statistik"
                description="Tampilkan angka-angka penting bisnis Anda seperti jumlah pelanggan, layanan, atau tahun pengalaman dalam baris horizontal."
            />

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Daftar Statistik</p>
                {items.length === 0 && (
                    <div className="flex flex-col items-center gap-2 py-6 text-center">
                        <span className="text-2xl">📊</span>
                        <p className="text-xs text-neutral-400">Belum ada data statistik. Klik <strong>Tambah Statistik</strong> untuk memulai.</p>
                    </div>
                )}
                {items.map((item: StatItem, i: number) => (
                    <div key={i} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                                <span className="text-xs font-semibold text-neutral-500">Statistik #{i + 1}</span>
                            </div>
                            <button type="button" onClick={() => removeItem(i)} className="text-xs text-danger hover:underline">Hapus</button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Field label="Angka" hint="Contoh: 500+, 10,000, 99%">
                                <input type="text" value={item.number} onChange={(e) => setItem(i, 'number', e.target.value)} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="500+" />
                            </Field>
                            <Field label="Label" hint="Contoh: Pelanggan Puas, Layanan Tersedia">
                                <input type="text" value={item.label} onChange={(e) => setItem(i, 'label', e.target.value)} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="Pelanggan Puas" />
                            </Field>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addItem} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-500 transition-colors hover:border-primary hover:text-primary">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Tambah Statistik
                </button>
            </div>
        </div>
    );
}

function ServicesForm({ data, set }: { data: Record<string, unknown>; set: (path: string, v: unknown) => void }) {
    const d = data as LandingConfig['services'];

    return (
        <div className="space-y-5">
            <SectionInfo
                title="Layanan"
                description="Menampilkan daftar layanan dan paket yang tersedia. Data diambil otomatis dari menu Layanan — cukup atur judul dan subjudul di sini."
            />

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Konten Utama</p>
                <Field label="Judul" hint="Judul bagian layanan.">
                    <input type="text" value={d?.title ?? ''} onChange={(e) => set('services.title', e.target.value)} className={ic()} placeholder="Layanan Kami" />
                </Field>
                <Field label="Subjudul" hint="Deskripsi pendukung di bawah judul.">
                    <input type="text" value={d?.subtitle ?? ''} onChange={(e) => set('services.subtitle', e.target.value)} className={ic()} placeholder="Pilihan layanan untuk Anda" />
                </Field>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">i</span>
                    <p className="text-xs font-semibold text-neutral-700">Informasi</p>
                </div>
                <p className="text-xs text-neutral-500">Data layanan, paket, kategori, harga, dan diskon ditampilkan secara otomatis dari menu <strong>Layanan</strong>. Kelola layanan di menu samping untuk mengubah konten yang tampil.</p>
            </div>
        </div>
    );
}

function TeamForm({ data, set }: { data: Record<string, unknown>; set: (path: string, v: unknown) => void }) {
    const d = data as LandingConfig['team'];

    return (
        <div className="space-y-5">
            <SectionInfo
                title="Tim"
                description="Kenalkan tim profesional Anda kepada calon pelanggan. Data diambil otomatis dari menu Staff."
            />

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Konten Utama</p>
                <Field label="Judul" hint="Judul bagian tim.">
                    <input type="text" value={d?.title ?? ''} onChange={(e) => set('team.title', e.target.value)} className={ic()} placeholder="Tim Kami" />
                </Field>
                <Field label="Subjudul" hint="Deskripsi pendukung di bawah judul.">
                    <input type="text" value={d?.subtitle ?? ''} onChange={(e) => set('team.subtitle', e.target.value)} className={ic()} placeholder="Kenali tim profesional kami" />
                </Field>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">i</span>
                    <p className="text-xs font-semibold text-neutral-700">Informasi</p>
                </div>
                <p className="text-xs text-neutral-500">Data anggota tim diambil otomatis dari menu <strong>Staff</strong>. Kelola staff di menu samping untuk mengubah konten yang tampil.</p>
            </div>
        </div>
    );
}

function TestimonialsForm({ data, set }: { data: Record<string, unknown>; set: (path: string, v: unknown) => void }) {
    const d = data as LandingConfig['testimonials'];
    const items = d?.items ?? [];

    function setItem(i: number, field: string, value: unknown) {
        const newItems = [...items];
        newItems[i] = { ...newItems[i], [field]: value };
        set('testimonials.items', newItems);
    }

    function addItem() {
        set('testimonials.items', [...items, { name: '', role: '', content: '', rating: 5 }]);
    }

    function removeItem(i: number) {
        set('testimonials.items', items.filter((_: unknown, idx: number) => idx !== i));
    }

    return (
        <div className="space-y-5">
            <SectionInfo
                title="Testimoni"
                description="Tampilkan ulasan dan pengalaman pelanggan untuk membangun kepercayaan. Setiap testimoni menampilkan nama, foto, rating bintang, dan isi testimoni."
            />

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Konten Utama</p>
                <Field label="Judul" hint="Judul bagian testimoni.">
                    <input type="text" value={d?.title ?? ''} onChange={(e) => set('testimonials.title', e.target.value)} className={ic()} placeholder="Apa Kata Mereka" />
                </Field>
                <Field label="Subjudul" hint="Deskripsi pendukung.">
                    <input type="text" value={d?.subtitle ?? ''} onChange={(e) => set('testimonials.subtitle', e.target.value)} className={ic()} placeholder="Testimoni dari pelanggan setia kami" />
                </Field>
            </div>

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Daftar Testimoni</p>
                {items.length === 0 && (
                    <div className="flex flex-col items-center gap-2 py-6 text-center">
                        <span className="text-2xl">💬</span>
                        <p className="text-xs text-neutral-400">Belum ada testimoni. Klik <strong>Tambah Testimoni</strong> untuk memulai.</p>
                    </div>
                )}
                {items.map((item: { name: string; role?: string; content: string; rating: number }, i: number) => (
                    <div key={i} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                                <span className="text-xs font-semibold text-neutral-500">Testimoni #{i + 1}</span>
                            </div>
                            <button type="button" onClick={() => removeItem(i)} className="text-xs text-danger hover:underline">Hapus</button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Field label="Nama" hint="Nama lengkap pelanggan.">
                                <input type="text" value={item.name} onChange={(e) => setItem(i, 'name', e.target.value)} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="Nama pelanggan" />
                            </Field>
                            <Field label="Role / Jabatan" hint="Contoh: CEO, Founder, atau Pelanggan Setia.">
                                <input type="text" value={item.role ?? ''} onChange={(e) => setItem(i, 'role', e.target.value)} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="CEO Perusahaan" />
                            </Field>
                        </div>
                        <Field label="Testimoni" hint="Isi ulasan atau pengalaman pelanggan.">
                            <textarea value={item.content} onChange={(e) => setItem(i, 'content', e.target.value)} rows={2} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="Ulasan pelanggan..." />
                        </Field>
                        <Field label="Rating" hint="Pilih jumlah bintang dari 1-5.">
                            <div className="mt-1 flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} type="button" onClick={() => setItem(i, 'rating', star)}
                                        className={cn('h-8 w-8 rounded-lg text-sm transition-colors', star <= item.rating ? 'bg-amber-100 text-amber-500' : 'bg-neutral-200 text-neutral-400')}>
                                        ★
                                    </button>
                                ))}
                            </div>
                        </Field>
                    </div>
                ))}
                <button type="button" onClick={addItem} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-500 transition-colors hover:border-primary hover:text-primary">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Tambah Testimoni
                </button>
            </div>
        </div>
    );
}

function FAQForm({ data, set }: { data: Record<string, unknown>; set: (path: string, v: unknown) => void }) {
    const d = data as LandingConfig['faq'];
    const items = d?.items ?? [];

    function setItem(i: number, field: string, value: string) {
        const newItems = [...items];
        newItems[i] = { ...newItems[i], [field]: value };
        set('faq.items', newItems);
    }

    function addItem() {
        set('faq.items', [...items, { question: '', answer: '' }]);
    }

    function removeItem(i: number) {
        set('faq.items', items.filter((_: unknown, idx: number) => idx !== i));
    }

    return (
        <div className="space-y-5">
            <SectionInfo
                title="FAQ"
                description="Jawab pertanyaan yang sering diajukan pelanggan. Membantu mengurangi keraguan sebelum melakukan booking."
            />

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Konten Utama</p>
                <Field label="Judul" hint="Judul bagian FAQ.">
                    <input type="text" value={d?.title ?? ''} onChange={(e) => set('faq.title', e.target.value)} className={ic()} placeholder="Pertanyaan Umum" />
                </Field>
                <Field label="Subjudul" hint="Deskripsi pendukung.">
                    <input type="text" value={d?.subtitle ?? ''} onChange={(e) => set('faq.subtitle', e.target.value)} className={ic()} placeholder="Temukan jawabannya di sini" />
                </Field>
            </div>

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Daftar Pertanyaan</p>
                {items.length === 0 && (
                    <div className="flex flex-col items-center gap-2 py-6 text-center">
                        <span className="text-2xl">❓</span>
                        <p className="text-xs text-neutral-400">Belum ada pertanyaan. Klik <strong>Tambah FAQ</strong> untuk memulai.</p>
                    </div>
                )}
                {items.map((item: FAQItem, i: number) => (
                    <div key={i} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                                <span className="text-xs font-semibold text-neutral-500">FAQ #{i + 1}</span>
                            </div>
                            <button type="button" onClick={() => removeItem(i)} className="text-xs text-danger hover:underline">Hapus</button>
                        </div>
                        <Field label="Pertanyaan" hint="Pertanyaan yang sering diajukan pelanggan.">
                            <input type="text" value={item.question} onChange={(e) => setItem(i, 'question', e.target.value)} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="Pertanyaan..." />
                        </Field>
                        <Field label="Jawaban" hint="Jawaban yang jelas dan membantu.">
                            <textarea value={item.answer} onChange={(e) => setItem(i, 'answer', e.target.value)} rows={3} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="Jawaban..." />
                        </Field>
                    </div>
                ))}
                <button type="button" onClick={addItem} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-500 transition-colors hover:border-primary hover:text-primary">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Tambah FAQ
                </button>
            </div>
        </div>
    );
}

function GalleryForm({ data, set, handleImageUpload }: { data: Record<string, unknown>; set: (path: string, v: unknown) => void; handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, section: string, index?: number) => void }) {
    const d = data as LandingConfig['gallery'];
    const items = d?.items ?? [];

    function setItem(i: number, field: string, value: string) {
        const newItems = [...items];
        newItems[i] = { ...newItems[i], [field]: value };
        set('gallery.items', newItems);
    }

    function addItem() {
        set('gallery.items', [...items, { image: '', title: '', description: '' }]);
    }

    function removeItem(i: number) {
        set('gallery.items', items.filter((_: unknown, idx: number) => idx !== i));
    }

    return (
        <div className="space-y-5">
            <SectionInfo
                title="Galeri"
                description="Tampilkan foto-foto hasil kerja, suasana tempat, atau momen-momen istimewa untuk meyakinkan calon pelanggan."
            />

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Konten Utama</p>
                <Field label="Judul" hint="Judul bagian galeri.">
                    <input type="text" value={d?.title ?? ''} onChange={(e) => set('gallery.title', e.target.value)} className={ic()} placeholder="Galeri Kami" />
                </Field>
                <Field label="Subjudul" hint="Deskripsi pendukung.">
                    <input type="text" value={d?.subtitle ?? ''} onChange={(e) => set('gallery.subtitle', e.target.value)} className={ic()} placeholder="Dokumentasi kegiatan kami" />
                </Field>
            </div>

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Daftar Gambar</p>
                {items.length === 0 && (
                    <div className="flex flex-col items-center gap-2 py-6 text-center">
                        <span className="text-2xl">🖼️</span>
                        <p className="text-xs text-neutral-400">Belum ada gambar. Klik <strong>Tambah Gambar</strong> untuk memulai.</p>
                    </div>
                )}
                {items.map((item: GalleryItem, i: number) => (
                    <div key={i} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                                <span className="text-xs font-semibold text-neutral-500">Gambar #{i + 1}</span>
                            </div>
                            <button type="button" onClick={() => removeItem(i)} className="text-xs text-danger hover:underline">Hapus</button>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="shrink-0">
                                {item.image ? (
                                    <div className="relative group">
                                        <img src={item.image} alt="" className="h-16 w-24 rounded-lg border border-neutral-200 object-cover shadow-sm" />
                                        <button type="button" onClick={() => {
                                            const newItems = [...items];
                                            newItems[i] = { ...newItems[i], image: '' };
                                            set('gallery.items', newItems);
                                        }}
                                            className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex h-16 w-24 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-white text-neutral-400">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <Field label="Judul" hint="Nama atau keterangan gambar.">
                                    <input type="text" value={item.title ?? ''} onChange={(e) => setItem(i, 'title', e.target.value)} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="Judul" />
                                </Field>
                                <Field label="Deskripsi" hint="Penjelasan singkat gambar.">
                                    <input type="text" value={item.description ?? ''} onChange={(e) => setItem(i, 'description', e.target.value)} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="Deskripsi" />
                                </Field>
                                <label className="cursor-pointer inline-flex items-center gap-1 text-xs text-primary hover:underline">
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                                    Upload Gambar
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'gallery', i)} />
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addItem} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-500 transition-colors hover:border-primary hover:text-primary">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Tambah Gambar
                </button>
            </div>
        </div>
    );
}

function CTAForm({ data, set }: { data: Record<string, unknown>; set: (path: string, v: unknown) => void }) {
    const d = data as LandingConfig['cta'];

    return (
        <div className="space-y-5">
            <SectionInfo
                title="CTA Banner"
                description="Banner ajakan bertindak di akhir halaman. Dorong pengunjung untuk segera melakukan booking atau menghubungi Anda."
            />

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Konten</p>
                <Field label="Judul" hint="Judul utama banner yang menarik perhatian.">
                    <input type="text" value={d?.title ?? ''} onChange={(e) => set('cta.title', e.target.value)} className={ic()} placeholder="Siap Booking?" />
                </Field>
                <Field label="Subjudul" hint="Ajakan atau penjelasan singkat.">
                    <textarea value={d?.subtitle ?? ''} onChange={(e) => set('cta.subtitle', e.target.value)} rows={2} className={ic()} placeholder="Ajakan untuk bertindak..." />
                </Field>
            </div>

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Tombol</p>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Teks Tombol" hint="Teks pada tombol ajakan.">
                        <input type="text" value={d?.button_text ?? ''} onChange={(e) => set('cta.button_text', e.target.value)} className={ic()} placeholder="Booking Sekarang" />
                    </Field>
                    <Field label="Link Tombol" hint="URL tujuan tombol.">
                        <input type="text" value={d?.button_link ?? ''} onChange={(e) => set('cta.button_link', e.target.value)} className={ic()} placeholder="/booking" />
                    </Field>
                </div>
            </div>

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Warna</p>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Warna Latar" hint="Pilih warna background banner.">
                        <input type="color" value={d?.background_color ?? '#7C3AED'} onChange={(e) => set('cta.background_color', e.target.value)} className="h-10 w-full cursor-pointer rounded-lg border border-neutral-300 bg-white p-0.5" />
                    </Field>
                    <Field label="Warna Teks" hint="Pilih warna teks di atas banner.">
                        <input type="color" value={d?.text_color ?? '#FFFFFF'} onChange={(e) => set('cta.text_color', e.target.value)} className="h-10 w-full cursor-pointer rounded-lg border border-neutral-300 bg-white p-0.5" />
                    </Field>
                </div>
            </div>
        </div>
    );
}

function ContactForm({ data, set }: { data: Record<string, unknown>; set: (path: string, v: unknown) => void }) {
    const d = data as LandingConfig['contact'];

    return (
        <div className="space-y-5">
            <SectionInfo
                title="Kontak"
                description="Informasi kontak bisnis Anda. Alamat, telepon, email, dan WhatsApp otomatis terisi dari cabang utama — cukup atur judul dan peta di sini."
            />

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Konten Utama</p>
                <Field label="Judul" hint="Judul bagian kontak.">
                    <input type="text" value={d?.title ?? ''} onChange={(e) => set('contact.title', e.target.value)} className={ic()} placeholder="Hubungi Kami" />
                </Field>
                <Field label="Subjudul" hint="Deskripsi pendukung.">
                    <input type="text" value={d?.subtitle ?? ''} onChange={(e) => set('contact.subtitle', e.target.value)} className={ic()} placeholder="Senang mendengar dari Anda" />
                </Field>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">i</span>
                    <p className="text-xs font-semibold text-neutral-700">Data Otomatis dari Cabang</p>
                </div>
                <p className="text-xs text-neutral-500">Alamat, telepon, email, dan WhatsApp ditampilkan secara otomatis dari <strong>cabang utama (default)</strong>. Edit data kontak di menu <strong>Perusahaan → Cabang</strong>.</p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">i</span>
                    <p className="text-xs font-semibold text-neutral-700">Peta Otomatis dari Cabang</p>
                </div>
                <p className="text-xs text-neutral-500">Peta Google Maps ditampilkan secara otomatis dari URL embed yang disimpan di <strong>cabang utama (default)</strong>. Atur peta di menu <strong>Perusahaan → Cabang</strong>.</p>
            </div>
        </div>
    );
}

function BranchesForm({ data, set }: { data: Record<string, unknown>; set: (path: string, v: unknown) => void }) {
    const d = data as Record<string, unknown>;

    return (
        <div className="space-y-5">
            <SectionInfo
                title="Cabang"
                description="Menampilkan daftar cabang bisnis Anda. Data diambil otomatis dari menu Perusahaan → Cabang."
            />

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Konten Utama</p>
                <Field label="Judul" hint="Judul bagian cabang.">
                    <input type="text" value={String(d.title ?? '')} onChange={(e) => set('branches.title', e.target.value)} className={ic()} placeholder="Cabang Kami" />
                </Field>
                <Field label="Subjudul" hint="Deskripsi pendukung.">
                    <input type="text" value={String(d.subtitle ?? '')} onChange={(e) => set('branches.subtitle', e.target.value)} className={ic()} placeholder="Temukan cabang terdekat" />
                </Field>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">i</span>
                    <p className="text-xs font-semibold text-neutral-700">Informasi</p>
                </div>
                <p className="text-xs text-neutral-500">Data cabang diambil otomatis dari daftar cabang aktif. Kelola cabang di menu <strong>Perusahaan → Cabang</strong>.</p>
            </div>
        </div>
    );
}

function DividerForm({ data, set }: { data: Record<string, unknown>; set: (path: string, v: unknown) => void }) {
    const d = data as LandingConfig['divider'];
    const styles = ['line', 'dots', 'wave', 'space'] as const;

    return (
        <div className="space-y-5">
            <SectionInfo
                title="Pemisah"
                description="Pemisah visual antar bagian halaman. Pilih dari beberapa gaya yang tersedia untuk memberi jeda yang menarik."
            />

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Tipe</p>
                <Field label="Gaya Pemisah" hint="Pilih tampilan pemisah antar bagian.">
                    <div className="flex flex-wrap gap-2">
                        {styles.map((s) => (
                            <button key={s} type="button" onClick={() => set('divider.style', s)}
                                className={cn('rounded-lg border px-4 py-2 text-sm transition-all capitalize', (d?.style ?? 'line') === s ? 'border-primary bg-primary-50 font-medium text-primary' : 'border-neutral-300 bg-white text-neutral-600 hover:border-primary/40')}>
                                {s === 'space' ? 'Spasi Kosong' : s === 'dots' ? 'Titik-titik' : s === 'wave' ? 'Gelombang' : 'Garis'}
                            </button>
                        ))}
                    </div>
                </Field>
            </div>

            {d?.style !== 'space' && (
                <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Ukuran</p>
                    <Field label="Tinggi (px)" hint="Semakin tinggi nilai, semakin besar jarak vertikal pemisah.">
                        <input type="number" value={d?.height ?? 60} onChange={(e) => set('divider.height', parseInt(e.target.value) || 60)} className="block w-32 rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm" min={20} max={200} />
                    </Field>
                </div>
            )}
        </div>
    );
}

function LogoCloudForm({ data, set, handleImageUpload }: { data: Record<string, unknown>; set: (path: string, v: unknown) => void; handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, section: string, index: number) => void }) {
    const d = data as LandingConfig['logo_cloud'];
    const items = d?.items ?? [];

    function setItem(i: number, field: string, value: string) {
        const newItems = [...items];
        newItems[i] = { ...newItems[i], [field]: value };
        set('logo_cloud.items', newItems);
    }

    function addItem() {
        set('logo_cloud.items', [...items, { image: '', name: '', url: '' }]);
    }

    function removeItem(i: number) {
        set('logo_cloud.items', items.filter((_: unknown, idx: number) => idx !== i));
    }

    return (
        <div className="space-y-5">
            <SectionInfo
                title="Logo Partner"
                description="Tampilkan logo mitra atau klien untuk membangun kredibilitas bisnis. Cocok untuk menampilkan brand yang sudah bekerja sama."
            />

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Konten Utama</p>
                <Field label="Judul" hint="Judul bagian logo partner.">
                    <input type="text" value={d?.title ?? ''} onChange={(e) => set('logo_cloud.title', e.target.value)} className={ic()} placeholder="Dipercaya oleh" />
                </Field>
            </div>

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Daftar Partner</p>
                {items.length === 0 && (
                    <div className="flex flex-col items-center gap-2 py-6 text-center">
                        <span className="text-2xl">🏢</span>
                        <p className="text-xs text-neutral-400">Belum ada partner. Klik <strong>Tambah Partner</strong> untuk memulai.</p>
                    </div>
                )}
                {items.map((item: LogoCloudItem, i: number) => (
                    <div key={i} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                                <span className="text-xs font-semibold text-neutral-500">Partner #{i + 1}</span>
                            </div>
                            <button type="button" onClick={() => removeItem(i)} className="text-xs text-danger hover:underline">Hapus</button>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="shrink-0">
                                {item.image ? (
                                    <div className="relative group">
                                        <img src={item.image} alt="" className="h-12 w-20 rounded-lg border border-neutral-200 object-contain bg-white shadow-sm" />
                                        <button type="button" onClick={() => {
                                            const newItems = [...items];
                                            newItems[i] = { ...newItems[i], image: '' };
                                            set('logo_cloud.items', newItems);
                                        }}
                                            className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-white text-neutral-400">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <Field label="Nama Partner" hint="Nama perusahaan atau brand.">
                                        <input type="text" value={item.name ?? ''} onChange={(e) => setItem(i, 'name', e.target.value)} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="Nama partner" />
                                    </Field>
                                    <Field label="URL Website" hint="Link ke website partner (opsional).">
                                        <input type="text" value={item.url ?? ''} onChange={(e) => setItem(i, 'url', e.target.value)} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="https://..." />
                                    </Field>
                                </div>
                                <label className="cursor-pointer inline-flex items-center gap-1 text-xs text-primary hover:underline">
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                                    Upload Logo
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo_cloud', i)} />
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addItem} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-500 transition-colors hover:border-primary hover:text-primary">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Tambah Partner
                </button>
            </div>
        </div>
    );
}

function FooterForm({ data, set }: { data: Record<string, unknown>; set: (path: string, v: unknown) => void }) {
    const d = data as LandingConfig['footer'];

    return (
        <div className="space-y-5">
            <SectionInfo
                title="Footer"
                description="Bagian paling bawah halaman. Biasanya berisi informasi hak cipta dan tautan penting."
            />

            <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Konten</p>
                <Field label="Teks Copyright" icon="©" hint="Gunakan {'{company_name}'} sebagai placeholder nama perusahaan. Contoh: © 2026 {company_name}. All rights reserved.">
                    <input type="text" value={d?.copyright_text ?? ''} onChange={(e) => set('footer.copyright_text', e.target.value)} className={ic()} placeholder="© 2026 {company_name}. All rights reserved." />
                </Field>
            </div>
        </div>
    );
}
