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
        transition: { staggerChildren: 0.1 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' as const },
    },
};

export default function TeamSection({ data, colors, team }: Props) {
    const members = team ?? [];

    return (
        <section id="team" className="py-16 sm:py-20 lg:py-section-gap-desktop" style={{ backgroundColor: '#F8FAFC' }}>
            <div className="mx-auto max-w-7xl px-gutter">
                <FadeIn>
                    <div className="text-center mb-16">
                        {data.title && (
                            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: colors.text }}>
                                {data.title}
                            </h2>
                        )}
                        {data.subtitle && (
                            <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed sm:text-lg" style={{ color: colors.text_muted }}>
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                </FadeIn>

                {members.length > 0 ? (
                    <motion.div
                        className="grid gap-8 md:grid-cols-3"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        {members.map((m) => (
                            <motion.div
                                key={m.id}
                                variants={cardVariants}
                                className="text-center rounded-lg bg-white p-8 border shadow-sm transition-all duration-300 hover:shadow-md"
                                style={{ borderColor: '#E5E7EB' }}
                            >
                                <div
                                    className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-lg text-2xl font-extrabold text-white"
                                    style={{ backgroundColor: colors.primary }}
                                >
                                    {getInitials(m.name)}
                                </div>
                                <h3 className="text-lg font-bold" style={{ color: colors.text }}>{m.name}</h3>
                                {m.position && (
                                    <p className="mt-1.5 text-sm font-semibold" style={{ color: colors.primary }}>{m.position}</p>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center">
                        <div
                            className="inline-flex items-center gap-3 rounded-lg border bg-white px-8 py-5"
                            style={{ borderColor: '#E5E7EB' }}
                        >
                            <svg className="h-5 w-5" style={{ color: colors.text_muted }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                            <span className="text-sm" style={{ color: colors.text_muted }}>Tim akan muncul di halaman publik.</span>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
