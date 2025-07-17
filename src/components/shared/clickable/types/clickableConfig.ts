import { ClickableType } from "@/lib/types/clickable";

export interface BaseConfig {
  clickableType: ClickableType;
}

export interface CollectionTabConfig extends BaseConfig {
  clickableType: ClickableType.CollectionTab;
  active: boolean;
}

export interface ProfileCtaConfig extends BaseConfig {
  clickableType: ClickableType.ProfileCTA;
}
