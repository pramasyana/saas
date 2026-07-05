import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
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
    solidHeader?: boolean;
}

const defaultColors = {
    primary: '#6B38D4',
    secondary: '#4648D4',
    accent: '#855000',
    background: '#FAF8FF',
    text: '#131B2E',
    text_muted: '#494454',
};

export default function PublicLayout({ children, tenantName, logo, colors, solidHeader }: PublicLayoutProps) {
    const c = { ...defaultColors, ...colors };
    const [scrolled, setScrolled] = useState(solidHeader ?? false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (solidHeader) {
 setScrolled(true);

 return; 
}

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
                        ? 'bg-white/70 shadow-sm shadow-primary/10 backdrop-blur-xl border-b border-white/20'
                        : 'bg-transparent'
                }`}
            >
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-gutter">
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
                            className="text-base font-bold tracking-tight"
                            style={{ color: c.text }}
                        >
                            {tenantName ?? 'Booking'}
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium transition-colors"
                                style={{ color: c.text, borderBottom: scrolled ? `2px solid ${c.primary}` : '2px solid transparent', paddingBottom: '4px' }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/booking"
                            className="hidden lg:inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                            style={{ backgroundColor: c.primary }}
                        >
                            Book Ritual
                        </Link>
                    </nav>

                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden"
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
                            className="border-t bg-white px-4 pb-4 pt-2 shadow-xl md:hidden"
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
                                    Book Ritual
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="border-t w-full py-section-gap-desktop" style={{ borderColor: 'rgba(203,195,215,0.3)', backgroundColor: '#F2F3FF' }}>
                <div className="mx-auto max-w-7xl px-gutter grid grid-cols-1 md:grid-cols-4 gap-base gap-y-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            {logo ? (
                                <img src={logo} alt={tenantName ?? 'Logo'} className="max-h-8 w-auto" />
                            ) : (
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl text-base font-bold text-white" style={{ backgroundColor: c.primary }}>
                                    {(tenantName ?? 'B').charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="text-base font-bold" style={{ color: c.text }}>{tenantName ?? 'Booking'}</span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: c.text_muted }}>
                            Solusi perawatan premium untuk Anda. Pengalaman terbaik dengan hasil maksimal di setiap kunjungan.
                        </p>
                        <div className="flex gap-4">
                            {['IG', 'FB', 'YT'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all hover:scale-110"
                                    style={{ backgroundColor: c.primary + '10', color: c.primary }}
                                >
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h5 className="font-bold uppercase tracking-widest text-sm" style={{ color: c.text }}>Navigasi</h5>
                        <ul className="space-y-4">
                            {['Beranda', 'Layanan', 'Booking', 'Kontak'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={item === 'Booking' ? '/booking' : '/'}
                                        className="text-sm transition-colors font-semibold"
                                        style={{ color: c.text_muted }}
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h5 className="font-bold uppercase tracking-widest text-sm" style={{ color: c.text }}>Kontak</h5>
                        <ul className="space-y-4 text-sm" style={{ color: c.text_muted }}>
                            <li>info@{tenantName?.toLowerCase().replace(/\s+/g, '')}.com</li>
                            <li>+62 812 3456 7890</li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5">Jl. Kemang Raya No. 42, Jakarta Selatan</span>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h5 className="font-bold uppercase tracking-widest text-sm" style={{ color: c.text }}>Newsletter</h5>
                        <p className="text-sm" style={{ color: c.text_muted }}>
                            Dapatkan update promo dan tips kecantikan terbaru langsung di email Anda.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email Anda"
                                className="flex-1 rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                style={{ borderColor: 'rgba(203,195,215,0.5)', backgroundColor: '#fff' }}
                            />
                            <button
                                className="flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:scale-105"
                                style={{ backgroundColor: c.primary, color: '#fff' }}
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-gutter mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'rgba(203,195,215,0.3)' }}>
                    <p className="text-xs" style={{ color: c.text_muted }}>
                        &copy; {new Date().getFullYear()} {tenantName ?? 'BookCRM'}. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs" style={{ color: c.text_muted }}>
                        <a href="#" className="hover:underline">Privacy Policy</a>
                        <a href="#" className="hover:underline">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
