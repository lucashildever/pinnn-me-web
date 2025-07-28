import { CardVariant } from "@/components/collections/pins-display/pin-card/types/cardVariant";
import { PredefinedIcon } from "@/lib/types/predefinedIcon";

export interface CardPayload {
  variantType: CardVariant;
  notFirstCard?: boolean;
  variantPayload: VariantPayload;
}

export interface CardData extends CardPayload {
  caption: string;
}

// card variants
export interface LinkVariantPayload {
  customIconSrc?: string;
  iconType?: PredefinedIcon;
  url: string;
}

export interface ImageVariantPayload {
  imageSrc: string;
}

export type VariantPayload = LinkVariantPayload | ImageVariantPayload;
