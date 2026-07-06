import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import Badge from '@/atoms/Badge';
import AdminLayout from '@/layouts/AdminLayout';
import { cn, formatPrice, formatNumber } from '@/lib/utils';
import { useAdminNotifications } from '@/features/admin/hooks/useAdminNotifications';

interface Stat {
    label: string;
    value: string;
    subtitle: string;
    icon: ReactNode;
    trend?: { value: string; positive: boolean };
    color: 'primary' | 'success' | 'warning' | 'info' | 'danger';
}

interface RecentUser {
    id: string;
    name: string;
    email: string;
    is_admin: boolean;
    created_at: string;
    joined_at: string;
}

interface WeeklySignup {
    day: string;
    count: number;
}

interface RecentSubscription {
    id: string;
    tenant_name: string;
    plan_name: string;
    price_amount: number;
    status: string;
    created_at: string;
}

interface RecentTenant {
    id: string;
    name: string | null;
    email: string | null;
    owner_name: string | null;
    domain: string | null;
    created_at: string;
}

interface RevenueOverview {
    mrr: number;
    active_subscriptions: number;
    total_revenue: number;
    pending_invoices: number;
}

interface MonthlyRevenue {
    labels: string[];
    paid: number[];
    pending: number[];
}

interface DashboardProps {
    stats: {
        total_users: number;
        new_today: number;
        new_this_week: number;
        new_this_month: number;
        total_admins: number;
        user_growth: number;
        total_tenants: number;
        new_tenants_this_month: number;
    };
    recent_users: RecentUser[];
    weekly_signups: WeeklySignup[];
    revenue_overview: RevenueOverview;
    monthly_revenue: MonthlyRevenue;
    recent_subscriptions: RecentSubscription[];
    recent_tenants: RecentTenant[];
}

const accentMap: Record<string, string> = {
    primary: 'border-l-primary',
    success: 'border-l-success',
    warning: 'border-l-warning',
    info: 'border-l-blue-500',
    danger: 'border-l-danger',
};

const iconBgMap: Record<string, string> = {
    primary: 'bg-primary-50 text-primary',
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
    info: 'bg-blue-50 text-blue-600',
    danger: 'bg-danger-light text-danger',
};

const statusBadge: Record<string, string> = {
    active: 'text-success ring-success/20',
    cancelled: 'text-danger ring-danger/20',
    expired: 'text-neutral-600 ring-neutral-300',
    trialing: 'text-blue-600 ring-blue-200',
};

function UsersIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
    );
}

function TrendingUpIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
    );
}

function ShieldIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
    );
}

function BuildingIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
    );
}

function DollarIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function CalendarIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
    );
}

function ChartBarIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
    );
}

function ArrowUpIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
        </svg>
    );
}

function CreditCardIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
    );
}

function ClockIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
};

const itemAnim = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

function GreetingSection() {
    const greeting = (() => {
        const h = new Date().getHours();
        if (h < 12) return 'Selamat Pagi';
        if (h < 15) return 'Selamat Siang';
        if (h < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    })();

    return (
        <motion.div variants={itemAnim} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                    {greeting}, Admin
                </h1>
                <p className="mt-1 text-sm text-neutral-500">
                    Berikut ringkasan aktivitas BookCRM hari ini.
                </p>
            </div>
            <div className="mt-4 flex items-center gap-4 sm:mt-0">
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                        {new Date().toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <ClockIcon className="h-4 w-4" />
                    <span>
                        {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

function NotificationBanners() {
    const { data: notifData } = useAdminNotifications();
    const activeNotifications = (notifData?.data ?? []).filter((n) => n.is_active);

    if (activeNotifications.length === 0) return null;

    const borderMap: Record<string, string> = {
        info: 'border-blue-200 bg-blue-50',
        warning: 'border-amber-200 bg-amber-50',
        success: 'border-green-200 bg-green-50',
        danger: 'border-red-200 bg-red-50',
    };
    const dotMap: Record<string, string> = {
        info: 'bg-blue-500',
        warning: 'bg-amber-500',
        success: 'bg-green-500',
        danger: 'bg-red-500',
    };
    const badgeMap: Record<string, string> = {
        info: 'default',
        warning: 'warning',
        success: 'success',
        danger: 'danger',
    };

    return (
        <motion.div variants={itemAnim} className="space-y-3">
            {activeNotifications.map((n) => (
                <div
                    key={n.id}
                    className={cn(
                        'flex items-start gap-3.5 rounded-xl border p-4 shadow-sm',
                        borderMap[n.type] || borderMap.info,
                    )}
                >
                    <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', dotMap[n.type] || dotMap.info)} />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-neutral-900">{n.title}</p>
                            <Badge variant={(badgeMap[n.type] as 'default' | 'warning' | 'success' | 'danger') || 'default'}>
                                {n.type}
                            </Badge>
                        </div>
                        <p className="mt-0.5 text-sm text-neutral-700">{n.message}</p>
                    </div>
                </div>
            ))}
        </motion.div>
    );
}

function StatCards({ stats, revenue_overview }: { stats: DashboardProps['stats']; revenue_overview: RevenueOverview }) {
    const primaryStats: Stat[] = [
        {
            label: 'Total Users',
            value: formatNumber(stats.total_users),
            subtitle: `${formatNumber(stats.new_this_month)} baru bulan ini`,
            icon: <UsersIcon />,
            trend: { value: `${stats.user_growth}% pertumbuhan`, positive: stats.user_growth >= 0 },
            color: 'primary',
        },
        {
            label: 'Tenants',
            value: formatNumber(stats.total_tenants),
            subtitle: `${formatNumber(stats.new_tenants_this_month)} baru bulan ini`,
            icon: <BuildingIcon />,
            color: 'info',
        },
        {
            label: 'MRR',
            value: formatPrice(revenue_overview.mrr),
            subtitle: `${revenue_overview.active_subscriptions} langganan aktif`,
            icon: <DollarIcon />,
            color: 'success',
        },
        {
            label: 'Total Pendapatan',
            value: formatPrice(revenue_overview.total_revenue),
            subtitle: `${revenue_overview.pending_invoices} invoice pending`,
            icon: <TrendingUpIcon />,
            color: 'danger',
        },
    ];

    const secondaryStats: Stat[] = [
        {
            label: 'Pengguna Baru',
            value: formatNumber(stats.new_today),
            subtitle: 'Mendaftar hari ini',
            icon: <TrendingUpIcon />,
            color: 'success',
        },
        {
            label: 'Minggu Ini',
            value: formatNumber(stats.new_this_week),
            subtitle: `${formatNumber(stats.new_this_month)} pengguna bulan ini`,
            icon: <CalendarIcon />,
            color: 'primary',
        },
        {
            label: 'Administrator',
            value: formatNumber(stats.total_admins),
            subtitle: 'Total admin panel',
            icon: <ShieldIcon />,
            color: 'warning',
        },
    ];

    return (
        <>
            <motion.div variants={itemAnim} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {primaryStats.map((s) => (
                    <div
                        key={s.label}
                        className="group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                        <div className={cn('absolute left-0 top-0 h-full w-1', accentMap[s.color])} />
                        <div className="p-5 pl-6">
                            <div className="flex items-start justify-between">
                                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', iconBgMap[s.color])}>
                                    {s.icon}
                                </div>
                                {s.trend && (
                                    <span
                                        className={cn(
                                            'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium',
                                            s.trend.positive ? 'bg-success-light text-success' : 'bg-danger-light text-danger',
                                        )}
                                    >
                                        <ArrowUpIcon className={cn('h-3 w-3', !s.trend.positive && 'rotate-180')} />
                                        {s.trend.value}
                                    </span>
                                )}
                            </div>
                            <p className="mt-3 text-2xl font-bold tracking-tight text-neutral-900">
                                {s.value}
                            </p>
                            <p className="mt-0.5 text-sm font-medium text-neutral-600">
                                {s.label}
                            </p>
                            <p className="text-xs text-neutral-400">
                                {s.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </motion.div>

            <motion.div variants={itemAnim} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {secondaryStats.map((s) => (
                    <div
                        key={s.label}
                        className="group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                        <div className="p-4">
                            <div className="flex items-center gap-3">
                                <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', iconBgMap[s.color])}>
                                    {s.icon}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-neutral-500">{s.label}</p>
                                    <p className="text-lg font-bold tracking-tight text-neutral-900">{s.value}</p>
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-neutral-400">{s.subtitle}</p>
                        </div>
                    </div>
                ))}
            </motion.div>
        </>
    );
}

function WeeklySignupsChart({ weekly_signups, stats }: { weekly_signups: WeeklySignup[]; stats: DashboardProps['stats'] }) {
    const maxVal = Math.max(...weekly_signups.map((w) => w.count), 1);
    const hasData = weekly_signups.length > 0;
    const barMaxHeight = 112;

    return (
        <motion.div variants={itemAnim}>
            <div className="rounded-xl border border-border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary">
                            <ChartBarIcon className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-neutral-900">Pendaftaran Minggu Ini</h2>
                            <p className="text-xs text-neutral-500">
                                Total {formatNumber(stats.new_this_week)} pengguna baru
                            </p>
                        </div>
                    </div>
                    <Badge variant="default">7 Hari</Badge>
                </div>
                <div className="px-6 pb-5 pt-6">
                    {!hasData ? (
                        <div className="flex h-32 items-center justify-center text-sm text-neutral-400">
                            <div className="text-center">
                                <ChartBarIcon className="mx-auto h-8 w-8 text-neutral-300" />
                                <p className="mt-2">Belum ada data pendaftaran minggu ini.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-end gap-3">
                            {weekly_signups.map((w) => {
                                const barHeight = Math.max((w.count / maxVal) * barMaxHeight, 4);
                                return (
                                    <div key={w.day} className="flex flex-1 flex-col items-center gap-1.5">
                                        <span className="text-xs font-semibold text-neutral-600">{w.count}</span>
                                        <div className="relative flex w-full items-end justify-center" style={{ height: `${barMaxHeight}px` }}>
                                            <div
                                                className="w-full max-w-[32px] rounded-md bg-gradient-to-t from-primary to-primary-light transition-all duration-500"
                                                style={{ height: `${barHeight}px` }}
                                            />
                                        </div>
                                        <span className="text-[11px] font-medium text-neutral-400">
                                            {w.day.slice(0, 3)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function RevenueChart({ monthly_revenue, revenue_overview }: { monthly_revenue: MonthlyRevenue; revenue_overview: RevenueOverview }) {
    const maxVal = Math.max(
        ...monthly_revenue.labels.map((_, i) => Math.max(monthly_revenue.paid[i], monthly_revenue.pending[i])),
        1,
    );
    const hasData = monthly_revenue.labels.length > 0;
    const barMaxHeight = 80;

    const shortLabels = monthly_revenue.labels.map((l) => {
        const parts = l.split(' ');
        return parts[0].slice(0, 3);
    });

    const totalPaid = monthly_revenue.paid.reduce((a, b) => a + b, 0);
    const totalPending = monthly_revenue.pending.reduce((a, b) => a + b, 0);

    return (
        <motion.div variants={itemAnim}>
            <div className="rounded-xl border border-border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-light text-success">
                            <DollarIcon className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-neutral-900">Revenue 12 Bulan</h2>
                            <p className="text-xs text-neutral-500">
                                MRR {formatPrice(revenue_overview.mrr)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-success" />
                            Lunas
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-warning" />
                            Pending
                        </span>
                    </div>
                </div>
                <div className="px-4 pt-6 sm:px-6">
                    {!hasData ? (
                        <div className="flex h-28 items-center justify-center text-sm text-neutral-400">
                            <div className="text-center">
                                <DollarIcon className="mx-auto h-8 w-8 text-neutral-300" />
                                <p className="mt-2">Belum ada data revenue.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-end gap-1">
                            {monthly_revenue.labels.map((label, i) => {
                                const paidVal = monthly_revenue.paid[i];
                                const pendingVal = monthly_revenue.pending[i];
                                const paidH = Math.max((paidVal / maxVal) * barMaxHeight, 2);
                                const pendingH = Math.max((pendingVal / maxVal) * barMaxHeight, 2);

                                return (
                                    <div key={label} className="flex flex-1 flex-col items-center gap-1">
                                        <div className="flex w-full items-end justify-center" style={{ height: `${barMaxHeight}px` }}>
                                            <div className="flex w-full max-w-[18px] flex-col-reverse items-center">
                                                <div
                                                    className="w-full rounded-t-sm bg-warning transition-all duration-500"
                                                    style={{ height: `${pendingH}px` }}
                                                />
                                                <div
                                                    className="w-full rounded-t-sm bg-success transition-all duration-500"
                                                    style={{ height: `${paidH}px` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-[9px] text-neutral-400 leading-none">
                                            {shortLabels[i]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="mt-4 border-t border-border">
                    <div className="max-h-[200px] overflow-y-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="sticky top-0 bg-white">
                                <tr className="border-b border-border text-neutral-400">
                                    <th className="px-6 py-2 font-medium">Bulan</th>
                                    <th className="px-3 py-2 text-right font-medium">Lunas</th>
                                    <th className="px-3 py-2 text-right font-medium">Pending</th>
                                    <th className="px-6 py-2 text-right font-medium">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {monthly_revenue.labels.map((label, i) => {
                                    const paid = monthly_revenue.paid[i];
                                    const pending = monthly_revenue.pending[i];
                                    return (
                                        <tr key={label} className="transition-colors hover:bg-neutral-50">
                                            <td className="px-6 py-2.5 font-medium text-neutral-900">{label}</td>
                                            <td className="px-3 py-2.5 text-right text-success">{formatPrice(paid, true)}</td>
                                            <td className="px-3 py-2.5 text-right text-warning">{formatPrice(pending, true)}</td>
                                            <td className="px-6 py-2.5 text-right font-semibold text-neutral-900">{formatPrice(paid + pending, true)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="bg-neutral-50">
                                <tr className="border-t border-border text-xs font-semibold">
                                    <td className="px-6 py-2.5 text-neutral-900">Total</td>
                                    <td className="px-3 py-2.5 text-right text-success">{formatPrice(totalPaid, true)}</td>
                                    <td className="px-3 py-2.5 text-right text-warning">{formatPrice(totalPending, true)}</td>
                                    <td className="px-6 py-2.5 text-right text-neutral-900">{formatPrice(totalPaid + totalPending, true)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function SubscriptionList({ recent_subscriptions }: { recent_subscriptions: RecentSubscription[] }) {
    return (
        <motion.div variants={itemAnim}>
            <div className="rounded-xl border border-border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary">
                            <CreditCardIcon className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-neutral-900">Subscription Terbaru</h2>
                            <p className="text-xs text-neutral-500">
                                {recent_subscriptions.length} langganan terbaru
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/admin/subscriptions"
                        className="text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                    >
                        Lihat semua
                    </Link>
                </div>
                <div className="divide-y divide-border">
                    {recent_subscriptions.length === 0 ? (
                        <div className="px-6 py-12 text-center text-sm text-neutral-400">
                            <CreditCardIcon className="mx-auto h-8 w-8 text-neutral-300" />
                            <p className="mt-2">Belum ada subscription.</p>
                        </div>
                    ) : (
                        recent_subscriptions.map((sub) => (
                            <div
                                key={sub.id}
                                className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-neutral-50"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-neutral-900 truncate">{sub.tenant_name}</p>
                                    <p className="text-xs text-neutral-500">{sub.plan_name}</p>
                                </div>
                                <div className="flex items-center gap-3 ml-3 shrink-0">
                                    <span className="text-sm font-semibold text-neutral-900">{formatPrice(sub.price_amount)}</span>
                                    <span
                                        className={cn(
                                            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset',
                                            statusBadge[sub.status] ?? 'text-neutral-600 ring-neutral-300',
                                        )}
                                    >
                                        {sub.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function TenantList({ recent_tenants }: { recent_tenants: RecentTenant[] }) {
    return (
        <motion.div variants={itemAnim}>
            <div className="rounded-xl border border-border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <BuildingIcon className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-neutral-900">Tenant Terbaru</h2>
                            <p className="text-xs text-neutral-500">
                                {recent_tenants.length} tenant terbaru
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/admin/tenants"
                        className="text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                    >
                        Lihat semua
                    </Link>
                </div>
                <div className="divide-y divide-border">
                    {recent_tenants.length === 0 ? (
                        <div className="px-6 py-12 text-center text-sm text-neutral-400">
                            <BuildingIcon className="mx-auto h-8 w-8 text-neutral-300" />
                            <p className="mt-2">Belum ada tenant.</p>
                        </div>
                    ) : (
                        recent_tenants.map((t) => (
                            <div
                                key={t.id}
                                className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-neutral-50"
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary">
                                        {(t.name ?? '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <Link
                                            href={`/admin/tenants/${t.id}`}
                                            className="text-sm font-medium text-neutral-900 hover:text-primary truncate block"
                                        >
                                            {t.name ?? 'Tanpa Nama'}
                                        </Link>
                                        <p className="text-xs text-neutral-500 truncate">{t.owner_name ?? t.email ?? '-'}</p>
                                    </div>
                                </div>
                                <div className="ml-3 shrink-0 text-right">
                                    <p className="text-xs text-neutral-400 truncate max-w-[140px]">{t.domain ?? '-'}</p>
                                    <p className="text-xs text-neutral-400">{t.created_at}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function RecentUsersList({ recent_users }: { recent_users: RecentUser[] }) {
    return (
        <motion.div variants={itemAnim}>
            <div className="rounded-xl border border-border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-light text-success">
                            <UsersIcon className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-neutral-900">Pengguna Terbaru</h2>
                            <p className="text-xs text-neutral-500">
                                {recent_users.length} pengguna terakhir mendaftar
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/admin/users"
                        className="text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                    >
                        Lihat semua
                    </Link>
                </div>
                <div className="divide-y divide-border">
                    {recent_users.length === 0 ? (
                        <div className="px-6 py-12 text-center text-sm text-neutral-400">
                            <UsersIcon className="mx-auto h-8 w-8 text-neutral-300" />
                            <p className="mt-2">Belum ada pengguna terdaftar.</p>
                        </div>
                    ) : (
                        recent_users.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-neutral-50"
                            >
                                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-neutral-900 truncate">{user.name}</p>
                                        <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 ml-3 shrink-0">
                                    <span className="hidden text-xs text-neutral-400 sm:block">{user.created_at}</span>
                                    {user.is_admin && <Badge variant="warning">Admin</Badge>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function QuickActions() {
    const actions = [
        { label: 'Users', href: '/admin/users', icon: UsersIcon, color: 'bg-primary-50 text-primary' },
        { label: 'Tenants', href: '/admin/tenants', icon: BuildingIcon, color: 'bg-blue-50 text-blue-600' },
        { label: 'Subs', href: '/admin/subscriptions', icon: CreditCardIcon, color: 'bg-success-light text-success' },
        { label: 'Revenue', href: '/admin/revenue', icon: DollarIcon, color: 'bg-warning-light text-warning' },
    ];

    return (
        <motion.div variants={itemAnim} className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-neutral-400 mr-1">Akses Cepat:</span>
            {actions.map((a) => (
                <Link
                    key={a.href}
                    href={a.href}
                    className={cn(
                        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                        a.color,
                    )}
                >
                    <a.icon className="h-3.5 w-3.5" />
                    {a.label}
                </Link>
            ))}
        </motion.div>
    );
}

export default function AdminDashboard({
    stats,
    recent_users,
    weekly_signups,
    revenue_overview,
    monthly_revenue,
    recent_subscriptions,
    recent_tenants,
}: DashboardProps) {
    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                <GreetingSection />

                <QuickActions />

                <NotificationBanners />

                <StatCards stats={stats} revenue_overview={revenue_overview} />

                <div className="grid gap-6 lg:grid-cols-2">
                    <WeeklySignupsChart weekly_signups={weekly_signups} stats={stats} />
                    <RevenueChart monthly_revenue={monthly_revenue} revenue_overview={revenue_overview} />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <SubscriptionList recent_subscriptions={recent_subscriptions} />
                    <TenantList recent_tenants={recent_tenants} />
                </div>

                <RecentUsersList recent_users={recent_users} />
            </motion.div>
        </AdminLayout>
    );
}
