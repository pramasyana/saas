import { Head } from '@inertiajs/react';
import { useState, useRef, useEffect  } from 'react';
import type {ReactNode} from 'react';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import { useEmailLogs, useClearOldEmailLogs } from '@/features/email-logs/hooks/useEmailLogs';
import type { EmailLog, EmailLogFilters } from '@/features/email-logs/types';
import { useDebounce } from '@/hooks/useDebounce';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/molecules/Pagination';
import { useToastStore } from '@/stores/toast';

interface EmailLogsPageProps {
    title: string;
    stats: {
        total_sent: number;
        total_failed: number;
        total_logs: number;
    };
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

const avatarColors = [
    'from-primary to-primary-dark text-white',
    'from-emerald-500 to-emerald-600 text-white',
    'from-amber-500 to-amber-600 text-white',
    'from-rose-500 to-rose-600 text-white',
    'from-sky-500 to-sky-600 text-white',
    'from-violet-500 to-violet-600 text-white',
];

function getAvatarColor(name: string): string {
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return avatarColors[Math.abs(hash) % avatarColors.length];
}

function formatRelativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) {
return 'Baru saja';
}

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
return `${minutes} menit lalu`;
}

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
return `${hours} jam lalu`;
}

    const days = Math.floor(hours / 24);

    if (days < 7) {
return `${days} hari lalu`;
}

    return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatFullTime(iso: string): string {
    return new Date(iso).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

const statusTabs = [
    { value: '', label: 'Semua', icon: null },
    { value: 'sent', label: 'Terkirim', icon: 'check' },
    { value: 'failed', label: 'Gagal', icon: 'x' },
] as const;

function LogCard({ log }: { log: EmailLog }) {
    const [expanded, setExpanded] = useState(false);
    const isSent = log.status === 'sent';
    const user = log.user;

    return (
        <div className={`group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md ${
            isSent ? 'border-success/20' : 'border-danger/20'
        }`}>
            <div className={`absolute left-0 top-0 h-full w-1 ${
                isSent
                    ? 'bg-gradient-to-b from-success to-success-dark'
                    : 'bg-gradient-to-b from-danger to-danger-dark'
            }`} />

            <div className="pl-5 pr-5">
                <div className="flex items-start gap-4 py-4">
                    {user ? (
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold shadow-sm ring-2 ring-white ${getAvatarColor(user.name)}`}>
                            {getInitials(user.name)}
                        </div>
                    ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-400">
                            ?
                        </div>
                    )}

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-neutral-900">
                                        {user?.name ?? 'Unknown'}
                                    </span>
                                    <span className="hidden text-xs text-neutral-400 sm:inline">·</span>
                                    <span className="hidden truncate text-xs text-neutral-500 sm:inline">
                                        {user?.email ?? '-'}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm font-medium text-neutral-800 leading-snug line-clamp-2">
                                    {log.subject}
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold shadow-sm ${
                                    isSent
                                        ? 'bg-success-light text-success ring-1 ring-success/20'
                                        : 'bg-danger-light text-danger ring-1 ring-danger/20'
                                }`}>
                                    <span className={`inline-block h-2 w-2 rounded-full ${
                                        isSent ? 'bg-success' : 'bg-danger'
                                    }`} />
                                    {isSent ? 'Terkirim' : 'Gagal'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-400">
                            <span className="inline-flex items-center gap-1">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                                </svg>
                                {log.channel}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                                </svg>
                                Attempt #{log.attempt}
                            </span>
                            <span className="inline-flex items-center gap-1" title={formatFullTime(log.created_at)}>
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formatRelativeTime(log.created_at)}
                            </span>
                        </div>

                        {!isSent && log.error_message && (
                            <div className="mt-3">
                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-danger-light px-2.5 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/10 ring-1 ring-danger/20"
                                >
                                    <svg className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                    {expanded ? 'Tutup detail error' : 'Lihat detail error'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {!isSent && log.error_message && expanded && (
                    <div className="border-t border-danger/10 pb-4 pt-3">
                        <div className="rounded-lg border border-danger/20 bg-danger-light/50 overflow-hidden">
                            <div className="flex items-center gap-2 border-b border-danger/10 bg-danger-light px-4 py-2">
                                <svg className="h-4 w-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                                <span className="text-xs font-semibold text-danger">Error Message</span>
                            </div>
                            <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-danger font-mono whitespace-pre-wrap break-all">
                                {log.error_message}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function TableSkeleton() {
    return (
        <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-xl border border-neutral-200 bg-white p-5">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-200" />
                        <div className="flex-1 space-y-2.5">
                            <div className="h-4 w-48 rounded bg-neutral-200" />
                            <div className="h-3 w-72 rounded bg-neutral-100" />
                            <div className="flex gap-4">
                                <div className="h-3 w-16 rounded bg-neutral-100" />
                                <div className="h-3 w-20 rounded bg-neutral-100" />
                                <div className="h-3 w-24 rounded bg-neutral-100" />
                            </div>
                        </div>
                        <div className="h-6 w-20 rounded-lg bg-neutral-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function EmailLogs({ title, stats }: EmailLogsPageProps) {
    const [filters, setFilters] = useState<EmailLogFilters>({
        page: 1,
        per_page: 15,
    });
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebounce(searchInput);
    const prevSearch = useRef(debouncedSearch);

    useEffect(() => {
        if (prevSearch.current !== debouncedSearch) {
            prevSearch.current = debouncedSearch;
            setFilters((prev) => ({ ...prev, page: 1 }));
        }
    }, [debouncedSearch]);

    function handleSearchChange(value: string) {
        setSearchInput(value);
    }

    const queryFilters = {
        ...filters,
        search: debouncedSearch || undefined,
    };

    const { data, isLoading, isError, error } = useEmailLogs(queryFilters);
    const logs = data?.data ?? [];
    const meta = data?.meta;

    const addToast = useToastStore((s) => s.addToast);
    const clearMutation = useClearOldEmailLogs();
    const [confirmClearOpen, setConfirmClearOpen] = useState(false);

    function handlePage(page: number) {
        setFilters((prev) => ({ ...prev, page }));
    }

    function handleClearOld() {
        clearMutation.mutate(undefined, {
            onSuccess: (res) => {
                setConfirmClearOpen(false);
                addToast('success', res.message || 'Log berhasil dibersihkan.');
            },
            onError: () => {
                setConfirmClearOpen(false);
                addToast('error', 'Gagal menghapus log.');
            },
        });
    }

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Email Logs</h1>
                <p className="mt-1 text-sm text-neutral-500">
                    Pantau semua pengiriman email dari sistem secara real-time.
                </p>
            </div>

            <FadeIn delay={0.05}>
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-success/20 bg-gradient-to-br from-success-light to-white p-5 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success-light text-success">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold tracking-tight text-neutral-900">
                                    {stats.total_sent.toLocaleString('id-ID')}
                                </p>
                                <p className="text-sm text-success font-medium">Terkirim</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-danger/20 bg-gradient-to-br from-danger-light to-white p-5 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-danger-light text-danger">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold tracking-tight text-neutral-900">
                                    {stats.total_failed.toLocaleString('id-ID')}
                                </p>
                                <p className="text-sm text-danger font-medium">Gagal</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-5 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.039a2.25 2.25 0 012.134 0l7.5 4.039a2.25 2.25 0 011.183 1.98V19.5z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold tracking-tight text-neutral-900">
                                    {stats.total_logs.toLocaleString('id-ID')}
                                </p>
                                <p className="text-sm text-neutral-600 font-medium">Total Log</p>
                            </div>
                        </div>
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.1}>
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-1 rounded-xl bg-neutral-100 p-1 ring-1 ring-inset ring-neutral-200">
                        {statusTabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setFilters((prev) => ({ ...prev, status: tab.value || undefined, page: 1 }))}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                                    (tab.value || undefined) === (filters.status || undefined)
                                        ? 'bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200'
                                        : 'text-neutral-500 hover:text-neutral-700'
                                }`}
                            >
                                {(filters.status || undefined) === (tab.value || undefined) && (
                                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                                        tab.value === 'sent' ? 'bg-success' : tab.value === 'failed' ? 'bg-danger' : 'bg-primary'
                                    }`} />
                                )}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-1 items-center gap-3 sm:max-w-md">
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Cari user, subject, atau error..."
                                className="w-full rounded-xl border border-neutral-300 py-2.5 pl-10 pr-3.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                        <Select
                            value={String(filters.per_page ?? 15)}
                            onChange={(v) => setFilters((prev) => ({ ...prev, per_page: Number(v), page: 1 }))}
                            options={[
                                { value: '10', label: '10' },
                                { value: '15', label: '15' },
                                { value: '25', label: '25' },
                                { value: '50', label: '50' },
                            ]}
                            placeholder="15"
                        />
                        <button
                            type="button"
                            disabled={clearMutation.isPending}
                            onClick={() => setConfirmClearOpen(true)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-danger/30 px-3.5 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger-light disabled:opacity-50"
                            title="Hapus log yang lebih dari 3 bulan"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.15}>
                <div className="space-y-3">
                    {isError ? (
                        <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-20 text-center shadow-sm">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-light ring-1 ring-danger/20">
                                <svg className="h-8 w-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-base font-semibold text-neutral-900">Gagal memuat data</p>
                                <p className="mt-1 text-sm text-neutral-500">{(error as Error)?.message || 'Terjadi kesalahan saat memuat log.'}</p>
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
                            >
                                Muat Ulang
                            </button>
                        </div>
                    ) : isLoading ? (
                        <TableSkeleton />
                    ) : logs.length === 0 ? (
                        <div className="flex flex-col items-center gap-5 rounded-2xl border border-neutral-200 bg-white px-6 py-20 shadow-sm">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-50 ring-1 ring-neutral-200">
                                <svg className="h-10 w-10 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.039a2.25 2.25 0 012.134 0l7.5 4.039a2.25 2.25 0 011.183 1.98V19.5z" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-base font-semibold text-neutral-900">
                                    {searchInput || filters.status ? 'Tidak ada log yang cocok' : 'Belum ada log email'}
                                </p>
                                <p className="mt-1 text-sm text-neutral-500 max-w-sm">
                                    {searchInput || filters.status
                                        ? 'Coba ubah filter atau kata kunci pencarian.'
                                        : 'Log akan muncul setelah ada pengiriman email dari sistem.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        logs.map((log, idx) => (
                            <FadeIn key={log.id} delay={Math.min(idx * 0.03, 0.3)}>
                                <LogCard log={log} />
                            </FadeIn>
                        ))
                    )}

                    {meta && (<Pagination meta={meta} onPageChange={handlePage} />)}
                </div>
            </FadeIn>

            {confirmClearOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setConfirmClearOpen(false)}>
                    <div
                        className="mx-4 w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-light ring-1 ring-danger/20">
                            <svg className="h-6 w-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-base font-semibold text-neutral-900">Hapus Log Lama</h3>
                        <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                            Yakin ingin menghapus semua email log yang lebih dari 3 bulan? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmClearOpen(false)}
                                disabled={clearMutation.isPending}
                                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleClearOld}
                                disabled={clearMutation.isPending}
                                className="inline-flex items-center gap-2 rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-danger-dark disabled:opacity-50 shadow-sm"
                            >
                                {clearMutation.isPending ? (
                                    <>
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                        </svg>
                                        Menghapus...
                                    </>
                                ) : (
                                    'Ya, Hapus'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
