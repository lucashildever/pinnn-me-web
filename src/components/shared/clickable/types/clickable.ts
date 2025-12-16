import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';

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
