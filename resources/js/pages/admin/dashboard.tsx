import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type {ReactNode} from 'react';
import Badge from '@/atoms/Badge';
import AdminLayout from '@/layouts/AdminLayout';
import { cn, formatPrice } from '@/lib/utils';
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

const colorMap: Record<string, { bg: string; icon: string; ring: string }> = {
    primary: { bg: 'bg-primary-50', icon: 'text-primary', ring: 'ring-primary/10' },
    success: { bg: 'bg-success-light', icon: 'text-success', ring: 'ring-success/20' },
    warning: { bg: 'bg-warning-light', icon: 'text-warning', ring: 'ring-warning/20' },
    info: { bg: 'bg-blue-50', icon: 'text-blue-600', ring: 'ring-blue-200' },
    danger: { bg: 'bg-danger-light', icon: 'text-danger', ring: 'ring-danger/20' },
};

const statusBadge: Record<string, string> = {
    active: 'bg-success-light text-success',
    cancelled: 'bg-danger-light text-danger',
    expired: 'bg-neutral-100 text-neutral-600',
    trialing: 'bg-blue-50 text-blue-600',
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

function ArrowUpIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
        </svg>
    );
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
    },
};

const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function AdminDashboard({ stats, recent_users, weekly_signups, revenue_overview, monthly_revenue, recent_subscriptions, recent_tenants }: DashboardProps) {
    const maxWeeklyValue = Math.max(...weekly_signups.map((w) => w.count), 1);
    const maxMonthlyValue = Math.max(...monthly_revenue.paid.map((v, i) => Math.max(v, monthly_revenue.pending[i])), 1);

    const { data: notifData } = useAdminNotifications();
    const activeNotifications = (notifData?.data ?? []).filter((n) => n.is_active);

    const greeting = (() => {
        const h = new Date().getHours();
        if (h < 12) return 'Selamat Pagi';
        if (h < 15) return 'Selamat Siang';
        if (h < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    })();

    const statCards: Stat[] = [
        {
            label: 'Total Users',
            value: stats.total_users.toLocaleString('id-ID'),
            subtitle: 'Seluruh pengguna terdaftar',
            icon: <UsersIcon />,
            trend: { value: `${stats.user_growth}% bulan ini`, positive: stats.user_growth >= 0 },
            color: 'primary',
        },
        {
            label: 'Pengguna Baru',
            value: stats.new_today.toLocaleString('id-ID'),
            subtitle: 'Mendaftar hari ini',
            icon: <TrendingUpIcon />,
            color: 'success',
        },
        {
            label: 'Minggu Ini',
            value: stats.new_this_week.toLocaleString('id-ID'),
            subtitle: `${stats.new_this_month} pengguna bulan ini`,
            icon: <CalendarIcon />,
            color: 'info',
        },
        {
            label: 'Administrator',
            value: stats.total_admins.toLocaleString('id-ID'),
            subtitle: 'Total admin panel',
            icon: <ShieldIcon />,
            color: 'warning',
        },
        {
            label: 'Tenants',
            value: stats.total_tenants.toLocaleString('id-ID'),
            subtitle: `${stats.new_tenants_this_month} baru bulan ini`,
            icon: <BuildingIcon />,
            color: 'primary',
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

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <motion.div variants={container} initial="hidden" animate="show">
                <motion.div variants={itemAnim} className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                            {greeting}, Admin
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500">
                            Berikut ringkasan aktivitas BookCRM hari ini.
                        </p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-neutral-400 sm:mt-0">
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
                </motion.div>

                {activeNotifications.length > 0 && (
                    <motion.div variants={itemAnim} className="mb-6 space-y-3">
                        {activeNotifications.map((n) => {
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
                            return (
                                <div key={n.id} className={`flex items-start gap-3 rounded-xl border p-4 ${borderMap[n.type] || borderMap.info}`}>
                                    <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${dotMap[n.type] || dotMap.info}`} />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-neutral-900">{n.title}</p>
                                        <p className="mt-0.5 text-sm text-neutral-700">{n.message}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                <motion.div variants={itemAnim} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                    {statCards.map((s) => {
                        const c = colorMap[s.color];
                        return (
                            <div
                                key={s.label}
                                className="group relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl ring-1', c.bg, c.icon, c.ring)}>
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
                                <p className="mt-3 text-lg font-bold tracking-tight text-neutral-900">
                                    {s.value}
                                </p>
                                <p className="mt-0.5 text-xs font-medium text-neutral-500">
                                    {s.label}
                                </p>
                                <p className="text-xs text-neutral-400">
                                    {s.subtitle}
                                </p>
                            </div>
                        );
                    })}
                </motion.div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <motion.div variants={itemAnim}>
                        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-semibold text-neutral-900">
                                        Pendaftaran Minggu Ini
                                    </h2>
                                    <p className="mt-0.5 text-sm text-neutral-500">
                                        Total {stats.new_this_week} pengguna baru
                                    </p>
                                </div>
                                <Badge variant="default">7 Hari</Badge>
                            </div>
                            <div className="flex items-end gap-3">
                                {weekly_signups.map((w) => (
                                    <div key={w.day} className="flex flex-1 flex-col items-center gap-2">
                                        <span className="text-xs font-medium text-neutral-500">
                                            {w.count}
                                        </span>
                                        <div className="relative flex w-full items-end justify-center">
                                            <div
                                                className="w-full max-w-[36px] rounded-lg bg-gradient-to-t from-primary to-primary-light transition-all duration-500"
                                                style={{ height: `${Math.max((w.count / maxWeeklyValue) * 140, 6)}px` }}
                                            />
                                        </div>
                                        <span className="text-xs text-neutral-400">
                                            {w.day.slice(0, 3)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemAnim}>
                        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-semibold text-neutral-900">
                                        Revenue 12 Bulan
                                    </h2>
                                    <p className="mt-0.5 text-sm text-neutral-500">
                                        MRR {formatPrice(revenue_overview.mrr)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-full bg-success" />
                                        Lunas
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-full bg-warning" />
                                        Pending
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-end gap-2">
                                {monthly_revenue.labels.map((label, i) => {
                                    const paidVal = monthly_revenue.paid[i];
                                    const pendingVal = monthly_revenue.pending[i];
                                    const paidHeight = Math.max((paidVal / maxMonthlyValue) * 120, 4);
                                    const pendingHeight = Math.max((pendingVal / maxMonthlyValue) * 120, 4);

                                    return (
                                        <div key={label} className="flex flex-1 flex-col items-center gap-2">
                                            <div className="relative flex w-full items-end justify-center" style={{ height: '140px' }}>
                                                <div className="absolute bottom-0 flex w-full max-w-[24px] flex-col items-center justify-end">
                                                    <div
                                                        className="w-full rounded-t-sm bg-warning transition-all duration-500"
                                                        style={{ height: `${pendingHeight}px` }}
                                                    />
                                                    <div
                                                        className="w-full rounded-t-sm bg-success transition-all duration-500"
                                                        style={{ height: `${paidHeight}px` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-neutral-400 truncate max-w-full">
                                                {label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <motion.div variants={itemAnim}>
                        <div className="rounded-2xl border border-border bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                                <div>
                                    <h2 className="text-base font-semibold text-neutral-900">
                                        Subscription Terbaru
                                    </h2>
                                    <p className="mt-0.5 text-sm text-neutral-500">
                                        {recent_subscriptions.length} langganan terbaru
                                    </p>
                                </div>
                                <Link href="/admin/subscriptions" className="text-sm font-medium text-primary transition-colors hover:text-primary-dark">
                                    Lihat semua
                                </Link>
                            </div>
                            <div className="divide-y divide-border">
                                {recent_subscriptions.length === 0 ? (
                                    <div className="px-6 py-12 text-center text-sm text-neutral-400">
                                        Belum ada subscription.
                                    </div>
                                ) : (
                                    recent_subscriptions.map((sub) => (
                                        <div key={sub.id} className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-neutral-50">
                                            <div>
                                                <p className="text-sm font-medium text-neutral-900">{sub.tenant_name}</p>
                                                <p className="text-xs text-neutral-500">{sub.plan_name}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-semibold text-neutral-900">{formatPrice(sub.price_amount)}</span>
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusBadge[sub.status] ?? 'bg-neutral-100 text-neutral-600'}`}>
                                                    {sub.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemAnim}>
                        <div className="rounded-2xl border border-border bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                                <div>
                                    <h2 className="text-base font-semibold text-neutral-900">
                                        Tenant Terbaru
                                    </h2>
                                    <p className="mt-0.5 text-sm text-neutral-500">
                                        {recent_tenants.length} tenant terbaru
                                    </p>
                                </div>
                                <Link href="/admin/tenants" className="text-sm font-medium text-primary transition-colors hover:text-primary-dark">
                                    Lihat semua
                                </Link>
                            </div>
                            <div className="divide-y divide-border">
                                {recent_tenants.length === 0 ? (
                                    <div className="px-6 py-12 text-center text-sm text-neutral-400">
                                        Belum ada tenant.
                                    </div>
                                ) : (
                                    recent_tenants.map((t) => (
                                        <div key={t.id} className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-neutral-50">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary">
                                                    {(t.name ?? '?').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <Link href={`/admin/tenants/${t.id}`} className="text-sm font-medium text-neutral-900 hover:text-primary">
                                                        {t.name ?? 'Tanpa Nama'}
                                                    </Link>
                                                    <p className="text-xs text-neutral-500">{t.owner_name ?? t.email ?? '-'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-neutral-400">{t.domain ?? '-'}</p>
                                                <p className="text-xs text-neutral-400">{t.created_at}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div variants={itemAnim} className="mt-6">
                    <div className="rounded-2xl border border-border bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <div>
                                <h2 className="text-base font-semibold text-neutral-900">
                                    Pengguna Terbaru
                                </h2>
                                <p className="mt-0.5 text-sm text-neutral-500">
                                    {recent_users.length} pengguna terakhir mendaftar
                                </p>
                            </div>
                            <Link href="/admin/users" className="text-sm font-medium text-primary transition-colors hover:text-primary-dark">
                                Lihat semua
                            </Link>
                        </div>
                        <div className="divide-y divide-border">
                            {recent_users.length === 0 ? (
                                <div className="px-6 py-12 text-center text-sm text-neutral-400">
                                    Belum ada pengguna terdaftar.
                                </div>
                            ) : (
                                recent_users.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-neutral-50">
                                        <div className="flex items-center gap-3.5">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-neutral-900">{user.name}</p>
                                                <p className="text-xs text-neutral-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="hidden text-xs text-neutral-400 sm:block">{user.created_at}</span>
                                            {user.is_admin && <Badge variant="warning">Admin</Badge>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AdminLayout>
    );
}
