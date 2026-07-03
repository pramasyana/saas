import type { LandingConfig, LogoCloudItem } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['logo_cloud']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function LogoCloudSection({ data, colors }: Props) {
    const items = data.items;

    if (!items?.length) {
return null;
}

    return (
        <section id="logo-cloud" className="border-b border-neutral-200/50 py-12 sm:py-16" style={{ backgroundColor: colors.background }}>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                {data.title && <p className="mb-8 text-center text-sm font-medium tracking-wider uppercase" style={{ color: colors.text_muted }}>{data.title}</p>}
                <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
                    {items.map((item: LogoCloudItem, i: number) => (
                        item.url ? (
                            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70">
                                {item.image ? <img src={item.image} alt={item.name ?? ''} className="h-10 w-auto opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0" /> : <span className="text-lg font-semibold" style={{ color: colors.text_muted }}>{item.name}</span>}
                            </a>
                        ) : (
                            <div key={i}>
                                {item.image ? <img src={item.image} alt={item.name ?? ''} className="h-10 w-auto opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0" /> : <span className="text-lg font-semibold" style={{ color: colors.text_muted }}>{item.name}</span>}
                            </div>
                        )
                    ))}
                </div>
            </div>
        </section>
    );
}
