import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface TenantSubNavProps {
    tenantId: string;
    tenantName?: string | null;
    tenantEmail?: string | null;
}

const tabs = [
    { label: 'Info', href: '' },
    { label: 'Profil Perusahaan', href: '/company/profile' },
    { label: 'Cabang', href: '/company/branches' },
    { label: 'Jam Kerja', href: '/company/working-hours' },
    { label: 'Hari Libur', href: '/company/holidays' },
    { label: 'Langganan', href: '/subscription' },
];

const avatarColors = [
    'bg-primary text-white',
    'bg-emerald-600 text-white',
    'bg-amber-600 text-white',
    'bg-rose-600 text-white',
    'bg-sky-600 text-white',
    'bg-violet-600 text-white',
];

function getAvatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getInitials(name: string | null | undefined): string {
    if (!name) return 'T';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function TenantSubNav({ tenantId, tenantName, tenantEmail }: TenantSubNavProps) {
    const { url } = usePage();

    function isActive(tabHref: string) {
        if (!tabHref) return url === `/admin/tenants/${tenantId}` || url === `/admin/tenants/${tenantId}/edit`;
        return url === `/admin/tenants/${tenantId}${tabHref}`;
    }

    return (
        <div className="rounded-xl border border-neutral-200 bg-white">
            <div className="flex items-center gap-4 px-6 py-4">
                <div className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold shadow-sm',
                    getAvatarColor(tenantName ?? ''),
                )}>
                    {getInitials(tenantName)}
                </div>
                <div className="min-w-0 leading-tight">
                    <p className="text-sm font-semibold text-neutral-900 truncate">
                        {tenantName || 'Tenant'}
                    </p>
                    {tenantEmail && (
                        <p className="text-xs text-neutral-500 truncate">{tenantEmail}</p>
                    )}
                </div>
            </div>

            <div className="flex gap-0.5 overflow-x-auto border-t border-neutral-100 px-4">
                {tabs.map((tab) => {
                    const active = isActive(tab.href);
                    return (
                        <Link
                            key={tab.label}
                            href={tab.href ? `/admin/tenants/${tenantId}${tab.href}` : `/admin/tenants/${tenantId}`}
                            className={cn(
                                'relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors',
                                active
                                    ? 'text-primary'
                                    : 'text-neutral-500 hover:text-neutral-700',
                            )}
                        >
                            {tab.label}
                            {active && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
