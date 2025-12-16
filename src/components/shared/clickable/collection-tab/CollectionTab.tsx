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
        <IconRenderer config={payload.iconConfig} />
        <p>{payload.content}</p>
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
      <IconRenderer config={payload.iconConfig} />
      <p>{payload.content}</p>
    </div>
  );
}
