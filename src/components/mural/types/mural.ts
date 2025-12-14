import { Pagination } from '@/lib/types/pagination';
import { CollectionTab } from '../../tabs-display/types/collectionTab';
import { Pin } from '../../resources-display/types/resource';

export interface Mural {
  name: string;
  displayName: string;
  description: string;
  collectionTabs: CollectionTab[];
  mainCollectionPins?: {
    data: Pin[];
    pagination: Pagination;
  };
}
