'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import styles from './text-variant.module.scss';
import VariantToolbar from '@/components/manage/variant-toolbar/VariantToolbar';

interface TextVariantProps {
  content: string;
  editable?: boolean;
  maxLength?: number;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onChange?: (value: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggle?: () => void;
  onDelete?: () => void;
}

export default function TextVariant({
  content,
  editable,
  maxLength,
  canMoveUp = true,
  canMoveDown = true,
  onChange,
  onMoveUp,
  onMoveDown,
  onToggle,
  onDelete,
}: TextVariantProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isOverLimit = maxLength !== undefined && content.length > maxLength;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  if (editable) {
    return (
      <div className={styles['editable-container']}>
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
                actions={['moveDown', 'moveUp', 'toggle']}
                canMoveUp={canMoveUp}
                canMoveDown={canMoveDown}
                variantType="text"
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <textarea
          ref={textareaRef}
          className={`${styles['text-variant']} ${styles['editable']} ${isOverLimit ? styles['error'] : ''}`}
          value={content}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Enter text..."
          autoFocus
          rows={1}
          onFocus={(e) => {
            setIsFocused(true);
            const length = e.target.value.length;
            e.target.setSelectionRange(length, length);
          }}
          onBlur={() => setIsFocused(false)}
        />
        {isOverLimit && (
          <span className={styles['error-message']}>
            Text too long: limit {maxLength}
          </span>
        )}
      </div>
    );
  }

  return <p className={styles['text-variant']}>{content}</p>;
}
