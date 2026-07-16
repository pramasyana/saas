import { Head, Link } from '@inertiajs/react';
import { useState  } from 'react';
import type {ReactNode} from 'react';
import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import CommissionDeleteDialog from '@/features/staff/components/CommissionDeleteDialog';
import { useCommissions, useDeleteCommission } from '@/features/staff/hooks/useCommission';
import { useAllStaff } from '@/features/staff/hooks/useStaff';
import type { Commission } from '@/features/staff/types';
import TenantLayout from '@/layouts/TenantLayout';
import DateRangePicker from '@/molecules/DateRangePicker';
import Pagination from '@/molecules/Pagination';
import { useToastStore } from '@/stores/toast';

interface Stats {
    total_month: number;
    prev_total_month: number;
    total_count: number;
    average_per_transaction: number;
    by_type: Record<string, { amount: number; count: number }>;
    top_staff: { name: string | null; amount: number };
}

interface CommissionPageProps {
    title: string;
    stats: Stats;
}

interface Filters {
    staff_id?: string;
    type?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
}

interface StatCard {
    label: string;
    value: ReactNode;
    icon: ReactNode;
    color: string;
    bg: string;
    subtitle?: string;
}

function extractMessage(error: unknown): string | undefined {
    if (!error) {
return undefined;
}

    if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };

        return axiosError.response?.data?.message ?? error.message;
    }

    if (error instanceof Error) {
return error.message;
}

    if (typeof error === 'string') {
return error;
}

    return 'Terjadi kesalahan.';
}

const typeOptions = [
    { value: '', label: 'Semua Tipe' },
    { value: 'service', label: 'Layanan' },
    { value: 'product', label: 'Produk' },
    { value: 'bonus', label: 'Bonus' },
    { value: 'incentive', label: 'Incentive' },
];

const perPageOptions = [
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
];

const typeColors: Record<string, { badge: 'success' | 'warning' | 'default'; dot: string }> = {
    service: { badge: 'success', dot: 'bg-success' },
    product: { badge: 'warning', dot: 'bg-warning' },
    bonus: { badge: 'default', dot: 'bg-primary' },
    incentive: { badge: 'success', dot: 'bg-info' },
};

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

export default function CommissionPage({ title, stats }: CommissionPageProps) {
    const addToast = useToastStore((s) => s.addToast);
    const [filters, setFilters] = useState<Filters>({ page: 1, per_page: 15, staff_id: '', type: '' });

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [commissionToDelete, setCommissionToDelete] = useState<Commission | null>(null);

    const { data: staffData } = useAllStaff();
    const allStaff = staffData?.data ?? [];

    const { data, isLoading, isError, error } = useCommissions(filters);
    const deleteMutation = useDeleteCommission();

    const commissions = data?.data ?? [];
    const meta = data?.meta;

    const totalMonth = stats?.total_month ?? 0;
    const prevTotalMonth = stats?.prev_total_month ?? 0;
    const totalCount = stats?.total_count ?? 0;
    const avgTransaction = stats?.average_per_transaction ?? 0;
    const byType = stats?.by_type ?? {};
    const topStaff = stats?.top_staff ?? { name: null, amount: 0 };

    const trend = prevTotalMonth > 0 ? ((totalMonth - prevTotalMonth) / prevTotalMonth) * 100 : 0;
    const trendUp = trend >= 0;

    function handlePage(page: number) {
 setFilters((prev) => ({ ...prev, page })); 
}

    function openDelete(commission: Commission) {
        setCommissionToDelete(commission);
        deleteMutation.reset();
        setDeleteOpen(true);
    }

    function handleDelete() {
        if (!commissionToDelete) {
return;
}

        deleteMutation.mutate(commissionToDelete.id, {
            onSuccess: () => {
                setDeleteOpen(false);
                setCommissionToDelete(null);
                addToast('success', 'Komisi berhasil dihapus.');
            },
        });
    }

    const deleteError = extractMessage(deleteMutation.error);

    const staffOptions = [
        { value: '', label: 'Semua Staff' },
        ...allStaff.map((s) => ({ value: s.id, label: s.name })),
    ];

    const monthName = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const prevMonthName = new Date(new Date().getFullYear(), new Date().getMonth() - 1).toLocaleDateString('id-ID', { month: 'long' });

    const statCards: StatCard[] = [
        {
            label: 'Total Komisi',
            value: formatCurrency(totalMonth),
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'text-primary',
            bg: 'bg-primary-50',
            subtitle: `${trendUp ? 'Naik' : 'Turun'} ${Math.abs(trend).toFixed(1)}% dari ${prevMonthName}`,
        },
        {
            label: 'Total Transaksi',
            value: totalCount.toLocaleString('id-ID'),
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
            ),
            color: 'text-success',
            bg: 'bg-success-50',
            subtitle: `Rata-rata ${formatCurrency(avgTransaction)} per transaksi`,
        },
        {
            label: 'Komisi Layanan',
            value: formatCurrency(byType?.service?.amount ?? 0),
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.94 5.94a2.12 2.12 0 01-3-3l5.94-5.94" />
                </svg>
            ),
            color: 'text-warning',
            bg: 'bg-warning-50',
            subtitle: `${byType?.service?.count ?? 0} transaksi`,
        },
        {
            label: 'Staff Teratas',
            value: topStaff.name || '-',
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            ),
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            subtitle: topStaff.name ? formatCurrency(topStaff.amount) : 'Belum ada data',
        },
    ];

    function renderSkeleton() {
        return (
            <div className="animate-pulse p-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4 py-4">
                        <div className="h-9 w-9 rounded-full bg-neutral-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3.5 w-32 rounded bg-neutral-200" />
                            <div className="h-3 w-24 rounded bg-neutral-100" />
                        </div>
                        <div className="h-5 w-20 rounded bg-neutral-200" />
                        <div className="flex gap-2">
                            <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                            <div className="h-8 w-8 rounded-lg bg-neutral-200" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    function renderError() {
        return (
            <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-50">
                    <svg className="h-8 w-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>
                <div>
                    <p className="text-base font-semibold text-neutral-900">Gagal memuat data</p>
                    <p className="mt-1 text-sm text-neutral-500">{(error as Error)?.message || 'Terjadi kesalahan. Coba lagi.'}</p>
                </div>
                <button onClick={() => window.location.reload()} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark">
                    Muat Ulang
                </button>
            </div>
        );
    }

    function renderEmpty() {
        return (
            <div className="flex flex-col items-center gap-5 px-6 py-20">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-100">
                    <svg className="h-10 w-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="text-base font-semibold text-neutral-900">Belum ada komisi</p>
                    <p className="mt-1 text-sm text-neutral-500">Catat komisi karyawan untuk memulai.</p>
                </div>
                <Link href="/staff/commission/create">
                    <Button variant="outline" size="sm">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah Komisi
                    </Button>
                </Link>
            </div>
        );
    }

    function renderMobileCard(c: Commission) {
        const tc = typeColors[c.type] ?? typeColors.bonus;

        return (
            <div key={c.id} className="border-b border-neutral-100 px-4 py-4 transition-colors last:border-b-0 hover:bg-neutral-50">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${tc.dot}`} />
                            <p className="truncate text-sm font-semibold text-neutral-900">{c.staff_name || '-'}</p>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                            <p className="text-xs text-neutral-500">{c.type_label} &middot; {c.date}</p>
                            {c.is_auto && (
                                <span className="inline-flex items-center rounded-full bg-info/10 px-1.5 py-0.5 text-[10px] font-semibold text-info">Otomatis</span>
                            )}
                        </div>
                        {c.notes && <p className="mt-1 truncate text-xs text-neutral-400">{c.notes}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <p className="text-sm font-bold text-neutral-900">{c.amount_formatted}</p>
                        <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                            <Link href={`/staff/commission/${c.id}/edit`} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary" title="Edit">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </Link>
                            <div className="h-4 w-px bg-neutral-200" />
                            <button onClick={() => openDelete(c)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger" title="Hapus">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function renderDesktopRow(c: Commission) {
        const tc = typeColors[c.type] ?? typeColors.bonus;

        return (
            <tr key={c.id} className="transition-colors hover:bg-neutral-50">
                <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${tc.dot}`} />
                        <p className="text-sm font-semibold text-neutral-900">{c.staff_name || '-'}</p>
                    </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-1.5">
                        <Badge variant={tc.badge}>{c.type_label}</Badge>
                        {c.is_auto && (
                            <span className="inline-flex items-center rounded-full bg-info/10 px-1.5 py-0.5 text-[10px] font-semibold text-info">Otomatis</span>
                        )}
                    </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-bold text-neutral-900">{c.amount_formatted}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">{c.date}</td>
                <td className="max-w-[200px] truncate px-6 py-4 text-sm text-neutral-500">{c.notes || <span className="text-neutral-300">-</span>}</td>
                <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex justify-end">
                        <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
                            <Link href={`/staff/commission/${c.id}/edit`} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary" title="Edit">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </Link>
                            <div className="h-5 w-px bg-neutral-200" />
                            <button onClick={() => openDelete(c)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger" title="Hapus">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        );
    }

    return (
        <TenantLayout>
            <Head title={title} />

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/staff" className="transition-colors hover:text-neutral-700">Staff</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Komisi</span>
            </nav>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{title}</h1>
                    <p className="mt-1 text-sm text-neutral-500">Catat komisi karyawan. Periode {monthName}.</p>
                </div>
                <Link href="/staff/commission/create">
                    <Button className="shrink-0">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah Komisi
                    </Button>
                </Link>
            </div>

            <FadeIn delay={0.03}>
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {statCards.map((s) => (
                        <div
                            key={s.label}
                            className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
                        >
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                                {s.icon}
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-bold tracking-tight text-neutral-900">
                                    {s.value}
                                </p>
                                <p className="text-sm text-neutral-500">{s.label}</p>
                                {s.subtitle && <p className="text-xs text-neutral-400">{s.subtitle}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </FadeIn>

            <FadeIn delay={0.06}>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Select
                        value={filters.staff_id ?? ''}
                        onChange={(v) => setFilters((prev) => ({ ...prev, staff_id: v, page: 1 }))}
                        options={staffOptions}
                        placeholder="Semua Staff"
                        className="w-full sm:flex-1 sm:min-w-0"
                    />
                    <Select
                        value={filters.type ?? ''}
                        onChange={(v) => setFilters((prev) => ({ ...prev, type: v, page: 1 }))}
                        options={typeOptions}
                        placeholder="Semua Tipe"
                        className="w-full sm:flex-1 sm:min-w-0"
                    />
                    <DateRangePicker
                        from={filters.date_from ?? ''}
                        to={filters.date_to ?? ''}
                        onFromChange={(v) => setFilters((prev) => ({ ...prev, date_from: v || '', page: 1 }))}
                        onToChange={(v) => setFilters((prev) => ({ ...prev, date_to: v || '', page: 1 }))}
                        fromPlaceholder="Dari"
                        toPlaceholder="Sampai"
                    />
                    <Select
                        value={String(filters.per_page ?? 15)}
                        onChange={(v) => setFilters((prev) => ({ ...prev, per_page: Number(v), page: 1 }))}
                        options={perPageOptions}
                        placeholder="Per page"
                        className="w-full sm:flex-1 sm:min-w-0"
                    />
                </div>
            </FadeIn>

            <FadeIn delay={0.09}>
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    {isError ? (
                        renderError()
                    ) : isLoading ? (
                        renderSkeleton()
                    ) : commissions.length === 0 ? (
                        renderEmpty()
                    ) : (
                        <>
                            <div className="divide-y divide-neutral-100 lg:hidden">
                                {commissions.map(renderMobileCard)}
                            </div>

                            <table className="hidden min-w-full divide-y divide-neutral-200 lg:table">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Staff</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Tipe</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Jumlah</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Tanggal</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Catatan</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 bg-white">
                                    {commissions.map(renderDesktopRow)}
                                </tbody>
                            </table>
                        </>
                    )}

                    {meta && (<Pagination meta={meta} onPageChange={handlePage} />)}
                </div>
            </FadeIn>

            <CommissionDeleteDialog
                open={!!commissionToDelete}
                commission={commissionToDelete!}
                deleting={deleteMutation.isPending}
                error={deleteError}
                onClose={() => {
 setDeleteOpen(false); setCommissionToDelete(null); deleteMutation.reset(); 
}}
                onConfirm={handleDelete}
            />
        </TenantLayout>
    );
}
