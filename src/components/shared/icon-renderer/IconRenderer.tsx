'use client';

import { ReactNode, useState } from 'react';
import Image from 'next/image';

import { IconConfig, IconType } from '@/lib/types/clickable';

import { emojiParser } from './utils/emojiParser';

import tempCustomImg from '/public/assets/temp/cp.png';
import styles from './icon-renderer.module.scss';
import Icon from './icon/Icon';

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
      // *escolhe icone do tipo predefined*
      // 1 - verifica se o icone existe na biblioteca lucide
      // 2 - se existir, pega. se não existir, seleciona internamente
      // (verificar melhor forma de selecionar internamente - com arquivos ou sprite? - usar arquivos por enquanto)

      // eu ainda preciso do RendererContainer pois ele define o tamanho da 'caixa' do icone -
      // o icone/imagem/emoji é renderizado dentro dele.

      const icon = `/assets/icons/predefined/${config.icon}-${'light'}.svg`;
      return (
        <RendererContainer size={rendererSize}>
          <Icon iconName={config.icon} />
        </RendererContainer>
      );
    case IconType.CUSTOM:
      return (
        <RendererContainer size={rendererSize}>
          <Image alt="tab icon" src={tempCustomImg} fill draggable={false} />
        </RendererContainer>
      );
    case IconType.EMOJI:
      return (
        <EmojiRenderer unicode={config.unicode} rendererSize={rendererSize} />
      );
    case IconType.NONE:
      return;
  }
}

interface RendererContainerProps {
  children: ReactNode;
  size: string;
}

function RendererContainer({ children, size }: RendererContainerProps) {
  return (
    <span className={`${styles[`renderer-container`]} ${styles[size]}`}>
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const src = `/assets/emojis/${emojiParser(unicode)}.svg`;

  if (hasError) {
    return <span>{unicode}</span>;
  }

  return (
    <>
      <span
        className={`
          ${styles['emoji-txt']}
          ${styles[rendererSize]}
          `}
        style={{ display: imageLoaded ? 'none' : 'inline' }}
      >
        {unicode}
      </span>
      <span
        className={`
          ${styles['emoji-img']}
          ${styles[rendererSize]}
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
