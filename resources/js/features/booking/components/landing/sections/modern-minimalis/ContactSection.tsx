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
    data: NonNullable<LandingConfig['contact']>;
    colors: NonNullable<LandingConfig['colors']>;
    branches?: BranchItem[];
}

export default function ContactSection({ data, colors, branches }: Props) {
    if (!data || Object.keys(data).length === 0) {
        return null;
    }

    const defaultBranch = branches?.find((b) => b.is_default) ?? branches?.[0];
    const address = data.address || defaultBranch?.address || null;
    const phone = data.phone || defaultBranch?.phone || null;
    const email = data.email || defaultBranch?.email || null;
    const whatsapp = data.whatsapp_number || defaultBranch?.whatsapp || null;

    const mapMarkers = defaultBranch && defaultBranch.latitude != null && defaultBranch.longitude != null
        ? [{ id: defaultBranch.id, name: defaultBranch.name, address: defaultBranch.address, latitude: defaultBranch.latitude, longitude: defaultBranch.longitude }]
        : [];

    const contactItems = [
        address && { icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z', label: 'Alamat', value: address },
        phone && { icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z', label: 'Telepon', value: phone },
        email && { icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75', label: 'Email', value: email },
        whatsapp && { icon: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z', label: 'WhatsApp', value: whatsapp },
    ].filter(Boolean) as { icon: string; label: string; value: string }[];

    return (
        <section id="contact" className="py-24 lg:py-32" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="mx-auto max-w-4xl px-gutter">
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

                <FadeIn>
                    <div className="space-y-0 max-w-xl mx-auto">
                        {contactItems.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-6 py-8"
                                style={{ borderBottom: `1px solid ${colors.primary}12` }}
                            >
                                <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: colors.primary }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: colors.text_muted }}>
                                        {item.label}
                                    </p>
                                    <p className="mt-2 text-base font-light" style={{ color: colors.text }}>
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </FadeIn>

                {mapMarkers.length > 0 && (
                    <FadeIn>
                        <div className="mt-20" style={{ border: `1px solid ${colors.primary}10` }}>
                            <LeafletMap markers={mapMarkers} />
                        </div>
                    </FadeIn>
                )}
            </div>
        </section>
    );
}
