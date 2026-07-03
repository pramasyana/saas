import type { LandingConfig, StatItem } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['stats']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function StatsSection({ data, colors }: Props) {
    const items = data.items;

    if (!items?.length) {
return null;
}

    return (
        <section id="stats" className="border-b border-neutral-200/50 py-16" style={{ backgroundColor: colors.primary }}>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((item: StatItem, i: number) => (
                        <div key={i} className="text-center">
                            <div className="text-4xl font-extrabold text-white sm:text-5xl">{item.number}</div>
                            <p className="mt-2 text-sm font-medium text-white/70">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
