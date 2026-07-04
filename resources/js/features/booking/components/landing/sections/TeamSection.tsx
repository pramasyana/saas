import { motion } from 'framer-motion';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';
import { getInitials } from './_utils';
import FadeIn from '@/atoms/FadeIn';

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
        <section id="team" className="py-16 sm:py-20 lg:py-section-gap-desktop relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 border-4 rounded-full -translate-x-1/2 -translate-y-1/2" style={{ borderColor: colors.primary }} />
                <div className="absolute bottom-0 right-0 w-96 h-96 border-2 rounded-full translate-x-1/4 translate-y-1/4" style={{ borderColor: colors.secondary }} />
            </div>
            <div className="mx-auto max-w-7xl px-gutter relative z-10">
                <FadeIn>
                    <div className="text-center mb-20">
                        {data.title && (
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: colors.text }}>
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
                        className="grid gap-12 md:grid-cols-3"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        {members.map((m) => (
                            <motion.div key={m.id} variants={cardVariants}
                                className="text-center group"
                            >
                                <div className="relative inline-block mb-6">
                                    <div className="absolute inset-0 rounded-full blur-2xl transition-colors duration-500"
                                        style={{
                                            backgroundColor: colors.primary + '20',
                                        }}
                                    />
                                    <div
                                        className="relative w-48 h-48 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                                        style={{ backgroundColor: colors.primary }}
                                    >
                                        {getInitials(m.name)}
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold" style={{ color: colors.text }}>{m.name}</h3>
                                {m.position && (
                                    <p className="mt-1.5 text-sm font-medium" style={{ color: colors.primary }}>{m.position}</p>
                                )}
                                {m.position && (
                                    <p className="mt-3 text-sm leading-relaxed max-w-xs mx-auto" style={{ color: colors.text_muted }}>
                                        Spesialis dengan pengalaman lebih dari 10 tahun di industri ini.
                                    </p>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center">
                        <div className="inline-flex items-center gap-3 rounded-2xl border px-8 py-5 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderColor: colors.primary + '15' }}>
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
