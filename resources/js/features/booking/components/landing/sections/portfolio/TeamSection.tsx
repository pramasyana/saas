import { motion } from 'framer-motion';
import FadeIn from '@/atoms/FadeIn';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';
import { getInitials } from '../_utils';

interface TeamMember {
    id: string; name: string; position: string | null; email: string | null;
}

interface Props {
    data: NonNullable<LandingConfig['team']>;
    colors: NonNullable<LandingConfig['colors']>;
    team?: TeamMember[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' as const },
    },
};

export default function TeamSection({ data, colors, team }: Props) {
    const members = team ?? [];

    return (
        <section id="team" className="py-20 sm:py-24 lg:py-32" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="mx-auto max-w-7xl px-gutter">
                <FadeIn>
                    <div className="mb-16">
                        <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: colors.primary }}>The Team</span>
                        <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-[0.95]" style={{ color: '#1A1A2E' }}>
                            {data.title || 'Meet the Creative'}
                        </h2>
                        {data.subtitle && (
                            <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: colors.text_muted }}>
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                </FadeIn>

                {members.length > 0 ? (
                    <motion.div
                        className="grid gap-6 md:grid-cols-12"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        {members.map((m, i) => (
                            <motion.div key={m.id} variants={cardVariants}
                                className={`group relative overflow-hidden ${i === 0 ? 'md:col-span-6 md:row-span-2' : 'md:col-span-3'}`}
                            >
                                <div className="relative overflow-hidden shadow-2xl"
                                    style={{ backgroundColor: colors.primary + '10', aspectRatio: i === 0 ? '3/4' : '1/1' }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundColor: i === 0 ? colors.primary : colors.primary + '15' }}
                                    >
                                        <span className={`font-black text-white ${i === 0 ? 'text-7xl' : 'text-4xl'}`}>
                                            {getInitials(m.name)}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <h3 className={`font-bold text-white ${i === 0 ? 'text-2xl' : 'text-lg'}`}>{m.name}</h3>
                                        {m.position && (
                                            <p className="mt-1 text-sm font-medium uppercase tracking-wider" style={{ color: colors.primary }}>
                                                {m.position}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center">
                        <div className="inline-flex items-center gap-3 border px-8 py-5" style={{ borderColor: '#E5E7EB' }}>
                            <span className="text-sm" style={{ color: colors.text_muted }}>Team members will appear here.</span>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
