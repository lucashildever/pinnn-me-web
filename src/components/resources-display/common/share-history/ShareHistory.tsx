'use client';

import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';
import styles from './share-history.module.scss';
import { EntryPreview, HistoryEntry } from '../../types/history-entry';
import Image from 'next/image';

import { useAppSelector } from '@/lib/state/hooks';
import { selectMuralId } from '@/lib/state/slices/muralSlice';
import { useEffect, useState } from 'react';
import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';
import AuthorMeta from '@/components/shared/author-meta/AuthorMeta';

import profPlaceholder from '/public/assets/prof-placeholder.jpg';

interface ShareHistoryProps {
  shareHistory: HistoryEntry[];
  style?: React.CSSProperties;
  ownerPreview?: EntryPreview;
}

export default function ShareHistory({
  shareHistory,
  style,
  ownerPreview,
}: ShareHistoryProps) {
  const ownerImageSrc =
    ownerPreview?.type === 'image' ? ownerPreview.url : profPlaceholder;

  const lastEntry = shareHistory.reduce((max, entry) =>
    entry.order > max.order ? entry : max,
  );

  return (
    <div className={styles['share-history']} style={style}>
      <SourceContainer content={{ type: 'image', src: ownerImageSrc }} />
      <IconRenderer
        config={{ type: 'predefined', icon: 'share' }}
        renderedSize={5}
        style={{
          opacity: 0.7,
          transform: 'translateX(1px)',
        }}
      />
      <HistorySourcesRenderer history={shareHistory} />
      <AuthorMeta
        muralName={lastEntry.muralName}
        hasBadge
        size="small"
        style={{
          marginLeft: '7px',
        }}
      />
    </div>
  );
}

function HistorySourcesRenderer({ history }: { history: HistoryEntry[] }) {
  const [overplus, setOverplus] = useState(false);
  const maxOrderHistory = Math.max(...history.map((entry) => entry.order));
  const muralId = useAppSelector(selectMuralId);

  useEffect(() => {
    if (maxOrderHistory > 5) {
      setOverplus(true);
    }
  }, [history, maxOrderHistory]);

  if (!muralId) {
    return null;
  }

  return (
    <div className={styles['share-history-list']}>
      {history.map((entry, index) => {
        const { preview } = entry;

        if (preview.type === 'icon') {
          return (
            <SourceContainer
              key={index}
              content={{ type: 'icon', config: preview.icon }}
            />
          );
        }

        if (preview.type === 'image') {
          return (
            <SourceContainer
              key={index}
              content={{ type: 'image', src: preview.url }}
            />
          );
        }

        // type === 'none' - render placeholder
        return (
          <SourceContainer
            key={index}
            content={{ type: 'image', src: profPlaceholder }}
          />
        );
      })}
      {overplus && (
        <SourceContainer
          content={{ type: 'excess', count: maxOrderHistory - 5 }}
        />
      )}
    </div>
  );
}

type SourceContainerContent =
  | { type: 'excess'; count: number }
  | { type: 'image'; src: string | typeof profPlaceholder }
  | { type: 'icon'; config: IconConfig };

interface SourceContainerProps {
  content: SourceContainerContent;
}

function SourceContainer({ content }: SourceContainerProps) {
  const renderContent = () => {
    switch (content.type) {
      case 'excess':
        return <span>+{content.count}</span>;
      case 'image':
        return <Image src={content.src} alt="source" fill draggable={false} />;
      case 'icon':
        return <IconRenderer config={content.config} renderedSize={4} />;
    }
  };

  return (
    <div
      className={`
        ${styles['source-container']}
        ${content.type === 'excess' ? styles['excess-number'] : ''}
        ${content.type === 'image' ? styles['has-image'] : ''}
      `}
    >
      {renderContent()}
    </div>
  );
}
