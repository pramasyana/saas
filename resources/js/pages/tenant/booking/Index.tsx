import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import { useCalendar } from '@/features/booking/hooks/useCalendar';
import type { BookingStatus, CalendarEvent } from '@/features/booking/types';
import { useAllBranches } from '@/features/company/hooks/useBranches';
import type { Branch } from '@/features/company/types';
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

    return d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(dateStr: string): string {
    const d = new Date(dateStr);

    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

const statIcons = {
    confirmed: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    progress: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
        </svg>
    ),
    completed: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
    ),
    no_show: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
    ),
};

export default function BookingIndex({ title, stats }: BookingPageProps) {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [branchId, setBranchId] = useState('');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

    const { data: branchesData } = useAllBranches();
    const branches = (branchesData?.data ?? []) as Branch[];

    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    const { data: calendarData, isLoading: calendarLoading } = useCalendar({
        start: startOfMonth.toISOString(),
        end: endOfMonth.toISOString(),
        branch_id: branchId || undefined,
    });

    const events = calendarData?.data ?? [];

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
        { label: 'Dikonfirmasi', value: stats.confirmed, icon: statIcons.confirmed, color: 'text-primary', bg: 'bg-primary-50' },
        { label: 'Berlangsung', value: stats.in_progress, icon: statIcons.progress, color: 'text-success', bg: 'bg-success-light' },
        { label: 'Selesai', value: stats.completed, icon: statIcons.completed, color: 'text-neutral-500', bg: 'bg-neutral-100' },
        { label: 'No Show', value: stats.no_show, icon: statIcons.no_show, color: 'text-pink-500', bg: 'bg-pink-50' },
    ];

    return (
        <TenantLayout>
            <Head title={title} />

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <span className="font-medium text-neutral-900">Booking</span>
            </nav>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{title}</h1>
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
                                <p className="text-2xl font-bold tracking-tight text-neutral-900">{s.value.toLocaleString('id-ID')}</p>
                                <p className="text-sm text-neutral-500">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </FadeIn>

            <FadeIn delay={0.06}>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex flex-wrap gap-3">
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
                </div>
            </FadeIn>

            {calendarLoading ? (
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="animate-pulse rounded-2xl border border-neutral-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                                <div className="h-4 w-20 rounded bg-neutral-200" />
                                <div className="h-4 w-32 rounded bg-neutral-200" />
                                <div className="h-4 w-20 rounded bg-neutral-200" />
                            </div>
                            <div className="grid grid-cols-7 gap-1 p-4">
                                {Array.from({ length: 35 }).map((_, i) => (
                                    <div key={i} className="aspect-square rounded-lg bg-neutral-100" />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="animate-pulse rounded-2xl border border-neutral-200 bg-white shadow-sm">
                            <div className="border-b border-neutral-200 px-5 py-4">
                                <div className="h-4 w-40 rounded bg-neutral-200" />
                            </div>
                            <div className="space-y-4 p-5">
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
                                <div
                                    key={ev.id}
                                    className="cursor-pointer px-5 py-3 transition-colors hover:bg-neutral-50"
                                    onClick={() => setSelectedBookingId(ev.id)}
                                >
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
            )}

            <BookingDetailModal
                bookingId={selectedBookingId}
                onClose={() => setSelectedBookingId(null)}
            />
        </TenantLayout>
    );
}
