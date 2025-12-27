'use client';

import styles from './variant-toolbar.module.scss';
import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';

export type ToolbarAction = 'moveUp' | 'moveDown';

interface VariantToolbarProps {
  actions: ToolbarAction[];
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete: () => void;
}

export default function VariantToolbar({
  actions,
  canMoveUp = true,
  canMoveDown = true,
  onMoveUp,
  onMoveDown,
  onDelete,
}: VariantToolbarProps) {
  return (
    <div className={styles['toolbar']}>
      {actions.includes('moveDown') && (
        <button
          type="button"
          className={`${styles['toolbar-button']} ${!canMoveDown ? styles['disabled'] : ''}`}
          onMouseDown={(e) => {
            e.preventDefault();
            if (canMoveDown) onMoveDown?.();
          }}
        >
          <IconRenderer
            config={{ type: 'predefined', icon: 'chevronDown' }}
            renderedSize={8}
          />
        </button>
      )}
      {actions.includes('moveUp') && (
        <button
          type="button"
          className={`${styles['toolbar-button']} ${!canMoveUp ? styles['disabled'] : ''}`}
          onMouseDown={(e) => {
            e.preventDefault();
            if (canMoveUp) onMoveUp?.();
          }}
        >
          <IconRenderer
            config={{ type: 'predefined', icon: 'chevronUp' }}
            renderedSize={8}
          />
        </button>
      )}
      <button
        type="button"
        className={styles['toolbar-button']}
        onMouseDown={(e) => {
          e.preventDefault();
          onDelete();
        }}
      >
        <IconRenderer
          config={{ type: 'predefined', icon: 'trash' }}
          renderedSize={5}
          color="#e57373"
          style={{
            transform: 'scale(1.1)',
          }}
        />
      </button>
    </div>
  );
}
