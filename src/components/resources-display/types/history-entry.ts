import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';

export interface HistoryEntry {
  order: number;
  sourceMuralId: string;
  muralName: string;
  preview: EntryPreview;
}

export type EntryPreview =
  | { type: 'icon'; icon: IconConfig }
  | { type: 'image'; url: string }
  | { type: 'none' };
