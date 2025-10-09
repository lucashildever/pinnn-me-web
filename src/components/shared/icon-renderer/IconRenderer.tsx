'use client';

import { ReactNode, useState } from 'react';
import Image from 'next/image';

import Icon from './icon/Icon';

import { IconConfig, IconType } from '@/lib/types/clickable';
import { emojiParser } from './utils/emojiParser';

import tempCustomImg from '/public/assets/temp/cp.png';
import styles from './icon-renderer.module.scss';

interface ConfigureIconProps {
  config: IconConfig;
  from: 'collection-tab' | 'compact-card' | 'cta-button';
}

export default function IconRenderer({ config, from }: ConfigureIconProps) {
  let rendererSize = null;

  if (from === 'compact-card') {
    rendererSize = 'large';
  } else {
    rendererSize = 'small';
  }

  switch (config.type) {
    case IconType.PREDEFINED:
      return (
        <RendererContainer
          className={`
          ${styles['predefined']}
          ${styles[rendererSize]}
        `}
        >
          <Icon iconName={config.icon} />
        </RendererContainer>
      );
    case IconType.CUSTOM:
      return (
        <RendererContainer
          className={`
            ${styles['custom']}
            ${styles[rendererSize]}
          `}
        >
          <Image alt="tab icon" src={tempCustomImg} fill draggable={false} />
        </RendererContainer>
      );
    case IconType.EMOJI:
      return (
        <RendererContainer
          className={`
            ${styles['emoji']}
            ${styles[rendererSize]}
          `}
        >
          <EmojiRenderer unicode={config.unicode} rendererSize={rendererSize} />
        </RendererContainer>
      );
    case IconType.NONE:
      return;
  }
}

interface RendererContainerProps {
  children: ReactNode;
  className?: string;
}

function RendererContainer({ children, className }: RendererContainerProps) {
  return (
    <span
      className={`
        ${styles[`renderer-container`]} 
        ${className ?? ''}
      `}
    >
      {children}
    </span>
  );
}

interface EmojiRendererProps {
  unicode: string;
  rendererSize: string;
}

function EmojiRenderer({ unicode, rendererSize }: EmojiRendererProps) {
  const [hasError, setHasError] = useState(false);
  const src = `/assets/emojis/${emojiParser(unicode)}.svg`;

  if (hasError) {
    return (
      <span className={styles['emoji-renderer']}>
        <span className={styles[`txt-${rendererSize}`]}>{unicode}</span>
      </span>
    );
  }

  return (
    <span className={styles['emoji-renderer']}>
      <Image
        className={styles[`img-${rendererSize}`]}
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
