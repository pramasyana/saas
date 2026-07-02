import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import Button from '@/atoms/Button';
import type { WorkingHour } from '@/features/company/types';
import { cn } from '@/lib/utils';

interface WorkingHourEditorProps {
    hours: WorkingHour[];
    saving: boolean;
    errors?: Record<string, string[]>;
    onSave: (hours: Partial<WorkingHour>[]) => void;
}

const DAY_LABELS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const DAY_LABELS_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function getOpenCount(items: WorkingHour[]) {
    return items.filter((i) => i.is_open).length;
}

export default function WorkingHourEditor({ hours, saving, errors = {}, onSave }: WorkingHourEditorProps) {
    const [items, setItems] = useState<WorkingHour[]>([]);

    useEffect(() => {
        if (hours.length > 0) {
            setItems(hours);
        } else {
            setItems(
                DAY_LABELS.map((_, i) => ({
                    day_of_week: i,
                    is_open: i !== 0,
                    open_time: i !== 0 ? '08:00' : null,
                    close_time: i !== 0 ? '17:00' : null,
                })),
            );
        }
    }, [hours]);

    function toggleDay(index: number) {
        setItems((prev) => {
            const next = [...prev];
            const current = { ...next[index] };
            current.is_open = !current.is_open;

            if (!current.is_open) {
                current.open_time = null;
                current.close_time = null;
            } else {
                current.open_time = '08:00';
                current.close_time = '17:00';
            }

            next[index] = current;

            return next;
        });
    }

    function updateTime(index: number, field: 'open_time' | 'close_time', value: string) {
        setItems((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };

            return next;
        });
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        onSave(items);
    }

    const openCount = getOpenCount(items);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {errors._general && (
                <div className="flex items-center gap-2.5 rounded-xl border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
                    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <span>{errors._general[0]}</span>
                </div>
            )}

            {/* Mobile: card per day */}
            <div className="grid gap-3 sm:hidden">
                {items.map((item, index) => (
                    <div
                        key={item.day_of_week}
                        className={cn(
                            'rounded-2xl border p-4 transition-all duration-200',
                            item.is_open
                                ? 'border-success/20 bg-success-light/30'
                                : 'border-neutral-200 bg-neutral-50/50',
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold',
                                        item.is_open
                                            ? 'bg-success text-white'
                                            : 'bg-neutral-200 text-neutral-400',
                                    )}
                                >
                                    {DAY_LABELS_SHORT[item.day_of_week]}
                                </div>
                                <div>
                                    <p className={cn(
                                        'text-sm font-medium',
                                        item.is_open ? 'text-neutral-900' : 'text-neutral-400',
                                    )}>
                                        {DAY_LABELS[item.day_of_week]}
                                    </p>
                                    {item.is_open && item.open_time && item.close_time && (
                                        <p className="text-xs text-neutral-500">
                                            {item.open_time} - {item.close_time}
                                        </p>
                                    )}
                                    {!item.is_open && (
                                        <p className="text-xs text-neutral-400">Libur</p>
                                    )}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => toggleDay(index)}
                                className={cn(
                                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2',
                                    item.is_open ? 'bg-primary' : 'bg-neutral-300',
                                )}
                            >
                                <span className={cn(
                                    'inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out',
                                    item.is_open ? 'translate-x-5' : 'translate-x-0',
                                )} />
                            </button>
                        </div>

                        {item.is_open && (
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-neutral-500">Buka</label>
                                    <input
                                        type="time"
                                        value={item.open_time ?? ''}
                                        onChange={(e) => updateTime(index, 'open_time', e.target.value)}
                                        className="block w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-neutral-500">Tutup</label>
                                    <input
                                        type="time"
                                        value={item.close_time ?? ''}
                                        onChange={(e) => updateTime(index, 'close_time', e.target.value)}
                                        className="block w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm sm:block">
                <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                        <tr>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Hari</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Jam Buka</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Jam Tutup</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {items.map((item, index) => (
                            <tr key={item.day_of_week} className={cn(
                                'transition-colors',
                                item.is_open ? 'hover:bg-success-light/20' : 'hover:bg-neutral-50',
                            )}>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className={cn(
                                            'text-sm font-medium',
                                            item.is_open ? 'text-neutral-900' : 'text-neutral-400',
                                        )}>
                                            {DAY_LABELS[item.day_of_week]}
                                        </span>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <button
                                        type="button"
                                        onClick={() => toggleDay(index)}
                                        className={cn(
                                            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2',
                                            item.is_open ? 'bg-primary' : 'bg-neutral-300',
                                        )}
                                    >
                                        <span className={cn(
                                            'inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out',
                                            item.is_open ? 'translate-x-5' : 'translate-x-0',
                                        )} />
                                    </button>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <input
                                        type="time"
                                        value={item.open_time ?? ''}
                                        onChange={(e) => updateTime(index, 'open_time', e.target.value)}
                                        disabled={!item.is_open}
                                        className={cn(
                                            'block w-32 rounded-xl border px-3 py-2 text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2',
                                            !item.is_open
                                                ? 'border-neutral-200 bg-neutral-50 text-neutral-400'
                                                : 'border-neutral-300 text-neutral-900 focus:border-primary focus:ring-primary/30',
                                        )}
                                    />
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <input
                                        type="time"
                                        value={item.close_time ?? ''}
                                        onChange={(e) => updateTime(index, 'close_time', e.target.value)}
                                        disabled={!item.is_open}
                                        className={cn(
                                            'block w-32 rounded-xl border px-3 py-2 text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2',
                                            !item.is_open
                                                ? 'border-neutral-200 bg-neutral-50 text-neutral-400'
                                                : 'border-neutral-300 text-neutral-900 focus:border-primary focus:ring-primary/30',
                                        )}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary footer */}
            <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <span className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                        openCount === 7
                            ? 'bg-success-light text-success'
                            : openCount > 0
                                ? 'bg-warning-light text-warning'
                                : 'bg-danger-light text-danger',
                    )}>
                        <span className={cn(
                            'inline-block h-1.5 w-1.5 rounded-full',
                            openCount === 7 ? 'bg-success' : openCount > 0 ? 'bg-warning' : 'bg-danger',
                        )} />
                        {openCount} dari 7 hari buka
                    </span>
                </div>
                <Button type="submit" disabled={saving} className="min-w-[140px]">
                    {saving ? (
                        <span className="inline-flex items-center gap-2">
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Menyimpan...
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Simpan Perubahan
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
}
