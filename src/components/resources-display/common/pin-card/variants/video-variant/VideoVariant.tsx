'use client';

import { useRef, useState } from 'react';
import styles from './video-variant.module.scss';
import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';
import VariantToolbar from '@/components/manage/variant-toolbar/VariantToolbar';

interface VideoVariantProps {
  src?: string;
  isEditing?: boolean;
  isUploading?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onFileSelect?: (file: File) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

export default function VideoVariant({
  src,
  isEditing = false,
  isUploading = false,
  canMoveUp = true,
  canMoveDown = true,
  onFileSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
}: VideoVariantProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = () => {
    if (isEditing && inputRef.current && !src) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  // Upload placeholder (no video yet)
  if (isEditing && !src) {
    return (
      <div
        className={`${styles['container']} ${styles['upload-placeholder']}`}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className={styles['file-input']}
        />
        <div className={styles['placeholder-content']}>
          {isUploading ? (
            <IconRenderer
              config={{ type: 'predefined', icon: 'loading' }}
              renderedSize={8}
            />
          ) : (
            <>
              <IconRenderer
                config={{ type: 'predefined', icon: 'video' }}
                renderedSize={10}
                style={{ opacity: 0.5 }}
              />
              <span className={styles['placeholder-text']}>
                Click to upload video
              </span>
            </>
          )}
        </div>
      </div>
    );
  }

  // Editing mode with video uploaded
  if (isEditing && src) {
    return (
      <div
        className={styles['editable-container']}
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {isFocused && onDelete && (
          <VariantToolbar
            actions={['moveDown', 'moveUp']}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onDelete={onDelete}
          />
        )}
        <div className={styles['container']}>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            src={src}
            className={styles.video}
            controls
            autoPlay
            muted
            loop
          />
        </div>
      </div>
    );
  }

  // Display mode (not editing)
  return (
    <div className={styles['container']}>
      {src && (
        /* eslint-disable-next-line jsx-a11y/media-has-caption */
        <video
          src={src}
          className={styles.video}
          controls={false}
          autoPlay
          muted
          loop
        />
      )}
    </div>
  );
}
