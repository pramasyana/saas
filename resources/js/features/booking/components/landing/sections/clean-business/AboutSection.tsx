import { motion } from 'framer-motion';
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
        <section id="about" className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <FadeIn direction="left">
                        <div className="space-y-6">
                            <span
                                className="inline-block rounded-lg px-3 py-1 text-xs font-bold tracking-wider uppercase"
                                style={{ backgroundColor: colors.primary + '10', color: colors.primary }}
                            >
                                Tentang Kami
                            </span>
                            {data.title && (
                                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: colors.text }}>
                                    {data.title}
                                </h2>
                            )}
                            <div className="h-1 w-12 rounded-sm" style={{ backgroundColor: colors.primary }} />
                            <div className="space-y-4">
                                {data.content.split('\n\n').map((paragraph, idx) => (
                                    <p key={idx} className="leading-relaxed text-base" style={{ color: colors.text_muted }}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn direction="right">
                        <div className="relative">
                            {data.image ? (
                                <img
                                    src={data.image}
                                    alt={data.title || 'About'}
                                    className="w-full rounded-lg object-cover border"
                                    style={{ aspectRatio: '4/3', borderColor: '#E5E7EB' }}
                                />
                            ) : (
                                <div
                                    className="flex h-80 w-full items-center justify-center rounded-lg border"
                                    style={{ backgroundColor: colors.primary + '05', borderColor: '#E5E7EB' }}
                                >
                                    <div className="text-6xl font-bold" style={{ color: colors.primary + '20' }}>
                                        ✦
                                    </div>
                                </div>
                            )}
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
