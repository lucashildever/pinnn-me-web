import { CardVariant } from './cardVariant';
import { IconConfig } from '@/lib/types/clickable';

export interface Card {
  id: string;
  order: string;
  caption: string;
  cardConfig: CardConfig;
}

export type CardConfig =
  | { variant: CardVariant.LINK; iconConfig: IconConfig; href: string }
  | { variant: CardVariant.DOWNLOAD; iconConfig: IconConfig }
  | { variant: CardVariant.IMAGE; imageSrc: string }
  | { variant: CardVariant.INTEGRATION };
