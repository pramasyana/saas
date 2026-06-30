import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import Badge from '@/atoms/Badge';
import { cn } from '@/lib/utils';

interface Stat {
    label: string;
    value: number;
    subtitle: string;
    icon: ReactNode;
    trend?: { value: string; positive: boolean };
    color: 'primary' | 'success' | 'warning' | 'info';
}

interface RecentUser {
    id: number;
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

interface DashboardStats {
    total_users: number;
    new_today: number;
    new_this_week: number;
    new_this_month: number;
    total_admins: number;
    user_growth: number;
}

interface DashboardProps {
    stats: DashboardStats;
    recent_users: RecentUser[];
    weekly_signups: WeeklySignup[];
}

const colorMap = {
    primary: { bg: 'bg-primary-50', icon: 'text-primary', ring: 'ring-primary/10' },
    success: { bg: 'bg-success-light', icon: 'text-success', ring: 'ring-success/20' },
    warning: { bg: 'bg-warning-light', icon: 'text-warning', ring: 'ring-warning/20' },
    info: { bg: 'bg-sky-50', icon: 'text-sky-600', ring: 'ring-sky-200' },
};

function UsersIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
    );
}

function UserPlusIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
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

function ArrowUpIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
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

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function AdminDashboard({ stats, recent_users, weekly_signups }: DashboardProps) {
    const maxChartValue = Math.max(...weekly_signups.map((w) => w.count), 1);

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
            value: stats.total_users,
            subtitle: 'Seluruh pengguna terdaftar',
            icon: <UsersIcon />,
            trend: { value: `${stats.user_growth}% bulan ini`, positive: stats.user_growth >= 0 },
            color: 'primary',
        },
        {
            label: 'Pengguna Baru',
            value: stats.new_today,
            subtitle: 'Mendaftar hari ini',
            icon: <UserPlusIcon />,
            color: 'success',
        },
        {
            label: 'Minggu Ini',
            value: stats.new_this_week,
            subtitle: `${stats.new_this_month} pengguna bulan ini`,
            icon: <TrendingUpIcon />,
            color: 'info',
        },
        {
            label: 'Administrator',
            value: stats.total_admins,
            subtitle: 'Total admin panel',
            icon: <ShieldIcon />,
            color: 'warning',
        },
    ];

    const quickActions = [
        {
            label: 'Tambah User',
            href: '/admin/users/create',
            desc: 'Buat akun pengguna baru',
            icon: <UserPlusIcon className="h-5 w-5" />,
        },
        {
            label: 'Lihat Laporan',
            href: '/admin/reports',
            desc: 'Analitik dan statistik',
            icon: <TrendingUpIcon className="h-5 w-5" />,
        },
        {
            label: 'Pengaturan',
            href: '/admin/settings',
            desc: 'Konfigurasi aplikasi',
            icon: <CalendarIcon className="h-5 w-5" />,
        },
    ];

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <motion.div variants={container} initial="hidden" animate="show">
                <motion.div variants={item} className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
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

                <motion.div variants={item} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((s) => {
                        const c = colorMap[s.color];
                        return (
                            <div
                                key={s.label}
                                className="group relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl ring-1', c.bg, c.icon, c.ring)}>
                                        {s.icon}
                                    </div>
                                    {s.trend && (
                                        <span
                                            className={cn(
                                                'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium',
                                                s.trend.positive
                                                    ? 'bg-success-light text-emerald-700'
                                                    : 'bg-danger-light text-red-700',
                                            )}
                                        >
                                            <ArrowUpIcon
                                                className={cn(
                                                    'h-3 w-3',
                                                    !s.trend.positive && 'rotate-180',
                                                )}
                                            />
                                            {s.trend.value}
                                        </span>
                                    )}
                                </div>
                                <p className="mt-4 text-3xl font-bold tracking-tight text-neutral-900">
                                    {s.value.toLocaleString('id-ID')}
                                </p>
                                <p className="mt-1 text-sm font-medium text-neutral-500">
                                    {s.label}
                                </p>
                                <p className="text-xs text-neutral-400">
                                    {s.subtitle}
                                </p>
                            </div>
                        );
                    })}
                </motion.div>

                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                    <motion.div variants={item} className="lg:col-span-2">
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
                                                style={{
                                                    height: `${Math.max((w.count / maxChartValue) * 160, 8)}px`,
                                                }}
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

                    <motion.div variants={item}>
                        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                            <h2 className="mb-1 text-base font-semibold text-neutral-900">
                                Aksi Cepat
                            </h2>
                            <p className="mb-5 text-sm text-neutral-500">
                                Menu yang sering digunakan
                            </p>
                            <div className="space-y-3">
                                {quickActions.map((action) => (
                                    <Link
                                        key={action.label}
                                        href={action.href}
                                        className="flex items-center gap-4 rounded-xl border border-border p-4 transition-all duration-200 hover:border-primary/30 hover:bg-primary-50 hover:shadow-sm"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 group-hover:bg-primary-50 group-hover:text-primary">
                                            {action.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-neutral-900">
                                                {action.label}
                                            </p>
                                            <p className="text-xs text-neutral-500">
                                                {action.desc}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div variants={item} className="mt-6">
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
                                    Belum ada pengguna terdaftar.
                                </div>
                            ) : (
                                recent_users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-neutral-50"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-neutral-900">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-neutral-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="hidden text-xs text-neutral-400 sm:block">
                                                {user.created_at}
                                            </span>
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
