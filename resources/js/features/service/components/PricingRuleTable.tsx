import { Link } from '@inertiajs/react';
import type { PricingRule, PricingRuleConditions } from '../types';

interface PricingRuleTableProps {
    rules: PricingRule[];
    onDelete: (rule: PricingRule) => void;
    onToggleActive: (id: string, current: boolean) => void;
    togglingId: string | null;
}

const typeStyles: Record<string, { label: string; color: string; bg: string }> = {
    percentage_discount: { label: 'Diskon %', color: 'text-success', bg: 'bg-success-light' },
    fixed_discount: { label: 'Diskon Rp', color: 'text-success', bg: 'bg-success-light' },
    percentage_surcharge: { label: 'Tambahan %', color: 'text-warning', bg: 'bg-warning-light' },
    fixed_surcharge: { label: 'Tambahan Rp', color: 'text-warning', bg: 'bg-warning-light' },
    price_override: { label: 'Override', color: 'text-primary', bg: 'bg-primary-50' },
};

function getConditionSummary(conditions: PricingRuleConditions): string {
    const parts: string[] = [];

    if (conditions.apply_to) {
        const labels = conditions.apply_to.map((a) =>
            a === 'service' ? 'Layanan' : a === 'package' ? 'Paket' : 'Add-on',
        );
        parts.push(labels.join(', '));
    }

    if (conditions.days_of_week) {
        const names = ['', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
        const days = conditions.days_of_week.map((d) => names[d] || '').join(', ');
        parts.push(days);
    }

    if (conditions.time_start) {
        parts.push(`${conditions.time_start}–${conditions.time_end || '...'}`);
    }

    return parts.join(' · ') || 'Semua kondisi';
}

export default function PricingRuleTable({ rules, onDelete, onToggleActive, togglingId }: PricingRuleTableProps) {
    if (rules.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                    <svg className="h-7 w-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                </div>
                <p className="text-sm font-medium text-neutral-900">Belum ada aturan harga</p>
                <p className="text-sm text-neutral-500">Buat aturan harga dinamis pertama untuk mengoptimalkan harga layanan.</p>
                <Link href="/service/pricing-rules/create" className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark">
                    Tambah Aturan
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* Mobile: card layout */}
            <div className="grid gap-3 lg:hidden">
                {rules.map((rule) => {
                    const typeInfo = typeStyles[rule.action_type] || { label: rule.action_type, color: 'text-neutral-500', bg: 'bg-neutral-100' };

                    return (
                        <div key={rule.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md">
                            <div className="flex items-start gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-neutral-900">{rule.name}</p>
                                    {rule.description && <p className="mt-0.5 truncate text-xs text-neutral-500">{rule.description}</p>}
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeInfo.bg} ${typeInfo.color}`}>
                                            {typeInfo.label}
                                        </span>
                                        <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary">
                                            Prio: {rule.priority}
                                        </span>
                                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-600">
                                            <svg className="h-3 w-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                                            </svg>
                                            {getConditionSummary(rule.conditions)}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onToggleActive(rule.id, rule.is_active)}
                                            disabled={togglingId === rule.id}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 ${rule.is_active ? 'bg-primary' : 'bg-neutral-300'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${rule.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${rule.is_active ? 'bg-success-light text-success' : 'bg-neutral-100 text-neutral-500'}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${rule.is_active ? 'bg-success' : 'bg-neutral-400'}`} />
                                            {rule.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                    {rule.start_date && (
                                        <span>{rule.start_date}{rule.end_date ? ` — ${rule.end_date}` : ''}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Link href={`/service/pricing-rules/${rule.id}/edit`} className="rounded-lg p-2 text-primary transition-colors hover:bg-primary-50">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    </Link>
                                    <button
                                        onClick={() => onDelete(rule)}
                                        disabled={togglingId === rule.id}
                                        className="rounded-lg p-2 text-danger transition-colors hover:bg-danger-light disabled:opacity-50"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop: table layout */}
            <div className="hidden lg:block">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-neutral-200 bg-neutral-50">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Aturan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Tipe</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">Prioritas</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Kondisi</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {rules.map((rule) => {
                                const typeInfo = typeStyles[rule.action_type] || { label: rule.action_type, color: 'text-neutral-500', bg: 'bg-neutral-100' };

                                return (
                                    <tr key={rule.id} className="transition-colors hover:bg-neutral-50">
                                        <td className="px-4 py-3">
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-neutral-900">{rule.name}</p>
                                                {rule.description && (
                                                    <p className="max-w-[200px] truncate text-xs text-neutral-500">{rule.description}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${typeInfo.bg} ${typeInfo.color}`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${typeInfo.color.replace('text-', 'bg-')}`} />
                                                {rule.action_label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                                                {rule.priority}
                                            </span>
                                        </td>
                                        <td className="max-w-[220px] truncate px-4 py-3 text-sm text-neutral-500">
                                            <div className="flex items-center gap-1.5">
                                                <svg className="h-3.5 w-3.5 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                                                </svg>
                                                {getConditionSummary(rule.conditions)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                type="button"
                                                onClick={() => onToggleActive(rule.id, rule.is_active)}
                                                disabled={togglingId === rule.id}
                                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 ${rule.is_active ? 'bg-primary' : 'bg-neutral-300'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${rule.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/service/pricing-rules/${rule.id}/edit`} className="rounded-lg p-2 text-primary transition-colors hover:bg-primary-50">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => onDelete(rule)}
                                                    disabled={togglingId === rule.id}
                                                    className="rounded-lg p-2 text-danger transition-colors hover:bg-danger-light disabled:opacity-50"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
