'use client';

import Icon from '@/components/shared/icon-renderer/icon/Icon';
import styles from './share-history.module.scss';
import { HistoryEntry } from '../../types/history-entry';

import { useAppSelector } from '@/lib/state/hooks';
import { selectMuralId } from '@/lib/state/slices/muralSlice';
import { useEffect, useState } from 'react';

interface ShareHistoryProps {
  shareHistory: HistoryEntry[];
}

export default function ShareHistory({ shareHistory }: ShareHistoryProps) {
  const muralId = useAppSelector(selectMuralId);

  return (
    <div className={styles['share-history']}>
      <SourceContainer />
      <Icon iconName="repeat" />{' '}
      {/* usar iconRenderer -> talvez seja necessario alterar ele */}
      <HistorySourcesRenderer history={shareHistory} />
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
        return <SourceContainer key={index} />;
      })}
      {overplus && <SourceContainer excessNumber={maxOrderHistory - 5} />}
    </div>
  );
}

interface SourceContainerProps {
  excessNumber?: number;
}

function SourceContainer({ excessNumber }: SourceContainerProps) {
  return (
    <div
      className={`
        ${styles['source-container']}
        ${excessNumber ? styles['excess-number'] : ''}
      `}
    >
      {excessNumber ? <span>+{excessNumber}</span> : null}
    </div>
  );
}
