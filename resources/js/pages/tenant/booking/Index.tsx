import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import { useCalendar } from '@/features/booking/hooks/useCalendar';
import { useBookings } from '@/features/booking/hooks/useBookings';
import type { Booking, BookingStatus, CalendarEvent } from '@/features/booking/types';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import type { Branch } from '@/features/company/types';
import { useAllStaff } from '@/features/staff/hooks/useStaff';
import TenantLayout from '@/layouts/TenantLayout';
import Pagination from '@/molecules/Pagination';
import { cn } from '@/lib/utils';

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
    return d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function BookingIndex({ title, stats }: BookingPageProps) {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [branchId, setBranchId] = useState('');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    const { data: branchesData } = useAllBranches();
    const branches = (branchesData?.data ?? []) as Branch[];
    const { data: staffData } = useAllStaff();

    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    const { data: calendarData } = useCalendar({
        start: startOfMonth.toISOString(),
        end: endOfMonth.toISOString(),
        branch_id: branchId || undefined,
    });

    const events = calendarData?.data ?? [];

    const { data: bookingsData } = useBookings({
        page,
        branch_id: branchId || undefined,
        date: selectedDate || undefined,
        per_page: 10,
    });

    const bookings = bookingsData?.data ?? [];
    const meta = bookingsData?.meta;

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

    function getDaysInMonth(): { date: Date; dateStr: string; day: number; isToday: boolean; isPast: boolean }[] {
        const days = [];
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDay = startOfMonth.getDay();

        for (let i = 0; i < firstDay; i++) {
            days.push(null as unknown as { date: Date; dateStr: string; day: number; isToday: boolean; isPast: boolean });
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(currentYear, currentMonth, d);
            const dateStr = date.toISOString().split('T')[0];
            const todayStr = today.toISOString().split('T')[0];
            days.push({
                date,
                dateStr,
                day: d,
                isToday: dateStr === todayStr,
                isPast: dateStr < todayStr,
            });
        }

        return days;
    }

    const days = getDaysInMonth();
    const monthName = startOfMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    const statCards = [
        { label: 'Dikonfirmasi', value: stats.confirmed, color: 'text-primary', bg: 'bg-primary-50' },
        { label: 'Berlangsung', value: stats.in_progress, color: 'text-success', bg: 'bg-success-light' },
        { label: 'Selesai', value: stats.completed, color: 'text-neutral-500', bg: 'bg-neutral-100' },
        { label: 'No Show', value: stats.no_show, color: 'text-pink-500', bg: 'bg-pink-50' },
    ];

    return (
        <TenantLayout>
            <Head title={title} />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Booking</h1>
                    <p className="mt-1 text-sm text-neutral-500">Kelola semua janji temu pelanggan.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/booking/walk-in">
                        <Button variant="secondary">
                            Walk In
                        </Button>
                    </Link>
                    <Link href="/booking/waiting-list">
                        <Button variant="secondary">
                            Waiting List
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {statCards.map((s) => (
                    <div key={s.label} className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                            <span className="text-lg font-bold">{s.value}</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-neutral-500">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mb-4">
                <Select
                    value={branchId}
                    onChange={(v) => { setBranchId(v); setSelectedDate(null); }}
                    options={[
                        { value: '', label: 'Semua Cabang' },
                        ...branches.filter((b) => b.is_active).map((b) => ({ value: b.id, label: b.name })),
                    ]}
                    placeholder="Filter cabang"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <FadeIn className="lg:col-span-2" delay={0.05}>
                    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                            <button onClick={prevMonth} className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <h3 className="text-sm font-semibold text-neutral-900">{monthName}</h3>
                            <button onClick={nextMonth} className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-7 border-b border-neutral-100">
                            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                                <div key={day} className="px-2 py-2 text-center text-xs font-semibold text-neutral-400">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7">
                            {days.map((day, i) => {
                                if (!day) {
                                    return <div key={`empty-${i}`} className="border-b border-r border-neutral-50 p-2" />;
                                }

                                const dayEvents = getEventsForDate(day.dateStr);
                                const isSelected = selectedDate === day.dateStr;

                                return (
                                    <button
                                        key={day.dateStr}
                                        onClick={() => setSelectedDate(isSelected ? null : day.dateStr)}
                                        className={cn(
                                            'relative border-b border-r border-neutral-50 p-2 text-left transition-colors hover:bg-neutral-50',
                                            isSelected && 'bg-primary-50 ring-2 ring-inset ring-primary',
                                        )}
                                    >
                                        <span className={cn(
                                            'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                                            day.isToday && 'bg-primary text-white',
                                            day.isPast && !isSelected && 'text-neutral-300',
                                            !day.isToday && !day.isPast && 'text-neutral-700',
                                        )}>
                                            {day.day}
                                        </span>
                                        {dayEvents.length > 0 && (
                                            <div className="mt-1 space-y-0.5">
                                                {dayEvents.slice(0, 3).map((ev) => (
                                                    <div
                                                        key={ev.id}
                                                        className="h-1.5 w-full rounded-full"
                                                        style={{ backgroundColor: ev.backgroundColor }}
                                                    />
                                                ))}
                                                {dayEvents.length > 3 && (
                                                    <span className="text-[10px] text-neutral-400">+{dayEvents.length - 3}</span>
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
                        <div className="border-b border-neutral-200 px-5 py-4">
                            <h3 className="text-sm font-semibold text-neutral-900">
                                {selectedDate ? formatDate(selectedDate) : 'Pilih tanggal'}
                            </h3>
                        </div>
                        <div className="divide-y divide-neutral-100">
                            {selectedDate && getEventsForDate(selectedDate).length === 0 && (
                                <div className="px-5 py-8 text-center text-sm text-neutral-400">
                                    Tidak ada booking
                                </div>
                            )}
                            {selectedDate && getEventsForDate(selectedDate).map((ev) => (
                                <div key={ev.id} className="px-5 py-3">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full"
                                            style={{ backgroundColor: ev.backgroundColor }}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-neutral-900">{ev.extendedProps.customer_name}</p>
                                            <p className="text-xs text-neutral-500">
                                                {formatTime(ev.start)} - {formatTime(ev.end)}
                                            </p>
                                            {ev.extendedProps.staff_name && (
                                                <p className="text-xs text-neutral-400">{ev.extendedProps.staff_name}</p>
                                            )}
                                            <span className={cn(
                                                'mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium',
                                                statusColors[ev.extendedProps.status as BookingStatus],
                                            )}>
                                                {statusLabels[ev.extendedProps.status as BookingStatus]}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </TenantLayout>
    );
}
