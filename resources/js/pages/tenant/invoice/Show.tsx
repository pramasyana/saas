import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Badge from '@/atoms/Badge';
import { useCustomerInvoice, usePayInvoice, useUpdateInvoiceNotes } from '@/features/invoice/hooks/useCustomerInvoices';
import TenantLayout from '@/layouts/TenantLayout';
import { cn, formatPrice } from '@/lib/utils';
import { useToastStore } from '@/stores/toast';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemAnim = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

const statusColors: Record<string, 'success' | 'warning' | 'default' | 'info' | 'danger'> = {
    paid: 'success',
    pending: 'warning',
    partial: 'info',
    draft: 'default',
    cancelled: 'danger',
};

const paymentMethods = [
    { value: 'cash', label: 'Tunai' },
    { value: 'card', label: 'Kartu' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'e-wallet', label: 'E-Wallet' },
    { value: 'other', label: 'Lainnya' },
];

function formatDate(date: string | null): string {
    if (!date) {
return '-';
}

    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

interface Props {
    invoiceId: string;
}

export default function InvoiceDetail({ invoiceId }: Props) {
    const addToast = useToastStore((s) => s.addToast);
    const { data: invoice, isLoading } = useCustomerInvoice(invoiceId);
    const payMutation = usePayInvoice();
    const notesMutation = useUpdateInvoiceNotes();

    const [payOpen, setPayOpen] = useState(false);
    const [payMethod, setPayMethod] = useState('cash');
    const [payAmount, setPayAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [notesLoaded, setNotesLoaded] = useState(false);

    const inv = invoice?.data;

    if (inv && !notesLoaded) {
        setNotes(inv.notes || '');
        setNotesLoaded(true);
    }

    function handlePay() {
        const amount = parseFloat(payAmount);

        if (isNaN(amount) || amount <= 0) {
            addToast('error', 'Masukkan jumlah pembayaran yang valid.');

            return;
        }

        payMutation.mutate(
            { id: invoiceId, data: { payment_method: payMethod, amount } },
            {
                onSuccess: () => {
                    addToast('success', 'Pembayaran berhasil dicatat.');
                    setPayOpen(false);
                    setPayAmount('');
                },
                onError: () => addToast('error', 'Gagal mencatat pembayaran.'),
            },
        );
    }

    function handleSaveNotes() {
        notesMutation.mutate(
            { id: invoiceId, notes: notes || null },
            { onSuccess: () => addToast('success', 'Catatan berhasil disimpan.') },
        );
    }

    function handleDownloadPdf() {
        window.open(`/api/v1/tenant/invoices/${invoiceId}/pdf`, '_blank');
    }

    function handlePreviewPdf() {
        window.open(`/api/v1/tenant/invoices/${invoiceId}/preview`, '_blank');
    }

    if (isLoading) {
        return (
            <TenantLayout>
                <Head title="Invoice Detail" />
                <div className="flex items-center justify-center py-20">
                    <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                </div>
            </TenantLayout>
        );
    }

    if (!inv) {
        return (
            <TenantLayout>
                <Head title="Invoice Tidak Ditemukan" />
                <div className="flex flex-col items-center gap-3 py-20">
                    <p className="text-sm font-medium text-neutral-900">Invoice tidak ditemukan.</p>
                    <Link href="/invoice" className="text-sm text-primary hover:underline">Kembali ke daftar invoice</Link>
                </div>
            </TenantLayout>
        );
    }

    const remaining = inv.total_amount - inv.paid_amount;

    return (
        <TenantLayout>
            <Head title={`Invoice ${inv.number}`} />

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/invoice" className="transition-colors hover:text-neutral-700">Invoice</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">{inv.number}</span>
            </nav>

            <motion.div variants={container} initial="hidden" animate="show">
                {/* Header Card */}
                <motion.div variants={itemAnim}>
                    <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                        <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-6 sm:p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white/70">Invoice</p>
                                    <h2 className="mt-1 font-mono text-2xl font-bold text-white">{inv.number}</h2>
                                    <p className="mt-1 text-sm text-white/80">{formatDate(inv.created_at)}</p>
                                </div>
                                <div className="text-right">
                                    <Badge variant={statusColors[inv.status] ?? 'default'}>{inv.status_label}</Badge>
                                    <p className="mt-2 text-2xl font-bold text-white">{formatPrice(inv.total_amount)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 sm:grid-cols-4">
                            <div className="px-5 py-4">
                                <p className="text-xs font-medium text-neutral-400">Customer</p>
                                <p className="mt-1 text-sm font-semibold text-neutral-900">{inv.customer_name || '-'}</p>
                            </div>
                            <div className="px-5 py-4">
                                <p className="text-xs font-medium text-neutral-400">Booking</p>
                                <p className="mt-1 text-sm font-semibold text-neutral-900">{inv.booking_code || '-'}</p>
                            </div>
                            <div className="px-5 py-4">
                                <p className="text-xs font-medium text-neutral-400">Jatuh Tempo</p>
                                <p className={cn('mt-1 text-sm font-semibold', inv.is_overdue ? 'text-danger' : 'text-neutral-900')}>
                                    {formatDate(inv.due_date)}
                                    {inv.is_overdue && <span className="ml-1 text-xs font-medium">(Terlambat)</span>}
                                </p>
                            </div>
                            <div className="px-5 py-4">
                                <p className="text-xs font-medium text-neutral-400">Sisa Tagihan</p>
                                <p className={cn('mt-1 text-sm font-semibold', remaining > 0 ? 'text-warning' : 'text-success')}>
                                    {remaining > 0 ? formatPrice(remaining) : 'Lunas'}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Invoice Items */}
                    <motion.div variants={itemAnim} className="lg:col-span-2">
                        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
                            <div className="border-b border-neutral-200 px-6 py-5">
                                <h3 className="text-base font-semibold text-neutral-900">Detail Invoice</h3>
                            </div>
                            <div className="p-6">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-neutral-100">
                                            <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Deskripsi</th>
                                            <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">Qty</th>
                                            <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Harga</th>
                                            <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-50">
                                        {inv.items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="py-3">
                                                    <p className="text-xs font-medium text-neutral-400">{item.type_label}</p>
                                                    <p className="text-sm font-medium text-neutral-900">{item.name}</p>
                                                    {item.metadata && typeof item.metadata === 'object' && 'staff_name' in item.metadata && (
                                                        <p className="text-xs text-neutral-500">Staff: {item.metadata.staff_name as string}</p>
                                                    )}
                                                </td>
                                                <td className="py-3 text-center text-sm text-neutral-700">{item.quantity}</td>
                                                <td className="py-3 text-right text-sm text-neutral-700">{formatPrice(item.unit_price)}</td>
                                                <td className="py-3 text-right text-sm font-semibold text-neutral-900">{formatPrice(item.total_price)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Summary */}
                                <div className="mt-6 border-t border-neutral-100 pt-4">
                                    <div className="flex justify-end">
                                        <div className="w-64 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-neutral-500">Subtotal</span>
                                                <span className="font-medium text-neutral-900">{formatPrice(inv.subtotal)}</span>
                                            </div>
                                            {inv.discount_amount > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-neutral-500">Diskon</span>
                                                    <span className="font-medium text-danger">-{formatPrice(inv.discount_amount)}</span>
                                                </div>
                                            )}
                                            {inv.tax_amount > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-neutral-500">Pajak ({inv.tax_rate}%)</span>
                                                    <span className="font-medium text-neutral-900">{formatPrice(inv.tax_amount)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between border-t border-neutral-200 pt-2 text-base font-bold">
                                                <span className="text-neutral-900">Total</span>
                                                <span className="text-neutral-900">{formatPrice(inv.total_amount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar Actions */}
                    <motion.div variants={itemAnim} className="space-y-6">
                        {/* Actions */}
                        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
                            <div className="border-b border-neutral-200 px-6 py-5">
                                <h3 className="text-base font-semibold text-neutral-900">Aksi</h3>
                            </div>
                            <div className="space-y-3 p-6">
                                <button
                                    onClick={handlePreviewPdf}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:border-primary/30 hover:bg-primary-50 hover:text-primary"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Preview PDF
                                </button>
                                <button
                                    onClick={handleDownloadPdf}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                    Download PDF
                                </button>
                                {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                                    <button
                                        onClick={() => setPayOpen(true)}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-success px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-success/90 hover:shadow-md"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                        </svg>
                                        Catat Pembayaran
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Payment Info */}
                        {(inv.status === 'paid' || inv.status === 'partial') && (
                            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
                                <div className="border-b border-neutral-200 px-6 py-5">
                                    <h3 className="text-base font-semibold text-neutral-900">Pembayaran</h3>
                                </div>
                                <div className="space-y-3 p-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500">Metode</span>
                                        <span className="font-medium text-neutral-900">{inv.payment_method_label || '-'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500">Dibayar</span>
                                        <span className="font-medium text-success">{formatPrice(inv.paid_amount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500">Tanggal</span>
                                        <span className="font-medium text-neutral-900">{formatDate(inv.paid_at)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
                            <div className="border-b border-neutral-200 px-6 py-5">
                                <h3 className="text-base font-semibold text-neutral-900">Catatan</h3>
                            </div>
                            <div className="p-6">
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    placeholder="Tambahkan catatan..."
                                    className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm transition-all placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                                <button
                                    onClick={handleSaveNotes}
                                    disabled={notesMutation.isPending}
                                    className="mt-3 inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:bg-neutral-50"
                                >
                                    {notesMutation.isPending ? 'Menyimpan...' : 'Simpan Catatan'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Pay Modal */}
            {payOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setPayOpen(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-neutral-900">Catat Pembayaran</h3>
                        <p className="mt-1 text-sm text-neutral-500">Invoice: {inv.number}</p>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Metode Pembayaran</label>
                                <select
                                    value={payMethod}
                                    onChange={(e) => setPayMethod(e.target.value)}
                                    className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                >
                                    {paymentMethods.map((m) => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Jumlah Pembayaran</label>
                                <input
                                    type="number"
                                    value={payAmount}
                                    onChange={(e) => setPayAmount(e.target.value)}
                                    max={remaining}
                                    placeholder={formatPrice(remaining)}
                                    className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                                <p className="mt-1 text-xs text-neutral-500">Sisa tagihan: {formatPrice(remaining)}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setPayOpen(false)}
                                className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:bg-neutral-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handlePay}
                                disabled={payMutation.isPending}
                                className="rounded-xl bg-success px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-success/90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {payMutation.isPending ? 'Menyimpan...' : 'Simpan Pembayaran'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </TenantLayout>
    );
}
