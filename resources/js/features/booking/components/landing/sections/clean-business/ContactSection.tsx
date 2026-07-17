import FadeIn from '@/atoms/FadeIn';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

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

function ContactCard({
    icon,
    label,
    value,
    colors,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    colors: NonNullable<LandingConfig['colors']>;
}) {
    return (
        <div className="rounded-lg border bg-white p-6 text-center" style={{ borderTop: `4px solid ${colors.primary}`, borderColor: '#E5E7EB' }}>
            <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                style={{ backgroundColor: colors.primary + '10', color: colors.primary }}
            >
                {icon}
            </div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.text_muted }}>{label}</p>
            <p className="mt-1.5 text-sm font-semibold" style={{ color: colors.text }}>{value}</p>
        </div>
    );
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

    const mapUrl = data.map_embed_url || defaultBranch?.map_embed_url;

    return (
        <section id="contact" className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-12">
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

                <FadeIn>
                    <div className="grid gap-6 sm:grid-cols-3 mb-10">
                        {address && (
                            <ContactCard
                                colors={colors}
                                label="Alamat"
                                value={address}
                                icon={
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                }
                            />
                        )}
                        {phone && (
                            <ContactCard
                                colors={colors}
                                label="Telepon"
                                value={phone}
                                icon={
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                }
                            />
                        )}
                        {email && (
                            <ContactCard
                                colors={colors}
                                label="Email"
                                value={email}
                                icon={
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                }
                            />
                        )}
                    </div>
                </FadeIn>

                <FadeIn>
                    {mapUrl ? (
                        <div className="h-80 overflow-hidden rounded-lg border" style={{ borderColor: '#E5E7EB' }}>
                            <iframe
                                src={mapUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Map"
                            />
                        </div>
                    ) : (
                        <div
                            className="flex h-80 items-center justify-center rounded-lg border"
                            style={{ backgroundColor: colors.primary + '05', borderColor: '#E5E7EB' }}
                        >
                            <div className="text-center">
                                <p className="text-sm font-bold" style={{ color: colors.text }}>Peta akan ditampilkan di sini</p>
                            </div>
                        </div>
                    )}
                </FadeIn>
            </div>
        </section>
    );
}
