import { Clickable } from '@/components/shared/clickable/types/clickable';

export interface CollectionTab {
  id: string;
  order: string;
  isMain: boolean;
  displayElement: Clickable;
}

export type ActiveTabData = Omit<CollectionTab, 'order' | 'isMain'>;
