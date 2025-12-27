import { CollectionTab } from '@/components/tabs-display/types/collectionTab';
import { MuralAppearance } from '@/components/mural/profile/types/appearance';
import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';

export interface CallToActionConfig {
  link: string;
  type: 'profile' | 'banner';
}

export interface CallToActionData {
  id: string;
  content: string;
  iconConfig: IconConfig;
  config: CallToActionConfig;
}

export interface MuralResponseData {
  id: string;
  displayName: string;
  description: string;
  collections: CollectionTab[];
  appearance: MuralAppearance;
  mainCollectionResources?: any;
  callToActions?: CallToActionData[];
}

export type FetcherResponse<T = any> = FetcherSuccess<T> | FetcherError;

export interface FetcherSuccess<T> {
  success: true;
  data: T;
}

export interface FetcherError {
  success: false;
  error: FetchError;
  message: string;
}

const FETCH_TYPES = {
  networkError: 'network-error',
  serverError: 'server-error',
  notFound: 'not-found',
  unauthorized: 'unauthorized',
  uploadError: 'upload-error',
} as const;

export type FetchError = (typeof FETCH_TYPES)[keyof typeof FETCH_TYPES];
