import { ActiveTabData } from "@/components/collections/tabs-display/types/collectionTab";
import { ClickableType } from "@/lib/types/clickable";

export type TabClick = (tabData: ActiveTabData) => void;

// Clickable configs
export interface CollectionTabConfig {
  clickableType: ClickableType.CollectionTab;
  tabId: string;
  active: boolean;
  tabClick: TabClick;
  ref?: React.Ref<HTMLDivElement>;
}

export interface OverlayTabDisplayConfig {
  visible: boolean;
  position: "left" | "right";
}

export interface CollectionTabOverlayConfig {
  clickableType: ClickableType.CollectionTabOverlay;
  displayConfig: OverlayTabDisplayConfig;
}

export interface ProfileCtaConfig {
  clickableType: ClickableType.ProfileCTA;
}

export type ClickableConfig =
  | CollectionTabConfig
  | CollectionTabOverlayConfig
  | ProfileCtaConfig;
