import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';
import TenantSubNav from '@/molecules/TenantSubNav';
import { useToastStore } from '@/stores/toast';

interface WorkingHour {
    id?: string;
    day_of_week: number;
    is_open: boolean;
    open_time: string | null;
    close_time: string | null;
    break_start: string | null;
    break_end: string | null;
}

interface Props {
    tenant_id: string;
    tenant_name?: string | null;
    tenant_email?: string | null;
    hours: WorkingHour[];
}

const DAY_LABELS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const DAY_LABELS_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function getOpenCount(items: WorkingHour[]) {
    return items.filter((i) => i.is_open).length;
}

export default function CompanyWorkingHours({ tenant_id, tenant_name, tenant_email, hours }: Props) {
    const addToast = useToastStore((s) => s.addToast);

    const { data, setData, put, errors, processing } = useForm({
        hours: [] as WorkingHour[],
    });

    useEffect(() => {
        if (hours.length > 0) {
            setData('hours', hours);
        } else {
            setData('hours', DAY_LABELS.map((_, i) => ({
                day_of_week: i,
                is_open: i !== 0,
                open_time: i !== 0 ? '08:00' : null,
                close_time: i !== 0 ? '17:00' : null,
                break_start: null,
                break_end: null,
            })));
        }
    }, [hours]);

    function toggleDay(index: number) {
        setData('hours', data.hours.map((item, i) => {
            if (i !== index) {
return item;
}

            return {
                ...item,
                is_open: !item.is_open,
                open_time: item.is_open ? null : '08:00',
                close_time: item.is_open ? null : '17:00',
            };
        }));
    }

    function updateTime(index: number, field: 'open_time' | 'close_time' | 'break_start' | 'break_end', value: string) {
        setData('hours', data.hours.map((item, i) => {
            if (i !== index) {
return item;
}

            return { ...item, [field]: value || null };
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/tenants/${tenant_id}/company/working-hours`, {
            onSuccess: () => addToast('success', 'Jam kerja berhasil diperbarui.'),
        });
    }

    function timeInputClass() {
        return 'block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30';
    }

    const openCount = getOpenCount(data.hours);
    const pct = Math.round((openCount / 7) * 100);

    return (
        <AdminLayout>
            <Head title="Jam Kerja" />

            <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/admin/dashboard" className="transition-colors hover:text-neutral-700">Dashboard</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <Link href="/admin/tenants" className="transition-colors hover:text-neutral-700">Tenants</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Jam Kerja</span>
            </nav>

            <TenantSubNav tenantId={tenant_id} tenantName={tenant_name} tenantEmail={tenant_email} />

            <div className="mt-6 mb-6">
                <h1 className="text-xl font-bold tracking-tight text-neutral-900">Jam Kerja</h1>
                <p className="mt-1 text-sm text-neutral-500">
                    Atur jam operasional perusahaan. {openCount} dari 7 hari aktif.
                </p>
            </div>

            <FadeIn delay={0.03}>
                <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {errors._general && (
                            <div className="flex items-center gap-2.5 rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
                                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                                <span>{errors._general[0]}</span>
                            </div>
                        )}

                        {errors.hours && (
                            <div className="flex items-center gap-2.5 rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
                                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                                <span>{errors.hours[0]}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-neutral-50">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-medium text-neutral-500">Cakupan Operasional</span>
                                    <span className="text-xs font-semibold text-neutral-700">{pct}%</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                                </div>
                            </div>
                        </div>

                        <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4 sm:px-4 sm:py-2 sm:text-xs sm:font-semibold sm:uppercase sm:tracking-wider sm:text-neutral-500">
                            <div className="col-span-2">Hari</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-3">Buka</div>
                            <div className="col-span-2">Tutup</div>
                            <div className="col-span-3">Istirahat</div>
                        </div>

                        {data.hours.map((item, index) => (
                            <div
                                key={index}
                                className={cn(
                                    'grid grid-cols-2 items-center gap-4 rounded-lg border p-4 sm:grid-cols-12 sm:gap-4 sm:px-4 sm:py-3',
                                    item.is_open
                                        ? 'border-neutral-200'
                                        : 'border-neutral-100 bg-neutral-50',
                                )}
                            >
                                <div className="flex items-center gap-3 sm:col-span-2">
                                    <div className={cn(
                                        'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold',
                                        item.is_open ? 'bg-primary-50 text-primary' : 'bg-neutral-100 text-neutral-400',
                                    )}>
                                        {DAY_LABELS_SHORT[index]}
                                    </div>
                                    <span className={cn('text-sm font-medium', item.is_open ? 'text-neutral-900' : 'text-neutral-400')}>
                                        {DAY_LABELS[index]}
                                    </span>
                                </div>

                                <div className="flex items-center sm:col-span-2">
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            checked={item.is_open}
                                            onChange={() => toggleDay(index)}
                                            className="peer sr-only"
                                        />
                                        <div className="h-6 w-11 rounded-full bg-neutral-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-success peer-checked:after:translate-x-full" />
                                    </label>
                                    <span className={cn('ml-2 text-xs font-medium sm:hidden', item.is_open ? 'text-success' : 'text-neutral-400')}>
                                        {item.is_open ? 'Buka' : 'Tutup'}
                                    </span>
                                </div>

                                <div className="sm:col-span-3">
                                    <label className="mb-1 block text-xs text-neutral-400 sm:hidden">Buka</label>
                                    <input
                                        type="time"
                                        value={item.open_time ?? ''}
                                        onChange={(e) => updateTime(index, 'open_time', e.target.value)}
                                        disabled={!item.is_open}
                                        className={timeInputClass() + (!item.is_open ? ' opacity-40 cursor-not-allowed' : '')}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-xs text-neutral-400 sm:hidden">Tutup</label>
                                    <input
                                        type="time"
                                        value={item.close_time ?? ''}
                                        onChange={(e) => updateTime(index, 'close_time', e.target.value)}
                                        disabled={!item.is_open}
                                        className={timeInputClass() + (!item.is_open ? ' opacity-40 cursor-not-allowed' : '')}
                                    />
                                </div>

                                <div className="col-span-2 flex gap-2 sm:col-span-3">
                                    <div className="flex-1">
                                        <label className="mb-1 block text-xs text-neutral-400 sm:hidden">Mulai</label>
                                        <input
                                            type="time"
                                            value={item.break_start ?? ''}
                                            onChange={(e) => updateTime(index, 'break_start', e.target.value)}
                                            disabled={!item.is_open}
                                            className={timeInputClass() + (!item.is_open ? ' opacity-40 cursor-not-allowed' : '')}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="mb-1 block text-xs text-neutral-400 sm:hidden">Selesai</label>
                                        <input
                                            type="time"
                                            value={item.break_end ?? ''}
                                            onChange={(e) => updateTime(index, 'break_end', e.target.value)}
                                            disabled={!item.is_open}
                                            className={timeInputClass() + (!item.is_open ? ' opacity-40 cursor-not-allowed' : '')}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center justify-end border-t border-neutral-200 pt-6">
                            <Button type="submit" disabled={processing} className="min-w-[140px]">
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </FadeIn>
        </AdminLayout>
    );
}
