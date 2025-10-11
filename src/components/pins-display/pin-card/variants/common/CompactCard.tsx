'use client';

import { useEffect, useState } from 'react';

import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';

import { IconConfig } from '@/lib/types/clickable';
import { CardVariant } from '../../types/cardVariant';

import { extractDomain } from '../link-variant/utils/extractDomain';

import { Download, ArrowUpRight } from 'lucide-react';

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
  const [configuredIcon, setConfiguredIcon] = useState<IconConfig>({
    type: 'predefined',
    icon: 'loading',
  });

  useEffect(() => {
    if (iconConfig.type === 'none') {
      if (variantType === 'link') {
        setConfiguredIcon({
          type: 'predefined',
          icon: 'link',
        });
      } else {
        setConfiguredIcon({
          type: 'predefined',
          icon: 'file',
        });
      }
    } else {
      setConfiguredIcon(iconConfig);
    }
  }, []);

  return (
    <div className={styles['compact-card']}>
      <div className={styles['icon-and-info']}>
        <IconRenderer from="compact-card" config={configuredIcon} />
        <div className={styles['card-info']}>
          <p>{caption}</p>
          <span>{variantType === 'link' ? extractDomain(meta) : meta}</span>
        </div>
      </div>
      {variantType === 'link' ? (
        <ArrowUpRight className={styles['arrow-icon']} />
      ) : (
        <Download className={styles['download-icon']} />
      )}
    </div>
  );
}
