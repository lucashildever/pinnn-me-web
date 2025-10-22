'use client';

import DownloadVariant from './variants/download-variant/DownloadVariant';
import ImageVariant from './variants/image-variant/ImageVariant';
import LinkVariant from './variants/link-variant/LinkVariant';

import { CardConfig } from './types/card';

import styles from './pin-card.module.scss';
import IntegrationVariant from './variants/integration-variant/IntegrationVariant';

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
    case 'image':
      return (
        <>
          {notFirstCard && <span className={styles['pin-line']} />}
          <ImageVariant caption={caption} />
        </>
      );
    case 'link':
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
    case 'download':
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
    case 'integration':
      return (
        <>
          {notFirstCard && <span className={styles['pin-line']} />}
          <IntegrationVariant
            caption={caption}
            embedConfig={cardConfig.embedConfig}
          />
        </>
      );
    default:
      return <>invalid variant</>;
  }
}
