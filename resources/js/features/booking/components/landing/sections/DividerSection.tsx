import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['divider']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function DividerSection({ data, colors }: Props) {
    if (!data.style) {
return null;
}

    const height = data.height ?? 60;

    if (data.style === 'space') {
        return <div style={{ height, backgroundColor: colors.background }} />;
    }

    return (
        <div className="flex items-center justify-center" style={{ height, backgroundColor: colors.background }}>
            {data.style === 'dots' ? (
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => <div key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.text_muted, opacity: 0.3 + i * 0.2 }} />)}
                </div>
            ) : data.style === 'wave' ? (
                <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="h-full w-full" style={{ color: colors.primary }}>
                    <path d="M0,30 C200,0 400,60 600,30 C800,0 1000,60 1200,30 L1200,60 L0,60 Z" fill="currentColor" opacity="0.08" />
                    <path d="M0,40 C200,15 400,55 600,40 C800,15 1000,55 1200,40 L1200,60 L0,60 Z" fill="currentColor" opacity="0.05" />
                </svg>
            ) : (
                <div className="h-px w-full max-w-2xl" style={{ backgroundColor: colors.text_muted, opacity: 0.3 }} />
            )}
        </div>
    );
}
