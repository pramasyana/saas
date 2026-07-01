import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import Button from '@/atoms/Button';

interface VerificationSuccessProps {
    title: string;
    message: string;
    loginUrl?: string;
}

export default function VerificationSuccess({ title, message, loginUrl = '/admin/login' }: VerificationSuccessProps) {
    return (
        <>
            <Head title={title} />
            <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
                <div className="w-full max-w-md animate-[fade-up_0.6s_ease-out]">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success-light">
                            <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-neutral-900">{title}</h1>
                        <p className="mt-2 text-sm text-neutral-500">{message}</p>
                        <Link href={loginUrl} className="mt-6 inline-block">
                            <Button>Login Sekarang</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
