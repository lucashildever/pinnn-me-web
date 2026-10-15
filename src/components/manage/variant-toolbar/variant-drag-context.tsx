'use client';

import { createContext, useContext } from 'react';
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from '@dnd-kit/core';

/**
 * The props needed to turn an element into the drag handle of a sortable item.
 * Exposed by each SortableVariant so the variant's VariantToolbar can start the
 * drag from its handle without drilling the controls through every variant.
 */
export interface VariantDragHandle {
  listeners?: DraggableSyntheticListeners;
  attributes?: DraggableAttributes;
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
}

const VariantDragContext = createContext<VariantDragHandle | null>(null);

export const VariantDragProvider = VariantDragContext.Provider;

export function useVariantDragHandle(): VariantDragHandle | null {
  return useContext(VariantDragContext);
}
