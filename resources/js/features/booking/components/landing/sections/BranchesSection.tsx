import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

interface BranchItem {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    whatsapp: string | null;
    is_default: boolean;
}

interface Props {
    data: NonNullable<LandingConfig['branches']>;
    colors: NonNullable<LandingConfig['colors']>;
    branches?: BranchItem[];
}

export default function BranchesSection({ data, colors, branches }: Props) {
    const items = branches ?? [];

    return (
        <section id="branches" className="border-b border-neutral-200/50 py-16 sm:py-20 lg:py-24" style={{ backgroundColor: colors.background }}>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    {data.title && <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: colors.text }}>{data.title}</h2>}
                    {data.subtitle && <p className="mt-3" style={{ color: colors.text_muted }}>{data.subtitle}</p>}
                </div>
                {items.length > 0 ? (
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((b) => (
                            <div key={b.id} className="rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md" style={{ borderColor: colors.primary + '20' }}>
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ backgroundColor: colors.primary }}>{b.name.charAt(0)}</div>
                                <h3 className="text-lg font-semibold" style={{ color: colors.text }}>{b.name}</h3>
                                <div className="mt-3 space-y-2.5 text-sm" style={{ color: colors.text_muted }}>
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
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-12 text-center text-sm" style={{ color: colors.text_muted }}>Cabang akan muncul di halaman publik.</div>
                )}
            </div>
        </section>
    );
}
