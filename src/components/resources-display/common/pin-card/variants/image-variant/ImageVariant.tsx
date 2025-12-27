'use client';

import { useRef, useState } from 'react';
import styles from './image-variant.module.scss';
import Image from 'next/image';
import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';
import VariantToolbar from '@/components/manage/variant-toolbar/VariantToolbar';

interface ImageVariantProps {
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

export default function ImageVariant({
  src,
  isEditing = false,
  isUploading = false,
  canMoveUp = true,
  canMoveDown = true,
  onFileSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
}: ImageVariantProps) {
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

  // Upload placeholder (no image yet)
  if (isEditing && !src) {
    return (
      <div
        className={`${styles['img-variant-container']} ${styles['upload-placeholder']}`}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
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
                config={{ type: 'predefined', icon: 'image' }}
                renderedSize={10}
                style={{ opacity: 0.5 }}
              />
              <span className={styles['placeholder-text']}>
                Click to upload image
              </span>
            </>
          )}
        </div>
      </div>
    );
  }

  // Editing mode with image uploaded
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
        <div className={styles['img-variant-container']}>
          <Image
            src={src}
            alt="Pin Image"
            className={styles.image}
            width={800}
            height={600}
            style={{ width: '100%', height: 'auto' }}
            unoptimized
          />
        </div>
      </div>
    );
  }

  // Display mode (not editing)
  return (
    <div className={styles['img-variant-container']}>
      {src && (
        <Image
          src={src}
          alt="Pin Image"
          className={styles.image}
          width={800}
          height={600}
          style={{ width: '100%', height: 'auto' }}
          unoptimized
        />
      )}
    </div>
  );
}
