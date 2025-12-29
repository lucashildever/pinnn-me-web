'use client';

import { useRef, useState } from 'react';
import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';
import IconSelector from '@/components/shared/icon-selector/IconSelector';
import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';
import styles from './preview-editor.module.scss';

type PreviewMode = 'automatic' | 'select' | 'custom';

interface PreviewEditorProps {
  variantType: 'link' | 'download';
  iconConfig: IconConfig;
  onIconConfigChange: (config: IconConfig) => void;
  onCustomUpload: (file: File) => void;
  isUploading?: boolean;
  uploadError?: string;
  onClearError?: () => void;
}

export default function PreviewEditor({
  variantType,
  iconConfig,
  onIconConfigChange,
  onCustomUpload,
  isUploading = false,
  uploadError,
  onClearError,
}: PreviewEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);

  // Determine current mode from iconConfig
  const getCurrentMode = (): PreviewMode => {
    if (iconConfig.type === 'custom') return 'custom';
    if (
      iconConfig.type === 'emoji' ||
      (iconConfig.type === 'predefined' &&
        iconConfig.icon !== 'link' &&
        iconConfig.icon !== 'fileDown')
    ) {
      return 'select';
    }
    return 'automatic';
  };

  const currentMode = getCurrentMode();

  const handleAutomaticClick = () => {
    onClearError?.();
    const defaultIcon = variantType === 'link' ? 'link' : 'fileDown';
    onIconConfigChange({ type: 'predefined', icon: defaultIcon });
  };

  const handleSelectClick = () => {
    onClearError?.();
    setIsIconSelectorOpen(true);
  };

  const handleIconSelect = (config: IconConfig) => {
    onIconConfigChange(config);
  };

  const handleCustomClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCustomUpload(file);
    }
    // Reset input for retry
    e.target.value = '';
  };

  // Render the preview icon based on current config
  const renderPreviewIcon = () => {
    if (isUploading) {
      return (
        <IconRenderer
          config={{ type: 'predefined', icon: 'loading' }}
          renderedSize={10}
        />
      );
    }

    if (iconConfig.type === 'custom') {
      return (
        <IconRenderer
          config={iconConfig}
          style={{ width: '100%', height: '100%' }}
        />
      );
    }

    if (iconConfig.type === 'predefined') {
      return <IconRenderer config={iconConfig} renderedSize={10} />;
    }

    if (iconConfig.type === 'emoji') {
      return <IconRenderer config={iconConfig} renderedSize={10} />;
    }

    // Default for 'none' type
    const defaultIcon = variantType === 'link' ? 'link' : 'fileDown';
    return (
      <IconRenderer
        config={{ type: 'predefined', icon: defaultIcon }}
        renderedSize={10}
      />
    );
  };

  return (
    <div className={styles['preview-editor']}>
      <div className={styles['section-header']}>
        <IconRenderer
          config={{ type: 'predefined', icon: 'image' }}
          renderedSize={5}
        />
        <span>Edit preview</span>
      </div>

      <div className={styles['mode-buttons']}>
        <button
          type="button"
          className={`${styles['mode-button']} ${currentMode === 'automatic' ? styles['active'] : ''}`}
          onClick={handleAutomaticClick}
        >
          <span className={styles['mode-label']}>Automatic</span>
          <IconRenderer
            config={{ type: 'predefined', icon: 'refreshCw' }}
            renderedSize={5}
            style={{ opacity: 0.5 }}
          />
        </button>

        <button
          type="button"
          className={`${styles['mode-button']} ${currentMode === 'select' ? styles['active'] : ''}`}
          onClick={handleSelectClick}
        >
          <span className={styles['mode-label']}>Select icon</span>
          <IconRenderer
            config={{ type: 'predefined', icon: 'chevronDown' }}
            renderedSize={5}
            style={{ opacity: 0.5 }}
          />
        </button>

        <button
          type="button"
          className={`${styles['mode-button']} ${currentMode === 'custom' ? styles['active'] : ''}`}
          onClick={handleCustomClick}
        >
          <span className={styles['mode-label']}>Upload custom</span>
          <IconRenderer
            config={{ type: 'predefined', icon: 'imageUp' }}
            renderedSize={5}
            style={{ opacity: 0.5 }}
          />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className={styles['file-input']}
        onChange={handleFileChange}
      />

      <div className={styles['preview-box']}>
        <div
          className={`${styles['preview-icon']} ${uploadError ? styles['error'] : ''}`}
        >
          {renderPreviewIcon()}
        </div>
        {uploadError && (
          <span className={styles['error-message']}>{uploadError}</span>
        )}
      </div>

      <IconSelector
        isOpen={isIconSelectorOpen}
        onClose={() => setIsIconSelectorOpen(false)}
        onSelect={handleIconSelect}
      />
    </div>
  );
}
