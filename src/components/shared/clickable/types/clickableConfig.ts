import { ActiveTabData } from "@/components/tabs-display/types/collectionTab";
import { ClickableType } from "@/lib/types/clickable";

export type TabClick = (tabData: ActiveTabData) => void;

// Clickable configs

export type ClickableConfig =
  | CollectionTabConfig
  | CollectionTabOverlayConfig
  | UtilityButtonConfig
  | MuralCtaConfig;

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

export interface MuralCtaConfig {
  clickableType: ClickableType.MURAL_CTA;
  link: string;
}

export interface UtilityButtonConfig {
  clickableType: ClickableType.MURAL_OPTIONS | ClickableType.MURAL_THEME;
}
