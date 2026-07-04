import { useState } from 'react';
import Button from '@/atoms/Button';
import { defaultLandingTemplate } from '@/features/booking/data/defaultLandingTemplate';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';
import { cn } from '@/lib/utils';
import Modal from '@/molecules/Modal';

interface TemplateCard {
    key: string;
    name: string;
    badge: { text: string; className: string };
    gradient: string;
    letter: string;
    description: string;
    colors: string[];
    sectionCount: number;
    displayTags: string[];
    extraTags: number;
    config: LandingConfig;
}

interface TemplateModalProps {
    open: boolean;
    onClose: () => void;
    onApply: (template: LandingConfig) => void;
    currentTemplate?: string;
}

const templates: TemplateCard[] = [
    {
        key: 'lumina',
        name: 'Lumina Wellness',
        badge: { text: 'Paling Baru', className: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200/50' },
        gradient: 'from-violet-600 to-indigo-600',
        letter: 'L',
        description: 'Desain modern dengan palet warna MD3 purple. Glassmorphic cards, mesh gradient CTA, dan layout refined.',
        colors: ['#6B38D4', '#4648D4', '#855000', '#FAF8FF', '#131B2E'],
        sectionCount: 15,
        displayTags: ['Hero 2-Kolom', 'Glass Cards', 'Gradient CTA', 'Filter Pills', 'Newsletter'],
        extraTags: 10,
        config: defaultLandingTemplate,
    },
    {
        key: 'clean-business',
        name: 'Clean Business',
        badge: { text: 'Paling Populer', className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/50' },
        gradient: 'from-violet-600 to-purple-600',
        letter: 'B',
        description: 'Template profesional dengan semua bagian lengkap. Cocok untuk bisnis jasa, salon, atau klinik.',
        colors: ['#7C3AED', '#10B981', '#F59E0B', '#FAFAFA', '#171717'],
        sectionCount: 15,
        displayTags: ['Hero', 'Keunggulan', 'Tentang', 'Statistik', 'Layanan'],
        extraTags: 10,
        config: {
            ...defaultLandingTemplate,
            template: 'clean-business',
            colors: {
                primary: '#7C3AED',
                secondary: '#10B981',
                accent: '#F59E0B',
                background: '#FAFAFA',
                text: '#171717',
                text_muted: '#737373',
            },
            cta: {
                ...defaultLandingTemplate.cta!,
                background_color: '#7C3AED',
            },
        },
    },
    {
        key: 'modern-minimalis',
        name: 'Modern Minimalis',
        badge: { text: 'Baru', className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50' },
        gradient: 'from-blue-500 to-cyan-500',
        letter: 'M',
        description: 'Desain minimalis modern dengan palet warna biru-sian. Fokus pada konten dan pengalaman pengguna.',
        colors: ['#3B82F6', '#06B6D4', '#F97316', '#FAFAFA', '#171717'],
        sectionCount: 10,
        displayTags: ['Hero', 'Keunggulan', 'Tentang', 'Layanan', 'Tim'],
        extraTags: 5,
        config: {
            ...defaultLandingTemplate,
            template: 'modern-minimalis',
            section_order: [
                'hero', 'features', 'about', 'services', 'team',
                'testimonials', 'faq', 'cta', 'contact', 'footer',
            ],
            colors: {
                primary: '#3B82F6',
                secondary: '#06B6D4',
                accent: '#F97316',
                background: '#FAFAFA',
                text: '#171717',
                text_muted: '#737373',
            },
            cta: {
                ...defaultLandingTemplate.cta!,
                background_color: '#3B82F6',
            },
        },
    },
    {
        key: 'portfolio',
        name: 'Portfolio',
        badge: { text: 'Ringan', className: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/50' },
        gradient: 'from-rose-500 to-pink-500',
        letter: 'P',
        description: 'Tampilan sederhana dan elegan untuk portfolio atau personal brand. Hanya bagian paling esensial.',
        colors: ['#7C3AED', '#10B981', '#F59E0B', '#FAFAFA', '#171717'],
        sectionCount: 6,
        displayTags: ['Hero', 'Galeri', 'Testimoni', 'CTA', 'Kontak'],
        extraTags: 1,
        config: {
            ...defaultLandingTemplate,
            template: 'portfolio',
            section_order: ['hero', 'gallery', 'testimonials', 'cta', 'contact', 'footer'],
            colors: {
                primary: '#7C3AED',
                secondary: '#10B981',
                accent: '#F59E0B',
                background: '#FAFAFA',
                text: '#171717',
                text_muted: '#737373',
            },
            cta: {
                ...defaultLandingTemplate.cta!,
                background_color: '#7C3AED',
            },
        },
    },
];

export default function TemplateModal({ open, onClose, onApply, currentTemplate }: TemplateModalProps) {
    const [confirmKey, setConfirmKey] = useState<string | null>(null);

    function handleApply(tpl: TemplateCard) {
        onApply(tpl.config);
        setConfirmKey(null);
    }

    function handleClose() {
        setConfirmKey(null);
        onClose();
    }

    return (
        <Modal open={open} onClose={handleClose} size="xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-8 py-5">
                <div>
                    <h2 className="text-xl font-semibold text-neutral-900">Pilih Template</h2>
                    <p className="mt-0.5 text-sm text-neutral-500">
                        Pilih template sebagai dasar landing page Anda. Semua bagian bisa diedit setelah dipilih.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleClose}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="space-y-4 overflow-y-auto px-8 py-6" style={{ maxHeight: 'calc(100vh - 24rem)' }}>
                {templates.map((tpl) => {
                    const isActive = currentTemplate === tpl.key;
                    const isConfirming = confirmKey === tpl.key;

                    return (
                        <div
                            key={tpl.key}
                            className={cn(
                                'rounded-2xl border bg-white p-6 transition-all',
                                isActive ? 'border-primary/30 ring-1 ring-primary/10' : 'border-neutral-200 hover:border-neutral-300 hover:shadow-md',
                            )}
                        >
                            <div className="flex items-start gap-5">
                                {/* Gradient Icon */}
                                <div className={cn(
                                    'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg text-2xl font-bold text-white',
                                    tpl.gradient,
                                )}>
                                    {tpl.letter}
                                </div>

                                {/* Content */}
                                <div className="min-w-0 flex-1">
                                    {/* Header row */}
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-base font-semibold text-neutral-900">{tpl.name}</h3>
                                        <span className={cn(
                                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                                            tpl.badge.className,
                                        )}>
                                            {tpl.badge.text}
                                        </span>
                                        {isActive && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                                Sedang Digunakan
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{tpl.description}</p>

                                    {/* Color Palette */}
                                    <div className="mt-3 flex items-center gap-1.5">
                                        <span className="mr-1 text-[11px] font-medium text-neutral-400">Warna:</span>
                                        {tpl.colors.map((hex, i) => (
                                            <div
                                                key={i}
                                                className="h-4 w-4 rounded-full border border-neutral-200"
                                                style={{ backgroundColor: hex }}
                                                title={hex}
                                            />
                                        ))}
                                    </div>

                                    {/* Sections */}
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
                                            </svg>
                                            {tpl.sectionCount} bagian
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {tpl.displayTags.map((tag) => (
                                                <span key={tag} className="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                                                    {tag}
                                                </span>
                                            ))}
                                            {tpl.extraTags > 0 && (
                                                <span className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-400">
                                                    +{tpl.extraTags} lagi
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex shrink-0 items-start pt-1">
                                    {isActive ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary-50 px-4 py-2 text-sm font-medium text-primary">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            Aktif
                                        </span>
                                    ) : isConfirming ? (
                                        <div className="flex flex-col items-end gap-2">
                                            <p className="text-xs text-neutral-500">Yakin mengganti template?</p>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmKey(null)}
                                                    className="rounded-xl border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleApply(tpl)}
                                                    className="rounded-xl border-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 hover:border-primary/50"
                                                >
                                                    Ya, Ganti
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setConfirmKey(tpl.key)}
                                            className="rounded-xl border-2 border-primary/30 bg-primary/5 px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:border-primary/50"
                                        >
                                            Terapkan Template
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-between border-t border-neutral-200 px-8 py-4">
                <p className="text-xs text-neutral-400">
                    Template hanya mengatur tata letak awal. Semua konten bisa disesuaikan setelahnya.
                </p>
                <Button variant="secondary" size="sm" onClick={handleClose}>
                    Tutup
                </Button>
            </div>
        </Modal>
    );
}
