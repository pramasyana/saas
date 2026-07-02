import { useState } from 'react';
import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import { useCustomerNotes, useCreateNote, useUpdateNote, useDeleteNote } from '@/features/crm/hooks/useCustomerNotes';
import type { CustomerNote } from '@/features/crm/types';

interface NoteListProps {
    customerId: string;
}

function timeAgo(date: string): string {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function NoteList({ customerId }: NoteListProps) {
    const [page, setPage] = useState(1);
    const [content, setContent] = useState('');
    const [editingNote, setEditingNote] = useState<CustomerNote | null>(null);
    const [editContent, setEditContent] = useState('');
    const perPage = 10;

    const { data, isLoading, error } = useCustomerNotes(customerId, { page, per_page: perPage });
    const createNote = useCreateNote();
    const updateNote = useUpdateNote();
    const deleteNote = useDeleteNote();

    const notes = data?.data ?? [];
    const meta = data?.meta;

    function handleAdd() {
        if (!content.trim()) return;
        createNote.mutate(
            { customerId, data: { customer_id: customerId, content: content.trim() } },
            { onSuccess: () => { setContent(''); } },
        );
    }

    function handleEdit(note: CustomerNote) {
        setEditingNote(note);
        setEditContent(note.content);
    }

    function handleSaveEdit() {
        if (!editingNote || !editContent.trim()) return;
        updateNote.mutate(
            { customerId, id: editingNote.id, data: { customer_id: customerId, content: editContent.trim() } },
            { onSuccess: () => { setEditingNote(null); setEditContent(''); } },
        );
    }

    function handleDelete(note: CustomerNote) {
        if (!confirm('Hapus catatan ini?')) return;
        deleteNote.mutate({ customerId, id: note.id });
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-3 py-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-light">
                    <svg className="h-6 w-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>
                <p className="text-sm text-danger">Gagal memuat catatan</p>
            </div>
        );
    }

    return (
        <FadeIn>
            <div className="space-y-5">
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Catatan</h3>
                        <p className="text-xs text-neutral-500">{meta?.total ?? 0} catatan</p>
                    </div>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={3}
                        className="block w-full resize-none rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/30"
                        placeholder="Tulis catatan baru..."
                    />
                    <div className="mt-3 flex justify-end">
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleAdd}
                            disabled={!content.trim() || createNote.isPending}
                        >
                            {createNote.isPending ? 'Menyimpan...' : 'Tambah Catatan'}
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse rounded-xl border border-neutral-200 bg-white p-4">
                                <div className="h-3 w-1/4 rounded bg-neutral-200" />
                                <div className="mt-2 h-4 w-3/4 rounded bg-neutral-100" />
                            </div>
                        ))}
                    </div>
                ) : notes.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-10">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                            <svg className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        <p className="text-sm text-neutral-500">Belum ada catatan</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notes.map((note) => (
                            <div key={note.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:border-neutral-300">
                                {editingNote?.id === note.id ? (
                                    <div>
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            rows={3}
                                            className="block w-full resize-none rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/30"
                                        />
                                        <div className="mt-3 flex justify-end gap-2">
                                            <Button type="button" size="sm" variant="secondary" onClick={() => setEditingNote(null)}>
                                                Batal
                                            </Button>
                                            <Button type="button" size="sm" onClick={handleSaveEdit} disabled={!editContent.trim() || updateNote.isPending}>
                                                {updateNote.isPending ? 'Menyimpan...' : 'Simpan'}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-start justify-between gap-4">
                                            <p className="flex-1 whitespace-pre-wrap text-sm text-neutral-700">{note.content}</p>
                                            <div className="flex shrink-0 items-center gap-1">
                                                <button
                                                    onClick={() => handleEdit(note)}
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-primary"
                                                    title="Edit"
                                                >
                                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(note)}
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-light hover:text-danger"
                                                    title="Hapus"
                                                >
                                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center gap-3 border-t border-neutral-100 pt-3">
                                            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                </svg>
                                                {note.user?.name ?? 'System'}
                                            </div>
                                            <span className="text-xs text-neutral-400">{timeAgo(note.created_at)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {meta && meta.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-2">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage(page - 1)}
                                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                    Prev
                                </button>
                                <span className="text-sm text-neutral-500">
                                    {meta.current_page} / {meta.last_page}
                                </span>
                                <button
                                    disabled={page >= meta.last_page}
                                    onClick={() => setPage(page + 1)}
                                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </FadeIn>
    );
}
