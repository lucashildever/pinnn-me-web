import { ActiveTabData } from '@/components/tabs-display/types/collectionTab';

export type ClickableConfig =
  | CollectionTabConfig
  | CollectionTabOverlayConfig
  | UtilityButtonConfig
  | CallToActionConfig;

export type TabClick = (tabData: ActiveTabData) => void;

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

export interface CallToActionConfig {
  clickableType: 'call-to-action';
  link: string;
}

export interface UtilityButtonConfig {
  clickableType: 'mural-options';
  // I may need to add more properties here in the future
}
