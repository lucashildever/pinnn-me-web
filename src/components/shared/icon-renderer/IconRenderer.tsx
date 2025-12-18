'use client';

import { CSSProperties, ReactNode, useState } from 'react';
import { IconConfig } from './icon/types/app-icon';
import { emojiParser } from './utils/emojiParser';
import tempCustomImg from '/public/assets/temp/tt.jpg';
import styles from './icon-renderer.module.scss';
import Image from 'next/image';
import Icon from './icon/Icon';

interface ConfigureIconProps {
  config: IconConfig;
  /**
   * Size of the rendered icon.
   * - 'small': Predefined small size (7 from modular scale)
   * - 'large': Predefined large size (19 from modular scale)
   * - number: Custom size from the modular scale (1-20)
   */
  renderedSize?: 'small' | 'large' | number;
  style?: CSSProperties;
}

/**
 * Renders any type of icon supported by the application.
 * This includes internal library icons (predefined), custom image icons, emojis, or no icon at all.
 */
export default function IconRenderer({
  config,
  renderedSize = 'small',
  style,
}: ConfigureIconProps) {
  // Determine the size class: predefined ('small'/'large') or dynamic ('size-N')
  const sizeClass =
    typeof renderedSize === 'number' ? `size-${renderedSize}` : renderedSize;

  switch (config.type) {
    case 'predefined':
      return (
        <RendererContainer
          className={`
            ${styles['predefined']}
            ${styles[sizeClass]} ${config.icon === 'loading' ? styles['animate-spin'] : ''}
        `}
          style={style}
        >
          <Icon iconName={config.icon} />
        </RendererContainer>
      );
    case 'custom':
      return (
        <RendererContainer
          className={`
            ${styles['custom']}
            ${styles[sizeClass]}
          `}
          style={style}
        >
          <Image alt="tab icon" src={tempCustomImg} fill draggable={false} />
        </RendererContainer>
      );
    case 'emoji':
      return (
        <RendererContainer
          className={`
            ${styles['emoji']}
            ${styles[sizeClass]}
          `}
          style={style}
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
  style?: CSSProperties;
}

function RendererContainer({
  children,
  className,
  style,
}: RendererContainerProps) {
  return (
    <div
      className={`
        ${styles[`renderer-container`]} 
        ${className ?? ''}
      `}
      style={style}
    >
      {children}
    </div>
  );
}

interface EmojiRendererProps {
  unicode: string;
  renderedSize: 'small' | 'large' | number;
}

function EmojiRenderer({ unicode, renderedSize }: EmojiRendererProps) {
  const [hasError, setHasError] = useState(false);
  const src = `/assets/emojis/${emojiParser(unicode)}.svg`;
  // Emojis only use predefined sizes, default to 'small' if number is passed
  const sizeClass = typeof renderedSize === 'number' ? 'small' : renderedSize;

  if (hasError) {
    return (
      <span className={styles['emoji-renderer']}>
        <span className={styles[`txt-${sizeClass}`]}>{unicode}</span>
      </span>
    );
  }

  return (
    <span className={styles['emoji-renderer']}>
      <Image
        className={styles[`img-${sizeClass}`]}
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
