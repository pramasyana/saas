import type { LandingConfig, FeatureItem } from '@/features/booking/hooks/useLandingSettings';
import { FeatureIcon } from './_utils';

interface Props {
    data: NonNullable<LandingConfig['features']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function FeaturesSection({ data, colors }: Props) {
    const items = data.items;

    if (!items?.length) {
return null;
}

    return (
        <section id="features" className="border-b border-neutral-200/50 py-16 sm:py-20 lg:py-24" style={{ backgroundColor: colors.background }}>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    {data.title && <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: colors.text }}>{data.title}</h2>}
                    {data.subtitle && <p className="mt-3" style={{ color: colors.text_muted }}>{data.subtitle}</p>}
                </div>
                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item: FeatureItem, i: number) => (
                        <div key={i} className="group rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md" style={{ borderColor: colors.primary + '15' }}>
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm" style={{ backgroundColor: colors.primary }}>
                                <FeatureIcon icon={item.icon} />
                            </div>
                            <h3 className="text-lg font-semibold" style={{ color: colors.text }}>{item.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed" style={{ color: colors.text_muted }}>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
