import type { LandingConfig, GalleryItem } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['gallery']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function GallerySection({ data, colors }: Props) {
    const items = data.items;

    if (!items?.length) {
return null;
}

    return (
        <section id="gallery" className="border-b border-neutral-200/50 py-16 sm:py-20 lg:py-24" style={{ backgroundColor: colors.background }}>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    {data.title && <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: colors.text }}>{data.title}</h2>}
                    {data.subtitle && <p className="mt-3" style={{ color: colors.text_muted }}>{data.subtitle}</p>}
                </div>
                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item: GalleryItem, i: number) => (
                        <div key={i} className="group relative overflow-hidden rounded-2xl bg-neutral-100 shadow-sm" style={{ aspectRatio: '4/3' }}>
                            {item.image ? (
                                <img src={item.image} alt={item.title ?? ''} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-neutral-300">
                                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                                <div>
                                    {item.title && <p className="text-sm font-semibold text-white">{item.title}</p>}
                                    {item.description && <p className="text-xs text-white/70">{item.description}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
