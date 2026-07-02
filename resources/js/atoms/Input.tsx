import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div>
                {label && (
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30',
                        error && 'border-danger focus:border-danger focus:ring-danger/30',
                        className,
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-xs text-danger">{error}</p>}
            </div>
        );
    },
);

Input.displayName = 'Input';

export default Input;
