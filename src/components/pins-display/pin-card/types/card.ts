import { IconConfig } from '@/lib/types/clickable';

export interface Card {
  id: string;
  order: string;
  caption: string;
  cardConfig: CardConfig;
}

export type CardConfig =
  | { variant: 'link'; iconConfig: IconConfig; href: string }
  | { variant: 'download'; iconConfig: IconConfig }
  | { variant: 'image'; imageSrc: string }
  | { variant: 'integration' };
