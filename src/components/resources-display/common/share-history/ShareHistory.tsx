'use client';

import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';
import styles from './share-history.module.scss';
import { HistoryEntry } from '../../types/history-entry';
import Image from 'next/image';

import { useAppSelector } from '@/lib/state/hooks';
import { selectMuralId } from '@/lib/state/slices/muralSlice';
import { useEffect, useState } from 'react';
import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';

// Temp images for demonstration
import profileImg from '/public/assets/temp/pf.jpg';
import cpImg from '/public/assets/temp/cp.jpg';
import ttImg from '/public/assets/temp/tt.jpg';
import pinImg from '/public/assets/temp/pin-image-dgg.jpg';
import AuthorMeta from '@/components/shared/author-meta/AuthorMeta';

const tempImages = [cpImg, ttImg, pinImg];

interface ShareHistoryProps {
  shareHistory: HistoryEntry[];
  style?: React.CSSProperties;
}

export default function ShareHistory({
  shareHistory,
  style,
}: ShareHistoryProps) {
  const muralId = useAppSelector(selectMuralId);

  return (
    <div className={styles['share-history']} style={style}>
      <SourceContainer content={{ type: 'image', src: profileImg }} />
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
        muralName="PinnnMe"
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

  useEffect(() => {
    if (maxOrderHistory > 5) {
      setOverplus(true);
    }
  }, [history]);

  return (
    <div className={styles['share-history-list']}>
      {history.map((_, index) => {
        // Use random temp image for each history entry
        const randomImage = tempImages[index % tempImages.length];
        return (
          <SourceContainer
            key={index}
            content={{ type: 'image', src: randomImage }}
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
  | { type: 'image'; src: typeof profileImg }
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
        return <IconRenderer config={content.config} renderedSize={5} />;
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
