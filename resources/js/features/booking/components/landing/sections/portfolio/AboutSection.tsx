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
        <section id="about" className="relative overflow-hidden py-20 sm:py-24 lg:py-32" style={{ backgroundColor: '#FAFAF8' }}>
            <div className="mx-auto max-w-7xl px-gutter">
                <div className="relative grid items-center gap-0 lg:grid-cols-2">
                    <FadeIn direction="left" className="relative z-0">
                        {data.image ? (
                            <div className="relative">
                                <div className="overflow-hidden rounded-2xl shadow-2xl" style={{ aspectRatio: '4/3' }}>
                                    <img
                                        src={data.image}
                                        alt={data.title || 'About'}
                                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                </div>
                                <div
                                    className="absolute -bottom-6 -right-6 h-32 w-32 rounded-2xl opacity-20 lg:-right-12"
                                    style={{ backgroundColor: colors.primary }}
                                />
                            </div>
                        ) : (
                            <div
                                className="flex h-80 w-full items-center justify-center rounded-2xl shadow-2xl"
                                style={{ backgroundColor: colors.primary + '08' }}
                            >
                                <span className="text-8xl font-black" style={{ color: colors.primary + '15' }}>&#10070;</span>
                            </div>
                        )}
                    </FadeIn>

                    <FadeIn direction="right" className="relative z-10 -mt-16 lg:-ml-20 lg:mt-0">
                        <div
                            className="rounded-2xl p-8 shadow-2xl sm:p-10 lg:p-12"
                            style={{ backgroundColor: '#FFFFFF' }}
                        >
                            <span
                                className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
                                style={{ backgroundColor: colors.primary + '12', color: colors.primary }}
                            >
                                Tentang Kami
                            </span>
                            {data.title && (
                                <h2
                                    className="mt-6 text-3xl font-black tracking-tight sm:text-4xl"
                                    style={{ color: colors.text }}
                                >
                                    {data.title}
                                </h2>
                            )}
                            <div className="mt-4 h-1 w-16" style={{ backgroundColor: colors.primary }} />
                            <div className="mt-8 space-y-4">
                                {data.content.split('\n\n').map((paragraph, idx) => (
                                    <p key={idx} className="text-base leading-relaxed" style={{ color: colors.text_muted }}>
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
