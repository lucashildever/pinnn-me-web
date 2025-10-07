'use client';

import ImageVariant from './variants/image-variant/ImageVariant';
import LinkVariant from './variants/link-variant/LinkVariant';

import { CardVariant } from './types/cardVariant';
import { CardConfig } from './types/card';

import styles from './pin-card.module.scss';
import DownloadVariant from './variants/download-variant/DownloadVariant';

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
  //console.log('cardConfig do PinCard', cardConfig);
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
            iconConfig={cardConfig.iconConfig}
          />
        </>
      );
    case CardVariant.DOWNLOAD:
      return (
        <>
          {notFirstCard && <span className={styles['pin-line']} />}
          <DownloadVariant
            caption={caption}
            meta="nome_do_arquivo.rar" // precisa vir do backend
            iconConfig={cardConfig.iconConfig}
          />
        </>
      );
    default:
      return <>invalid variant</>;
  }
}
