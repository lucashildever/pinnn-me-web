import { IntegrationPlatform } from '../../types/integration-platform';

export type VariantType = (typeof VARIANTS)[number];

export const VARIANTS = [
  'link',
  'text',
  'title',
  'image',
  'download',
  'integration',
] as const;

export interface Variant {
  id: string;
  order: string;
  config: VariantConfig;
}

export type VariantConfig =
  | TextConfig
  | TitleConfig
  | LinkConfig
  | ImageConfig
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

export interface IntegrationConfig extends BaseConfig {
  type: 'integration';
  platform: IntegrationPlatform;
  embedUrl: string;
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
  icon: IconConfig;
}

export interface DownloadConfig extends BaseConfig {
  type: 'download';
  src: string;
  icon: IconConfig;
}

// Shared configs
export interface TextBasedConfig extends BaseConfig {
  type: 'text' | 'title';
  content: string;
}

export interface IconConfig {
  type: string;
  src?: string;
}
