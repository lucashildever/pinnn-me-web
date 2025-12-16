'use client';

import IconRenderer from '../icon-renderer/IconRenderer';

import { ClickableConfig } from './types/clickableConfig';
import { Clickable as IClickable } from '@/components/shared/clickable/types/clickable';

import styles from './clickable.module.scss';
import { CollectionTab } from './collection-tab/CollectionTab';

interface ClickableProps {
  payload: IClickable;
  config: ClickableConfig;
  style?: React.CSSProperties;
}

export default function Clickable({ payload, config, style }: ClickableProps) {
  switch (config.clickableType) {
    case 'collection-tab':
      return <CollectionTab payload={payload} config={config} style={style} />;
    case 'collection-tab-overlay':
      return (
        <CollectionTab
          payload={payload}
          config={config}
          style={style}
          overlay
        />
      );
    case 'call-to-action':
      return (
        <a
          style={style}
          className={styles['profile-cta']}
          href={config.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconRenderer config={payload.iconConfig} />
          <p>{payload.content}</p>
        </a>
      );
    case 'mural-options':
      return (
        <div
          className={styles[`${config.clickableType}-button-clickable`]}
          style={style}
        >
          <IconRenderer config={payload.iconConfig} />
        </div>
      );
    default:
      return null;
  }
}
