import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import type { CSSProperties, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    solidHeader?: boolean;
}

const defaultColors = {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#FAFAFA',
    text: '#171717',
    text_muted: '#737373',
};

export default function PublicLayout({ children, tenantName, logo, colors, solidHeader }: PublicLayoutProps) {
    const c = { ...defaultColors, ...colors };
    const [scrolled, setScrolled] = useState(solidHeader ?? false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (solidHeader) { setScrolled(true); return; }
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [solidHeader]);

    const cssVars: CSSProperties = {
        '--color-primary': c.primary,
        '--color-secondary': c.secondary,
        '--color-accent': c.accent,
        '--color-bg': c.background,
        '--color-text': c.text,
        '--color-text-muted': c.text_muted,
    } as CSSProperties;

    const navLinks = [
        { href: '/', label: 'Beranda' },
    ];

    return (
        <div className="flex min-h-screen flex-col" style={{ backgroundColor: c.background, ...cssVars }}>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'bg-white/80 shadow-lg shadow-black/5 backdrop-blur-xl'
                        : 'bg-transparent'
                }`}
            >
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-3 group">
                        {logo ? (
                            <img src={logo} alt={tenantName ?? 'Logo'} className="max-h-8 w-auto transition-transform group-hover:scale-105" />
                        ) : (
                            <div
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-base font-bold text-white shadow-lg transition-transform group-hover:scale-110 group-hover:shadow-xl"
                                style={{ backgroundColor: c.primary }}
                            >
                                {(tenantName ?? 'B').charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span
                            className={`text-base font-bold tracking-tight transition-colors ${
                                scrolled ? '' : 'text-white'
                            }`}
                            style={scrolled ? { color: c.text } : { color: '#fff' }}
                        >
                            {tenantName ?? 'Booking'}
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-1 sm:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-white/10"
                                style={{ color: scrolled ? c.text : '#fff' }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/booking"
                            className="ml-2 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
                            style={{ backgroundColor: c.primary }}
                        >
                            Booking
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </nav>

                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg sm:hidden"
                        style={{ color: scrolled ? c.text : '#fff' }}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            )}
                        </svg>
                    </button>
                </div>

                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t bg-white px-4 pb-4 pt-2 shadow-xl sm:hidden"
                            style={{ borderColor: c.primary + '15' }}
                        >
                            <div className="flex flex-col gap-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-100"
                                        style={{ color: c.text }}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Link
                                    href="/booking"
                                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                                    style={{ backgroundColor: c.primary }}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Booking Sekarang
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="border-t" style={{ backgroundColor: c.text, borderColor: c.text + '20' }}>
                <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-3 mb-4">
                                {logo ? (
                                    <img src={logo} alt={tenantName ?? 'Logo'} className="max-h-8 w-auto brightness-0 invert" />
                                ) : (
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl text-base font-bold text-white" style={{ backgroundColor: c.primary }}>
                                        {(tenantName ?? 'B').charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="text-base font-bold text-white">{tenantName ?? 'Booking'}</span>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
                                Solusi perawatan premium untuk Anda. Pengalaman terbaik dengan hasil maksimal.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-4">Navigasi</h4>
                            <ul className="space-y-2.5">
                                {['Beranda', 'Layanan', 'Booking', 'Kontak'].map((item) => (
                                    <li key={item}>
                                        <Link
                                            href={item === 'Booking' ? '/booking' : '/'}
                                            className="text-sm transition-colors hover:text-white"
                                            style={{ color: '#9CA3AF' }}
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-4">Kontak</h4>
                            <ul className="space-y-2.5 text-sm" style={{ color: '#9CA3AF' }}>
                                <li>info@{tenantName?.toLowerCase().replace(/\s+/g, '')}.com</li>
                                <li>+62 812 3456 7890</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-4">Ikuti Kami</h4>
                            <div className="flex gap-3">
                                {['Instagram', 'Facebook', 'YouTube'].map((social) => (
                                    <a
                                        key={social}
                                        href="#"
                                        className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all hover:scale-110"
                                        style={{ backgroundColor: c.primary + '20', color: '#fff' }}
                                    >
                                        {social.charAt(0)}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 border-t pt-6 text-center" style={{ borderColor: '#ffffff10' }}>
                        <p className="text-xs" style={{ color: '#6B7280' }}>
                            &copy; {new Date().getFullYear()} {tenantName ?? 'BookCRM'}. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}