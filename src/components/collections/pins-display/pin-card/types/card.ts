import { PredefinedIcon } from "@/lib/types/predefinedIcon";
import { CardVariant } from "./cardVariant";

export interface ICard {
  id: string;
  order: string;
  caption: string;
  cardConfig: CardConfig;
}

export type CardConfig =
  | { variant: CardVariant.IMAGE; imageSrc: string }
  | { variant: CardVariant.LINK; icon: CardIconConfig; href: string };

export type CardIconConfig =
  | { type: "custom"; src: string }
  | { type: "predefined"; icon: PredefinedIcon };
