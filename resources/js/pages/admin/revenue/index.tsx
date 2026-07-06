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
import { Bar, Doughnut } from 'react-chartjs-2';
import FadeIn from '@/atoms/FadeIn';
import AdminLayout from '@/layouts/AdminLayout';
import { formatPrice } from '@/lib/utils';

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
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}jt`;
    if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}rb`;
    return formatPrice(value);
}

const chartColors = {
    primary: '#6366f1',
    primaryLight: 'rgba(99, 102, 241, 0.15)',
    success: '#10b981',
    successLight: 'rgba(16, 185, 129, 0.15)',
    warning: '#f59e0b',
    warningLight: 'rgba(245, 158, 11, 0.15)',
    neutral: '#94a3b8',
};

const doughnutColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Revenue({ title, overview, monthly, by_plan }: Props) {
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
            legend: { display: true, position: 'top' as const },
        },
        scales: {
            x: { grid: { display: false } },
            y: {
                beginAtZero: true,
                ticks: { callback: (v: number) => formatCompact(v) },
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
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'right' as const },
        },
    };

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Revenue Analytics</h1>
                <p className="mt-1 text-sm text-neutral-500">Ringkasan pendapatan dan performa subscription.</p>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <FadeIn delay={0}>
                    <div className="rounded-xl border border-success/20 bg-gradient-to-br from-success-light to-white p-5 shadow-sm">
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">MRR</p>
                        <p className="mt-1.5 text-2xl font-bold text-neutral-900">{formatPrice(overview.mrr)}</p>
                        <p className="mt-1 text-xs text-success">{overview.active_subscriptions} langganan aktif</p>
                    </div>
                </FadeIn>
                <FadeIn delay={0.05}>
                    <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary-50 to-white p-5 shadow-sm">
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Total Revenue</p>
                        <p className="mt-1.5 text-2xl font-bold text-neutral-900">{formatPrice(overview.total_revenue)}</p>
                        <p className="mt-1 text-xs text-primary">{overview.paid_invoices} invoice lunas</p>
                    </div>
                </FadeIn>
                <FadeIn delay={0.1}>
                    <div className="rounded-xl border border-warning/20 bg-gradient-to-br from-warning-light to-white p-5 shadow-sm">
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Invoice Tertunda</p>
                        <p className="mt-1.5 text-2xl font-bold text-neutral-900">{overview.pending_invoices}</p>
                        <p className="mt-1 text-xs text-warning">Menunggu pembayaran</p>
                    </div>
                </FadeIn>
                <FadeIn delay={0.15}>
                    <div className="rounded-xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-5 shadow-sm">
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Rata-rata per Tenant</p>
                        <p className="mt-1.5 text-2xl font-bold text-neutral-900">{formatPrice(overview.avg_revenue_per_tenant)}</p>
                        <p className="mt-1 text-xs text-neutral-500">Per bulan</p>
                    </div>
                </FadeIn>
            </div>

            <div className="mb-6 grid gap-6 lg:grid-cols-3">
                <FadeIn delay={0.03}>
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm lg:col-span-2">
                        <h2 className="mb-1 text-base font-bold text-neutral-900">Pendapatan Bulanan</h2>
                        <p className="mb-5 text-xs text-neutral-500">12 bulan terakhir</p>
                        <div className="h-72">
                            <Bar data={barData} options={barOptions} />
                        </div>
                    </div>
                </FadeIn>

                <FadeIn delay={0.06}>
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-1 text-base font-bold text-neutral-900">Per Plan</h2>
                        <p className="mb-5 text-xs text-neutral-500">Distribusi revenue per paket</p>
                        <div className="h-64">
                            {by_plan.length > 0 ? (
                                <Doughnut data={doughnutData} options={doughnutOptions} />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                                    Belum ada data
                                </div>
                            )}
                        </div>
                    </div>
                </FadeIn>
            </div>

            <FadeIn delay={0.08}>
                <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-1 text-base font-bold text-neutral-900">Detail per Plan</h2>
                    <p className="mb-5 text-xs text-neutral-500">Rincian subscription aktif dan revenue</p>
                    {by_plan.length === 0 ? (
                        <div className="py-8 text-center text-sm text-neutral-400">Belum ada data.</div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-neutral-200">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-neutral-100 bg-neutral-50/50">
                                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Plan</th>
                                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Subscriber</th>
                                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Revenue</th>
                                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">% Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {by_plan.map((plan) => {
                                        const pct = overview.mrr > 0
                                            ? ((plan.revenue / overview.mrr) * 100).toFixed(1)
                                            : '0';
                                        return (
                                            <tr key={plan.name} className="transition-colors hover:bg-neutral-50/50">
                                                <td className="px-5 py-4 text-sm font-medium text-neutral-900">{plan.name}</td>
                                                <td className="px-5 py-4 text-sm text-neutral-600">{plan.count}</td>
                                                <td className="px-5 py-4 text-sm font-semibold text-neutral-900">{formatPrice(plan.revenue)}</td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-2 w-24 overflow-hidden rounded-full bg-neutral-200">
                                                            <div
                                                                className="h-full rounded-full bg-primary transition-all"
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-neutral-500">{pct}%</span>
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
            </FadeIn>
        </AdminLayout>
    );
}
