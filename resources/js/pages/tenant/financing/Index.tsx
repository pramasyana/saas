import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
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
import TenantLayout from '@/layouts/TenantLayout';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import {
    useFinancingOverview,
    useFinancingMonthly,
    useFinancingBreakdown,
} from '@/features/financing/hooks/useFinancing';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, ChartTitle, Tooltip, Legend);

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
    success: 'border-l-success',
    danger: 'border-l-danger',
    primary: 'border-l-primary',
    warning: 'border-l-warning',
};

const iconBgMap: Record<string, string> = {
    success: 'bg-success-light text-success',
    danger: 'bg-danger-light text-danger',
    primary: 'bg-primary-50 text-primary',
    warning: 'bg-warning-light text-warning',
};

function formatCompact(value: number): string {
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}jt`;
    if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}rb`;
    return formatPrice(value);
}

const doughnutColors = ['#10b981', '#ef4444', '#6366f1', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

interface StatCardProps {
    label: string;
    value: string;
    subtitle?: string;
    accent: string;
    iconBg: string;
    icon: React.ReactNode;
}

function StatCard({ label, value, subtitle, accent, iconBg, icon }: StatCardProps) {
    return (
        <motion.div
            variants={itemAnim}
            className={cn(
                'rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md border-l-4',
                accent,
            )}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-neutral-500">{label}</p>
                    <p className="mt-1.5 text-2xl font-bold text-neutral-900">{value}</p>
                    {subtitle && <p className="mt-1 text-xs text-neutral-400">{subtitle}</p>}
                </div>
                <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', iconBg)}>
                    {icon}
                </div>
            </div>
        </motion.div>
    );
}

function RevenueIcon() {
    return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function CostIcon() {
    return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
    );
}

function ProfitIcon() {
    return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
    );
}

function MarginIcon() {
    return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
    );
}

export default function FinancingIndex() {
    const { data: overviewRes, isLoading: loadingOverview } = useFinancingOverview();
    const { data: monthlyRes, isLoading: loadingMonthly } = useFinancingMonthly();
    const { data: breakdownRes, isLoading: loadingBreakdown } = useFinancingBreakdown();

    const overview = overviewRes?.data;
    const monthly = monthlyRes?.data;
    const breakdown = breakdownRes?.data ?? [];

    const isLoading = loadingOverview || loadingMonthly || loadingBreakdown;

    return (
        <TenantLayout>
            <Head title="Financing" />

            {isLoading ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 animate-pulse rounded-xl border border-neutral-200 bg-white" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="h-96 animate-pulse rounded-xl border border-neutral-200 bg-white lg:col-span-2" />
                        <div className="h-96 animate-pulse rounded-xl border border-neutral-200 bg-white" />
                    </div>
                </div>
            ) : (
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                    {/* Header */}
                    <motion.div variants={itemAnim}>
                        <h1 className="text-2xl font-bold text-neutral-900">Financing</h1>
                        <p className="mt-1 text-sm text-neutral-500">Perbandingan revenue dan biaya untuk memantau profit bisnis Anda.</p>
                    </motion.div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="Total Revenue"
                            value={formatCompact(overview?.total_revenue ?? 0)}
                            subtitle="Periode ini"
                            accent={accentMap.success}
                            iconBg={iconBgMap.success}
                            icon={<RevenueIcon />}
                        />
                        <StatCard
                            label="Total Biaya"
                            value={formatCompact(overview?.total_cost ?? 0)}
                            subtitle={overview?.cost_growth !== undefined ? `${overview.cost_growth > 0 ? '+' : ''}${overview.cost_growth}% dari bulan lalu` : undefined}
                            accent={accentMap.danger}
                            iconBg={iconBgMap.danger}
                            icon={<CostIcon />}
                        />
                        <StatCard
                            label="Profit"
                            value={formatCompact(overview?.profit ?? 0)}
                            subtitle="Revenue - Biaya"
                            accent={overview?.profit !== undefined && overview.profit >= 0 ? accentMap.success : accentMap.danger}
                            iconBg={overview?.profit !== undefined && overview.profit >= 0 ? iconBgMap.success : iconBgMap.danger}
                            icon={<ProfitIcon />}
                        />
                        <StatCard
                            label="Profit Margin"
                            value={`${overview?.profit_margin ?? 0}%`}
                            subtitle="Persentase profit"
                            accent={accentMap.primary}
                            iconBg={iconBgMap.primary}
                            icon={<MarginIcon />}
                        />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Bar Chart - Monthly Revenue vs Cost */}
                        <motion.div
                            variants={itemAnim}
                            className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm lg:col-span-2"
                        >
                            <h3 className="text-base font-semibold text-neutral-900">Revenue vs Biaya Bulanan</h3>
                            <p className="mt-1 text-xs text-neutral-400">Perbandingan 12 bulan terakhir</p>
                            <div className="mt-4 h-80">
                                {monthly && (
                                    <Bar
                                        data={{
                                            labels: monthly.labels,
                                            datasets: [
                                                {
                                                    label: 'Revenue',
                                                    data: monthly.revenue,
                                                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                                                    borderColor: '#10b981',
                                                    borderWidth: 1,
                                                    borderRadius: 4,
                                                },
                                                {
                                                    label: 'Biaya',
                                                    data: monthly.costs,
                                                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                                                    borderColor: '#ef4444',
                                                    borderWidth: 1,
                                                    borderRadius: 4,
                                                },
                                                {
                                                    label: 'Profit',
                                                    data: monthly.profits,
                                                    backgroundColor: 'rgba(99, 102, 241, 0.6)',
                                                    borderColor: '#6366f1',
                                                    borderWidth: 1,
                                                    borderRadius: 4,
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyle: 'circle' } },
                                                tooltip: {
                                                    callbacks: {
                                                        label: (ctx) => `${ctx.dataset.label}: ${formatPrice(ctx.parsed.y)}`,
                                                    },
                                                },
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        callback: (val) => formatCompact(Number(val)),
                                                    },
                                                    grid: { color: 'rgba(0,0,0,0.04)' },
                                                },
                                                x: {
                                                    grid: { display: false },
                                                },
                                            },
                                        }}
                                    />
                                )}
                            </div>
                        </motion.div>

                        {/* Doughnut - Cost Breakdown */}
                        <motion.div
                            variants={itemAnim}
                            className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
                        >
                            <h3 className="text-base font-semibold text-neutral-900">Breakdown Biaya</h3>
                            <p className="mt-1 text-xs text-neutral-400">Distribusi per kategori</p>
                            <div className="mt-4 h-64">
                                {breakdown.length > 0 ? (
                                    <Doughnut
                                        data={{
                                            labels: breakdown.map((b) => b.name),
                                            datasets: [
                                                {
                                                    data: breakdown.map((b) => b.total),
                                                    backgroundColor: breakdown.map((b, i) => b.color || doughnutColors[i % doughnutColors.length]),
                                                    borderWidth: 0,
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            cutout: '65%',
                                            plugins: {
                                                legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true, pointStyle: 'circle', font: { size: 11 } } },
                                                tooltip: {
                                                    callbacks: {
                                                        label: (ctx) => `${ctx.label}: ${formatPrice(ctx.parsed)}`,
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                                        Belum ada data biaya
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Detail Table */}
                    {breakdown.length > 0 && (
                        <motion.div
                            variants={itemAnim}
                            className="rounded-xl border border-neutral-200 bg-white shadow-sm"
                        >
                            <div className="border-b border-neutral-100 px-6 py-4">
                                <h3 className="text-base font-semibold text-neutral-900">Detail Biaya per Kategori</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-neutral-100 text-left text-xs font-medium text-neutral-500">
                                            <th className="px-6 py-3">Kategori</th>
                                            <th className="px-6 py-3 text-right">Total</th>
                                            <th className="px-6 py-3 text-right">Persentase</th>
                                            <th className="px-6 py-3">Distribusi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {breakdown.map((item, index) => {
                                            const totalCost = breakdown.reduce((sum, b) => sum + b.total, 0);
                                            const pct = totalCost > 0 ? (item.total / totalCost) * 100 : 0;

                                            return (
                                                <tr key={index} className="border-b border-neutral-50 last:border-0">
                                                    <td className="px-6 py-3.5">
                                                        <div className="flex items-center gap-2.5">
                                                            <span
                                                                className="h-3 w-3 shrink-0 rounded-full"
                                                                style={{ backgroundColor: item.color || doughnutColors[index % doughnutColors.length] }}
                                                            />
                                                            <span className="font-medium text-neutral-900">{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3.5 text-right font-medium text-neutral-900">
                                                        {formatPrice(item.total)}
                                                    </td>
                                                    <td className="px-6 py-3.5 text-right text-neutral-500">
                                                        {pct.toFixed(1)}%
                                                    </td>
                                                    <td className="px-6 py-3.5">
                                                        <div className="h-2 w-full max-w-[120px] overflow-hidden rounded-full bg-neutral-100">
                                                            <div
                                                                className="h-full rounded-full"
                                                                style={{
                                                                    width: `${pct}%`,
                                                                    backgroundColor: item.color || doughnutColors[index % doughnutColors.length],
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </TenantLayout>
    );
}
