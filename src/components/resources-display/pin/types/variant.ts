import { Pagination } from '@/lib/types/pagination';
import { IntegrationPlatform } from '../../types/integration-platform';
import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';

export type VariantType = (typeof VARIANTS)[number];

export const VARIANTS = [
  'link',
  'text',
  'title',
  'image',
  'video',
  'download',
  'integration',
] as const;

export interface Variant {
  id: string;
  order: string;
  config: VariantConfig;
}

export interface PaginatedVariants {
  data: Variant[];
  pagination: Pagination;
}

export type VariantConfig =
  | TextConfig
  | TitleConfig
  | LinkConfig
  | ImageConfig
  | VideoConfig
  | DownloadConfig
  | IntegrationConfig;

interface BaseConfig {
  type: VariantType;
}

// Variant configs
export interface ImageConfig extends BaseConfig {
  type: 'image';
  src: string;
}

export interface VideoConfig extends BaseConfig {
  type: 'video';
  src: string;
}

export interface IntegrationConfig extends BaseConfig {
  type: 'integration';
  embedConfig: {
    platform: IntegrationPlatform;
    url: string;
    html?: string;
  };
}

export interface TextConfig extends TextBasedConfig {
  type: 'text';
}

export interface TitleConfig extends TextBasedConfig {
  type: 'title';
}

export interface LinkConfig extends BaseConfig {
  type: 'link';
  href: string;
  iconConfig: IconConfig;
  content: string;
}

export interface DownloadConfig extends BaseConfig {
  type: 'download';
  src: string;
  iconConfig: IconConfig;
  content: string;
}

// Shared configs
export interface TextBasedConfig extends BaseConfig {
  type: 'text' | 'title';
  content: string;
}
