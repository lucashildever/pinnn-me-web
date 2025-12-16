import { CardVariant } from '@/components/pins-display/pin-card/types/cardVariant';
import { AppIcon } from '@/components/shared/icon-renderer/icon/types/app-icon';

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
  iconType?: AppIcon;
  url: string;
}

export interface ImageVariantPayload {
  imageSrc: string;
}

export type VariantPayload = LinkVariantPayload | ImageVariantPayload;
