'use client';

import { useState } from 'react';
import AuthProvider from '@/components/providers/auth-provider/AuthProvider';
import PinCard from '@/components/resources-display/common/pin-card/PinCard';
import styles from './create-resource.module.scss';
import muralStyles from '@/components/mural/mural-container.module.scss';
import AddElement from '@/components/manage/add-element/AddElement';
import TitleVariant from '@/components/resources-display/common/pin-card/variants/title-variant/TitleVariant';
import TextVariant from '@/components/resources-display/common/pin-card/variants/text-variant/TextVariant';
import ImageVariant from '@/components/resources-display/common/pin-card/variants/image-variant/ImageVariant';
import VideoVariant from '@/components/resources-display/common/pin-card/variants/video-variant/VideoVariant';
import LinkVariant from '@/components/resources-display/common/pin-card/variants/link-variant/LinkVariant';
import DownloadVariant from '@/components/resources-display/common/pin-card/variants/download-variant/DownloadVariant';
import { VariantSelection } from '@/components/manage/add-element/AddElement';
import { apiClient } from '@/lib/api-client/apiClient';
import { useAppSelector } from '@/lib/state/hooks';
import { selectLimits } from '@/lib/state/slices/authSlice';

import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';
import {
  generateNextOrder,
  generateOrderBetween,
} from '@/lib/utils/fractional-index';
import EditorHeader from '../../_components/editor-header/EditorHeader';
import Clickable from '@/components/shared/clickable/Clickable';

interface EditableVariant {
  id: string;
  type: 'title' | 'text' | 'image' | 'video' | 'link' | 'download';
  order: string;
  content: string;
  src?: string;
  link?: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  isUploading?: boolean;
  uploadError?: string;
  iconConfig?: IconConfig;
}

export default function CreateResourcePage() {
  const [variants, setVariants] = useState<EditableVariant[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const limits = useAppSelector(selectLimits);

  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');

  const handleAddVariant = (selection: VariantSelection) => {
    if (typeof selection === 'object' && selection.type === 'integration') {
      console.log('Integration variant:', selection.platform);
      return;
    }

    const type = selection as
      | 'title'
      | 'text'
      | 'image'
      | 'video'
      | 'link'
      | 'download';

    // Get smallest existing order to prepend new variant at top
    const sortedVariants = [...variants].sort((a, b) =>
      a.order.localeCompare(b.order),
    );
    const firstOrder = sortedVariants[0]?.order || null;
    const newOrder = generateOrderBetween(null, firstOrder);

    const newVariant: EditableVariant = {
      id: crypto.randomUUID(),
      type,
      order: newOrder,
      content: '',
    };
    setVariants((prev) => [newVariant, ...prev]);
  };

  const handleVariantChange = (id: string, content: string) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, content } : v)),
    );
  };

  const handleLinkChange = (id: string, link: string) => {
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, link } : v)));
  };

  const handleFileChange = (
    id: string,
    fileName: string,
    fileUrl: string,
    fileSize: number,
  ) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, fileName, fileUrl, fileSize } : v,
      ),
    );
  };

  const handleToggleVariant = (id: string) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const newType = v.type === 'title' ? 'text' : 'title';
          return { ...v, type: newType };
        }
        return v;
      }),
    );
  };

  const handleImageUpload = async (id: string, file: File) => {
    // Set uploading state
    setVariants((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, isUploading: true, uploadError: undefined } : v,
      ),
    );

    try {
      const result = await apiClient.storage.uploadImage(file);

      if (result.success) {
        setVariants((prev) =>
          prev.map((v) =>
            v.id === id
              ? { ...v, src: result.data.publicUrl, isUploading: false }
              : v,
          ),
        );
      } else {
        console.error('Upload failed:', result.message);
        setVariants((prev) =>
          prev.map((v) =>
            v.id === id
              ? {
                  ...v,
                  isUploading: false,
                  uploadError: 'Upload failed, try again',
                }
              : v,
          ),
        );
      }
    } catch (error) {
      console.error('Upload error:', error);
      setVariants((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                isUploading: false,
                uploadError: 'Upload failed, try again',
              }
            : v,
        ),
      );
    }
  };

  const handleVideoUpload = async (id: string, file: File) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, isUploading: true, uploadError: undefined } : v,
      ),
    );

    try {
      const result = await apiClient.storage.uploadVideo(file);

      if (result.success) {
        setVariants((prev) =>
          prev.map((v) =>
            v.id === id
              ? { ...v, src: result.data.publicUrl, isUploading: false }
              : v,
          ),
        );
      } else {
        console.error('Video upload failed:', result.message);
        setVariants((prev) =>
          prev.map((v) =>
            v.id === id
              ? {
                  ...v,
                  isUploading: false,
                  uploadError: 'Upload failed, try again',
                }
              : v,
          ),
        );
      }
    } catch (error) {
      console.error('Video upload error:', error);
      setVariants((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                isUploading: false,
                uploadError: 'Upload failed, try again',
              }
            : v,
        ),
      );
    }
  };

  const handleMoveUp = (id: string) => {
    setVariants((prev) => {
      const sorted = [...prev].sort((a, b) => a.order.localeCompare(b.order));
      const index = sorted.findIndex((v) => v.id === id);
      if (index <= 0) return prev;

      // Calculate new order between the one above and two above
      const orderAbove = sorted[index - 1].order;
      const orderTwoAbove = sorted[index - 2]?.order || null;
      const newOrder = generateOrderBetween(orderTwoAbove, orderAbove);

      return prev.map((v) => (v.id === id ? { ...v, order: newOrder } : v));
    });
  };

  const handleMoveDown = (id: string) => {
    setVariants((prev) => {
      const sorted = [...prev].sort((a, b) => a.order.localeCompare(b.order));
      const index = sorted.findIndex((v) => v.id === id);
      if (index < 0 || index >= sorted.length - 1) return prev;

      // Calculate new order between the one below and two below
      const orderBelow = sorted[index + 1].order;
      const orderTwoBelow = sorted[index + 2]?.order || null;
      const newOrder = generateOrderBetween(orderBelow, orderTwoBelow);

      return prev.map((v) => (v.id === id ? { ...v, order: newOrder } : v));
    });
  };

  const handleDelete = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  // Validate all variants and return if any has errors
  const getVariantErrors = (): boolean => {
    if (variants.length === 0) return true;

    return variants.some((v) => {
      switch (v.type) {
        case 'title':
        case 'text':
          return !v.content.trim();
        case 'image':
        case 'video':
          return !v.src || v.isUploading;
        case 'link':
          return !v.content.trim() || !v.link;
        case 'download':
          return !v.content.trim() || !v.fileUrl;
        default:
          return false;
      }
    });
  };

  const hasErrors = getVariantErrors();

  const handlePublish = async () => {
    if (hasErrors || isPublishing || !selectedCollectionId) return;

    setIsPublishing(true);

    try {
      const variantsPayload = variants.map((v) => {
        let config;

        switch (v.type) {
          case 'title':
            config = { type: 'title' as const, content: v.content };
            break;
          case 'text':
            config = { type: 'text' as const, content: v.content };
            break;
          case 'image':
            config = { type: 'image' as const, src: v.src! };
            break;
          case 'video':
            config = { type: 'video' as const, src: v.src! };
            break;
          case 'link':
            config = {
              type: 'link' as const,
              content: v.content,
              src: v.link!,
              iconConfig: v.iconConfig || {
                type: 'predefined' as const,
                icon: 'link',
              },
            };
            break;
          case 'download':
            config = {
              type: 'download' as const,
              content: v.content,
              src: v.fileUrl!,
              iconConfig: v.iconConfig || {
                type: 'predefined' as const,
                icon: 'fileDown',
              },
              fileName: v.fileName!,
              fileSize: v.fileSize!,
            };
            break;
          default:
            throw new Error(`Unknown variant type: ${v.type}`);
        }

        return { order: v.order, config };
      });

      const result = await apiClient.resources.createPinResource(
        selectedCollectionId,
        {
          variants: variantsPayload,
        },
      );

      if (result.success) {
        console.log('Resource created successfully:', result.data);
        // TODO: redirect to resource page or show success
      } else {
        console.error('Failed to create resource:', result.message);
      }
    } catch (error) {
      console.error('Publish error:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <AuthProvider>
      <main className={styles['page-container']}>
        <div
          className={`${muralStyles['mural-container']} ${styles['mural-container-wrapper']}`}
        >
          <EditorHeader
            onPublish={handlePublish}
            isPublishing={isPublishing}
            hasErrors={hasErrors}
          />
          <div className={styles['editor-content']}>
            <div className={styles['coll-selector-container']}>
              <Clickable
                payload={{
                  iconConfig: { type: 'predefined', icon: 'chevronDown' },
                }}
                config={{
                  clickableType: 'collection-selector',
                  selectedCollectionId,
                  onSelect: setSelectedCollectionId,
                }}
              />
            </div>
            <PinCard variants={[]}>
              <AddElement label="Add content" onSelect={handleAddVariant} />
              {[...variants]
                .sort((a, b) => a.order.localeCompare(b.order))
                .map((variant, index, sortedArray) => {
                  const isFirst = index === 0;
                  const isLast = index === sortedArray.length - 1;

                  if (variant.type === 'title') {
                    return (
                      <TitleVariant
                        key={variant.id}
                        content={variant.content}
                        editable
                        maxLength={limits?.title_variant_max_length}
                        canMoveUp={!isFirst}
                        canMoveDown={!isLast}
                        onChange={(value) =>
                          handleVariantChange(variant.id, value)
                        }
                        onMoveUp={() => handleMoveUp(variant.id)}
                        onMoveDown={() => handleMoveDown(variant.id)}
                        onToggle={() => handleToggleVariant(variant.id)}
                        onDelete={() => handleDelete(variant.id)}
                      />
                    );
                  }

                  if (variant.type === 'image') {
                    return (
                      <ImageVariant
                        key={variant.id}
                        src={variant.src}
                        isEditing={true}
                        isUploading={variant.isUploading}
                        uploadError={variant.uploadError}
                        maxFileSize={limits?.image_size_limit}
                        canMoveUp={!isFirst}
                        canMoveDown={!isLast}
                        onFileSelect={(file) =>
                          handleImageUpload(variant.id, file)
                        }
                        onClearImage={() =>
                          setVariants((prev) =>
                            prev.map((v) =>
                              v.id === variant.id
                                ? { ...v, src: undefined }
                                : v,
                            ),
                          )
                        }
                        onMoveUp={() => handleMoveUp(variant.id)}
                        onMoveDown={() => handleMoveDown(variant.id)}
                        onDelete={() => handleDelete(variant.id)}
                      />
                    );
                  }

                  if (variant.type === 'video') {
                    return (
                      <VideoVariant
                        key={variant.id}
                        src={variant.src}
                        isEditing={true}
                        isUploading={variant.isUploading}
                        uploadError={variant.uploadError}
                        maxFileSize={limits?.video_size_limit}
                        canMoveUp={!isFirst}
                        canMoveDown={!isLast}
                        onFileSelect={(file) =>
                          handleVideoUpload(variant.id, file)
                        }
                        onClearVideo={() =>
                          setVariants((prev) =>
                            prev.map((v) =>
                              v.id === variant.id
                                ? { ...v, src: undefined }
                                : v,
                            ),
                          )
                        }
                        onMoveUp={() => handleMoveUp(variant.id)}
                        onMoveDown={() => handleMoveDown(variant.id)}
                        onDelete={() => handleDelete(variant.id)}
                      />
                    );
                  }

                  if (variant.type === 'link') {
                    return (
                      <LinkVariant
                        key={variant.id}
                        iconConfig={
                          variant.iconConfig || {
                            type: 'predefined',
                            icon: 'link',
                          }
                        }
                        content={variant.content}
                        link={variant.link || ''}
                        isEditing={true}
                        maxPreviewSize={limits?.image_size_limit}
                        canMoveUp={!isFirst}
                        canMoveDown={!isLast}
                        onContentChange={(value) =>
                          handleVariantChange(variant.id, value)
                        }
                        onLinkChange={(value) =>
                          handleLinkChange(variant.id, value)
                        }
                        onIconConfigChange={(config) =>
                          setVariants((prev) =>
                            prev.map((v) =>
                              v.id === variant.id
                                ? { ...v, iconConfig: config }
                                : v,
                            ),
                          )
                        }
                        onMoveUp={() => handleMoveUp(variant.id)}
                        onMoveDown={() => handleMoveDown(variant.id)}
                        onDelete={() => handleDelete(variant.id)}
                      />
                    );
                  }

                  if (variant.type === 'download') {
                    return (
                      <DownloadVariant
                        key={variant.id}
                        iconConfig={
                          variant.iconConfig || {
                            type: 'predefined',
                            icon: 'fileDown',
                          }
                        }
                        content={variant.content}
                        fileUrl={variant.fileUrl || ''}
                        fileName={variant.fileName || ''}
                        fileSize={variant.fileSize || 0}
                        isEditing={true}
                        maxFileSize={limits?.file_size_limit}
                        maxPreviewSize={limits?.image_size_limit}
                        canMoveUp={!isFirst}
                        canMoveDown={!isLast}
                        onContentChange={(value) =>
                          handleVariantChange(variant.id, value)
                        }
                        onFileChange={(fileName, fileUrl, fileSize) =>
                          handleFileChange(
                            variant.id,
                            fileName,
                            fileUrl,
                            fileSize,
                          )
                        }
                        onIconConfigChange={(config) =>
                          setVariants((prev) =>
                            prev.map((v) =>
                              v.id === variant.id
                                ? { ...v, iconConfig: config }
                                : v,
                            ),
                          )
                        }
                        onMoveUp={() => handleMoveUp(variant.id)}
                        onMoveDown={() => handleMoveDown(variant.id)}
                        onDelete={() => handleDelete(variant.id)}
                      />
                    );
                  }

                  return (
                    <TextVariant
                      key={variant.id}
                      content={variant.content}
                      editable
                      maxLength={limits?.text_variant_max_length}
                      canMoveUp={!isFirst}
                      canMoveDown={!isLast}
                      onChange={(value) =>
                        handleVariantChange(variant.id, value)
                      }
                      onMoveUp={() => handleMoveUp(variant.id)}
                      onMoveDown={() => handleMoveDown(variant.id)}
                      onToggle={() => handleToggleVariant(variant.id)}
                      onDelete={() => handleDelete(variant.id)}
                    />
                  );
                })}
            </PinCard>
            <AddElement label="Add pin" />
          </div>
        </div>
      </main>
    </AuthProvider>
  );
}
