import { Head, Link } from '@inertiajs/react';
import Button from '@/atoms/Button';

export default function VerificationNotice() {
    return (
        <>
            <Head title="Cek Email Anda" />
            <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
                <div className="w-full max-w-md animate-[fade-up_0.6s_ease-out]">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.039a2.25 2.25 0 012.134 0l7.5 4.039a2.25 2.25 0 011.183 1.98V19.5z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-neutral-900">
                            Cek Email Anda
                        </h1>
                        <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                            Kami telah mengirimkan email verifikasi ke alamat email Anda.
                            Silakan klik tautan di email tersebut untuk mengaktifkan akun Anda.
                        </p>
                        <p className="mt-3 text-xs text-neutral-400">
                            Tidak menerima email? Periksa folder spam atau
                            {' '}
                            <button
                                type="button"
                                className="font-semibold text-primary hover:text-primary-dark transition-colors"
                                onClick={() => {
                                    /* TODO: resend verification */
                                }}
                            >
                                kirim ulang
                            </button>
                            .
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-3">
                            <Link href="/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                            <Link href="/">
                                <Button variant="secondary">Ke Beranda</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
