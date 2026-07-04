import { motion } from 'framer-motion';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';
import FadeIn from '@/atoms/FadeIn';

interface Props {
    data: NonNullable<LandingConfig['about']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function AboutSection({ data, colors }: Props) {
    if (!data.content) return null;

    return (
        <section id="about" className="relative overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: colors.background }}>
            <div
                className="absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full opacity-5"
                style={{ backgroundColor: colors.primary }}
            />
            <div
                className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 rounded-full opacity-5"
                style={{ backgroundColor: colors.primary }}
            />
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <FadeIn direction="left">
                        <div className="relative">
                            {data.image ? (
                                <div className="relative">
                                    <div
                                        className="absolute -top-4 -left-4 h-full w-full rounded-2xl"
                                        style={{ backgroundColor: colors.primary, opacity: 0.1 }}
                                    />
                                    <img
                                        src={data.image}
                                        alt={data.title || 'About'}
                                        className="relative rounded-2xl object-cover shadow-xl w-full"
                                        style={{ aspectRatio: '4/3' }}
                                    />
                                    <div
                                        className="absolute -bottom-3 -right-3 h-24 w-24 rounded-2xl"
                                        style={{ backgroundColor: colors.primary, opacity: 0.15 }}
                                    />
                                </div>
                            ) : (
                                <div
                                    className="flex h-80 w-full items-center justify-center rounded-2xl"
                                    style={{ backgroundColor: colors.primary + '08' }}
                                >
                                    <div className="text-6xl font-bold" style={{ color: colors.primary + '20' }}>
                                        ✦
                                    </div>
                                </div>
                            )}
                        </div>
                    </FadeIn>

                    <FadeIn direction="right">
                        <div className="relative">
                            <span
                                className="inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase mb-4"
                                style={{ backgroundColor: colors.primary + '12', color: colors.primary }}
                            >
                                Tentang Kami
                            </span>
                            {data.title && (
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: colors.text }}>
                                    {data.title}
                                </h2>
                            )}
                            <div
                                className="mt-2 h-1.5 w-12 rounded-full"
                                style={{ backgroundColor: colors.primary }}
                            />
                            <div className="mt-6 space-y-4">
                                {data.content.split('\n\n').map((paragraph, idx) => (
                                    <p key={idx} className="leading-relaxed" style={{ color: colors.text_muted }}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}