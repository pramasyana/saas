import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { LandingConfig, LogoCloudItem } from '@/features/booking/hooks/useLandingSettings';
import FadeIn from '@/atoms/FadeIn';

interface Props {
    data: NonNullable<LandingConfig['logo_cloud']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function LogoCloudSection({ data, colors }: Props) {
    const items = data.items;
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        let animationId: number;
        let pos = 0;
        const speed = 0.3;

        const animate = () => {
            pos += speed;
            if (pos >= el.scrollWidth / 2) pos = 0;
            el.style.transform = `translateX(${-pos}px)`;
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, [items]);

    if (!items?.length) return null;

    return (
        <section id="logo-cloud" className="py-12 sm:py-16" style={{ backgroundColor: colors.background }}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    {data.title && (
                        <p className="mb-10 text-center text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: colors.text_muted }}>
                            {data.title}
                        </p>
                    )}
                </FadeIn>

                <div className="overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
                    <motion.div
                        ref={scrollRef}
                        className="flex items-center gap-12 sm:gap-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        {[...items, ...items].map((item: LogoCloudItem, i: number) => (
                            <div key={i} className="flex-shrink-0">
                                {item.url ? (
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block transition-all duration-300 hover:scale-110"
                                    >
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name ?? ''}
                                                className="h-10 w-auto opacity-50 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
                                            />
                                        ) : (
                                            <span className="text-base font-semibold transition-colors" style={{ color: colors.text_muted }}>{item.name}</span>
                                        )}
                                    </a>
                                ) : (
                                    <div>
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name ?? ''}
                                                className="h-10 w-auto opacity-50 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
                                            />
                                        ) : (
                                            <span className="text-base font-semibold" style={{ color: colors.text_muted }}>{item.name}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}