import { motion } from 'framer-motion';
import { useState } from 'react';

import FadeIn from '@/atoms/FadeIn';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';
import LeafletMap from '@/molecules/LeafletMap';

interface BranchItem {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    whatsapp: string | null;
    map_embed_url: string | null;
    latitude: number | null;
    longitude: number | null;
    is_default: boolean;
}

interface Props {
    data: NonNullable<LandingConfig['branches']>;
    colors: NonNullable<LandingConfig['colors']>;
    branches?: BranchItem[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' as const },
    },
};

export default function BranchesSection({ data, colors, branches }: Props) {
    const items = branches ?? [];
    const [activeCard, setActiveCard] = useState<string | null>(null);

    const mapMarkers = items
        .filter((b) => b.latitude != null && b.longitude != null)
        .map((b) => ({
            id: b.id,
            name: b.name,
            address: b.address,
            latitude: b.latitude!,
            longitude: b.longitude!,
        }));

    return (
        <section id="branches" className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: '#F8FAFC' }}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center">
                        {data.title && (
                            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: colors.text }}>
                                {data.title}
                            </h2>
                        )}
                        {data.subtitle && (
                            <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed sm:text-lg" style={{ color: colors.text_muted }}>
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                </FadeIn>

                {items.length > 0 ? (
                    <>
                        {mapMarkers.length > 0 && (
                            <div className="mt-10">
                                <LeafletMap markers={mapMarkers} />
                            </div>
                        )}
                        <motion.div
                            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                        >
                            {items.map((b) => (
                                <motion.div
                                    key={b.id}
                                    variants={cardVariants}
                                    onMouseEnter={() => setActiveCard(b.id)}
                                    onMouseLeave={() => setActiveCard(null)}
                                    className="group relative rounded-lg border bg-white p-7 transition-all duration-300 hover:shadow-sm"
                                    style={{
                                        borderColor: activeCard === b.id ? colors.primary : '#E5E7EB',
                                    }}
                                >
                                    <div
                                        className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-base font-bold text-white"
                                        style={{ backgroundColor: colors.primary }}
                                    >
                                        {b.name.charAt(0)}
                                    </div>
                                    <h3 className="text-lg font-bold" style={{ color: colors.text }}>{b.name}</h3>
                                    {b.is_default && (
                                        <span
                                            className="mt-2 inline-block rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                                            style={{ backgroundColor: colors.primary + '10', color: colors.primary }}
                                        >
                                            Utama
                                        </span>
                                    )}
                                    <div className="mt-4 space-y-3 text-sm" style={{ color: colors.text_muted }}>
                                        {b.address && (
                                            <div className="flex items-start gap-2.5">
                                                <svg className="mt-0.5 h-4 w-4 shrink-0" style={{ color: colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                </svg>
                                                <span>{b.address}</span>
                                            </div>
                                        )}
                                        {b.phone && (
                                            <div className="flex items-center gap-2.5">
                                                <svg className="h-4 w-4 shrink-0" style={{ color: colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                                </svg>
                                                <span>{b.phone}</span>
                                            </div>
                                        )}
                                        {b.email && (
                                            <div className="flex items-center gap-2.5">
                                                <svg className="h-4 w-4 shrink-0" style={{ color: colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                                </svg>
                                                <span>{b.email}</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </>
                ) : (
                    <div className="mt-14 text-center">
                        <div className="inline-flex items-center gap-3 rounded-lg border bg-white px-8 py-4" style={{ borderColor: '#E5E7EB' }}>
                            <svg className="h-5 w-5" style={{ color: colors.text_muted }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <span className="text-sm" style={{ color: colors.text_muted }}>Cabang akan muncul di halaman publik.</span>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
