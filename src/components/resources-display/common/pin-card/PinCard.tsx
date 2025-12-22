'use client';

import { Variant } from '../../pin/types/variant';
import styles from './pin-card.module.scss';
import TextVariant from './variants/text-variant/TextVariant';
import TitleVariant from './variants/title-variant/TitleVariant';
import LinkVariant from './variants/link-variant/LinkVariant';
import ImageVariant from './variants/image-variant/ImageVariant';
import DownloadVariant from './variants/download-variant/DownloadVariant';
import IntegrationVariant from './variants/integration-variant/IntegrationVariant';
import Divider from '@/components/shared/divider/divider';
import { HistoryEntry } from '../../types/history-entry';
import ShareHistory from '../share-history/ShareHistory';
import OptionsButton from '../options-button/OptionsButton';
import VideoVariant from './variants/video-variant/VideoVariant';

interface PinCardProps {
  variants: Variant[];
  variantsFromSharedPin?: Variant[];
  shareHistory?: HistoryEntry[];
}

export default function PinCard({
  variants,
  variantsFromSharedPin,
  shareHistory,
}: PinCardProps) {
  return (
    <div className={styles['pin-card']}>
      <OptionsButton top={5} right={5} />
      {shareHistory ? (
        <ShareHistory
          shareHistory={shareHistory}
          style={{
            marginBottom: '10px',
          }}
        />
      ) : null}
      <VariantsRenderer variants={variants} />
      {variantsFromSharedPin && variantsFromSharedPin.length > 0 ? (
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
          return (
            <LinkVariant
              key={index}
              content={variant.config.content}
              iconConfig={variant.config.iconConfig}
            />
          );
        case 'download':
          return (
            <DownloadVariant
              key={index}
              content={variant.config.content}
              iconConfig={variant.config.iconConfig}
            />
          );
        case 'image':
          return <ImageVariant key={index} src={variant.config.src} />;
        case 'video':
          return <VideoVariant key={index} src={variant.config.src} />;
        case 'integration':
          return (
            <IntegrationVariant key={index} data={variant.config.embedConfig} />
          );
        default:
          return 'invalid variant type';
      }
    });
  }
}
