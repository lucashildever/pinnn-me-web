'use client';

import { ReactNode, useState } from 'react';
import { IconConfig } from './icon/types/app-icon';
import { emojiParser } from './utils/emojiParser';
import tempCustomImg from '/public/assets/temp/tt.jpg';
import styles from './icon-renderer.module.scss';
import Image from 'next/image';
import Icon from './icon/Icon';

interface ConfigureIconProps {
  config: IconConfig;
  renderedSize?: 'small' | 'large';
}

/**
 * Renders any type of icon supported by the application.
 * This includes internal library icons (predefined), custom image icons, emojis, or no icon at all.
 */
export default function IconRenderer({
  config,
  renderedSize = 'small',
}: ConfigureIconProps) {
  switch (config.type) {
    case 'predefined':
      return (
        <RendererContainer
          className={`
            ${styles['predefined']}
            ${styles[renderedSize]} ${config.icon === 'loading' ? styles['animate-spin'] : ''}
        `}
        >
          <Icon iconName={config.icon} />
        </RendererContainer>
      );
    case 'custom':
      return (
        <RendererContainer
          className={`
            ${styles['custom']}
            ${styles[renderedSize]}
          `}
        >
          <Image alt="tab icon" src={tempCustomImg} fill draggable={false} />
        </RendererContainer>
      );
    case 'emoji':
      return (
        <RendererContainer
          className={`
            ${styles['emoji']}
            ${styles[renderedSize]}
          `}
        >
          <EmojiRenderer unicode={config.unicode} renderedSize={renderedSize} />
        </RendererContainer>
      );
    case 'none':
      return;
  }
}

interface RendererContainerProps {
  children: ReactNode;
  className?: string;
}

function RendererContainer({ children, className }: RendererContainerProps) {
  return (
    <div
      className={`
        ${styles[`renderer-container`]} 
        ${className ?? ''}
      `}
    >
      {children}
    </div>
  );
}

interface EmojiRendererProps {
  unicode: string;
  renderedSize: string;
}

function EmojiRenderer({ unicode, renderedSize }: EmojiRendererProps) {
  const [hasError, setHasError] = useState(false);
  const src = `/assets/emojis/${emojiParser(unicode)}.svg`;

  if (hasError) {
    return (
      <span className={styles['emoji-renderer']}>
        <span className={styles[`txt-${renderedSize}`]}>{unicode}</span>
      </span>
    );
  }

  return (
    <span className={styles['emoji-renderer']}>
      <Image
        className={styles[`img-${renderedSize}`]}
        src={src}
        alt={`emoji-${unicode}`}
        width={24}
        height={24}
        onError={() => setHasError(true)}
        unoptimized
        draggable={false}
      />
    </span>
  );
}
