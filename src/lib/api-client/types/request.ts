import { Pin } from '@/components/resources-display/pin/types/pin';
import { CollectionTab } from '@/components/tabs-display/types/collectionTab';

export interface FetcherOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  token?: string;
  queryParams?: Record<string, string | boolean>;
}

// Mural
export interface CreateMuralRequest {
  name: string;
  displayName: string;
  description?: string;
}

export interface MuralRequest {
  muralName: string;
  getMainCollectionResources: boolean;
}

// Collections
export interface CreateCollectionRequest extends Omit<CollectionTab, 'order'> {
  muralId: string;
}

// Pins
export interface CreatePinRequest extends Omit<Pin, 'id' | 'order' | 'cards'> {}
