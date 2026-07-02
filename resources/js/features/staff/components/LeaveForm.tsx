import type { FormEvent} from 'react';
import { useState } from 'react';
import Button from '@/atoms/Button';
import Select from '@/atoms/Select';
import type { LeaveFormData } from '@/features/staff/types';
import { cn } from '@/lib/utils';

interface LeaveFormProps {
    staff: { value: string; label: string }[];
    saving: boolean;
    errors: Record<string, string[]>;
    onSave: (data: LeaveFormData) => void;
    onCancel?: () => void;
}

const typeOptions = [
    { value: 'sick', label: 'Sakit' },
    { value: 'vacation', label: 'Cuti' },
    { value: 'other', label: 'Lainnya' },
];

export default function LeaveForm({ staff, saving, errors = {}, onSave, onCancel }: LeaveFormProps) {
    const [form, setForm] = useState<LeaveFormData>({
        staff_id: '',
        type: 'sick',
        date_start: '',
        date_end: '',
        reason: '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        onSave(form);
    }

    function inputClass(field: string, extra?: string) {
        return cn(
            'block w-full rounded-xl border px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2',
            errors[field]
                ? 'border-danger ring-danger/20 focus:border-danger focus:ring-danger/30'
                : 'border-neutral-300 ring-neutral-300 focus:border-primary focus:ring-primary/30',
            'disabled:bg-neutral-50 disabled:text-neutral-500',
            extra,
        );
    }

    function renderField(
        label: string,
        field: string,
        children: React.ReactNode,
        required?: boolean,
    ) {
        const fieldErrors = errors[field];

        return (
            <div>
                <label className="block text-sm font-medium text-neutral-700">
                    {label}
                    {required && <span className="ml-0.5 text-danger">*</span>}
                </label>
                <div className="relative mt-1.5">{children}</div>
                {fieldErrors && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-danger">
                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <span>{fieldErrors[0]}</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {errors._general && (
                <div className="flex items-center gap-2.5 rounded-xl border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
                    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <span>{errors._general.join(', ')}</span>
                </div>
            )}

            <div>
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Data Cuti</h3>
                        <p className="text-xs text-neutral-500">Ajukan cuti karyawan.</p>
                    </div>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        {renderField('Staff', 'staff_id', (
                            <Select
                                value={form.staff_id}
                                onChange={(v) => setForm((prev) => ({ ...prev, staff_id: v }))}
                                options={staff}
                                placeholder="Pilih staff..."
                                error={!!errors.staff_id}
                            />
                        ), true)}
                    </div>
                    <div>
                        {renderField('Tipe Cuti', 'type', (
                            <Select
                                value={form.type}
                                onChange={(v) => setForm((prev) => ({ ...prev, type: v as LeaveFormData['type'] }))}
                                options={typeOptions}
                                error={!!errors.type}
                            />
                        ), true)}
                    </div>
                    <div>
                        {renderField('Tanggal Mulai', 'date_start', (
                            <input
                                type="date"
                                required
                                value={form.date_start}
                                onChange={(e) => setForm((prev) => ({ ...prev, date_start: e.target.value }))}
                                className={inputClass('date_start')}
                            />
                        ), true)}
                    </div>
                    <div>
                        {renderField('Tanggal Selesai', 'date_end', (
                            <input
                                type="date"
                                required
                                value={form.date_end}
                                onChange={(e) => setForm((prev) => ({ ...prev, date_end: e.target.value }))}
                                className={inputClass('date_end')}
                            />
                        ), true)}
                    </div>
                    <div className="sm:col-span-2">
                        {renderField('Alasan', 'reason', (
                            <textarea
                                value={form.reason || ''}
                                onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
                                rows={3}
                                className={inputClass('reason')}
                                placeholder="Alasan cuti (opsional)"
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-neutral-200 pt-6">
                {onCancel && <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
                    Batal
                </Button>}
                <Button type="submit" disabled={saving} className="min-w-[120px]">
                    {saving ? (
                        <span className="inline-flex items-center gap-2">
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Menambahkan...
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Tambah
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
}
