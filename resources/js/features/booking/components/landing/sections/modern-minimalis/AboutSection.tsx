import FadeIn from '@/atoms/FadeIn';
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
        <section id="about" className="py-32" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="mx-auto max-w-4xl px-gutter text-center">
                {data.title && (
                    <FadeIn>
                        <h2 className="text-5xl lg:text-6xl font-black tracking-tight" style={{ color: colors.text }}>
                            {data.title}
                        </h2>
                    </FadeIn>
                )}

                {data.image && (
                    <FadeIn>
                        <div className="mt-20">
                            <div className="w-full overflow-hidden" style={{ aspectRatio: '16/7' }}>
                                <img
                                    src={data.image}
                                    alt={data.title || 'About'}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                    </FadeIn>
                )}

                <FadeIn>
                    <div className="mt-20 mx-auto max-w-2xl">
                        <div className="w-12 h-px mx-auto mb-12" style={{ backgroundColor: colors.primary + '30' }} />
                        {data.content.split('\n\n').map((paragraph, idx) => (
                            <p key={idx} className="text-base font-light leading-relaxed" style={{ color: colors.text_muted }}>
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
