import { useState } from 'react';
import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Pagination from '@/molecules/Pagination';
import { useCustomerReviews, useApproveReview, useDeleteReview } from '@/features/crm/hooks/useCustomerReviews';
import { useToastStore } from '@/stores/toast';

interface ReviewListProps {
    customerId: string;
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`h-4 w-4 ${star <= rating ? 'text-amber-400' : 'text-neutral-200'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
            ))}
        </div>
    );
}

export default function ReviewList({ customerId }: ReviewListProps) {
    const [page, setPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');
    const addToast = useToastStore((s) => s.addToast);

    const { data, isLoading, error } = useCustomerReviews(customerId, { page, per_page: 10 });
    const approveReview = useApproveReview();
    const deleteReview = useDeleteReview();

    const allReviews = data?.data ?? [];
    const meta = data?.meta;

    const reviews = allReviews.filter((r) => {
        if (filterStatus === 'approved') return r.is_approved;
        if (filterStatus === 'pending') return !r.is_approved;
        return true;
    });

    function handleApprove(id: string) {
        approveReview.mutate(id, {
            onSuccess: () => addToast('success', 'Review berhasil disetujui'),
        });
    }

    function handleDelete(id: string) {
        if (!confirm('Hapus review ini?')) return;
        deleteReview.mutate(id, {
            onSuccess: () => addToast('success', 'Review berhasil dihapus'),
        });
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-3 py-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-light">
                    <svg className="h-6 w-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>
                <p className="text-sm text-danger">Gagal memuat review</p>
            </div>
        );
    }

    return (
        <FadeIn>
            <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-900">Review</h3>
                            <p className="text-xs text-neutral-500">Ulasan pelanggan</p>
                        </div>
                    </div>
                    <div className="flex gap-1 rounded-lg border border-neutral-200 bg-white p-0.5">
                        {(['all', 'approved', 'pending'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => { setFilterStatus(status); setPage(1); }}
                                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                    filterStatus === status
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-neutral-500 hover:text-neutral-700'
                                }`}
                            >
                                {status === 'all' ? 'Semua' : status === 'approved' ? 'Disetujui' : 'Menunggu'}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse rounded-xl border border-neutral-200 bg-white p-4">
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <div key={s} className="h-4 w-4 rounded bg-neutral-200" />
                                    ))}
                                </div>
                                <div className="mt-2 h-3 w-1/4 rounded bg-neutral-200" />
                                <div className="mt-2 h-4 w-3/4 rounded bg-neutral-100" />
                            </div>
                        ))}
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-10">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                            <svg className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                        </div>
                        <p className="text-sm text-neutral-500">Belum ada review</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {reviews.map((review) => (
                            <div key={review.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:border-neutral-300">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <StarRating rating={review.rating} />
                                        {review.title && (
                                            <p className="text-sm font-semibold text-neutral-900">{review.title}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Badge variant={review.is_approved ? 'success' : 'warning'}>
                                            {review.is_approved ? 'Disetujui' : 'Menunggu'}
                                        </Badge>
                                    </div>
                                </div>
                                {review.content && (
                                    <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-600">{review.content}</p>
                                )}
                                <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
                                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                                        {review.customer && (
                                            <span className="flex items-center gap-1">
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                </svg>
                                                {review.customer.name}
                                            </span>
                                        )}
                                        <span>{new Date(review.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {!review.is_approved && (
                                            <button
                                                onClick={() => handleApprove(review.id)}
                                                disabled={approveReview.isPending}
                                                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success-light disabled:opacity-50"
                                            >
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                                Setujui
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            disabled={deleteReview.isPending}
                                            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger-light disabled:opacity-50"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {meta && meta.last_page > 1 && (
                            <div className="pt-2">
                                <Pagination meta={meta} onPageChange={setPage} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </FadeIn>
    );
}
