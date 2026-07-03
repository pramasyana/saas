import { Link } from '@inertiajs/react';
import type { CSSProperties, ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
    tenantName?: string;
    logo?: string | null;
    colors?: {
        primary?: string;
        secondary?: string;
        accent?: string;
        background?: string;
        text?: string;
        text_muted?: string;
    };
}

const defaultColors = {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#FAFAFA',
    text: '#171717',
    text_muted: '#737373',
};

export default function PublicLayout({ children, tenantName, logo, colors }: PublicLayoutProps) {
    const c = { ...defaultColors, ...colors };

    const cssVars: CSSProperties = {
        '--color-primary': c.primary,
        '--color-secondary': c.secondary,
        '--color-accent': c.accent,
        '--color-bg': c.background,
        '--color-text': c.text,
        '--color-text-muted': c.text_muted,
    } as CSSProperties;

    return (
        <div className="flex min-h-screen flex-col" style={{ backgroundColor: c.background, ...cssVars }}>
            <header className="sticky top-0 z-40 border-b bg-white shadow-sm" style={{ borderColor: c.text_muted + '20' }}>
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-3">
                        {logo ? (
                            <img src={logo} alt={tenantName ?? 'Logo'} className="max-h-8 w-auto" />
                        ) : (
                            <div
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm"
                                style={{ backgroundColor: c.primary }}
                            >
                                {(tenantName ?? 'B').charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span
                            className="text-base font-bold tracking-tight"
                            style={{ color: c.text }}
                        >
                            {tenantName ?? 'Booking'}
                        </span>
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link
                            href="/booking"
                            className="text-sm font-medium transition-colors hover:opacity-80"
                            style={{ color: c.primary }}
                        >
                            Booking
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="border-t bg-white py-6" style={{ borderColor: c.text_muted + '20' }}>
                <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
                    <p className="text-sm" style={{ color: c.text_muted }}>
                        &copy; {new Date().getFullYear()} {tenantName ?? 'BookCRM'}. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
