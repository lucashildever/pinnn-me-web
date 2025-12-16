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

interface PinProps {
  variants: Variant[];
  variantsFromSharedPin?: Variant[];
}

export default function PinCard({ variants, variantsFromSharedPin }: PinProps) {
  return (
    <div className={styles['pin-card']}>
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
