import { useState } from 'react';
import Select from '@/atoms/Select';
import { useTags } from '@/features/crm/hooks/useTags';
import type { Tag } from '@/features/crm/types';
import TagBadge from './TagBadge';

interface TagListProps {
    tags: Tag[];
    onAddTag: (tagId: string) => void;
    onRemoveTag: (tag: Tag) => void;
    isLoading?: boolean;
}

export default function TagList({ tags, onAddTag, onRemoveTag, isLoading }: TagListProps) {
    const [showSelector, setShowSelector] = useState(false);

    const { data: allTagsData } = useTags({ per_page: 100, is_active: true });
    const allTags = allTagsData?.data ?? [];

    const availableTags = allTags.filter(
        (t) => !tags.some((ut) => ut.id === t.id),
    );

    const tagOptions = availableTags.map((t) => ({
        value: t.id,
        label: t.name,
    }));

    if (isLoading) {
        return (
            <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-6 w-16 animate-pulse rounded-full bg-neutral-200" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} onRemove={onRemoveTag} />
            ))}
            {showSelector ? (
                <div className="flex items-center gap-2">
                    <div className="min-w-[180px]">
                        <Select
                            value=""
                            onChange={(v) => {
                                if (v) {
                                    onAddTag(v);
                                }
                            }}
                            options={tagOptions}
                            placeholder="Pilih tag..."
                            searchable
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowSelector(false)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setShowSelector(true)}
                    className="inline-flex items-center gap-1 rounded-full border border-dashed border-neutral-300 px-2.5 py-0.5 text-xs font-medium text-neutral-500 transition-colors hover:border-primary hover:text-primary"
                >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Tambah Tag
                </button>
            )}
        </div>
    );
}
