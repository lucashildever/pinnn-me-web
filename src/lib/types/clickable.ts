import { PredefinedIcon } from "./predefinedIcon";

export interface Clickable {
  content: string;
  iconConfig: IconConfig;
}

export type IconConfig =
  | { type: IconType.NONE }
  | { type: IconType.PREDEFINED; icon: PredefinedIcon }
  | { type: IconType.CUSTOM; url: string }
  | { type: IconType.EMOJI; unicode: string };

export enum ClickableType {
  COLLECTION_TAB = "collectionTab",
  COLLECTION_TAB_OVERLAY = "collectionTabOverlay",
  PROFILE_CTA = "profileCTA",
}

export enum IconType {
  NONE = "none",
  PREDEFINED = "predefined",
  CUSTOM = "custom",
  EMOJI = "emoji",
}
