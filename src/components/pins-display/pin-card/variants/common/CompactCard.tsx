'use client';

import Image from 'next/image';

import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';

import { CardVariant } from '../../types/cardVariant';
import { IconConfig } from '@/lib/types/clickable';

import { extractDomain } from '../link-variant/utils/extractDomain';

import darkDownloadIcon from '/public/assets/icons/dark-download.svg';
import darkArrowIcon from '/public/assets/icons/dark-arrow-45.svg';

import styles from './compact-card.module.scss';

interface CompactCardProps {
  variantType: CardVariant;
  iconConfig: IconConfig;
  caption: string;
  meta: string;
}

export default function CompactCard({
  variantType,
  iconConfig,
  caption,
  meta,
}: CompactCardProps) {
  return (
    <div className={styles[`compact-container-${variantType}`]}>
      <div className={styles['icon-and-info']}>
        <IconRenderer from="compact-card" config={iconConfig} />
        <div className={styles['card-info']}>
          <p>{caption}</p>
          {/* Tavez seja necessario adicionar um extractFileName para card tipo download */}
          <span>
            {variantType === CardVariant.LINK ? extractDomain(meta) : meta}
            {/* verificar porque "invalid domain" */}
          </span>
        </div>
      </div>
      {variantType === CardVariant.LINK ? (
        <Image
          src={darkArrowIcon}
          alt="link icon"
          className={styles['arrow-icon']}
        />
      ) : (
        <Image
          src={darkDownloadIcon}
          alt="download icon"
          className={styles['download-icon']}
        />
      )}
    </div>
  );
}
