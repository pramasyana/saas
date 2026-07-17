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

export default function BranchesSection({ data, colors, branches }: Props) {
    const items = branches ?? [];
    const [activeId, setActiveId] = useState<string | null>(null);

    const mapMarkers = items
        .filter((b) => b.latitude != null && b.longitude != null)
        .map((b) => ({
            id: b.id,
            name: b.name,
            address: b.address,
            latitude: b.latitude!,
            longitude: b.longitude!,
        }));

    if (!items.length) {
        return null;
    }

    return (
        <section id="branches" className="py-24 lg:py-32" style={{ backgroundColor: '#FAFAFA' }}>
            <div className="mx-auto max-w-5xl px-gutter">
                <FadeIn>
                    <div className="text-center mb-20 space-y-4">
                        {data.title && (
                            <h2 className="text-5xl lg:text-6xl font-black tracking-tight" style={{ color: colors.text }}>
                                {data.title}
                            </h2>
                        )}
                        {data.subtitle && (
                            <p className="max-w-2xl mx-auto text-base font-light leading-relaxed" style={{ color: colors.text_muted }}>
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                </FadeIn>

                {mapMarkers.length > 0 && (
                    <div className="mb-16" style={{ border: `1px solid ${colors.primary}10` }}>
                        <LeafletMap markers={mapMarkers} />
                    </div>
                )}

                <div className="space-y-0">
                    {items.map((b) => (
                        <div
                            key={b.id}
                            onMouseEnter={() => setActiveId(b.id)}
                            onMouseLeave={() => setActiveId(null)}
                            className="py-8"
                            style={{ borderBottom: `1px solid ${colors.primary}12` }}
                        >
                            <div className="flex items-start justify-between gap-8">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-semibold tracking-tight" style={{ color: colors.text }}>
                                            {b.name}
                                        </h3>
                                        {b.is_default && (
                                            <span className="text-[10px] font-medium uppercase tracking-[0.15em]" style={{ color: colors.primary }}>
                                                Utama
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm font-light" style={{ color: colors.text_muted }}>
                                        {b.address && <span>{b.address}</span>}
                                        {b.phone && <span>{b.phone}</span>}
                                        {b.email && <span>{b.email}</span>}
                                    </div>
                                </div>
                                <svg
                                    className="h-5 w-5 shrink-0 mt-1 transition-transform duration-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    style={{
                                        color: activeId === b.id ? colors.primary : colors.text_muted,
                                        transform: activeId === b.id ? 'translateX(4px)' : 'translateX(0)',
                                    }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
