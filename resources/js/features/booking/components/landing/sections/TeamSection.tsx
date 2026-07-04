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
        <section id="team" className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: colors.background }}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center">
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
                        className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        {members.map((m) => (
                            <motion.div key={m.id} variants={cardVariants}
                                className="group text-center"
                            >
                                <div className="relative mx-auto h-24 w-24">
                                    <div
                                        className="absolute inset-0 rounded-full opacity-20 transition-all duration-500 group-hover:opacity-30 group-hover:scale-110"
                                        style={{ backgroundColor: colors.primary }}
                                    />
                                    <div
                                        className="relative flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                                        style={{ backgroundColor: colors.secondary }}
                                    >
                                        {getInitials(m.name)}
                                    </div>
                                </div>
                                <h3 className="mt-5 text-base font-semibold" style={{ color: colors.text }}>{m.name}</h3>
                                {m.position && (
                                    <p className="mt-1.5 text-sm" style={{ color: colors.text_muted }}>{m.position}</p>
                                )}
                                {m.email && (
                                    <a
                                        href={`mailto:${m.email}`}
                                        className="mt-2 inline-flex items-center gap-1.5 text-xs transition-colors hover:underline"
                                        style={{ color: colors.primary }}
                                    >
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                        {m.email}
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="mt-14 text-center">
                        <div className="inline-flex items-center gap-3 rounded-2xl border bg-white px-8 py-4 shadow-sm" style={{ borderColor: colors.primary + '15' }}>
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