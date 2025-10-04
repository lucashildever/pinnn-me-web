'use client';

import ImageVariant from './variants/image-variant/ImageVariant';
import LinkVariant from './variants/link-variant/LinkVariant';

import styles from './pin-card.module.scss';
import { CardVariant } from './types/cardVariant';
import { CardConfig } from './types/card';

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
            // need refactoring
            cardIconConfig={{ type: 'custom', src: 'string' }}
          />
        </>
      );
    default:
      return <>invalid variant</>;
  }
}
