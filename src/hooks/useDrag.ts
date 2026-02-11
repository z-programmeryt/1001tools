'use client';

import { useMemo, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

export function useDragOrder(ids: string[], storageKey: string) {
  const [order, setOrder] = useState<string[]>(() => {
    if (typeof window === 'undefined') return ids;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : ids;
  });

  const orderedIds = useMemo(() => {
    const safe = order.filter((id) => ids.includes(id));
    return [...safe, ...ids.filter((id) => !safe.includes(id))];
  }, [order, ids]);

  const move = (activeId: string, overId: string) => {
    const oldIndex = orderedIds.indexOf(activeId);
    const newIndex = orderedIds.indexOf(overId);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(orderedIds, oldIndex, newIndex);
    setOrder(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  return { orderedIds, move, reset: () => { localStorage.removeItem(storageKey); setOrder(ids); } };
}
