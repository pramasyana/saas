import FadeIn from '@/atoms/FadeIn';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';
import { ContactItem } from '../_utils';

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

    return (
        <section id="contact" className="py-20 sm:py-24 lg:py-32" style={{ backgroundColor: colors.background }}>
            <div className="mx-auto max-w-7xl px-gutter">
                <FadeIn>
                    <div className="mb-16 space-y-4">
                        <span className="block text-xs font-bold uppercase tracking-[0.2em]" style={{ color: colors.primary }}>
                            Hubungi Kami
                        </span>
                        {data.title && (
                            <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl" style={{ color: colors.text }}>
                                {data.title}
                            </h2>
                        )}
                        {data.subtitle && (
                            <p className="max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: colors.text_muted }}>
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                </FadeIn>

                <div className="grid gap-0 lg:grid-cols-5">
                    <FadeIn direction="left" className="lg:col-span-3">
                        <div className="h-80 overflow-hidden rounded-t-2xl lg:h-full lg:rounded-l-2xl lg:rounded-tr-none" style={{ minHeight: '400px' }}>
                            {(() => {
                                const mapUrl = data.map_embed_url || defaultBranch?.map_embed_url;

                                return mapUrl ? (
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
                                ) : (
                                    <div
                                        className="flex h-full w-full items-center justify-center"
                                        style={{ backgroundColor: colors.primary + '08' }}
                                    >
                                        <div className="text-center">
                                            <div className="text-6xl mb-4" style={{ color: colors.primary + '20' }}>&#128506;</div>
                                            <p className="text-sm" style={{ color: colors.text_muted }}>Peta akan ditampilkan di sini</p>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </FadeIn>

                    <FadeIn direction="right" className="lg:col-span-2">
                        <div className="rounded-b-2xl p-8 shadow-2xl lg:h-full lg:rounded-bl-none lg:rounded-br-2xl lg:p-10" style={{ backgroundColor: '#1A1A2E' }}>
                            <h3 className="text-2xl font-black text-white">Informasi Kontak</h3>
                            <div className="mt-4 h-1 w-12" style={{ backgroundColor: colors.primary }} />

                            <div className="mt-10 space-y-8">
                                {address && (
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: colors.primary }}>
                                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white/60">Alamat</p>
                                            <p className="mt-1 text-sm text-white/90">{address}</p>
                                        </div>
                                    </div>
                                )}
                                {phone && (
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: colors.primary }}>
                                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white/60">Telepon</p>
                                            <p className="mt-1 text-sm text-white/90">{phone}</p>
                                        </div>
                                    </div>
                                )}
                                {email && (
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: colors.primary }}>
                                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white/60">Email</p>
                                            <p className="mt-1 text-sm text-white/90">{email}</p>
                                        </div>
                                    </div>
                                )}
                                {whatsapp && (
                                    <a
                                        href={`https://wa.me/${whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-4 transition-opacity hover:opacity-80"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: '#25D366' }}>
                                            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white/60">WhatsApp</p>
                                            <p className="mt-1 text-sm text-white/90">{whatsapp}</p>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
