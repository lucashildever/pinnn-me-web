import React from 'react';
import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';
import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';
import styles from './display-element.module.scss';

export interface DisplayElementProps {
  iconConfig: IconConfig;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function DisplayElement({
  iconConfig,
  label,
  className,
  style,
}: DisplayElementProps) {
  return (
    <div
      className={`${styles['display-element']} ${className || ''}`}
      style={style}
    >
      <IconRenderer config={iconConfig} />
      {label && <p>{label}</p>}
    </div>
  );
}
