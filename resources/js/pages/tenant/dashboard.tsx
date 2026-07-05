import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import Badge from '@/atoms/Badge';
import FadeIn from '@/atoms/FadeIn';
import Card from '@/molecules/Card';
import TenantLayout from '@/layouts/TenantLayout';
import { cn, formatNumber } from '@/lib/utils';

interface UserInfo {
    name: string;
    email: string;
    joined_at: string;
}

interface SubscriptionInfo {
    plan_name: string;
    plan_slug: string;
    status: string;
    price_amount: number;
    billing_interval: string;
    starts_at: string;
    ends_at: string;
    features: Array<{ key: string; label: string; type: string; value: string }>;
}

interface DashboardStats {
    monthly_revenue: number;
    revenue_growth: number;
    total_orders: number;
    orders_growth: number;
    avg_order_value: number;
    avg_order_growth: number;
    completion_rate: number;
    completion_rate_growth: number;
    active_customers: number;
    active_subscriptions: number;
}

interface UrgentBooking {
    id: string;
    start_time: string;
    customer: { id: string; name: string; phone?: string };
    staff: { id: string; name: string };
    services: Array<{ id: string; name: string }>;
}

interface ChartItem {
    day: string;
    date: string;
    count: number;
}

interface LatestBooking {
    id: string;
    created_at: string;
    customer: { id: string; name: string };
    services: Array<{ id: string; name: string }>;
}

interface TopService {
    name: string;
    total_bookings: number;
    total_revenue: number;
}

interface DashboardProps {
    user: UserInfo;
    subscription: SubscriptionInfo | null;
    stats: DashboardStats;
    urgent_bookings: UrgentBooking[];
    booking_chart: ChartItem[];
    latest_bookings: LatestBooking[];
    top_services: TopService[];
}

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) {
return 'Baru saja';
}

    if (diff < 3600) {
return `${Math.floor(diff / 60)} menit lalu`;
}

    if (diff < 86400) {
return `${Math.floor(diff / 3600)} jam lalu`;
}

    const days = Math.floor(diff / 86400);

    return `${days} hari lalu`;
}

function GrowthBadge({ value, suffix = '%' }: { value: number; suffix?: string }) {
    if (value === 0) {
return null;
}

    const isPositive = value > 0;

    return (
        <span
            className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none',
                isPositive ? 'bg-success-light text-success' : 'bg-danger-light text-danger',
            )}
        >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={isPositive ? 'M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18' : 'M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3'} />
            </svg>
            {Math.abs(value)}{suffix}
        </span>
    );
}

function StatIcon({ color }: { color: string }) {
    const icons: Record<string, ReactNode> = {
        revenue: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        orders: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
        ),
        avg: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
            </svg>
        ),
        completion: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        customers: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        ),
    };

    return <>{icons[color] || icons.revenue}</>;
}

interface StatCardDef {
    key: string;
    label: string;
    value: string;
    growth: number;
    color: string;
    gradient: string;
}

export default function TenantDashboard({ user, subscription, stats, urgent_bookings, booking_chart, latest_bookings, top_services }: DashboardProps) {
    const statCards: StatCardDef[] = [
        {
            key: 'revenue',
            label: 'Revenue',
            value: `Rp ${formatNumber(stats.monthly_revenue)}`,
            growth: stats.revenue_growth,
            color: 'text-success',
            gradient: 'from-success/20 to-success/5',
        },
        {
            key: 'orders',
            label: 'Total Order',
            value: formatNumber(stats.total_orders),
            growth: stats.orders_growth,
            color: 'text-primary',
            gradient: 'from-primary/20 to-primary/5',
        },
        {
            key: 'avg',
            label: 'Rata-rata Order',
            value: `Rp ${formatNumber(stats.avg_order_value)}`,
            growth: stats.avg_order_growth,
            color: 'text-warning',
            gradient: 'from-warning/20 to-warning/5',
        },
        {
            key: 'completion',
            label: 'Tingkat Penyelesaian',
            value: `${stats.completion_rate}%`,
            growth: stats.completion_rate_growth,
            color: 'text-sky-600',
            gradient: 'from-sky-500/20 to-sky-500/5',
        },
        {
            key: 'customers',
            label: 'Customer Aktif',
            value: formatNumber(stats.active_customers),
            growth: 0,
            color: 'text-violet-600',
            gradient: 'from-violet-500/20 to-violet-500/5',
        },
    ];

    const maxChartValue = Math.max(...booking_chart.map((w) => w.count), 1);
    const maxTopService = Math.max(...top_services.map((s) => s.total_revenue), 1);

    return (
        <TenantLayout>
            <Head title="Dashboard" />

            {/* ── Header ── */}
            <FadeIn delay={0.02}>
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                            Selamat Datang, {user.name}!
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        <Link href="/booking" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark active:scale-[0.97]">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Buat Booking
                        </Link>
                        <Link href="/booking/walk-in" className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 active:scale-[0.97]">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            Walk In
                        </Link>
                        <Link href="/booking" className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 active:scale-[0.97]">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                            Lihat Kalender
                        </Link>
                    </div>
                </div>
            </FadeIn>

            {/* ── Stat Cards ── */}
            <FadeIn delay={0.05}>
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {statCards.map((s) => (
                        <div
                            key={s.key}
                            className={cn(
                                'group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md',
                            )}
                        >
                            <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', s.gradient)} />
                            <div className="relative">
                                <div className={cn('mb-3 inline-flex rounded-lg p-2.5 ring-1 ring-inset ring-black/5', s.color.replace('text-', 'bg-').replace('600', '100').replace('500', '100'))}>
                                    <StatIcon color={s.key} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-2xl font-bold tracking-tight text-neutral-900">
                                        {s.value}
                                    </p>
                                    {s.growth !== 0 && <GrowthBadge value={s.growth} />}
                                </div>
                                <p className="mt-0.5 text-sm text-neutral-500">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </FadeIn>

            {/* ── Urgent Bookings ── */}
            {urgent_bookings.length > 0 && (
                <FadeIn delay={0.08}>
                    <div className="mb-6 overflow-hidden rounded-xl border border-amber-200 bg-amber-50 shadow-sm">
                        <div className="flex items-center gap-3 border-b border-amber-200/60 px-5 py-3.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-amber-800">
                                {urgent_bookings.length} booking akan segera dimulai
                            </p>
                        </div>
                        <div className="divide-y divide-amber-200/40">
                            {urgent_bookings.map((b) => (
                                <div key={b.id} className="flex items-center gap-3 px-5 py-3 text-sm transition-colors hover:bg-amber-100/50">
                                    <span className="min-w-[52px] rounded-md bg-white px-2 py-1 text-center text-xs font-semibold text-neutral-700 shadow-sm">
                                        {new Date(b.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className="h-4 w-px bg-amber-200" />
                                    <span className="font-medium text-neutral-900">{b.customer?.name}</span>
                                    {b.services?.[0] && (
                                        <>
                                            <span className="hidden text-neutral-400 sm:inline">·</span>
                                            <span className="hidden text-neutral-500 sm:inline">{b.services[0].name}</span>
                                        </>
                                    )}
                                    <span className="ml-auto text-xs text-neutral-400">{b.staff?.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            )}

            {/* ── Chart + Today's Summary ── */}
            <div className="mb-6 grid gap-6 lg:grid-cols-3">
                <FadeIn delay={0.1} className="lg:col-span-2">
                    <Card>
                        <div className="mb-1 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-neutral-900">Tren Booking (7 Hari)</h3>
                                <p className="text-sm text-neutral-500">Jumlah booking per hari</p>
                            </div>
                            <Badge variant="default">{booking_chart.filter((b) => b.count > 0).length} hari aktif</Badge>
                        </div>
                        {booking_chart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-sm text-neutral-400">
                                <svg className="mb-3 h-12 w-12 text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                </svg>
                                Belum ada data booking.
                            </div>
                        ) : (
                            <div className="mt-6 flex items-end gap-2 sm:gap-3">
                                {booking_chart.map((w) => (
                                    <div key={w.date} className="flex flex-1 flex-col items-center gap-2">
                                        <span className="text-xs font-semibold text-neutral-600">{w.count}</span>
                                        <div className="relative flex w-full items-end justify-center">
                                            <div
                                                className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-primary to-primary-light transition-all duration-500"
                                                style={{ height: `${Math.max((w.count / maxChartValue) * 180, 6)}px` }}
                                            />
                                        </div>
                                        <span className={cn('text-xs', w.count > 0 ? 'font-medium text-neutral-500' : 'text-neutral-300')}>{w.day}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </FadeIn>

                <FadeIn delay={0.13}>
                    <Card>
                        <h3 className="mb-1 text-base font-semibold text-neutral-900">Ringkasan Hari Ini</h3>
                        <p className="mb-5 text-sm text-neutral-500">Capaian bisnis bulan ini</p>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                                <span className="text-sm text-neutral-600">Total Revenue</span>
                                <span className="text-sm font-semibold text-neutral-900">Rp {formatNumber(stats.monthly_revenue)}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                                <span className="text-sm text-neutral-600">Total Orders</span>
                                <span className="text-sm font-semibold text-neutral-900">{formatNumber(stats.total_orders)}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                                <span className="text-sm text-neutral-600">Rata-rata Order</span>
                                <span className="text-sm font-semibold text-neutral-900">Rp {formatNumber(stats.avg_order_value)}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                                <span className="text-sm text-neutral-600">Penyelesaian</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-20 overflow-hidden rounded-full bg-neutral-100">
                                        <div className="h-full rounded-full bg-success" style={{ width: `${stats.completion_rate}%` }} />
                                    </div>
                                    <span className="text-sm font-semibold text-neutral-900">{stats.completion_rate}%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-neutral-600">Customer Aktif</span>
                                <span className="text-sm font-semibold text-neutral-900">{formatNumber(stats.active_customers)}</span>
                            </div>
                        </div>
                    </Card>
                </FadeIn>
            </div>

            {/* ── Latest Bookings + Top Services ── */}
            <div className="mb-6 grid gap-6 sm:grid-cols-2">
                <FadeIn delay={0.15}>
                    <Card>
                        <div className="mb-1 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-neutral-900">Pesanan Terbaru</h3>
                                <p className="text-sm text-neutral-500">{latest_bookings.length} booking terakhir</p>
                            </div>
                            <Link href="/booking" className="text-sm font-medium text-primary transition-colors hover:text-primary-dark">
                                Lihat semua
                            </Link>
                        </div>
                        {latest_bookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-sm text-neutral-400">
                                <svg className="mb-3 h-10 w-10 text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Belum ada booking.
                            </div>
                        ) : (
                            <div className="mt-4 divide-y divide-neutral-100">
                                {latest_bookings.map((b) => (
                                    <div key={b.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary">
                                                {b.customer?.name?.charAt(0) || '?'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-neutral-900 truncate">{b.customer?.name}</p>
                                                <p className="text-xs text-neutral-400 truncate">{b.services?.[0]?.name || 'Tanpa layanan'}</p>
                                            </div>
                                        </div>
                                        <span className="shrink-0 text-xs text-neutral-400">{timeAgo(b.created_at)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </FadeIn>

                <FadeIn delay={0.18}>
                    <Card>
                        <h3 className="mb-1 text-base font-semibold text-neutral-900">Layanan Terpopuler</h3>
                        <p className="mb-5 text-sm text-neutral-500">Berdasarkan revenue bulan ini</p>
                        {top_services.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-sm text-neutral-400">
                                <svg className="mb-3 h-10 w-10 text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                                Belum ada data layanan.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {top_services.map((svc, i) => (
                                    <div key={svc.name}>
                                        <div className="mb-1.5 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <span className={cn(
                                                    'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                                                    i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-neutral-100 text-neutral-500',
                                                )}>
                                                    {i + 1}
                                                </span>
                                                <span className="text-sm font-medium text-neutral-900">{svc.name}</span>
                                            </div>
                                            <span className="text-xs font-semibold text-neutral-700">
                                                Rp {formatNumber(svc.total_revenue)}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                                            <div
                                                className={cn(
                                                    'h-full rounded-full transition-all duration-500',
                                                    i === 0 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-primary to-primary-light',
                                                )}
                                                style={{ width: `${(svc.total_revenue / maxTopService) * 100}%` }}
                                            />
                                        </div>
                                        <p className="mt-1 text-[11px] text-neutral-400">{svc.total_bookings} booking</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </FadeIn>
            </div>

            {/* ── Analytics Link ── */}
            <FadeIn delay={0.21}>
                <Link
                    href="/booking/analytics"
                    className="mb-8 flex items-center justify-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm transition-all hover:border-primary/40 hover:bg-primary-50/50 hover:shadow-md"
                >
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                    <span className="text-sm font-semibold text-neutral-700">Lihat Analytics Lengkap</span>
                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </Link>
            </FadeIn>

            {/* ── Account, Subscription, Features ── */}
            <div className="grid gap-6 lg:grid-cols-3">
                <FadeIn delay={0.24}>
                    <Card>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold text-neutral-900">Akun</h3>
                        </div>
                        <div className="space-y-3.5">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                                <span className="text-sm text-neutral-500">Nama</span>
                                <span className="text-sm font-medium text-neutral-900">{user.name}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                                <span className="text-sm text-neutral-500">Email</span>
                                <span className="text-sm font-medium text-neutral-900">{user.email}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-neutral-500">Bergabung</span>
                                <span className="text-sm font-medium text-neutral-900">
                                    {new Date(user.joined_at).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                            </div>
                        </div>
                    </Card>
                </FadeIn>

                <FadeIn delay={0.27}>
                    <Card>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-light text-success">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold text-neutral-900">Langganan</h3>
                        </div>
                        {subscription ? (
                            <div className="space-y-3.5">
                                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                                    <span className="text-sm text-neutral-500">Paket</span>
                                    <span className="text-sm font-semibold text-neutral-900">{subscription.plan_name}</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                                    <span className="text-sm text-neutral-500">Status</span>
                                    <Badge variant={subscription.status === 'active' ? 'success' : 'warning'}>
                                        {subscription.status === 'active' ? 'Aktif' : subscription.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                                    <span className="text-sm text-neutral-500">Tagihan</span>
                                    <span className="text-sm font-medium text-neutral-900">
                                        Rp {formatNumber(subscription.price_amount)}/{subscription.billing_interval === 'monthly' ? 'bln' : 'thn'}
                                    </span>
                                </div>
                                {subscription.ends_at && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-neutral-500">Berakhir</span>
                                        <span className="text-sm font-medium text-neutral-900">
                                            {new Date(subscription.ends_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="py-6 text-center text-sm text-neutral-400">Tidak ada langganan aktif.</p>
                        )}
                    </Card>
                </FadeIn>

                <FadeIn delay={0.3}>
                    <Card>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning-light text-warning">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold text-neutral-900">Fitur</h3>
                        </div>
                        {subscription?.features && subscription.features.length > 0 ? (
                            <div className="space-y-2.5">
                                {subscription.features.map((feature) => (
                                    <div key={feature.key} className="flex items-center justify-between">
                                        <span className="text-sm text-neutral-600">{feature.label}</span>
                                        {feature.type === 'boolean' ? (
                                            <span className={feature.value === 'true' ? 'text-success' : 'text-neutral-300'}>
                                                {feature.value === 'true' ? (
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                ) : (
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                )}
                                            </span>
                                        ) : (
                                            <span className="text-sm font-medium text-neutral-900">{feature.value}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="py-6 text-center text-sm text-neutral-400">Tidak ada informasi fitur.</p>
                        )}
                    </Card>
                </FadeIn>
            </div>
        </TenantLayout>
    );
}
