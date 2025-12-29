'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';
import CompactVariant from '../common/CompactVariant';
import DownloadModal from '@/components/shared/modal/download-modal/DownloadModal';
import VariantToolbar from '@/components/manage/variant-toolbar/VariantToolbar';
import VariantEditForm from '@/components/manage/variant-toolbar/variant-edit-form/VariantEditForm';
import { apiClient } from '@/lib/api-client/apiClient';
import styles from './download-variant.module.scss';

interface DownloadVariantProps {
  iconConfig: IconConfig;
  content: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  isEditing?: boolean;
  maxFileSize?: number;
  maxPreviewSize?: number;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onContentChange?: (value: string) => void;
  onFileChange?: (fileName: string, fileUrl: string, fileSize: number) => void;
  onIconConfigChange?: (config: IconConfig) => void;
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

export default function DownloadVariant({
  content,
  iconConfig,
  fileUrl,
  fileName,
  fileSize,
  isEditing = false,
  maxFileSize,
  maxPreviewSize,
  canMoveUp = true,
  canMoveDown = true,
  onContentChange,
  onFileChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  onIconConfigChange,
}: DownloadVariantProps) {
  const isNewVariant = isEditing && !content && !fileName;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(isNewVariant);
  const [isEditFormOpen, setIsEditFormOpen] = useState(isNewVariant);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewUploading, setIsPreviewUploading] = useState(false);
  const [previewUploadError, setPreviewUploadError] = useState<string | null>(
    null,
  );
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [descriptionTouched, setDescriptionTouched] = useState(false);
  const [formWasClosed, setFormWasClosed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fileError = fileSizeError || uploadError;

  const isDescriptionEmpty = !content.trim();
  const isFileMissing = !fileName || !!fileError;

  const showDescriptionError =
    isEditing && descriptionTouched && isDescriptionEmpty;
  const showFileError =
    isEditing && (!!fileError || (formWasClosed && isFileMissing));
  const hasError =
    isEditing && formWasClosed && (isDescriptionEmpty || isFileMissing);

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
          setDescriptionTouched(true);
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
    setDescriptionTouched(true);
    setIsEditFormOpen(false);
  };

  const handleDone = () => {
    setFormWasClosed(true);
    setDescriptionTouched(true);
    setIsEditFormOpen(false);
    setIsFocused(false);
  };

  const handleDescriptionChange = (value: string) => {
    onContentChange?.(value);
  };

  const handleDescriptionBlur = () => {
    setDescriptionTouched(true);
  };

  const handleFileUpload = async (file: File) => {
    setFileSizeError(null);
    setUploadError(null);

    if (maxFileSize && file.size > maxFileSize) {
      setFileSizeError(`File too large: max ${formatFileSize(maxFileSize)}`);
      return;
    }

    setIsUploading(true);
    try {
      const result = await apiClient.storage.uploadFile(file);
      if (result.success && onFileChange) {
        onFileChange(
          result.data.fileName,
          result.data.publicUrl,
          result.data.fileSize,
        );
      } else if (!result.success) {
        console.error('File upload failed:', result.error);
        setUploadError('Upload failed, try again');
      }
    } catch (error) {
      console.error('File upload error:', error);
      setUploadError('Upload failed, try again');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreviewUpload = async (file: File) => {
    if (!onIconConfigChange) return;

    setPreviewUploadError(null);

    if (maxPreviewSize && file.size > maxPreviewSize) {
      setPreviewUploadError(
        `Too large. Max: ${formatFileSize(maxPreviewSize)}`,
      );
      return;
    }

    setIsPreviewUploading(true);
    try {
      const result = await apiClient.storage.uploadImage(file);
      if (result.success) {
        onIconConfigChange({ type: 'custom', url: result.data.publicUrl });
      } else {
        console.error('Preview upload failed:', result.error);
        setPreviewUploadError('Upload failed');
      }
    } catch (error) {
      console.error('Preview upload error:', error);
      setPreviewUploadError('Upload failed');
    } finally {
      setIsPreviewUploading(false);
    }
  };

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
              title="Edit your download"
              descriptionValue={content}
              descriptionPlaceholder="Add description..."
              srcValue={fileError || fileName}
              srcPlaceholder={fileError || 'Add your file...'}
              srcIcon="fileDown"
              descriptionError={showDescriptionError}
              srcError={showFileError}
              onDescriptionChange={handleDescriptionChange}
              onDescriptionBlur={handleDescriptionBlur}
              onSrcChange={() => {}}
              onBack={handleBackClick}
              onDelete={onDelete}
              onDone={handleDone}
              showFileInput={true}
              fileAccept=".pdf,.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z,.psd,.ai,.eps,.svg,.sketch,.fig,.ttf,.otf,.woff,.woff2"
              onFileSelect={handleFileUpload}
              isUploading={isUploading}
              showPreviewEditor={!!onIconConfigChange}
              variantType="download"
              iconConfig={iconConfig}
              onIconConfigChange={onIconConfigChange}
              onPreviewUpload={handlePreviewUpload}
              isPreviewUploading={isPreviewUploading}
              previewUploadError={previewUploadError || undefined}
              onClearPreviewError={() => setPreviewUploadError(null)}
            />
          )}
        </AnimatePresence>
        <CompactVariant
          content={content || 'Add description...'}
          srcMeta={fileName || 'Add your file...'}
          variantType="download"
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
        srcMeta={fileName}
        variantType="download"
        iconConfig={iconConfig}
        onClick={handleClick}
      />
      <DownloadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        fileUrl={fileUrl}
        fileName={fileName}
        fileSize={fileSize}
      />
    </>
  );
}
