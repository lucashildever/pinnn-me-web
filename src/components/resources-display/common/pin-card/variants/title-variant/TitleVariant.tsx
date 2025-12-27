'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './title-variant.module.scss';
import VariantToolbar from '@/components/manage/variant-toolbar/VariantToolbar';

interface TitleVariantProps {
  content: string;
  editable?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onChange?: (value: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

export default function TitleVariant({
  content,
  editable,
  canMoveUp = true,
  canMoveDown = true,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}: TitleVariantProps) {
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
          className={`${styles['title-variant']} ${styles['editable']}`}
          value={content}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Enter title..."
          autoFocus
          rows={1}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    );
  }

  return <h2 className={styles['title-variant']}>{content}</h2>;
}
