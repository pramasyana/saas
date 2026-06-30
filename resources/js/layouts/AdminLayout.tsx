import { Link, router, usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebar';

interface AdminLayoutProps {
    children: ReactNode;
}

const navItems = [
    {
        label: 'Dashboard',
        href: '/admin/dashboard',
        icon: (
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
        ),
    },
    {
        label: 'Users',
        href: '/admin/users',
        icon: (
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        ),
    },
    {
        label: 'Laporan',
        href: '/admin/reports',
        icon: (
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        ),
    },
    {
        label: 'Pengaturan',
        href: '/admin/settings',
        icon: (
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { collapsed, mobileOpen, toggleCollapsed, setMobileOpen } = useSidebarStore();

    const { url } = usePage();

    function handleLogout() {
        router.post('/admin/logout');
    }

    function isActive(href: string) {
        if (href === '/admin/dashboard') {
            return url === '/admin/dashboard';
        }
        return url.startsWith(href);
    }

    return (
        <div className="flex min-h-screen bg-neutral-50">
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-white transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
                    collapsed ? 'lg:w-16' : 'lg:w-64',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className={cn(
                    'flex h-16 shrink-0 items-center border-b border-border transition-all duration-300',
                    collapsed ? 'lg:justify-center lg:px-0' : 'gap-2.5 px-6',
                )}>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-light text-sm font-bold text-white shadow-sm">
                        B
                    </div>
                    <span className={cn(
                        'overflow-hidden whitespace-nowrap text-base font-bold tracking-tight text-neutral-900 transition-all duration-300',
                        collapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100',
                    )}>
                        BookCRM
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto px-2 py-4 lg:px-3">
                    <p className={cn(
                        'mb-2 overflow-hidden whitespace-nowrap px-3 text-xs font-semibold tracking-wider text-neutral-400 transition-all duration-300',
                        collapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100',
                    )}>
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
                                        collapsed && 'lg:justify-center lg:gap-0 lg:px-2',
                                        active
                                            ? 'bg-primary-50 text-primary shadow-sm'
                                            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                                    )}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <span className={cn('shrink-0', active ? 'text-primary' : 'text-neutral-400')}>
                                        {item.icon}
                                    </span>
                                    <span className={cn(
                                        'overflow-hidden whitespace-nowrap transition-all duration-300',
                                        collapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100',
                                    )}>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto shrink-0 border-t border-border px-3 py-4">
                    <button
                        onClick={handleLogout}
                        className={cn(
                            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-danger-light hover:text-danger',
                            collapsed && 'lg:justify-center lg:gap-0 lg:px-2',
                        )}
                        title={collapsed ? 'Logout' : undefined}
                    >
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        <span className={cn(
                            'overflow-hidden whitespace-nowrap transition-all duration-300',
                            collapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100',
                        )}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-white px-4 lg:px-6">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 lg:hidden"
                        aria-label="Buka sidebar"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>

                    <button
                        onClick={toggleCollapsed}
                        className="hidden rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 lg:block"
                        aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
                    >
                        <svg className={cn(
                            'h-5 w-5 transition-transform duration-300',
                            collapsed && 'rotate-180',
                        )} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                        </svg>
                    </button>

                    <div className="flex-1" />

                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary">
                            SA
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}
        </div>
    );
}
