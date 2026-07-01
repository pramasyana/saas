import { Link, router, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import ToastContainer from '@/atoms/Toast';
import { cn } from '@/lib/utils';

interface TenantLayoutProps {
    children: ReactNode;
}

const navItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: (
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
        ),
    },
];

export default function TenantLayout({ children }: TenantLayoutProps) {
    const { url } = usePage();

    function handleLogout() {
        router.post('/logout');
    }

    function isActive(href: string) {
        return url === href || url.startsWith(href + '/');
    }

    const user = usePage().props.auth?.user as { name?: string } | undefined;
    const initials = user?.name
        ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <div className="flex min-h-screen bg-neutral-50">
            <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-white">
                <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border px-6">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-light text-sm font-bold text-white shadow-sm">
                        B
                    </div>
                    <span className="text-base font-bold tracking-tight text-neutral-900">
                        BookCRM
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-4">
                    <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-neutral-400">
                        Menu Utama
                    </p>
                    <nav className="space-y-0.5">
                        {navItems.map((item) => {
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                                        active
                                            ? 'bg-primary-50 text-primary shadow-sm'
                                            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                                    )}
                                >
                                    <span className={cn('shrink-0', active ? 'text-primary' : 'text-neutral-400')}>
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto shrink-0 border-t border-border px-3 py-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-danger-light hover:text-danger"
                    >
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col pl-64">
                <header className="flex h-16 shrink-0 items-center justify-end gap-3 border-b border-border bg-white px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary">
                            {initials}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {children}
                </main>
            </div>

            <ToastContainer />
        </div>
    );
}
