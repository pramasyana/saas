import { cn } from '@/lib/utils';

interface DateRangePickerProps {
    from: string;
    to: string;
    onFromChange: (value: string) => void;
    onToChange: (value: string) => void;
    fromPlaceholder?: string;
    toPlaceholder?: string;
    className?: string;
}

const inputClass = [
    'w-full rounded-xl border border-neutral-300 bg-white px-3 h-[42px] text-sm shadow-sm transition-all duration-200',
    'text-neutral-900',
    'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30',
    'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400',
    '[color-scheme:light]',
].join(' ');

export default function DateRangePicker({
    from,
    to,
    onFromChange,
    onToChange,
    fromPlaceholder = 'Dari',
    toPlaceholder = 'Sampai',
    className,
}: DateRangePickerProps) {
    const toMin = from || undefined;

    function handleFromChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newFrom = e.target.value;
        onFromChange(newFrom);
        if (to && newFrom && to < newFrom) {
            onToChange('');
        }
    }

    function handleToChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newTo = e.target.value;
        if (from && newTo && newTo < from) return;
        onToChange(newTo);
    }

    return (
        <div className={cn('flex items-center', className)}>
            <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                </div>
                <input
                    type="date"
                    value={from}
                    onChange={handleFromChange}
                    placeholder={fromPlaceholder}
                    className={cn(inputClass, 'pl-9')}
                />
            </div>
            <div className="flex shrink-0 items-center px-2">
                <div className="h-px w-3 bg-neutral-300" />
            </div>
            <div className="relative flex-1">
                <input
                    type="date"
                    value={to}
                    onChange={handleToChange}
                    min={toMin}
                    placeholder={toPlaceholder}
                    className={cn(
                        inputClass,
                        from && to && to < from && 'border-danger bg-danger-50 text-danger focus:border-danger focus:ring-danger/30',
                    )}
                />
            </div>
        </div>
    );
}
