'use client';

import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDragOrder } from '@/hooks/useDrag';
import { tools } from '@/lib/tools-data';
import ToolCard from './ToolCard';

function SortableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const tool = tools.find((t) => t.slug === id);
  if (!tool) return null;

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} {...attributes} {...listeners}>
      <ToolCard tool={tool} />
    </div>
  );
}

export default function ToolGrid() {
  const sensors = useSensors(useSensor(PointerSensor));
  const ids = tools.map((t) => t.slug);
  const { orderedIds, move, reset } = useDragOrder(ids, 'np:toolOrder');

  return (
    <section>
      <div className="mb-3 flex justify-between">
        <h2 className="text-xl font-semibold">All Tools</h2>
        <button className="rounded-full border border-slate-300/50 px-3 py-1 text-sm" onClick={reset}>Reset Layout</button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (!over || active.id === over.id) return;
          move(String(active.id), String(over.id));
        }}
      >
        <SortableContext items={orderedIds} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {orderedIds.map((id) => <SortableItem key={id} id={id} />)}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}
