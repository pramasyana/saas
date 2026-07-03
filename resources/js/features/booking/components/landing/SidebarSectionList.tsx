import {
    DndContext,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    useDraggable
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
    visibleSections: string[];
    availableSections: string[];
    sectionLabels: Record<string, string>;
    selectedSection: string | null;
    onSelect: (key: string) => void;
    onRemove: (key: string) => void;
    onAdd: (key: string, insertAt?: number) => void;
    onReorder: (newOrder: string[]) => void;
}

const pinned = ['hero', 'footer'];

function PinnedItem({
    label,
    isSelected,
    onSelect,
}: {
    label: string;
    isSelected: boolean;
    onSelect: () => void;
}) {
    return (
        <div
            className={cn(
                'flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm transition-all',
                isSelected ? 'bg-primary-50 text-primary font-medium' : 'text-neutral-500',
            )}
        >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-neutral-300">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
            </span>
            <button type="button" onClick={onSelect} className="flex-1 truncate text-left">
                {label}
            </button>
        </div>
    );
}

function SortableActiveItem({
    sectionKey,
    label,
    isSelected,
    onSelect,
    onRemove,
    canRemove,
}: {
    sectionKey: string;
    label: string;
    isSelected: boolean;
    onSelect: () => void;
    onRemove: () => void;
    canRemove: boolean;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sectionKey });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm transition-all',
                isDragging ? 'opacity-40 shadow-lg' : '',
                isSelected ? 'bg-primary-50 text-primary font-medium' : 'text-neutral-700 hover:bg-neutral-100',
            )}
        >
            <button
                type="button"
                {...attributes}
                {...listeners}
                className="flex h-5 w-5 shrink-0 cursor-grab items-center justify-center rounded text-neutral-400 hover:text-neutral-600 active:cursor-grabbing"
            >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm8-16a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
                </svg>
            </button>

            <button type="button" onClick={onSelect} className="flex-1 truncate text-left">
                {label}
            </button>

            {canRemove && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}

                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-neutral-400 hover:bg-danger hover:text-white"
                >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}

function DraggableAvailableItem({
    sectionKey,
    label,
}: {
    sectionKey: string;
    label: string;
}) {
    const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({ id: `available-${sectionKey}` });
    const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                'flex cursor-grab items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 active:cursor-grabbing',
                isDragging && 'z-50 rounded-lg bg-white opacity-40 shadow-lg',
            )}
        >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center text-neutral-400">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </span>
            {label}
        </div>
    );
}

export default function SidebarSectionList({
    visibleSections,
    availableSections,
    sectionLabels,
    selectedSection,
    onSelect,
    onRemove,
    onAdd,
    onReorder,
}: Props) {
    const [showAvailable, setShowAvailable] = useState(true);

    const hasHero = visibleSections.includes('hero');
    const hasFooter = visibleSections.includes('footer');
    const middleSections = visibleSections.filter((k) => !pinned.includes(k));

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const activeId = String(active.id);

        if (activeId.startsWith('available-')) {
            const sectionKey = activeId.replace('available-', '');
            const overId = String(over.id);
            const overIndex = visibleSections.indexOf(overId);

            onAdd(sectionKey, overIndex !== -1 ? overIndex : undefined);

            return;
        }

        const oldIndex = middleSections.indexOf(activeId);
        const newIndex = middleSections.indexOf(String(over.id));

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            const reordered = [...middleSections];
            reordered.splice(oldIndex, 1);
            reordered.splice(newIndex, 0, activeId);

            const newOrder: string[] = [];

            if (hasHero) {
                newOrder.push('hero');
            }

            newOrder.push(...reordered);

            if (hasFooter) {
                newOrder.push('footer');
            }

            onReorder(newOrder);
        }
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
                    <h3 className="text-xs font-semibold tracking-wider text-neutral-500">BAGIAN</h3>
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                        {visibleSections.length}/{visibleSections.length + availableSections.length}
                    </span>
                </div>

                <div className="divide-y divide-neutral-100 p-2">
                    {/* Hero — always pinned at top */}
                    {hasHero && (
                        <PinnedItem
                            label={sectionLabels.hero || 'Hero'}
                            isSelected={selectedSection === 'hero'}
                            onSelect={() => onSelect('hero')}
                        />
                    )}

                    {/* Sortable middle sections */}
                    {middleSections.length === 0 && !hasHero && !hasFooter ? (
                        <p className="px-2 py-4 text-center text-xs text-neutral-400">
                            Belum ada bagian. Tambah dari daftar di bawah.
                        </p>
                    ) : (
                        <SortableContext items={middleSections} strategy={verticalListSortingStrategy}>
                            <div className="divide-y divide-neutral-100">
                                {middleSections.map((key) => (
                                    <SortableActiveItem
                                        key={key}
                                        sectionKey={key}
                                        label={sectionLabels[key] || key}
                                        isSelected={selectedSection === key}
                                        onSelect={() => onSelect(key)}
                                        onRemove={() => onRemove(key)}
                                        canRemove={true}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    )}

                    {/* Footer — always pinned at bottom */}
                    {hasFooter && (
                        <PinnedItem
                            label={sectionLabels.footer || 'Footer'}
                            isSelected={selectedSection === 'footer'}
                            onSelect={() => onSelect('footer')}
                        />
                    )}
                </div>

                {availableSections.length > 0 && (
                    <>
                        <button
                            type="button"
                            onClick={() => setShowAvailable(!showAvailable)}
                            className="flex w-full items-center justify-between border-t border-neutral-200 px-4 py-2.5 text-left transition-colors hover:bg-neutral-50"
                        >
                            <span className="text-xs font-semibold tracking-wider text-neutral-500">
                                TAMBAH BAGIAN
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                                    {availableSections.length}
                                </span>
                                <svg
                                    className={cn('h-3 w-3 text-neutral-400 transition-transform', showAvailable && 'rotate-180')}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                        </button>
                        {showAvailable && (
                            <div className="grid grid-cols-2 gap-0.5 p-2 pt-0">
                                {availableSections.map((key) => (
                                    <DraggableAvailableItem
                                        key={key}
                                        sectionKey={key}
                                        label={sectionLabels[key] || key}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </DndContext>
    );
}
