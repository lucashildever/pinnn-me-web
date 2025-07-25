import { ActiveTabData } from "@/components/collections/tabs-display/types/collectionTab";
import { ClickableType } from "@/lib/types/clickable";

export type TabClick = (tabData: ActiveTabData) => void;

// Clickable configs
export interface CollectionTabConfig {
  clickableType: ClickableType.COLLECTION_TAB;
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
  clickableType: ClickableType.COLLECTION_TAB_OVERLAY;
  displayConfig: OverlayTabDisplayConfig;
}

export interface ProfileCtaConfig {
  clickableType: ClickableType.PROFILE_CTA;
  link: string;
}

export type ClickableConfig =
  | CollectionTabConfig
  | CollectionTabOverlayConfig
  | ProfileCtaConfig;
