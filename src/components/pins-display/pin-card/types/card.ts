import { IconConfig } from '@/lib/types/clickable';
import { EmbedConfig } from '../variants/integration-variant/types/embed';

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
  | { variant: 'integration'; embedConfig: EmbedConfig };
