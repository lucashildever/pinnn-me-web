'use client';

import ImageVariant from './variants/image-variant/ImageVariant';
import LinkVariant from './variants/link-variant/LinkVariant';

import { CardVariant } from './types/cardVariant';
import { CardConfig } from './types/card';
import { IconType } from '@/lib/types/clickable';

import styles from './pin-card.module.scss';

interface CardProps {
  caption: string;
  notFirstCard: boolean;
  cardConfig: CardConfig;
}

export default function PinCard({
  caption,
  cardConfig,
  notFirstCard,
}: CardProps) {
  switch (cardConfig.variant) {
    case CardVariant.IMAGE:
      return (
        <>
          {notFirstCard && <span className={styles['pin-line']} />}
          <ImageVariant caption={caption} />
        </>
      );
    case CardVariant.LINK:
      return (
        <>
          {notFirstCard && <span className={styles['pin-line']} />}
          <LinkVariant
            caption={caption}
            meta="www.google.com" // precisa vir do backend
            iconConfig={{ type: IconType.CUSTOM, url: 'string' }} // precisa vir do backend
          />
        </>
      );
    default:
      return <>invalid variant</>;
  }
}
