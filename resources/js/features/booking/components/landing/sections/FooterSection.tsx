import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['footer']>;
    colors: NonNullable<LandingConfig['colors']>;
    tenantName?: string;
}

export default function FooterSection({ data, colors, tenantName }: Props) {
    const text = data.copyright_text ?? `© ${new Date().getFullYear()} ${tenantName ?? 'BookCRM'}. All rights reserved.`;

    return (
        <footer className="border-t bg-white py-6" style={{ borderColor: colors.text_muted + '20' }}>
            <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
                <p className="text-sm" style={{ color: colors.text_muted }}>
                    {text.replace('{company_name}', tenantName ?? '')}
                </p>
            </div>
        </footer>
    );
}
