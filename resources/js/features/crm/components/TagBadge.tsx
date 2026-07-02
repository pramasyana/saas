import { cn } from '@/lib/utils';
import type { Tag } from '@/features/crm/types';

interface TagBadgeProps {
    tag: Tag;
    onRemove?: (tag: Tag) => void;
    className?: string;
}

export default function TagBadge({ tag, onRemove, className }: TagBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                className,
            )}
            style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
        >
            {tag.name}
            {onRemove && (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onRemove(tag); }}
                    className="ml-0.5 inline-flex rounded-full p-0.5 transition-colors hover:bg-black/10"
                    title={`Hapus tag ${tag.name}`}
                >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </span>
    );
}
