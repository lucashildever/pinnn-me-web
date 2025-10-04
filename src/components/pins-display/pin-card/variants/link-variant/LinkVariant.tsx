'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

import darkInstagramIcon from '/public/assets/icons/social/dark-instagram.svg';
import darkPinterestIcon from '/public/assets/icons/social/dark-pinterest.svg';
import darkArrowIcon from '/public/assets/icons/dark-arrow-45.svg';
import darkLinkIcon from '/public/assets/icons/dark-link.svg';
import darkTiktok from '/public/assets/icons/social/dark-tiktok.svg';
import darkXIcon from '/public/assets/icons/social/dark-x.svg';

import { PredefinedIcon } from '@/lib/types/predefinedIcon';
import { CardIconConfig } from '../../types/card';

import styles from './link-variant.module.scss';

interface LinkProps {
  caption: string;
  cardIconConfig: CardIconConfig;
}

const extractDomain = (url: string): string => {
  try {
    const { hostname } = new URL(url);
    return hostname.startsWith('www.') ? hostname.slice(4) : hostname;
  } catch (error) {
    console.error('Error while extracting domain:', error);
    return 'invalid domain';
  }
};

export default function LinkVariant({ caption, cardIconConfig }: LinkProps) {
  const [variantIcon, setVariantIcon] = useState<string>(darkLinkIcon);
  const [isCustomIcon, setIsCustomIcon] = useState<boolean>(false);

  useEffect(() => {
    if (cardIconConfig.type === 'custom') {
      setIsCustomIcon(true);
    }

    if (isCustomIcon && cardIconConfig.type === 'custom') {
      setVariantIcon(cardIconConfig.src || darkLinkIcon);
    } else if (cardIconConfig.type === 'predefined') {
      switch (cardIconConfig.icon) {
        case PredefinedIcon.X:
          setVariantIcon(darkXIcon);
          break;
        case PredefinedIcon.INSTAGRAM:
          setVariantIcon(darkInstagramIcon);
          break;
        case PredefinedIcon.TIKTOK:
          setVariantIcon(darkTiktok);
          break;
        case PredefinedIcon.PINTEREST:
          setVariantIcon(darkPinterestIcon);
          break;
        default:
          setVariantIcon(darkLinkIcon);
      }
    }
  }, []);

  return (
    <a
      href="/"
      target="_blank"
      rel="noopener noreferrer"
      className={styles['link']}
    >
      <div className={styles['img-and-info']}>
        <div
          className={`${styles['link-icon-conainer']} ${
            isCustomIcon ? styles['custom'] : ''
          }`}
        >
          <Image
            src={variantIcon}
            alt="link icon"
            className={styles['link-icon']}
          />
        </div>
        <div className={styles['link-info']}>
          <p>{caption}</p>
          <span>
            {/* need refactoring */}
            {extractDomain('https://www.google.com')}
          </span>
        </div>
      </div>
      <Image
        src={darkArrowIcon}
        alt="arrow icon"
        className={styles['arrow-icon']}
      />
    </a>
  );
}
