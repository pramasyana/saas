import { Link } from '@inertiajs/react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Calendar } from 'lucide-react';
import Button from '@/atoms/Button';
import { cn } from '@/lib/utils';

const productLinks = [
    { label: 'Nusentra Booking', href: '#features', desc: 'Penjadwalan & reservasi online' },
    { label: 'Nusentra CRM', href: '#features', desc: 'Manajemen pelanggan' },
    { label: 'Nusentra Finance', href: '#features', desc: 'Penagihan & pembayaran' },
    { label: 'Nusentra Pages', href: '#features', desc: 'Halaman bisnis profesional' },
];

const navLinks = [
    { label: 'Harga', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [productOpen, setProductOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', (latest) => {
        setScrolled(latest > 20);
    });

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled
                    ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-outline-variant/20 py-3'
                    : 'bg-white/90 backdrop-blur-md border-b border-outline-variant/20 py-4',
            )}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
                <div className="flex items-center gap-8">
                    <a href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
                        <img src="/images/logo-nusentra.png" alt="Nusentra" className="h-12 w-auto object-contain" />
                    </a>

                    <nav className="hidden lg:flex items-center gap-8">
                        <div className="relative group">
                            <button
                                className="flex items-center gap-1 font-medium text-sm text-on-surface hover:text-primary transition-colors"
                                onMouseEnter={() => setProductOpen(true)}
                                onMouseLeave={() => setProductOpen(false)}
                            >
                                Produk & Layanan
                                <ChevronDown className="h-4 w-4" />
                            </button>
                            {productOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-full left-0 mt-2 w-72 rounded-xl border border-border bg-white p-2 shadow-xl"
                                    onMouseEnter={() => setProductOpen(true)}
                                    onMouseLeave={() => setProductOpen(false)}
                                >
                                    {productLinks.map((link) => (
                                        <a
                                            key={link.label}
                                            href={link.href}
                                            className="block rounded-lg px-4 py-3 transition-colors hover:bg-neutral-50"
                                        >
                                            <p className="text-sm font-medium text-neutral-900">{link.label}</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">{link.desc}</p>
                                        </a>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="font-medium text-sm text-on-surface hover:text-primary transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="hidden sm:block font-medium text-sm text-on-surface hover:text-primary transition-colors">
                        Masuk
                    </Link>
                    <Link href="/register">
                        <Button size="sm" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Jadwalkan Demo
                        </Button>
                    </Link>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden flex items-center p-2 text-on-surface"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-border/50 bg-white px-6 pb-8 pt-4 lg:hidden"
                >
                    <nav>
                        <ul className="flex flex-col gap-1">
                            <li>
                                <span className="block px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                    Produk & Layanan
                                </span>
                                {productLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="block rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </li>
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="block rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <hr className="my-4 border-border" />
                    <Link href="/login" className="mb-3 block w-full rounded-lg px-3 py-2.5 text-center text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100">
                        Masuk
                    </Link>
                    <Link href="/register">
                        <Button size="sm" className="w-full gap-2">
                            <Calendar className="h-4 w-4" />
                            Jadwalkan Demo
                        </Button>
                    </Link>
                </motion.div>
            )}
        </motion.header>
    );
}
