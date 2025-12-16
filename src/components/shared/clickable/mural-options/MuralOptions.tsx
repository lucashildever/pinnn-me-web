'use client';

import IconRenderer from '../../icon-renderer/IconRenderer';
import { UtilityButtonConfig } from '../types/clickableConfig';
import { Clickable as IClickable } from '@/components/shared/clickable/types/clickable';
import styles from '../clickable.module.scss';
import React from 'react';

interface MuralOptionsProps {
  payload: IClickable;
  config: UtilityButtonConfig;
  style?: React.CSSProperties;
}

export function MuralOptions({ payload, config, style }: MuralOptionsProps) {
  return (
    <div
      className={styles[`${config.clickableType}-button-clickable`]}
      style={style}
    >
      <IconRenderer config={payload.iconConfig} />
    </div>
  );
}
