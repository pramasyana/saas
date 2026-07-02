import { cn } from '@/lib/utils';

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface PaginationProps {
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
    return (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-neutral-200 px-6 py-3.5 sm:flex-row">
            <p className="text-sm text-neutral-500">
                <span className="font-medium text-neutral-700">{meta.total}</span> data · Halaman{' '}
                <span className="font-medium text-neutral-700">{meta.current_page}</span> dari{' '}
                <span className="font-medium text-neutral-700">{meta.last_page}</span>
            </p>
            <div className="flex items-center gap-1">
                <button
                    disabled={meta.current_page <= 1}
                    onClick={() => onPageChange(meta.current_page - 1)}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Prev
                </button>
                <div className="flex gap-1">
                    {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={cn(
                                'flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-sm font-medium transition-all',
                                page === meta.current_page
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-neutral-600 hover:bg-neutral-100',
                            )}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                <button
                    disabled={meta.current_page >= meta.last_page}
                    onClick={() => onPageChange(meta.current_page + 1)}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Next
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
