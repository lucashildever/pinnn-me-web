'use client';

import { ClickableConfig } from './types/clickableConfig';
import { Clickable as IClickable } from '@/components/shared/clickable/types/clickable';

import styles from './clickable.module.scss';
import { CollectionTab } from './collection-tab/CollectionTab';
import { CallToAction } from './call-to-action/CallToAction';
import { MuralOptions } from './mural-options/MuralOptions';

import { CollectionSelector } from './collection-selector/CollectionSelector';

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
      return <CallToAction payload={payload} config={config} style={style} />;
    case 'mural-options':
      return <MuralOptions payload={payload} config={config} style={style} />;
    case 'collection-selector':
      return (
        <CollectionSelector
          selectedCollectionId={config.selectedCollectionId}
          onSelect={config.onSelect}
        />
      );
    default:
      return null;
  }
}
