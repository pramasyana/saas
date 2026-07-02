import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
    tenantName?: string;
}

export default function PublicLayout({ children, tenantName }: PublicLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-neutral-50">
            <header className="sticky top-0 z-40 border-b border-border bg-white shadow-sm">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-light text-sm font-bold text-white shadow-sm">
                            B
                        </div>
                        <span className="text-base font-bold tracking-tight text-neutral-900">
                            {tenantName ?? 'Booking'}
                        </span>
                    </div>
                    <nav className="flex items-center gap-6">
                        <Link
                            href="/booking"
                            className="text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                        >
                            Booking
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="border-t border-border bg-white py-6">
                <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
                    <p className="text-sm text-neutral-400">
                        &copy; {new Date().getFullYear()} BookCRM. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
