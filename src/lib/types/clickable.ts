import { AppIcon } from '@/components/shared/icon-renderer/icon/types/icon';

export interface Clickable {
  content?: string;
  iconConfig: IconConfig;
}

const CLICKABLE_TYPES = {
  collectionTab: 'collection-tab',
  collectionTabOverlay: 'collectionTab-overlay',
  muralCta: 'mural-cta',
  muralOptions: 'mural-options',
  muralTheme: 'mural-theme',
} as const;

export type ClickableType =
  (typeof CLICKABLE_TYPES)[keyof typeof CLICKABLE_TYPES];

export type IconConfig =
  | { type: 'none' }
  | { type: 'predefined'; icon: AppIcon }
  | { type: 'custom'; url: string }
  | { type: 'emoji'; unicode: string };
