import { PredefinedIcon } from "./predefinedIcon";

export interface IClickable {
  content: string;
  iconConfig: IconConfig;
}

export type IconConfig =
  | { type: "none" }
  | { type: "predefined"; icon: PredefinedIcon }
  | { type: "custom"; url: string }
  | { type: "emoji"; unicode: string };

export enum ClickableType {
  CollectionTab = "collectionTab",
  CollectionTabOverlay = "collectionTabOverlay",
  ProfileCTA = "profileCTA",
}
