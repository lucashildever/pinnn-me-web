import { ActiveTabData } from "@/components/collections/tabs-display/types/collectionTab";
import { ClickableType } from "@/lib/types/clickable";

export interface BaseConfig {
  clickableType: ClickableType;
}

export interface CollectionTabConfig extends BaseConfig {
  clickableType: ClickableType.CollectionTab;
  tabId: string;
  active: boolean;
  tabClick: TabClick;
  ref?: React.Ref<HTMLDivElement>;
}

export interface ProfileCtaConfig extends BaseConfig {
  clickableType: ClickableType.ProfileCTA;
}

export type TabClick = (tabData: ActiveTabData) => void;
