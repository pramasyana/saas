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
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/30" onClick={onClose} />
            <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-light">
                    <svg className="h-6 w-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>

                <h3 className="mb-2 text-center text-lg font-semibold text-neutral-900">
                    Hapus User
                </h3>
                <p className="mb-6 text-center text-sm text-neutral-600">
                    Apakah Anda yakin ingin menghapus <strong>{user.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                </p>

                {error && (
                    <div className="mb-4 rounded-lg bg-danger-light px-4 py-3 text-center text-sm text-danger">
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
                        className="bg-danger text-white hover:bg-red-700"
                    >
                        {deleting ? 'Menghapus...' : 'Hapus'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
