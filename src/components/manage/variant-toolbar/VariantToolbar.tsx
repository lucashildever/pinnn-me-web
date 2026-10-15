'use client';

import styles from './variant-toolbar.module.scss';
import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';
import { useVariantDragHandle } from './variant-drag-context';

export type ToolbarAction =
  | 'drag'
  | 'settings'
  | 'toggle'
  | 'replaceImage'
  | 'replaceVideo';

export type VariantType = 'title' | 'text';

interface VariantToolbarProps {
  actions: ToolbarAction[];
  variantType?: VariantType;
  hasSettingsError?: boolean;
  onSettings?: () => void;
  onToggle?: () => void;
  onReplaceImage?: () => void;
  onReplaceVideo?: () => void;
  onDelete: () => void;
}

export default function VariantToolbar({
  actions,
  variantType,
  hasSettingsError = false,
  onSettings,
  onToggle,
  onReplaceImage,
  onReplaceVideo,
  onDelete,
}: VariantToolbarProps) {
  const dragHandle = useVariantDragHandle();

  return (
    <div className={styles['toolbar']}>
      {actions.includes('drag') && (
        <button
          ref={dragHandle?.setActivatorNodeRef}
          type="button"
          className={`${styles['toolbar-button']} ${styles['drag-handle']}`}
          aria-label="Reorder"
          {...dragHandle?.listeners}
          {...dragHandle?.attributes}
          onMouseDown={(e) => e.preventDefault()}
        >
          <IconRenderer
            config={{ type: 'predefined', icon: 'gripVertical' }}
            renderedSize={6}
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
