import { Head } from '@inertiajs/react';
import { useAnalytics } from '@/features/booking/hooks/useAnalytics';
import TenantLayout from '@/layouts/TenantLayout';

const statusConfig: Record<string, { label: string; color: string }> = {
    total: { label: 'Total Booking', color: 'primary' },
    confirmed: { label: 'Terkonfirmasi', color: 'info' },
    in_progress: { label: 'Berjalan', color: 'warning' },
    completed: { label: 'Selesai', color: 'success' },
    cancelled: { label: 'Dibatalkan', color: 'danger' },
    no_show: { label: 'No Show', color: 'neutral' },
};

const colorMap: Record<string, string> = {
    primary: 'bg-primary',
    info: 'bg-blue-500',
    warning: 'bg-warning',
    success: 'bg-success',
    danger: 'bg-danger',
    neutral: 'bg-neutral-400',
};

export default function AnalyticsIndexPage() {
    const { data: response, isLoading, isError, error } = useAnalytics();
    const analytics = response?.data;

    const maxChartValue = Math.max(...(analytics?.booking_chart?.map((w) => w.count) ?? [0]), 1);

    return (
        <TenantLayout>
            <Head title="Analytics" />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Analytics</h1>
                    <p className="mt-1 text-sm text-neutral-500">Ringkasan performa bisnis Anda.</p>
                </div>
            </div>

            {isError ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-20 text-center shadow-sm">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-50">
                        <svg className="h-8 w-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-base font-semibold text-neutral-900">Gagal memuat data</p>
                        <p className="mt-1 text-sm text-neutral-500">{(error as Error)?.message || 'Terjadi kesalahan.'}</p>
                    </div>
                    <button onClick={() => window.location.reload()} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark">
                        Muat Ulang
                    </button>
                </div>
            ) : isLoading ? (
                <div className="animate-pulse space-y-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-28 rounded-xl bg-neutral-100" />
                        ))}
                    </div>
                    <div className="h-64 rounded-xl bg-neutral-100" />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="h-48 rounded-xl bg-neutral-100" />
                        <div className="h-48 rounded-xl bg-neutral-100" />
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Stat Cards */}
                    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {Object.entries(statusConfig).map(([key, config]) => {
                            const value = analytics?.[key as keyof typeof analytics];
                            return (
                                <div key={key} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorMap[config.color]} bg-opacity-10`}>
                                            <div className={`h-3 w-3 rounded-full ${colorMap[config.color]}`} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-medium text-neutral-500">{config.label}</p>
                                            <p className="text-lg font-bold tracking-tight text-neutral-900">
                                                {typeof value === 'number' ? value.toLocaleString('id-ID') : '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Revenue Cards */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-50 text-success">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">Revenue Minggu Ini</p>
                                    <p className="text-2xl font-bold tracking-tight text-neutral-900">
                                        Rp {(analytics?.revenue_week ?? 0).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">Revenue Bulan Ini</p>
                                    <p className="text-2xl font-bold tracking-tight text-neutral-900">
                                        Rp {(analytics?.revenue_month ?? 0).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Trend Chart */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-1 text-sm font-semibold text-neutral-900">Tren Booking (7 Hari)</h3>
                        <p className="mb-6 text-xs text-neutral-500">Jumlah booking per hari (tidak termasuk dibatalkan/no show)</p>
                        <div className="flex items-end gap-3">
                            {(analytics?.booking_chart ?? []).map((w) => (
                                <div key={w.date} className="flex flex-1 flex-col items-center gap-2">
                                    <span className="text-xs font-medium text-neutral-500">{w.count}</span>
                                    <div className="relative flex w-full items-end justify-center">
                                        <div
                                            className="w-full max-w-[36px] rounded-lg bg-gradient-to-t from-primary to-primary-light transition-all duration-500"
                                            style={{ height: `${Math.max((w.count / maxChartValue) * 160, 8)}px` }}
                                        />
                                    </div>
                                    <span className="text-xs text-neutral-400">{w.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Services & Staff Performance */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        {/* Top Services */}
                        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-1 text-sm font-semibold text-neutral-900">Layanan Terlaris</h3>
                            <p className="mb-4 text-xs text-neutral-500">Berdasarkan revenue bulan ini</p>
                            {(analytics?.top_services ?? []).length === 0 ? (
                                <p className="py-8 text-center text-sm text-neutral-400">Belum ada data layanan.</p>
                            ) : (
                                <div className="space-y-3">
                                    {(analytics?.top_services ?? []).map((svc, i) => {
                                        const maxRevenue = Math.max(...(analytics?.top_services ?? []).map((s) => s.total_revenue), 1);

                                        return (
                                            <div key={svc.name}>
                                                <div className="mb-1 flex items-center justify-between">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-500">{i + 1}</span>
                                                        <span className="text-sm font-medium text-neutral-900">{svc.name}</span>
                                                    </div>
                                                    <span className="text-xs font-semibold text-neutral-700">
                                                        Rp {svc.total_revenue.toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500"
                                                        style={{ width: `${(svc.total_revenue / maxRevenue) * 100}%` }}
                                                    />
                                                </div>
                                                <p className="mt-0.5 text-[11px] text-neutral-400">{svc.total_bookings} booking</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Staff Performance */}
                        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-1 text-sm font-semibold text-neutral-900">Performa Staff</h3>
                            <p className="mb-4 text-xs text-neutral-500">Berdasarkan jumlah booking bulan ini</p>
                            {(analytics?.staff_performance ?? []).length === 0 ? (
                                <p className="py-8 text-center text-sm text-neutral-400">Belum ada data staff.</p>
                            ) : (
                                <div className="space-y-4">
                                    {(analytics?.staff_performance ?? []).map((staff) => {
                                        const maxBookings = Math.max(...(analytics?.staff_performance ?? []).map((s) => s.total_bookings), 1);

                                        return (
                                            <div key={staff.id}>
                                                <div className="mb-1 flex items-center justify-between">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary">
                                                            {staff.name.charAt(0)}
                                                        </div>
                                                        <span className="text-sm font-medium text-neutral-900">{staff.name}</span>
                                                    </div>
                                                    <span className="text-xs font-semibold text-neutral-700">{staff.total_bookings} booking</span>
                                                </div>
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-success to-success-light transition-all duration-500"
                                                        style={{ width: `${(staff.total_bookings / maxBookings) * 100}%` }}
                                                    />
                                                </div>
                                                <p className="mt-0.5 text-[11px] text-neutral-400">
                                                    Rp {staff.total_revenue.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </TenantLayout>
    );
}
