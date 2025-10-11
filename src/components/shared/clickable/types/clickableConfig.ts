import { ActiveTabData } from '@/components/tabs-display/types/collectionTab';
import { ClickableType } from '@/lib/types/clickable';

export type TabClick = (tabData: ActiveTabData) => void;

// Clickable configs

export type ClickableConfig =
  | CollectionTabConfig
  | CollectionTabOverlayConfig
  | UtilityButtonConfig
  | MuralCtaConfig;

export interface CollectionTabConfig {
  clickableType: 'collection-tab';
  tabId: string;
  active: boolean;
  tabClick: TabClick;
  ref?: React.Ref<HTMLDivElement>;
}

export interface OverlayTabDisplayConfig {
  visible: boolean;
  position: 'left' | 'right';
}

export interface CollectionTabOverlayConfig {
  clickableType: 'collection-tab-overlay';
  displayConfig: OverlayTabDisplayConfig;
}

export interface MuralCtaConfig {
  clickableType: 'mural-cta';
  link: string;
}

export interface UtilityButtonConfig {
  clickableType: 'mural-options' | 'mural-theme';
}
