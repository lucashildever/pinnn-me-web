'use client';

import IconRenderer from '../../icon-renderer/IconRenderer';
import { CallToActionConfig } from '../types/clickableConfig';
import { Clickable as IClickable } from '@/components/shared/clickable/types/clickable';
import styles from '../clickable.module.scss';
import React from 'react';

interface CallToActionProps {
  payload: IClickable;
  config: CallToActionConfig;
  style?: React.CSSProperties;
}

export function CallToAction({ payload, config, style }: CallToActionProps) {
  return (
    <a
      style={style}
      className={styles['profile-cta']}
      href={config.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconRenderer config={payload.iconConfig} renderedSize={6} />
      <p>{payload.content}</p>
    </a>
  );
}
