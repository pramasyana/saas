import { Link } from '@inertiajs/react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Button from '@/atoms/Button';
import { cn } from '@/lib/utils';

const links = [
    { label: 'Fitur', href: '#features' },
    { label: 'Harga', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', (latest) => {
        setScrolled(latest > 40);
    });

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
                scrolled
                    ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-border/50'
                    : 'bg-transparent',
            )}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
                <a
                    href="/"
                    className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-light text-sm font-bold text-white shadow-sm">
                        B
                    </div>
                    <span className="text-base font-bold tracking-tight text-neutral-900">
                        BookCRM
                    </span>
                </a>

                <nav className="hidden items-center md:flex">
                    <ul className="flex items-center gap-1">
                        {links.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="ml-8 flex items-center gap-3">
                        <Link href="/login" className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900">
                            Masuk
                        </Link>
                        <Link href="/register">
                            <Button size="sm">Mulai Uji Coba</Button>
                        </Link>
                    </div>
                </nav>

                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors md:hidden',
                        mobileOpen
                            ? 'border-primary/30 bg-primary/5'
                            : 'border-border bg-white',
                    )}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? (
                        <X className="h-4 w-4 text-neutral-600" />
                    ) : (
                        <Menu className="h-4 w-4 text-neutral-600" />
                    )}
                </button>
            </div>

            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-border/50 bg-white px-5 pb-8 pt-4 md:hidden"
                >
                    <nav>
                        <ul className="flex flex-col gap-1">
                            {links.map((link) => (
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
                        <Button size="sm" className="w-full">
                            Mulai Uji Coba
                        </Button>
                    </Link>
                </motion.div>
            )}
        </motion.header>
    );
}
