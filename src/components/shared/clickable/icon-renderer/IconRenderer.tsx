import { useState } from 'react';
import Image from 'next/image';

import { IconConfig, IconType } from '@/lib/types/clickable';

import { emojiParser } from './helpers/emojiParser';

import styles from './icon-renderer.module.scss';

import tempCustomImg from '/public/assets/temp/cp.png';

interface ConfigureIconProps {
  config: IconConfig;
}

export default function IconRenderer({ config }: ConfigureIconProps) {
  switch (config.type) {
    case IconType.PREDEFINED:
      const icon = `/assets/icons/predefined/${config.icon}-${'light'}.svg`;
      return (
        <span className={styles[`predefined-icon-${config.icon}`]}>
          <Image alt="tab icon" src={icon} fill draggable={false} />
        </span>
      );
    case IconType.CUSTOM:
      return (
        <span className={styles['custom-icon']}>
          <Image alt="tab icon" src={tempCustomImg} fill draggable={false} />
        </span>
      );
      return;
    case IconType.EMOJI:
      return <EmojiRenderer unicode={config.unicode} />;
    case IconType.NONE:
      return;
  }
}

function EmojiRenderer({ unicode }: { unicode: string }) {
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const src = `/emojis/${emojiParser(unicode)}.svg`;

  if (hasError) {
    return <span>{unicode}</span>;
  }

  return (
    <>
      <span
        className={styles['emoji-txt']}
        style={{ display: imageLoaded ? 'none' : 'inline' }}
      >
        {unicode}
      </span>
      <span
        className={styles['emoji-img']}
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
