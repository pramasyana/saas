import { motion } from 'framer-motion';
import FadeIn from '@/atoms/FadeIn';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';
import { getInitials } from '../_utils';

interface TeamMember {
    id: string;
    name: string;
    position: string | null;
    email: string | null;
}

interface Props {
    data: NonNullable<LandingConfig['team']>;
    colors: NonNullable<LandingConfig['colors']>;
    team?: TeamMember[];
}

export default function TeamSection({ data, colors, team }: Props) {
    const members = team ?? [];

    if (!members.length) {
        return null;
    }

    return (
        <section id="team" className="py-24 lg:py-32" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="mx-auto max-w-5xl px-gutter">
                <FadeIn>
                    <div className="text-center mb-24 space-y-4">
                        {data.title && (
                            <h2 className="text-5xl lg:text-6xl font-black tracking-tight" style={{ color: colors.text }}>
                                {data.title}
                            </h2>
                        )}
                        {data.subtitle && (
                            <p className="max-w-2xl mx-auto text-base font-light leading-relaxed" style={{ color: colors.text_muted }}>
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                </FadeIn>

                <motion.div
                    className="grid gap-24 md:grid-cols-2"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
                >
                    {members.map((m) => (
                        <motion.div
                            key={m.id}
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                            className="text-center"
                        >
                            <div className="w-64 h-64 rounded-full flex items-center justify-center text-4xl font-light mx-auto" style={{ color: colors.primary + '60', backgroundColor: colors.primary + '05' }}>
                                {getInitials(m.name)}
                            </div>
                            <h3 className="mt-10 text-xl font-semibold tracking-tight" style={{ color: colors.text }}>
                                {m.name}
                            </h3>
                            {m.position && (
                                <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em]" style={{ color: colors.text_muted }}>
                                    {m.position}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
