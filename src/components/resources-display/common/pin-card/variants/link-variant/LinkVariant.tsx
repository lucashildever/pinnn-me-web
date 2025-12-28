'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';
import CompactVariant from '../common/CompactVariant';
import ExternalLinkModal from '@/components/shared/modal/external-link-modal/ExternalLinkModal';
import VariantToolbar from '@/components/manage/variant-toolbar/VariantToolbar';
import VariantEditForm from '@/components/manage/variant-toolbar/variant-edit-form/VariantEditForm';
import { extractDomain } from './utils/extractDomain';
import { isValidUrl } from './utils/isValidUrl';
import styles from './link-variant.module.scss';

interface LinkVariantProps {
  iconConfig: IconConfig;
  content: string;
  link: string;
  isEditing?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onContentChange?: (value: string) => void;
  onLinkChange?: (value: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

export default function LinkVariant({
  content,
  iconConfig,
  link,
  isEditing = false,
  canMoveUp = true,
  canMoveDown = true,
  onContentChange,
  onLinkChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}: LinkVariantProps) {
  const isNewVariant = isEditing && !content && !link;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(isNewVariant);
  const [isEditFormOpen, setIsEditFormOpen] = useState(isNewVariant);
  const [descriptionTouched, setDescriptionTouched] = useState(false);
  const [linkStartedTyping, setLinkStartedTyping] = useState(!!link);
  const [formWasClosed, setFormWasClosed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Base validation (always computed)
  const isDescriptionEmpty = !content.trim();
  const isLinkInvalid = !isValidUrl(link);

  // Errors for form inputs (with touched logic)
  const showDescriptionError =
    isEditing && descriptionTouched && isDescriptionEmpty;
  const showLinkError = isEditing && linkStartedTyping && isLinkInvalid;

  // Errors for toolbar/card (only after form was closed)
  const hasError =
    isEditing && formWasClosed && (isDescriptionEmpty || isLinkInvalid);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        document.body.contains(target)
      ) {
        setIsFocused(false);
        if (isEditFormOpen) {
          setFormWasClosed(true);
        }
        setIsEditFormOpen(false);
      }
    };

    if (isFocused) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFocused, isEditFormOpen]);

  const handleClick = () => {
    if (!isEditing) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSettingsClick = () => {
    setIsEditFormOpen(true);
  };

  const handleBackClick = () => {
    setFormWasClosed(true);
    setIsEditFormOpen(false);
  };

  const handleDone = () => {
    setFormWasClosed(true);
    setIsEditFormOpen(false);
    setIsFocused(false);
  };

  const handleDescriptionChange = (value: string) => {
    onContentChange?.(value);
  };

  const handleDescriptionBlur = () => {
    setDescriptionTouched(true);
  };

  const handleLinkChange = (value: string) => {
    if (!linkStartedTyping && value.length > 0) {
      setLinkStartedTyping(true);
    }
    onLinkChange?.(value);
  };

  const displaySrcMeta = link
    ? isValidUrl(link)
      ? extractDomain(link)
      : link
    : 'Paste link...';

  if (isEditing) {
    return (
      <div
        ref={containerRef}
        className={styles['editable-container']}
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
      >
        <AnimatePresence mode="wait">
          {isFocused && !isEditFormOpen && onDelete && (
            <motion.div
              key="toolbar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.15 }}
            >
              <VariantToolbar
                actions={['moveDown', 'moveUp', 'settings']}
                canMoveUp={canMoveUp}
                canMoveDown={canMoveDown}
                hasSettingsError={hasError}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onSettings={handleSettingsClick}
                onDelete={onDelete}
              />
            </motion.div>
          )}
          {isFocused && isEditFormOpen && onDelete && (
            <VariantEditForm
              key="editform"
              title="Edit your link"
              descriptionValue={content}
              descriptionPlaceholder="Add description..."
              srcValue={link}
              srcPlaceholder="Paste link..."
              srcIcon="link"
              descriptionError={showDescriptionError}
              srcError={showLinkError}
              onDescriptionChange={handleDescriptionChange}
              onDescriptionBlur={handleDescriptionBlur}
              onSrcChange={handleLinkChange}
              onBack={handleBackClick}
              onDelete={onDelete}
              onDone={handleDone}
            />
          )}
        </AnimatePresence>
        <CompactVariant
          content={content || 'Add description...'}
          srcMeta={displaySrcMeta}
          variantType="link"
          iconConfig={iconConfig}
          hasError={hasError}
        />
      </div>
    );
  }

  return (
    <>
      <CompactVariant
        content={content}
        srcMeta={link}
        variantType="link"
        iconConfig={iconConfig}
        onClick={handleClick}
      />
      <ExternalLinkModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        link={link}
      />
    </>
  );
}
