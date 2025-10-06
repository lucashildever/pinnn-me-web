import { useState } from 'react';
import Image from 'next/image';

import { IconConfig, IconType } from '@/lib/types/clickable';

import { emojiParser } from './helpers/emojiParser';

import styles from './icon-renderer.module.scss';

import tempCustomImg from '/public/assets/temp/cp.png';

interface ConfigureIconProps {
  config: IconConfig;
  from: 'collection-tab' | 'compact-card' | 'cta-button';
}

export default function IconRenderer({ config, from }: ConfigureIconProps) {
  let renderedSize = null;

  if (from === 'compact-card') {
    renderedSize = 'large';
  } else {
    renderedSize = 'small';
  }

  switch (config.type) {
    case IconType.PREDEFINED:
      const icon = `/assets/icons/predefined/${config.icon}-${'light'}.svg`;
      return (
        <span
          className={`
        ${styles[`predefined-icon-${config.icon}`]}
        ${styles[renderedSize]}
        `}
        >
          <Image alt="tab icon" src={icon} fill draggable={false} />
        </span>
      );
    case IconType.CUSTOM:
      return (
        <span
          className={`
          ${styles['custom-icon']}
          ${styles[renderedSize]}
          `}
        >
          <Image alt="tab icon" src={tempCustomImg} fill draggable={false} />
        </span>
      );
    case IconType.EMOJI:
      return (
        <EmojiRenderer unicode={config.unicode} renderedSize={renderedSize} />
      );
    case IconType.NONE:
      return;
  }
}

interface EmojiRendererProps {
  unicode: string;
  renderedSize: string;
}

function EmojiRenderer({ unicode, renderedSize }: EmojiRendererProps) {
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const src = `/emojis/${emojiParser(unicode)}.svg`;

  if (hasError) {
    return <span>{unicode}</span>;
  }

  return (
    <>
      <span
        className={`
          ${styles['emoji-txt']}
          ${styles[renderedSize]}
          `}
        style={{ display: imageLoaded ? 'none' : 'inline' }}
      >
        {unicode}
      </span>
      <span
        className={`
          ${styles['emoji-img']}
          ${styles[renderedSize]}
          `}
        style={{ display: imageLoaded ? 'inline' : 'none' }}
      >
        <Image
          src={src}
          alt={`emoji-${unicode}`}
          width={24}
          height={24}
          onError={() => setHasError(true)}
          onLoad={() => setImageLoaded(true)}
          unoptimized
          draggable={false}
        />
      </span>
    </>
  );
}
