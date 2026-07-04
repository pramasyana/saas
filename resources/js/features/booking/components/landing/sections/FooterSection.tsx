import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['footer']>;
    colors: NonNullable<LandingConfig['colors']>;
    tenantName?: string;
}

export default function FooterSection({ data, colors, tenantName }: Props) {
    const text = data.copyright_text ?? `© ${new Date().getFullYear()} ${tenantName ?? 'BookCRM'}. All rights reserved.`;

    return (
        <footer className="border-t bg-white py-6" style={{ borderColor: colors.primary + '10' }}>
            <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                    <p className="text-sm" style={{ color: colors.text_muted }}>
                        {text.replace('{company_name}', tenantName ?? '')}
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-xs transition-colors hover:underline" style={{ color: colors.text_muted }}>
                            Kebijakan Privasi
                        </a>
                        <a href="#" className="text-xs transition-colors hover:underline" style={{ color: colors.text_muted }}>
                            Syarat & Ketentuan
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}