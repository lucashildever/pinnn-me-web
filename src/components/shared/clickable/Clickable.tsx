'use client';

import IconRenderer from '../icon-renderer/IconRenderer';

import { ClickableConfig, CollectionTabConfig } from './types/clickableConfig';
import { Clickable as IClickable } from '@/lib/types/clickable';

import styles from './clickable.module.scss';

interface ClickableProps {
  payload: IClickable;
  config: ClickableConfig;
  style?: React.CSSProperties;
}

export default function Clickable({ payload, config, style }: ClickableProps) {
  switch (config.clickableType) {
    case 'collection-tab':
      return (
        <div
          style={style}
          ref={config.ref}
          className={`${styles['collection-tab-clickable']} ${
            config.active ? styles['active'] : ''
          }`}
          onClick={() =>
            config.tabClick({
              id: config.tabId,
              displayElement: {
                content: payload.content,
                iconConfig: payload.iconConfig,
              },
            })
          }
        >
          <IconRenderer from="collection-tab" config={payload.iconConfig} />
          <p>{payload.content}</p>
        </div>
      );
    case 'collection-tab-overlay':
      return (
        <div
          style={style}
          className={`
            ${styles['collection-tab-overlay']} 
            ${styles[config.displayConfig.visible ? 'visible' : '']}
            ${styles[config.displayConfig.position]}
          `}
        >
          <IconRenderer from="collection-tab" config={payload.iconConfig} />
          <p>{payload.content}</p>
        </div>
      );
    case 'mural-cta':
      return (
        <a
          style={style}
          className={styles['profile-cta']}
          href={config.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconRenderer from="cta-button" config={payload.iconConfig} />
          <p>{payload.content}</p>
        </a>
      );
    case 'mural-options':
      return (
        <div
          className={styles[`${config.clickableType}-button-clickable`]}
          style={style}
        >
          <IconRenderer from="cta-button" config={payload.iconConfig} />
        </div>
      );
    case 'mural-theme':
      return (
        <div
          style={style}
          className={styles[`${config.clickableType}-button-clickable`]}
        >
          <IconRenderer from="cta-button" config={payload.iconConfig} />
        </div>
      );
    default:
      return null;
  }
}

interface CollectionTabClickableProps extends Omit<ClickableProps, 'config'> {
  config: CollectionTabConfig;
}

function CollectionTabClickable({
  payload,
  config,
}: CollectionTabClickableProps) {
  return (
    <div
      ref={config.ref}
      className={`${styles['collection-tab-clickable']} ${
        config.active ? styles['active'] : ''
      }`}
      onClick={() =>
        config.tabClick({
          id: config.tabId,
          displayElement: {
            content: payload.content,
            iconConfig: payload.iconConfig,
          },
        })
      }
    >
      <IconRenderer from="cta-button" config={payload.iconConfig} />
      <p>{payload.content}</p>
    </div>
  );
}
