import { Pagination } from '@/lib/types/pagination';
import { HistoryEntry } from '../../types/history-entry';
import { Variant } from './variant';

export interface Pin {
  id: string;
  meta: PinMeta;
  order: string | null;
  variants: {
    data: Variant[];
    pagination: Pagination;
  };
}

export interface PinsData {
  data: Pin[];
  pagination: Pagination;
}

export interface PinMeta {
  firstPinId: string | null;
  history: HistoryEntry[];
  inheritedVariantsTotal: number;
  sharedPinId: string | null;
}
