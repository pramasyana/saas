import { useState, useRef, useEffect } from 'react';
import { useTenantNotifications, useMarkNotificationRead } from '@/features/tenant/hooks/useTenantNotifications';

const typeStyles: Record<string, string> = {
    info: 'bg-blue-100 text-blue-600',
    warning: 'bg-warning-light text-warning',
    success: 'bg-success-light text-success',
    danger: 'bg-danger-light text-danger',
};

export default function TenantNotificationBell() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { data, isLoading } = useTenantNotifications();
    const markRead = useMarkNotificationRead();

    const notifications = data?.data ?? [];
    const unreadCount = notifications.filter((n) => {
        const readBy = n.read_by ?? [];

        return readBy.length === 0;
    }).length;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleOpen() {
        setOpen(!open);
    }

    function handleMarkRead(id: string) {
        markRead.mutate(id);
    }

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={handleOpen}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Notifikasi"
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-neutral-200 bg-white shadow-lg z-50">
                    <div className="border-b border-neutral-100 px-4 py-3">
                        <h3 className="text-sm font-semibold text-neutral-900">Notifikasi</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {isLoading ? (
                            <div className="space-y-3 p-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="h-16 animate-pulse rounded-xl bg-neutral-100" />
                                ))}
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                                <svg className="h-8 w-8 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                </svg>
                                <p className="text-sm text-neutral-500">Tidak ada notifikasi</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-neutral-100">
                                {notifications.map((n) => (
                                    <button
                                        key={n.id}
                                        onClick={() => handleMarkRead(n.id)}
                                        className="w-full px-4 py-3 text-left transition-colors hover:bg-neutral-50"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${typeStyles[n.type]}`}>
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-neutral-900">{n.title}</p>
                                                <p className="mt-0.5 text-xs text-neutral-600 line-clamp-2">{n.message}</p>
                                                <p className="mt-1 text-[10px] text-neutral-400">
                                                    {new Date(n.created_at).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
