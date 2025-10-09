'use client';

import { useEffect, useState } from 'react';

import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';

import { IconConfig, IconType } from '@/lib/types/clickable';
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
    type: IconType.PREDEFINED,
    icon: 'link', // mudar isso para um icone pre-load padrão
  });

  useEffect(() => {
    // TESTAR
    console.log('iconConfig', iconConfig);
    if (iconConfig.type === 'none') {
      if (variantType === CardVariant.LINK) {
        setConfiguredIcon({
          type: IconType.PREDEFINED,
          icon: 'link',
        });
      } else {
        setConfiguredIcon({
          type: IconType.PREDEFINED,
          icon: 'file',
        });
      }
    } else {
      setConfiguredIcon(iconConfig);
    }
  }, []);

  return (
    <div
      className={`
      ${styles['compact-card']}
      ${styles[variantType]} 
    `}
      // o ${styles[variantType]} talvez não seja necessário, avaliar
    >
      <div className={styles['icon-and-info']}>
        <IconRenderer from="compact-card" config={configuredIcon} />
        <div className={styles['card-info']}>
          <p>{caption}</p>
          {/* Tavez seja necessario adicionar um extractFileName para card tipo download */}
          <span>
            {variantType === CardVariant.LINK ? extractDomain(meta) : meta}
          </span>
        </div>
      </div>
      {variantType === CardVariant.LINK ? (
        <ArrowUpRight className={styles['arrow-icon']} />
      ) : (
        <Download className={styles['download-icon']} />
      )}
    </div>
  );
}
