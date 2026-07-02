import Button from '@/atoms/Button';
import type { User } from '@/features/users/types';

interface UserDeleteDialogProps {
    open: boolean;
    user: User;
    deleting: boolean;
    error?: string;
    onClose: () => void;
    onConfirm: () => void;
}

export default function UserDeleteDialog({ open, user, deleting, error, onClose, onConfirm }: UserDeleteDialogProps) {
    if (!open) {
return null;
}

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm animate-[fade-up_0.3s_ease-out] rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-danger-light">
                    <svg className="h-7 w-7 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>

                <h3 className="mb-1 text-center text-lg font-semibold text-neutral-900">
                    Hapus User
                </h3>
                <p className="mb-6 text-center text-sm text-neutral-600">
                    Apakah Anda yakin ingin menghapus <strong className="text-neutral-900">{user.name}</strong>?
                    <br />
                    Tindakan ini tidak dapat dibatalkan.
                </p>

                {error && (
                    <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-danger-light px-4 py-3 text-sm text-danger">
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        {error}
                    </div>
                )}

                <div className="flex justify-center gap-3">
                    <Button variant="secondary" onClick={onClose} disabled={deleting}>
                        Batal
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={deleting}
                        className="bg-danger text-white hover:bg-danger"
                    >
                        {deleting ? (
                            <span className="flex items-center gap-2">
                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Menghapus...
                            </span>
                        ) : 'Hapus'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
