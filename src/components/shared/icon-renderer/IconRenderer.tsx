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
  renderedSize?: number;
  strokeWidth?: number;
  color?: string;
  style?: CSSProperties;
}

/**
 * Renders any type of icon supported by the application.
 * This includes internal library icons (predefined), custom image icons, emojis, or no icon at all.
 */
export default function IconRenderer({
  config,
  renderedSize = 5,
  strokeWidth,
  color,
  style,
}: ConfigureIconProps) {
  const sizeClass = `size-${renderedSize}`;

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
          <Icon
            iconName={config.icon}
            strokeWidth={strokeWidth}
            color={color}
          />
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
  renderedSize: number;
}

function EmojiRenderer({ unicode, renderedSize }: EmojiRendererProps) {
  const [hasError, setHasError] = useState(false);
  const src = `/assets/emojis/${emojiParser(unicode)}.svg`;

  if (hasError) {
    return (
      <span className={styles['emoji-renderer']}>
        <span
          className={styles['txt-fallback']}
          style={{ fontSize: `${renderedSize * 4}px` }}
        >
          {unicode}
        </span>
      </span>
    );
  }

  return (
    <span className={styles['emoji-renderer']}>
      <Image
        src={src}
        alt={`emoji-${unicode}`}
        width={renderedSize * 4} // Approximation or we can use styling. Since we use size classes on container, this might be fine or we might want to fit container.
        height={renderedSize * 4}
        onError={() => setHasError(true)}
        unoptimized
        draggable={false}
      />
    </span>
  );
}
