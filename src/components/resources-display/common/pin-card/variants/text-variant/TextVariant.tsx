'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './text-variant.module.scss';
import VariantToolbar from '@/components/manage/variant-toolbar/VariantToolbar';

interface TextVariantProps {
  content: string;
  editable?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onChange?: (value: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

export default function TextVariant({
  content,
  editable,
  canMoveUp = true,
  canMoveDown = true,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}: TextVariantProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  if (editable) {
    return (
      <div className={styles['editable-container']}>
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
        <textarea
          ref={textareaRef}
          className={`${styles['text-variant']} ${styles['editable']}`}
          value={content}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Enter text..."
          autoFocus
          rows={1}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    );
  }

  return <p className={styles['text-variant']}>{content}</p>;
}
