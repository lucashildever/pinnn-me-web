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

// Resources
export interface VariantIconConfig {
  type: 'none' | 'predefined' | 'custom' | 'emoji';
  icon?: string;
  url?: string;
  unicode?: string;
}

export type VariantConfigDto =
  | { type: 'title'; content: string }
  | { type: 'text'; content: string }
  | { type: 'image'; src: string; fileKey?: string }
  | { type: 'video'; src: string; fileKey?: string }
  | {
      type: 'link';
      content: string;
      src: string;
      iconConfig: VariantIconConfig;
    }
  | {
      type: 'download';
      content: string;
      src: string;
      iconConfig: VariantIconConfig;
      fileName: string;
      fileSize: number;
      fileKey?: string;
    };

export interface CreateVariantDto {
  order: string;
  config: VariantConfigDto;
}

export interface CreatePinResourceRequest {
  variants: CreateVariantDto[];
}
