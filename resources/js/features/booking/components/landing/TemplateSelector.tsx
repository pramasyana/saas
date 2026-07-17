import { useState } from 'react';
import { motion } from 'framer-motion';
import { defaultLandingTemplate } from '@/features/booking/data/defaultLandingTemplate';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';
import { cn } from '@/lib/utils';

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
    previewUrl: string;
}

interface TemplateSelectorProps {
    onApply: (template: LandingConfig) => void;
    isPending?: boolean;
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
        previewUrl: 'https://lumina.nusentra.web.id',
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
        previewUrl: 'https://clean.nusentra.web.id',
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
        previewUrl: 'https://modern.nusentra.web.id',
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
        previewUrl: 'https://portfolio.nusentra.web.id',
    },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function TemplateSelector({ onApply, isPending }: TemplateSelectorProps) {
    const [confirmKey, setConfirmKey] = useState<string | null>(null);

    function handleApply(tpl: TemplateCard) {
        onApply(tpl.config);
        setConfirmKey(null);
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-neutral-50 via-white to-purple-50/30">
            <div className="mx-auto max-w-5xl px-6 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10 text-center"
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H3" />
                        </svg>
                        Langkah 1 dari 2
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Pilih Template Landing Page</h1>
                    <p className="mt-3 text-base text-neutral-500">
                        Pilih template sebagai dasar landing page Anda. Semua konten bisa disesuaikan setelahnya.
                    </p>
                </motion.div>

                {/* Template Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-6 sm:grid-cols-2"
                >
                    {templates.map((tpl) => {
                        const isConfirming = confirmKey === tpl.key;

                        return (
                            <motion.div
                                key={tpl.key}
                                variants={itemVariants}
                                className={cn(
                                    'group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200',
                                    isConfirming ? 'border-primary/40 ring-2 ring-primary/10' : 'border-neutral-200 hover:border-neutral-300 hover:shadow-lg',
                                )}
                            >
                                {/* Preview Area */}
                                <div className={cn('relative flex h-48 items-center justify-center bg-gradient-to-br', tpl.gradient)}>
                                    <span className="text-6xl font-bold text-white/20">{tpl.letter}</span>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                                    {/* Badge */}
                                    <span className={cn('absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold', tpl.badge.className)}>
                                        {tpl.badge.text}
                                    </span>

                                    {/* Section count */}
                                    <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-700 backdrop-blur-sm">
                                        {tpl.sectionCount} bagian
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="text-lg font-semibold text-neutral-900">{tpl.name}</h3>
                                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-neutral-500">{tpl.description}</p>

                                    {/* Colors */}
                                    <div className="mt-3 flex items-center gap-1.5">
                                        {tpl.colors.map((hex, i) => (
                                            <div
                                                key={i}
                                                className="h-5 w-5 rounded-full border-2 border-white shadow-sm ring-1 ring-neutral-200"
                                                style={{ backgroundColor: hex }}
                                                title={hex}
                                            />
                                        ))}
                                    </div>

                                    {/* Tags */}
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {tpl.displayTags.slice(0, 3).map((tag) => (
                                            <span key={tag} className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                                                {tag}
                                            </span>
                                        ))}
                                        {tpl.extraTags > 0 && (
                                            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-400">
                                                +{tpl.extraTags}
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => window.open(tpl.previewUrl, '_blank')}
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                            </svg>
                                            Preview
                                        </button>

                                        {isConfirming ? (
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmKey(null)}
                                                    className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleApply(tpl)}
                                                    disabled={isPending}
                                                    className="rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                                                >
                                                    {isPending ? 'Menerapkan...' : 'Ya, Terapkan'}
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setConfirmKey(tpl.key)}
                                                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                                            >
                                                Pilih Template
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Footer hint */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 text-center text-sm text-neutral-400"
                >
                    Template hanya mengatur tata letak awal. Semua konten, warna, dan bagian bisa disesuaikan nanti.
                </motion.p>
            </div>
        </div>
    );
}
