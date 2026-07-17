import { Head } from '@inertiajs/react';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title as ChartTitle,
    Tooltip,
} from 'chart.js';
import { motion } from 'framer-motion';
import { Bar, Doughnut } from 'react-chartjs-2';
import AdminLayout from '@/layouts/AdminLayout';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, ChartTitle, Tooltip, Legend);

interface Overview {
    mrr: number;
    active_subscriptions: number;
    total_revenue: number;
    pending_invoices: number;
    paid_invoices: number;
    avg_revenue_per_tenant: number;
}

interface MonthlyData {
    labels: string[];
    paid: number[];
    pending: number[];
}

interface PlanRevenue {
    name: string;
    count: number;
    revenue: number;
}

interface Props {
    title: string;
    overview: Overview;
    monthly: MonthlyData;
    by_plan: PlanRevenue[];
}

function formatCompact(value: number): string {
    if (value >= 1_000_000) {
return `Rp ${(value / 1_000_000).toFixed(1)}jt`;
}

    if (value >= 1_000) {
return `Rp ${(value / 1_000).toFixed(0)}rb`;
}

    return formatPrice(value);
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
    },
};

const itemAnim = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

const accentMap: Record<string, string> = {
    primary: 'border-l-primary',
    success: 'border-l-success',
    warning: 'border-l-warning',
    info: 'border-l-blue-500',
    neutral: 'border-l-neutral-400',
};

const iconBgMap: Record<string, string> = {
    primary: 'bg-primary-50 text-primary',
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
    info: 'bg-blue-50 text-blue-600',
    neutral: 'bg-neutral-100 text-neutral-600',
};

const chartColors = {
    primary: '#6366f1',
    primaryBg: 'rgba(99, 102, 241, 0.12)',
    success: '#10b981',
    successBg: 'rgba(16, 185, 129, 0.12)',
    warning: '#f59e0b',
    warningBg: 'rgba(245, 158, 11, 0.12)',
};

const doughnutColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

function DollarIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function BuildingIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
    );
}

function ReceiptIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
    );
}

function UsersIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
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

function ArrowDownIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
        </svg>
    );
}

export default function Revenue({ title, overview, monthly, by_plan }: Props) {
    const lastIdx = monthly.paid.length - 1;
    const currentMonthRev = monthly.paid[lastIdx] ?? 0;
    const prevMonthRev = monthly.paid[lastIdx - 1] ?? 0;
    const momGrowth = prevMonthRev > 0 ? ((currentMonthRev - prevMonthRev) / prevMonthRev) * 100 : 0;
    const pendingTotal = monthly.pending.reduce((a, b) => a + b, 0);
    const paidTotal = monthly.paid.reduce((a, b) => a + b, 0);

    const barData = {
        labels: monthly.labels,
        datasets: [
            {
                label: 'Lunas',
                data: monthly.paid,
                backgroundColor: chartColors.success,
                borderRadius: 4,
                borderSkipped: false,
            },
            {
                label: 'Tertunda',
                data: monthly.pending,
                backgroundColor: chartColors.warning,
                borderRadius: 4,
                borderSkipped: false,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
                labels: { usePointStyle: true, padding: 16, font: { size: 12 } },
            },
            tooltip: {
                callbacks: {
                    label: (ctx: { dataset: { label: string }; raw: number }) =>
                        `${ctx.dataset.label}: Rp ${Number(ctx.raw).toLocaleString('id-ID')}`,
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 10 } },
            },
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: {
                    font: { size: 10 },
                    callback: (v: number) => formatCompact(v),
                },
            },
        },
    };

    const doughnutData = {
        labels: by_plan.map((p) => p.name),
        datasets: [
            {
                data: by_plan.map((p) => p.revenue),
                backgroundColor: doughnutColors.slice(0, by_plan.length),
                borderWidth: 0,
                hoverOffset: 8,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            legend: {
                display: true,
                position: 'right' as const,
                labels: {
                    usePointStyle: true,
                    padding: 12,
                    font: { size: 11 },
                    generateLabels: (chart: ChartJS) => {
                        const data = chart.data;

                        return (data.labels ?? []).map((label, i) => ({
                            text: `${label}: ${formatCompact(data.datasets[0].data[i] as number)}`,
                            fillStyle: (data.datasets[0].backgroundColor as string[])[i],
                            index: i,
                            pointStyle: 'circle' as const,
                        }));
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: (ctx: { parsed: number }) => `Rp ${Number(ctx.parsed).toLocaleString('id-ID')}`,
                },
            },
        },
    };

    return (
        <AdminLayout>
            <Head title={title} />

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                <motion.div variants={itemAnim} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Revenue Analytics</h1>
                        <p className="mt-1 text-sm text-neutral-500">Ringkasan pendapatan dan performa subscription.</p>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-sm text-neutral-400 sm:mt-0">
                        <span className="inline-flex items-center gap-1 font-medium text-neutral-700">
                            {momGrowth >= 0 ? (
                                <>
                                    <ArrowUpIcon className="h-3.5 w-3.5 text-success" />
                                    <span className="text-success">+{momGrowth.toFixed(1)}%</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownIcon className="h-3.5 w-3.5 text-danger" />
                                    <span className="text-danger">{momGrowth.toFixed(1)}%</span>
                                </>
                            )}
                        </span>
                        <span className="text-neutral-400">MoM growth</span>
                    </div>
                </motion.div>

                <motion.div variants={itemAnim} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className={cn('absolute left-0 top-0 h-full w-1', accentMap.success)} />
                        <div className="p-5 pl-6">
                            <div className="flex items-start justify-between">
                                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', iconBgMap.success)}>
                                    <DollarIcon className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="mt-3 text-2xl font-bold tracking-tight text-neutral-900">
                                {formatPrice(overview.mrr)}
                            </p>
                            <p className="mt-0.5 text-sm font-medium text-neutral-600">MRR</p>
                            <p className="text-xs text-neutral-400">{overview.active_subscriptions} langganan aktif</p>
                        </div>
                    </div>
                    <div className="group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className={cn('absolute left-0 top-0 h-full w-1', accentMap.primary)} />
                        <div className="p-5 pl-6">
                            <div className="flex items-start justify-between">
                                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', iconBgMap.primary)}>
                                    <TrendingUpIcon className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="mt-3 text-2xl font-bold tracking-tight text-neutral-900">
                                {formatPrice(overview.total_revenue)}
                            </p>
                            <p className="mt-0.5 text-sm font-medium text-neutral-600">Total Revenue</p>
                            <p className="text-xs text-neutral-400">{overview.paid_invoices} invoice lunas</p>
                        </div>
                    </div>
                    <div className="group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className={cn('absolute left-0 top-0 h-full w-1', accentMap.warning)} />
                        <div className="p-5 pl-6">
                            <div className="flex items-start justify-between">
                                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', iconBgMap.warning)}>
                                    <ReceiptIcon className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="mt-3 text-2xl font-bold tracking-tight text-warning">
                                {overview.pending_invoices}
                            </p>
                            <p className="mt-0.5 text-sm font-medium text-neutral-600">Invoice Tertunda</p>
                            <p className="text-xs text-neutral-400">{formatPrice(pendingTotal)} menunggu pembayaran</p>
                        </div>
                    </div>
                    <div className="group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className={cn('absolute left-0 top-0 h-full w-1', accentMap.info)} />
                        <div className="p-5 pl-6">
                            <div className="flex items-start justify-between">
                                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', iconBgMap.info)}>
                                    <BuildingIcon className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="mt-3 text-2xl font-bold tracking-tight text-neutral-900">
                                {formatPrice(overview.avg_revenue_per_tenant)}
                            </p>
                            <p className="mt-0.5 text-sm font-medium text-neutral-600">Rata-rata per Tenant</p>
                            <p className="text-xs text-neutral-400">Per bulan</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <motion.div variants={itemAnim} className="lg:col-span-2">
                        <div className="rounded-xl border border-border bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-light text-success">
                                        <TrendingUpIcon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-semibold text-neutral-900">Pendapatan Bulanan</h2>
                                        <p className="text-xs text-neutral-500">12 bulan terakhir</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-success" />
                                        Lunas
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-warning" />
                                        Tertunda
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="h-72">
                                    <Bar data={barData} options={barOptions} />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemAnim}>
                        <div className="rounded-xl border border-border bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary">
                                        <DollarIcon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-semibold text-neutral-900">Per Plan</h2>
                                        <p className="text-xs text-neutral-500">Distribusi revenue per paket</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                {by_plan.length > 0 ? (
                                    <div className="h-64">
                                        <Doughnut data={doughnutData} options={doughnutOptions} />
                                    </div>
                                ) : (
                                    <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
                                        Belum ada data plan.
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div variants={itemAnim}>
                    <div className="rounded-xl border border-border bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                    <UsersIcon className="h-4 w-4" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-neutral-900">Detail per Plan</h2>
                                    <p className="text-xs text-neutral-500">Rincian subscription aktif dan revenue</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {by_plan.length === 0 ? (
                                <div className="py-8 text-center text-sm text-neutral-400">Belum ada data plan.</div>
                            ) : (
                                <div className="overflow-hidden rounded-xl border border-border">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-border bg-neutral-50/80">
                                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Plan</th>
                                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Subscriber</th>
                                                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Revenue</th>
                                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">% Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {by_plan.map((plan) => {
                                                const pct = overview.mrr > 0
                                                    ? ((plan.revenue / overview.mrr) * 100).toFixed(1)
                                                    : '0';

                                                return (
                                                    <tr key={plan.name} className="transition-colors hover:bg-neutral-50/50">
                                                        <td className="px-5 py-4 text-sm font-medium text-neutral-900">{plan.name}</td>
                                                        <td className="px-5 py-4">
                                                            <span className="inline-flex items-center gap-1.5 text-sm text-neutral-600">
                                                                <UsersIcon className="h-3.5 w-3.5 text-neutral-400" />
                                                                {plan.count}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4 text-right text-sm font-semibold text-neutral-900">
                                                            {formatPrice(plan.revenue)}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-2 w-24 overflow-hidden rounded-full bg-neutral-200">
                                                                    <div
                                                                        className="h-full rounded-full bg-primary transition-all duration-500"
                                                                        style={{ width: `${pct}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-xs font-medium text-neutral-500">{pct}%</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AdminLayout>
    );
}
