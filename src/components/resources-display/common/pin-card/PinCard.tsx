'use client';

import { Variant } from './types/variant';
import styles from './pin.module.scss';
import TextVariant from './variants/text-variant/TextVariant';
import TitleVariant from './variants/title-variant/TitleVariant';
import LinkVariant from './variants/link-variant/LinkVariant';
import ImageVariant from './variants/image-variant/ImageVariant';
import DownloadVariant from './variants/download-variant/DownloadVariant';
import IntegrationVariant from './variants/integration-variant/IntegrationVariant';
import Divider from '@/components/shared/divider/divider';
import { HistoryEntry } from '../../types/history-entry';
import ShareHistory from '../share-history/ShareHistory';

interface PinProps {
  variants: Variant[];
  variantsFromSharedPin?: Variant[];
  shareHistory?: HistoryEntry[];
}

export default function PinCard({
  variants,
  variantsFromSharedPin,
  shareHistory,
}: PinProps) {
  return (
    <div className={styles['pin-card']}>
      {shareHistory ? <ShareHistory shareHistory={shareHistory} /> : null}
      <VariantsRenderer variants={variants} />
      {variantsFromSharedPin ? (
        <>
          <Divider />
          <VariantsRenderer variants={variantsFromSharedPin} />
        </>
      ) : null}
    </div>
  );
}

interface VariantsRendererProps {
  variants: Variant[];
}

function VariantsRenderer({ variants }: VariantsRendererProps) {
  {
    return variants.map((variant, index) => {
      switch (variant.config.type) {
        case 'text':
          return <TextVariant key={index} content={variant.config.content} />;
        case 'title':
          return <TitleVariant key={index} content={variant.config.content} />;
        case 'link':
          return <LinkVariant key={index} />;
        case 'image':
          return <ImageVariant key={index} />;
        case 'download':
          return <DownloadVariant key={index} />;
        case 'integration':
          return <IntegrationVariant key={index} />;
        default:
          return 'invalid variant type';
      }
    });
  }
}
