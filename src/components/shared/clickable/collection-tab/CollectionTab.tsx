import IconRenderer from '../../icon-renderer/IconRenderer';
import {
  CollectionTabConfig,
  CollectionTabOverlayConfig,
} from '../types/clickableConfig';
import { Clickable as IClickable } from '@/components/shared/clickable/types/clickable';
import styles from '../clickable.module.scss';
import React from 'react';

interface CollectionTabProps {
  payload: IClickable;
  config: CollectionTabConfig | CollectionTabOverlayConfig;
  style?: React.CSSProperties;
  overlay?: boolean;
}

export function CollectionTab({
  payload,
  config,
  style,
  overlay = false,
}: CollectionTabProps) {
  if (overlay) {
    const overlayConfig = config as CollectionTabOverlayConfig;
    return (
      <div
        style={style}
        className={`
          ${styles['collection-tab-overlay']} 
          ${styles[overlayConfig.displayConfig.visible ? 'visible' : '']}
          ${styles[overlayConfig.displayConfig.position]}
        `}
      >
        <div className={styles['collection-tab-overlay-pill']}>
          <IconRenderer
            config={payload.iconConfig}
            renderedSize={payload.iconConfig.type === 'custom' ? 6 : 4}
          />
          <p>{payload.content}</p>
        </div>
      </div>
    );
  }

  const tabConfig = config as CollectionTabConfig;
  return (
    <div
      style={style}
      ref={tabConfig.ref}
      className={`${styles['collection-tab-clickable']} ${
        tabConfig.active ? styles['active'] : ''
      }`}
      onClick={() =>
        tabConfig.tabClick({
          id: tabConfig.tabId,
          displayElement: {
            content: payload.content,
            iconConfig: payload.iconConfig,
          },
        })
      }
    >
      <IconRenderer
        config={payload.iconConfig}
        renderedSize={payload.iconConfig.type === 'custom' ? 6 : 4}
      />
      <p>{payload.content}</p>
    </div>
  );
}
