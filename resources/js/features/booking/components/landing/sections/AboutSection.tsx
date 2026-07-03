import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['about']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function AboutSection({ data, colors }: Props) {
    if (!data.content) {
return null;
}

    return (
        <section id="about" className="border-b border-neutral-200/50 py-16 sm:py-20 lg:py-24" style={{ backgroundColor: colors.background }}>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {data.image && <div className="order-last lg:order-first"><img src={data.image} alt={data.title || 'About'} className="rounded-2xl object-cover shadow-lg" /></div>}
                    <div>
                        {data.title && <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: colors.text }}>{data.title}</h2>}
                        <p className="mt-6 leading-relaxed whitespace-pre-line" style={{ color: colors.text_muted }}>{data.content}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
