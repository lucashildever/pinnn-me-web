import { ActiveTabData } from '@/components/tabs-display/types/collectionTab';
import { Clickable } from './clickable';

export type ClickableConfig =
  | CollectionTabConfig
  | CollectionTabOverlayConfig
  | UtilityButtonConfig
  | CallToActionConfig
  | CollectionSelectorConfig;

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
}

export interface CollectionSelectorConfig {
  clickableType: 'collection-selector';
  items: Array<{
    id: string;
    payload: Clickable;
  }>;
  onSelect: (id: string) => void;
}
