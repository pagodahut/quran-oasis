'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { BookOpen, Calendar, Star, GripVertical } from 'lucide-react';

// ============================================
// Types
// ============================================

export type KanbanStatus = 'not-started' | 'learning' | 'reviewing' | 'mastered';

export interface KanbanCard {
  id: string;
  surahName: string;
  surahNumber: number;
  ayahRange: string;
  lastPracticed: string | null;
  confidence: number; // 0-100
  status: KanbanStatus;
}

interface KanbanColumnDef {
  id: KanbanStatus;
  title: string;
  color: string;
  darkColor: string;
}

const COLUMNS: KanbanColumnDef[] = [
  { id: 'not-started', title: 'Not Started', color: 'rgba(148,163,184,0.15)', darkColor: 'rgba(148,163,184,0.1)' },
  { id: 'learning', title: 'Learning', color: 'rgba(59,130,246,0.12)', darkColor: 'rgba(59,130,246,0.15)' },
  { id: 'reviewing', title: 'Reviewing', color: 'rgba(245,158,11,0.12)', darkColor: 'rgba(245,158,11,0.15)' },
  { id: 'mastered', title: 'Mastered', color: 'rgba(34,197,94,0.12)', darkColor: 'rgba(34,197,94,0.15)' },
];

// ============================================
// Sortable Card
// ============================================

function SortableCard({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <KanbanCardView card={card} isDragging={isDragging} dragListeners={listeners} />
    </div>
  );
}

function KanbanCardView({
  card,
  isDragging = false,
  dragListeners,
}: {
  card: KanbanCard;
  isDragging?: boolean;
  dragListeners?: Record<string, unknown>;
}) {
  const confidenceColor =
    card.confidence >= 80
      ? 'text-green-500'
      : card.confidence >= 50
        ? 'text-amber-500'
        : 'text-red-400';

  return (
    <motion.div
      layout
      className={cn(
        'group relative rounded-xl p-3 mb-2',
        'backdrop-blur-[12px]',
        'bg-white/60 dark:bg-[rgba(22,27,34,0.65)]',
        'border border-black/[0.05] dark:border-white/[0.07]',
        'shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.15)]',
        'transition-all duration-150',
        isDragging && 'opacity-50 scale-95',
        !isDragging && 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]',
      )}
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-0.5 cursor-grab active:cursor-grabbing text-night-400 dark:text-night-500 opacity-0 group-hover:opacity-100 transition-opacity"
          {...dragListeners}
        >
          <GripVertical size={14} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={12} className="text-gold-500 flex-shrink-0" />
            <span className="text-sm font-semibold text-night-800 dark:text-night-100 truncate">
              {card.surahName}
            </span>
          </div>
          <p className="text-xs text-night-500 dark:text-night-400 mb-2">
            Ayahs {card.ayahRange}
          </p>
          <div className="flex items-center justify-between">
            {card.lastPracticed ? (
              <span className="flex items-center gap-1 text-[10px] text-night-400 dark:text-night-500">
                <Calendar size={10} />
                {card.lastPracticed}
              </span>
            ) : (
              <span className="text-[10px] text-night-400 dark:text-night-500 italic">Not yet practiced</span>
            )}
            <span className={cn('flex items-center gap-0.5 text-[10px] font-medium', confidenceColor)}>
              <Star size={10} />
              {card.confidence}%
            </span>
          </div>
          {/* Confidence bar */}
          <div className="mt-2 h-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                card.confidence >= 80
                  ? 'bg-green-500'
                  : card.confidence >= 50
                    ? 'bg-amber-500'
                    : 'bg-red-400',
              )}
              style={{ width: `${card.confidence}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Column
// ============================================

function KanbanColumn({ column, cards }: { column: KanbanColumnDef; cards: KanbanCard[] }) {
  return (
    <div className="flex-shrink-0 w-72 sm:w-80">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-night-700 dark:text-night-200">{column.title}</h3>
        <span className="text-xs text-night-400 dark:text-night-500 bg-black/[0.04] dark:bg-white/[0.06] px-2 py-0.5 rounded-full">
          {cards.length}
        </span>
      </div>
      <div
        className="rounded-2xl p-2 min-h-[200px]"
        style={{ backgroundColor: column.color }}
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence>
            {cards.map((card) => (
              <SortableCard key={card.id} card={card} />
            ))}
          </AnimatePresence>
          {cards.length === 0 && (
            <div className="flex items-center justify-center h-24 text-xs text-night-400 dark:text-night-500 italic">
              Drop items here
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}

// ============================================
// Main Board
// ============================================

interface KanbanBoardProps {
  initialCards?: KanbanCard[];
  className?: string;
}

// Demo data
const DEMO_CARDS: KanbanCard[] = [
  { id: '1', surahName: 'Al-Fatiha', surahNumber: 1, ayahRange: '1-7', lastPracticed: '2 hours ago', confidence: 95, status: 'mastered' },
  { id: '2', surahName: 'Al-Baqarah', surahNumber: 2, ayahRange: '1-20', lastPracticed: '1 day ago', confidence: 72, status: 'reviewing' },
  { id: '3', surahName: 'Al-Baqarah', surahNumber: 2, ayahRange: '21-40', lastPracticed: '3 days ago', confidence: 45, status: 'learning' },
  { id: '4', surahName: 'Al-Imran', surahNumber: 3, ayahRange: '1-30', lastPracticed: null, confidence: 0, status: 'not-started' },
  { id: '5', surahName: 'An-Nisa', surahNumber: 4, ayahRange: '1-25', lastPracticed: null, confidence: 0, status: 'not-started' },
  { id: '6', surahName: 'Al-Mulk', surahNumber: 67, ayahRange: '1-30', lastPracticed: '5 hours ago', confidence: 88, status: 'reviewing' },
  { id: '7', surahName: 'Ya-Sin', surahNumber: 36, ayahRange: '1-20', lastPracticed: '12 hours ago', confidence: 60, status: 'learning' },
  { id: '8', surahName: 'Ar-Rahman', surahNumber: 55, ayahRange: '1-30', lastPracticed: '1 week ago', confidence: 92, status: 'mastered' },
];

export default function KanbanBoard({ initialCards, className }: KanbanBoardProps) {
  const [cards, setCards] = useState<KanbanCard[]>(initialCards || DEMO_CARDS);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const activeCard = activeId ? cards.find((c) => c.id === activeId) : null;

  const getColumnCards = useCallback(
    (status: KanbanStatus) => cards.filter((c) => c.status === status),
    [cards],
  );

  function findColumnForCard(cardId: string): KanbanStatus | undefined {
    return cards.find((c) => c.id === cardId)?.status;
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeCardId = String(active.id);
    const overId = String(over.id);

    // Check if dropped on a column or another card
    const overColumn = COLUMNS.find((c) => c.id === overId);
    const overCardColumn = findColumnForCard(overId);
    const targetColumn = overColumn?.id || overCardColumn;

    if (!targetColumn) return;

    setCards((prev) => {
      const activeIndex = prev.findIndex((c) => c.id === activeCardId);
      if (activeIndex === -1) return prev;

      const updated = [...prev];
      updated[activeIndex] = { ...updated[activeIndex], status: targetColumn };

      // If dropped on another card, reorder within column
      if (!overColumn && overId !== activeCardId) {
        const overIndex = updated.findIndex((c) => c.id === overId);
        if (overIndex !== -1) {
          return arrayMove(updated, activeIndex, overIndex);
        }
      }

      return updated;
    });
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-night-800 dark:text-night-100">Memorization Progress</h2>
        <p className="text-sm text-night-500 dark:text-night-400">Drag cards between columns to update your progress</p>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory md:snap-none">
          {COLUMNS.map((col) => (
            <KanbanColumn key={col.id} column={col} cards={getColumnCards(col.id)} />
          ))}
        </div>
        <DragOverlay>
          {activeCard ? <KanbanCardView card={activeCard} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
