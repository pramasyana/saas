import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';
import { getInitials } from './_utils';

interface TeamMember {
    id: string; name: string; position: string | null; email: string | null;
}

interface Props {
    data: NonNullable<LandingConfig['team']>;
    colors: NonNullable<LandingConfig['colors']>;
    team?: TeamMember[];
}

export default function TeamSection({ data, colors, team }: Props) {
    const members = team ?? [];

    return (
        <section id="team" className="border-b border-neutral-200/50 py-16 sm:py-20 lg:py-24" style={{ backgroundColor: colors.background }}>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    {data.title && <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: colors.text }}>{data.title}</h2>}
                    {data.subtitle && <p className="mt-3" style={{ color: colors.text_muted }}>{data.subtitle}</p>}
                </div>
                {members.length > 0 ? (
                    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {members.map((m) => (
                            <div key={m.id} className="group text-center">
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-xl font-bold text-white shadow-md transition-transform group-hover:scale-110" style={{ backgroundColor: colors.secondary }}>{getInitials(m.name)}</div>
                                <h3 className="mt-4 text-base font-semibold" style={{ color: colors.text }}>{m.name}</h3>
                                {m.position && <p className="mt-1 text-sm" style={{ color: colors.text_muted }}>{m.position}</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-12 text-center text-sm" style={{ color: colors.text_muted }}>Tim akan muncul di halaman publik.</div>
                )}
            </div>
        </section>
    );
}
