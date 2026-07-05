import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import { useCalendar } from '@/features/booking/hooks/useCalendar';
import type { BookingStatus, CalendarEvent } from '@/features/booking/types';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import type { Branch } from '@/features/company/types';
import { useAllStaff } from '@/features/staff/hooks/useStaff';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';
import BookingDetailModal from '@/organisms/BookingDetailModal';

interface BookingPageProps {
    title: string;
    stats: {
        total: number;
        confirmed: number;
        in_progress: number;
        completed: number;
        cancelled: number;
        no_show: number;
    };
}

const statusColors: Record<BookingStatus, string> = {
    pending: 'bg-warning text-white',
    confirmed: 'bg-primary text-white',
    in_progress: 'bg-success text-white',
    completed: 'bg-neutral-400 text-white',
    cancelled: 'bg-danger text-white',
    no_show: 'bg-pink-500 text-white',
};

const statusLabels: Record<BookingStatus, string> = {
    pending: 'Pending',
    confirmed: 'Dikonfirmasi',
    in_progress: 'Sedang Berjalan',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
    no_show: 'No Show',
};

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);

    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatShortDate(dateStr: string): string {
    const d = new Date(dateStr);

    return d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
}

function formatTime(dateStr: string): string {
    const d = new Date(dateStr);

    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
}

function localDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

export default function BookingIndex({ title, stats }: BookingPageProps) {
    const today = useMemo(() => new Date(), []);
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [branchId, setBranchId] = useState('');
    const [staffId, setStaffId] = useState('');
    const [selectedDate, setSelectedDate] = useState<string | null>(localDateStr(today));
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

    const { data: branchesData } = useAllBranches();
    const branches = (branchesData?.data ?? []) as Branch[];

    const { data: staffData } = useAllStaff();
    const staffList = staffData?.data ?? [];

    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    const { data: calendarData, isLoading: calendarLoading } = useCalendar({
        start: startOfMonth.toISOString(),
        end: endOfMonth.toISOString(),
        branch_id: branchId || undefined,
    });

    const events = useMemo(() => calendarData?.data ?? [], [calendarData]);

    const todayCount = useMemo(() => {
        return events.filter((e) => {
            const d = new Date(e.start);

            return isSameDay(d, today);
        }).length;
    }, [events, today]);

    const selectedEvents = useMemo(() => {
        if (!selectedDate) {
return [];
}

        return events.filter((e) => e.start.startsWith(selectedDate));
    }, [events, selectedDate]);

    function goToToday() {
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        setSelectedDate(localDateStr(today));
    }

    function prevMonth() {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }

        setSelectedDate(null);
    }

    function nextMonth() {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }

        setSelectedDate(null);
    }

    function getEventsForDate(dateStr: string): CalendarEvent[] {
        return events.filter((e) => e.start.startsWith(dateStr));
    }

    function getDaysInMonth(): ({ date: Date; dateStr: string; day: number; isToday: boolean; isPast: boolean; isFuture: boolean } | null)[] {
        const days = [];
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDay = startOfMonth.getDay();

        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(currentYear, currentMonth, d);
            const dateStr = localDateStr(date);
            const todayStr = localDateStr(today);
            days.push({
                date,
                dateStr,
                day: d,
                isToday: dateStr === todayStr,
                isPast: dateStr < todayStr,
                isFuture: dateStr > todayStr,
            });
        }

        return days;
    }

    const days = getDaysInMonth();
    const monthName = startOfMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    const statCards = [
        {
            label: 'Total Booking',
            value: stats.total,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
            ),
            color: 'text-primary',
            bg: 'bg-primary-50',
        },
        {
            label: 'Hari Ini',
            value: todayCount,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'text-amber-600',
            bg: 'bg-amber-50',
        },
        {
            label: 'Dikonfirmasi',
            value: stats.confirmed,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'text-primary',
            bg: 'bg-primary-50',
        },
        {
            label: 'Berlangsung',
            value: stats.in_progress,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
            ),
            color: 'text-success',
            bg: 'bg-success-light',
        },
        {
            label: 'Selesai',
            value: stats.completed,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'text-neutral-500',
            bg: 'bg-neutral-100',
        },
        {
            label: 'No Show',
            value: stats.no_show,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
            ),
            color: 'text-pink-500',
            bg: 'bg-pink-50',
        },
    ];

    const staffOptions = [
        { value: '', label: 'Semua Staff' },
        ...staffList.filter((s) => s.is_active).map((s) => ({ value: s.id, label: s.name })),
    ];

    return (
        <TenantLayout>
            <Head title={title} />

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/booking" className="font-medium text-neutral-900">Booking</Link>
            </nav>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{title}</h1>
                    <p className="mt-1 text-sm text-neutral-500">Kelola semua janji temu pelanggan.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/booking/walk-in">
                        <Button variant="secondary" size="sm">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Walk In
                        </Button>
                    </Link>
                    <Link href="/booking/waiting-list">
                        <Button variant="secondary" size="sm">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Waiting List
                        </Button>
                    </Link>
                </div>
            </div>

            <FadeIn delay={0.03}>
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {statCards.map((s) => (
                        <div
                            key={s.label}
                            className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
                        >
                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                                {s.icon}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xl font-bold tracking-tight text-neutral-900">{s.value.toLocaleString('id-ID')}</p>
                                <p className="text-xs text-neutral-500">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </FadeIn>

            <FadeIn delay={0.06}>
                <div className="mb-5 flex flex-wrap items-center gap-3">
                    <div className="w-44">
                        <Select
                            value={branchId}
                            onChange={(v) => {
 setBranchId(v); setSelectedDate(null); 
}}
                            options={[
                                { value: '', label: 'Semua Cabang' },
                                ...branches.filter((b) => b.is_active).map((b) => ({ value: b.id, label: b.name })),
                            ]}
                            placeholder="Filter cabang"
                        />
                    </div>
                    <div className="w-44">
                        <Select
                            value={staffId}
                            onChange={(v) => {
 setStaffId(v); setSelectedDate(null); 
}}
                            options={staffOptions}
                            placeholder="Filter staff"
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={goToToday}>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        Hari Ini
                    </Button>
                </div>
            </FadeIn>

            {calendarLoading ? (
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="animate-pulse rounded-2xl border border-neutral-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-4 w-20 rounded bg-neutral-200" />
                                    <div className="h-4 w-32 rounded bg-neutral-200" />
                                    <div className="h-4 w-20 rounded bg-neutral-200" />
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-px bg-neutral-100 p-px">
                                {Array.from({ length: 35 }).map((_, i) => (
                                    <div key={i} className="aspect-square bg-white p-2">
                                        <div className="h-full rounded-lg bg-neutral-100" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="animate-pulse rounded-2xl border border-neutral-200 bg-white shadow-sm">
                            <div className="border-b border-neutral-200 px-5 py-4">
                                <div className="h-4 w-40 rounded bg-neutral-200" />
                            </div>
                            <div className="space-y-3 p-5">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-2/3 rounded bg-neutral-200" />
                                            <div className="h-3 w-1/2 rounded bg-neutral-100" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                    <FadeIn className="lg:col-span-2" delay={0.05}>
                        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={prevMonth}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                        </svg>
                                    </button>
                                    <h3 className="min-w-[160px] text-center text-sm font-semibold text-neutral-900">{monthName}</h3>
                                    <button
                                        onClick={nextMonth}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 border-b border-neutral-100 bg-neutral-50">
                                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                                    <div key={day} className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7">
                                {days.map((day, i) => {
                                    if (!day) {
                                        return <div key={`empty-${i}`} className="border-b border-r border-neutral-50 p-1.5" />;
                                    }

                                    const dayEvents = getEventsForDate(day.dateStr);
                                    const isSelected = selectedDate === day.dateStr;
                                    const confirmedCount = dayEvents.filter((e) => e.extendedProps.status === 'confirmed').length;
                                    const inProgressCount = dayEvents.filter((e) => e.extendedProps.status === 'in_progress').length;

                                    return (
                                        <button
                                            key={day.dateStr}
                                            onClick={() => setSelectedDate(isSelected ? null : day.dateStr)}
                                            className={cn(
                                                'group relative min-h-[80px] border-b border-r border-neutral-50 p-1.5 text-left transition-all',
                                                isSelected && 'bg-primary-50 ring-2 ring-inset ring-primary',
                                                !isSelected && 'hover:bg-neutral-50',
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors',
                                                    day.isToday && !isSelected && 'bg-primary text-white',
                                                    day.isToday && isSelected && 'bg-primary text-white',
                                                    !day.isToday && isSelected && 'bg-primary-200 text-primary',
                                                    !day.isToday && !isSelected && day.isPast && 'text-neutral-300',
                                                    !day.isToday && !isSelected && !day.isPast && 'text-neutral-700',
                                                )}
                                            >
                                                {day.day}
                                            </span>

                                            {dayEvents.length > 0 && (
                                                <div className="mt-1 space-y-1">
                                                    {dayEvents.slice(0, 3).map((ev) => (
                                                        <div
                                                            key={ev.id}
                                                            className="flex items-center gap-1 rounded px-1 py-0.5"
                                                            style={{ backgroundColor: ev.backgroundColor + '20' }}
                                                        >
                                                            <div
                                                                className="h-1.5 w-1.5 shrink-0 rounded-full"
                                                                style={{ backgroundColor: ev.backgroundColor }}
                                                            />
                                                            <span className="truncate text-[10px] font-medium leading-none" style={{ color: ev.backgroundColor }}>
                                                                {formatTime(ev.start)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {dayEvents.length > 3 && (
                                                        <span className="block px-1 text-[10px] font-medium text-neutral-400">
                                                            +{dayEvents.length - 3} lagi
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {dayEvents.length > 0 && (
                                                <div className="absolute right-1.5 top-1.5 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                                                    {confirmedCount > 0 && (
                                                        <span className="flex h-4 min-w-[14px] items-center justify-center rounded bg-primary/10 px-1 text-[9px] font-bold text-primary">
                                                            {confirmedCount}
                                                        </span>
                                                    )}
                                                    {inProgressCount > 0 && (
                                                        <span className="flex h-4 min-w-[14px] items-center justify-center rounded bg-success/10 px-1 text-[9px] font-bold text-success">
                                                            {inProgressCount}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
                                <h3 className="text-sm font-semibold text-neutral-900">
                                    {selectedDate ? formatShortDate(selectedDate) : 'Pilih tanggal'}
                                </h3>
                                {selectedEvents.length > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                                        {selectedEvents.length}
                                        <span className="text-neutral-400">booking</span>
                                    </span>
                                )}
                            </div>

                            {!selectedDate ? (
                                <div className="flex flex-col items-center gap-4 px-5 py-14 text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100">
                                        <svg className="h-7 w-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-900">Belum ada tanggal dipilih</p>
                                        <p className="mt-1 text-xs text-neutral-500">Klik tanggal di kalender untuk melihat jadwal booking.</p>
                                    </div>
                                </div>
                            ) : selectedEvents.length === 0 ? (
                                <div className="flex flex-col items-center gap-4 px-5 py-14 text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success-light">
                                        <svg className="h-7 w-7 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-900">Tidak ada booking</p>
                                        <p className="mt-1 text-xs text-neutral-500">
                                            {formatDate(selectedDate)} tidak memiliki jadwal booking.
                                        </p>
                                    </div>
                                    <Link href="/booking/walk-in">
                                        <Button variant="secondary" size="sm">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            Buat Walk In
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-neutral-100">
                                    {selectedEvents.map((ev) => (
                                        <div
                                            key={ev.id}
                                            className="group cursor-pointer px-5 py-3 transition-colors hover:bg-neutral-50"
                                            onClick={() => setSelectedBookingId(ev.id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                                                    style={{ backgroundColor: ev.backgroundColor }}
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="text-sm font-semibold text-neutral-900">{ev.extendedProps.customer_name}</p>
                                                        <span
                                                            className={cn(
                                                                'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                                                                statusColors[ev.extendedProps.status as BookingStatus],
                                                            )}
                                                        >
                                                            {statusLabels[ev.extendedProps.status as BookingStatus]}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                                                        <span className="inline-flex items-center gap-1">
                                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {formatTime(ev.start)} - {formatTime(ev.end)}
                                                        </span>
                                                        {ev.extendedProps.staff_name && (
                                                            <span className="inline-flex items-center gap-1">
                                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                                </svg>
                                                                {ev.extendedProps.staff_name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {ev.extendedProps.services.length > 0 && (
                                                        <p className="mt-1 text-xs text-neutral-400">
                                                            {ev.extendedProps.services.join(', ')}
                                                        </p>
                                                    )}
                                                    {ev.extendedProps.notes && (
                                                        <div className="mt-1.5 flex items-start gap-1 rounded-lg bg-neutral-50 px-2.5 py-1.5">
                                                            <svg className="mt-0.5 h-3 w-3 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                                            </svg>
                                                            <span className="text-xs text-neutral-500">{ev.extendedProps.notes}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </FadeIn>
                </div>
            )}

            <BookingDetailModal
                bookingId={selectedBookingId}
                onClose={() => setSelectedBookingId(null)}
            />
        </TenantLayout>
    );
}
