'use client';

import styles from './variant-toolbar.module.scss';
import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';

export type ToolbarAction =
  | 'moveUp'
  | 'moveDown'
  | 'settings'
  | 'toggle'
  | 'replaceImage'
  | 'replaceVideo';

export type VariantType = 'title' | 'text';

interface VariantToolbarProps {
  actions: ToolbarAction[];
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  variantType?: VariantType;
  hasSettingsError?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onSettings?: () => void;
  onToggle?: () => void;
  onReplaceImage?: () => void;
  onReplaceVideo?: () => void;
  onDelete: () => void;
}

export default function VariantToolbar({
  actions,
  canMoveUp = true,
  canMoveDown = true,
  variantType,
  hasSettingsError = false,
  onMoveUp,
  onMoveDown,
  onSettings,
  onToggle,
  onReplaceImage,
  onReplaceVideo,
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
      {actions.includes('settings') && (
        <button
          type="button"
          className={`${styles['toolbar-button']} ${hasSettingsError ? styles['error'] : ''}`}
          onMouseDown={(e) => {
            e.preventDefault();
            onSettings?.();
          }}
        >
          <IconRenderer
            config={{ type: 'predefined', icon: 'settings' }}
            renderedSize={6}
          />
        </button>
      )}
      {actions.includes('toggle') && variantType && (
        <button
          type="button"
          className={styles['toolbar-button']}
          onMouseDown={(e) => {
            e.preventDefault();
            onToggle?.();
          }}
        >
          <IconRenderer
            config={{ type: 'predefined', icon: variantType }}
            renderedSize={6}
          />
        </button>
      )}
      {actions.includes('replaceImage') && (
        <button
          type="button"
          className={styles['toolbar-button']}
          onMouseDown={(e) => {
            e.preventDefault();
            onReplaceImage?.();
          }}
        >
          <IconRenderer
            config={{ type: 'predefined', icon: 'imageUp' }}
            renderedSize={6}
          />
        </button>
      )}
      {actions.includes('replaceVideo') && (
        <button
          type="button"
          className={styles['toolbar-button']}
          onMouseDown={(e) => {
            e.preventDefault();
            onReplaceVideo?.();
          }}
        >
          <IconRenderer
            config={{ type: 'predefined', icon: 'video' }}
            renderedSize={6}
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
