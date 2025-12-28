'use client';

import { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import styles from './image-variant.module.scss';
import Image from 'next/image';
import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';
import VariantToolbar from '@/components/manage/variant-toolbar/VariantToolbar';

interface ImageVariantProps {
  src?: string;
  isEditing?: boolean;
  isUploading?: boolean;
  maxFileSize?: number;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onFileSelect?: (file: File) => void;
  onClearImage?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / 1024).toFixed(0)} KB`;
};

export default function ImageVariant({
  src,
  isEditing = false,
  isUploading = false,
  maxFileSize,
  canMoveUp = true,
  canMoveDown = true,
  onFileSelect,
  onClearImage,
  onMoveUp,
  onMoveDown,
  onDelete,
}: ImageVariantProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAutoOpened = useRef(false);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-open file picker for new variants (only once)
  useEffect(() => {
    if (isEditing && !src && inputRef.current && !hasAutoOpened.current) {
      hasAutoOpened.current = true;
      inputRef.current.click();
    }
  }, [isEditing, src]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        document.body.contains(target)
      ) {
        setIsFocused(false);
      }
    };

    if (isFocused) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFocused]);

  const handleClick = () => {
    if (isEditing && inputRef.current && !src) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (maxFileSize && file.size > maxFileSize) {
      setError(`File too large: max ${formatFileSize(maxFileSize)}`);
      // Clear image so placeholder with error is shown
      onClearImage?.();
      // Reset input so user can select again
      e.target.value = '';
      return;
    }

    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  // Upload placeholder (no image yet)
  if (isEditing && !src) {
    return (
      <div
        className={`${styles['img-variant-container']} ${styles['upload-placeholder']} ${error ? styles['error'] : ''}`}
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
                {error || 'Click to upload image'}
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
        ref={containerRef}
        className={styles['editable-container']}
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles['file-input']}
        />
        <AnimatePresence mode="wait">
          {isFocused && onDelete && (
            <motion.div
              key="toolbar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.15 }}
            >
              <VariantToolbar
                actions={['moveDown', 'moveUp', 'replaceImage']}
                canMoveUp={canMoveUp}
                canMoveDown={canMoveDown}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onReplaceImage={() => inputRef.current?.click()}
                onDelete={onDelete}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
