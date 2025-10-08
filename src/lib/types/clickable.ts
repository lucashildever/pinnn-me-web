import { AppIcon } from '@/components/shared/icon-renderer/icon/types/icon';

export interface Clickable {
  content?: string;
  iconConfig: IconConfig;
}

export enum ClickableType {
  COLLECTION_TAB = 'collection-tab',
  COLLECTION_TAB_OVERLAY = 'collectionTab-overlay',
  MURAL_CTA = 'mural-cta',
  MURAL_OPTIONS = 'mural-options',
  MURAL_THEME = 'mural-theme',
}

export type IconConfig =
  | { type: IconType.NONE }
  | { type: IconType.PREDEFINED; icon: AppIcon }
  | { type: IconType.CUSTOM; url: string }
  | { type: IconType.EMOJI; unicode: string };

export enum IconType {
  NONE = 'none',
  PREDEFINED = 'predefined',
  CUSTOM = 'custom',
  EMOJI = 'emoji',
}
