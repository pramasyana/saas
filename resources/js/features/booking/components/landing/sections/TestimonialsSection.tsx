import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';
import { StarRating } from './_utils';

interface Props {
    data: NonNullable<LandingConfig['testimonials']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function TestimonialsSection({ data, colors }: Props) {
    const items = data.items;

    if (!items?.length) {
return null;
}

    return (
        <section id="testimonials" className="border-b border-neutral-200/50 py-16 sm:py-20 lg:py-24" style={{ backgroundColor: colors.background }}>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    {data.title && <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: colors.text }}>{data.title}</h2>}
                    {data.subtitle && <p className="mt-3" style={{ color: colors.text_muted }}>{data.subtitle}</p>}
                </div>
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, i) => (
                        <div key={i} className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: colors.primary + '15' }}>
                            <StarRating rating={item.rating} />
                            <p className="mt-4 text-sm italic leading-relaxed" style={{ color: colors.text_muted }}>"{item.content}"</p>
                            <div className="mt-4 border-t pt-4" style={{ borderColor: colors.text_muted + '20' }}>
                                <p className="text-sm font-semibold" style={{ color: colors.text }}>{item.name}</p>
                                {item.role && <p className="text-xs" style={{ color: colors.text_muted }}>{item.role}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
