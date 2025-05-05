export interface CardPayload {
  variantType: CardVariant;
  notFirstCard?: boolean;
  variantPayload: VariantPayload;
}

export interface CardData extends CardPayload {
  caption: string;
}

// card variants
export enum CardVariant {
  Image = "image",
  Link = "link",
}

export interface LinkVariantPayload {
  customIconSrc?: string;
  iconType?: IconType;
  url: string;
}

export interface ImageVariantPayload {
  imageSrc: string;
}

export type VariantPayload = LinkVariantPayload | ImageVariantPayload;

//
export enum IconType {
  X = "x",
  TikTok = "tiktok",
  Twitch = "twitch",
  Youtube = "youtube",
  Facebook = "facebook",
  LinkedIn = "linkedin",
  Pinterest = "pinterest",
  Instagram = "instagram",
}
