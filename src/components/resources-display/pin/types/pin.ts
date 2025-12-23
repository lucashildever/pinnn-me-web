import { Pagination } from '@/lib/types/pagination';
import { EntryPreview, HistoryEntry } from '../../types/history-entry';
import { PaginatedVariants } from './variant';

export interface Pin {
  id: string;
  meta: PinMeta;
  order: string | null;
  variants: PaginatedVariants;
}

export interface PinsData {
  data: Pin[];
  pagination: Pagination;
}

export interface PinMeta {
  history: HistoryEntry[];
  ownerPreview: EntryPreview;
  firstPinId: string | null;
  sharedPinId: string | null;
  inheritedVariantsTotal: number | null;
}
