'use client';

import { useRef } from 'react';
import { motion } from 'motion/react';
import styles from './variant-edit-form.module.scss';
import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';
import {
  AppIcon,
  IconConfig,
} from '@/components/shared/icon-renderer/icon/types/app-icon';
import PreviewEditor from './preview-editor/PreviewEditor';

interface VariantEditFormProps {
  title: string;
  descriptionValue: string;
  descriptionPlaceholder: string;
  srcValue: string;
  srcPlaceholder: string;
  srcIcon: AppIcon;
  descriptionError?: boolean;
  srcError?: boolean;
  onDescriptionChange: (value: string) => void;
  onDescriptionBlur?: () => void;
  onSrcChange: (value: string) => void;
  onBack: () => void;
  onDelete: () => void;
  onDone: () => void;
  // Optional file input props
  showFileInput?: boolean;
  fileAccept?: string;
  onFileSelect?: (file: File) => void;
  isUploading?: boolean;
  // Preview editor props
  showPreviewEditor?: boolean;
  variantType?: 'link' | 'download';
  iconConfig?: IconConfig;
  onIconConfigChange?: (config: IconConfig) => void;
  onPreviewUpload?: (file: File) => void;
  isPreviewUploading?: boolean;
  previewUploadError?: string;
  onClearPreviewError?: () => void;
}

export default function VariantEditForm({
  title,
  descriptionValue,
  descriptionPlaceholder,
  srcValue,
  srcPlaceholder,
  srcIcon,
  descriptionError = false,
  srcError = false,
  onDescriptionChange,
  onDescriptionBlur,
  onSrcChange,
  onBack,
  onDelete,
  onDone,
  showFileInput = false,
  fileAccept,
  onFileSelect,
  isUploading = false,
  showPreviewEditor = false,
  variantType,
  iconConfig,
  onIconConfigChange,
  onPreviewUpload,
  isPreviewUploading = false,
  previewUploadError,
  onClearPreviewError,
}: VariantEditFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    // Reset input so user can select same file again on retry
    e.target.value = '';
  };

  return (
    <motion.div
      className={styles['edit-form']}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles['edit-header']}>
        <button
          type="button"
          className={styles['header-button']}
          onMouseDown={(e) => {
            e.preventDefault();
            onBack();
          }}
        >
          <IconRenderer
            config={{ type: 'predefined', icon: 'arrowLeft' }}
            renderedSize={7}
          />
        </button>
        <span className={styles['header-title']}>{title}</span>
        <button
          type="button"
          className={styles['header-button']}
          onMouseDown={(e) => {
            e.preventDefault();
            onDelete();
          }}
        >
          <IconRenderer
            config={{ type: 'predefined', icon: 'trash' }}
            renderedSize={5}
            color="#e57373"
          />
        </button>
      </div>

      <div
        className={`${styles['edit-input-row']} ${descriptionError ? styles['error'] : ''}`}
      >
        <IconRenderer
          config={{ type: 'predefined', icon: 'pencil' }}
          renderedSize={6}
          style={{ opacity: 0.5 }}
        />
        <input
          type="text"
          className={styles['edit-input']}
          placeholder={descriptionPlaceholder}
          value={descriptionValue}
          onChange={(e) => onDescriptionChange(e.target.value)}
          onBlur={onDescriptionBlur}
        />
      </div>

      {showFileInput ? (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept={fileAccept}
            className={styles['file-input']}
            onChange={handleFileChange}
          />
          <div
            className={`${styles['edit-input-row']} ${styles['clickable']} ${srcError ? styles['error'] : ''}`}
            onClick={handleFileClick}
          >
            <IconRenderer
              config={{ type: 'predefined', icon: srcIcon }}
              renderedSize={6}
              style={{ opacity: 0.5 }}
            />
            <span className={styles['file-label']}>
              {isUploading ? 'Uploading...' : srcValue || srcPlaceholder}
            </span>
          </div>
        </>
      ) : (
        <div
          className={`${styles['edit-input-row']} ${srcError ? styles['error'] : ''}`}
        >
          <IconRenderer
            config={{ type: 'predefined', icon: srcIcon }}
            renderedSize={6}
            style={{ opacity: 0.5 }}
          />
          <input
            type="text"
            className={styles['edit-input']}
            placeholder={srcPlaceholder}
            value={srcValue}
            onChange={(e) => onSrcChange(e.target.value)}
          />
        </div>
      )}

      {showPreviewEditor &&
        variantType &&
        iconConfig &&
        onIconConfigChange &&
        onPreviewUpload && (
          <PreviewEditor
            variantType={variantType}
            iconConfig={iconConfig}
            onIconConfigChange={onIconConfigChange}
            onCustomUpload={onPreviewUpload}
            isUploading={isPreviewUploading}
            uploadError={previewUploadError}
            onClearError={onClearPreviewError}
          />
        )}

      <button
        type="button"
        className={styles['done-button']}
        onMouseDown={(e) => {
          e.preventDefault();
          onDone();
        }}
      >
        Done
      </button>
    </motion.div>
  );
}
