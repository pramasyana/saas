import { Link } from '@inertiajs/react';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['cta']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function CTASection({ data }: Props) {
    const bgColor = data.background_color || '#7C3AED';
    const txtColor = data.text_color || '#FFFFFF';

    return (
        <section className="py-16 sm:py-20" style={{ backgroundColor: bgColor }}>
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: txtColor }}>{data.title || 'Siap Booking?'}</h2>
                {data.subtitle && <p className="mt-4 text-lg" style={{ color: txtColor + 'CC' }}>{data.subtitle}</p>}
                <div className="mt-8">
                    <Link href={data.button_link || '/booking'} className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105" style={{ color: bgColor }}>
                        {data.button_text || 'Booking Sekarang'}
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
