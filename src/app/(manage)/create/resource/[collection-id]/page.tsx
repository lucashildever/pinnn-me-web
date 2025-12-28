'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

interface EditableVariant {
  id: string;
  type: 'title' | 'text' | 'image' | 'video' | 'link' | 'download';
  content: string;
  src?: string;
  link?: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  isUploading?: boolean;
}

export default function CreateResourcePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [variants, setVariants] = useState<EditableVariant[]>([]);
  const limits = useAppSelector(selectLimits);

  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.replace('/login');
        return;
      }

      const isValid = await apiClient.auth.validateToken();

      if (!isValid) {
        localStorage.removeItem('token');
        router.replace('/login');
      } else {
        setIsAuthenticated(true);
      }
    };

    validateAuth();
  }, [router]);

  // Show nothing while checking auth
  if (isAuthenticated === null) {
    return null;
  }

  const handleAddVariant = (selection: VariantSelection) => {
    // Handle integration variants separately if needed
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
    const newVariant: EditableVariant = {
      id: crypto.randomUUID(),
      type,
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
      prev.map((v) => (v.id === id ? { ...v, isUploading: true } : v)),
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
          prev.map((v) => (v.id === id ? { ...v, isUploading: false } : v)),
        );
      }
    } catch (error) {
      console.error('Upload error:', error);
      setVariants((prev) =>
        prev.map((v) => (v.id === id ? { ...v, isUploading: false } : v)),
      );
    }
  };

  const handleVideoUpload = async (id: string, file: File) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isUploading: true } : v)),
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
          prev.map((v) => (v.id === id ? { ...v, isUploading: false } : v)),
        );
      }
    } catch (error) {
      console.error('Video upload error:', error);
      setVariants((prev) =>
        prev.map((v) => (v.id === id ? { ...v, isUploading: false } : v)),
      );
    }
  };

  const handleMoveUp = (id: string) => {
    setVariants((prev) => {
      const index = prev.findIndex((v) => v.id === id);
      if (index <= 0) return prev;
      const newVariants = [...prev];
      [newVariants[index - 1], newVariants[index]] = [
        newVariants[index],
        newVariants[index - 1],
      ];
      return newVariants;
    });
  };

  const handleMoveDown = (id: string) => {
    setVariants((prev) => {
      const index = prev.findIndex((v) => v.id === id);
      if (index < 0 || index >= prev.length - 1) return prev;
      const newVariants = [...prev];
      [newVariants[index], newVariants[index + 1]] = [
        newVariants[index + 1],
        newVariants[index],
      ];
      return newVariants;
    });
  };

  const handleDelete = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <main className={styles['page-container']}>
      <div
        className={`${muralStyles['mural-container']} ${styles['mural-container-wrapper']}`}
      >
        <PinCard variants={[]}>
          <AddElement label="Add content" onSelect={handleAddVariant} />
          {variants.map((variant, index) => {
            const isFirst = index === 0;
            const isLast = index === variants.length - 1;

            if (variant.type === 'title') {
              return (
                <TitleVariant
                  key={variant.id}
                  content={variant.content}
                  editable
                  maxLength={limits?.title_variant_max_length}
                  canMoveUp={!isFirst}
                  canMoveDown={!isLast}
                  onChange={(value) => handleVariantChange(variant.id, value)}
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
                  maxFileSize={limits?.image_size_limit}
                  canMoveUp={!isFirst}
                  canMoveDown={!isLast}
                  onFileSelect={(file) => handleImageUpload(variant.id, file)}
                  onClearImage={() =>
                    setVariants((prev) =>
                      prev.map((v) =>
                        v.id === variant.id ? { ...v, src: undefined } : v,
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
                  maxFileSize={limits?.video_size_limit}
                  canMoveUp={!isFirst}
                  canMoveDown={!isLast}
                  onFileSelect={(file) => handleVideoUpload(variant.id, file)}
                  onClearVideo={() =>
                    setVariants((prev) =>
                      prev.map((v) =>
                        v.id === variant.id ? { ...v, src: undefined } : v,
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
                  iconConfig={{ type: 'none' }}
                  content={variant.content}
                  link={variant.link || ''}
                  isEditing={true}
                  canMoveUp={!isFirst}
                  canMoveDown={!isLast}
                  onContentChange={(value) =>
                    handleVariantChange(variant.id, value)
                  }
                  onLinkChange={(value) => handleLinkChange(variant.id, value)}
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
                  iconConfig={{ type: 'none' }}
                  content={variant.content}
                  fileUrl={variant.fileUrl || ''}
                  fileName={variant.fileName || ''}
                  fileSize={variant.fileSize || 0}
                  isEditing={true}
                  maxFileSize={limits?.file_size_limit}
                  canMoveUp={!isFirst}
                  canMoveDown={!isLast}
                  onContentChange={(value) =>
                    handleVariantChange(variant.id, value)
                  }
                  onFileChange={(fileName, fileUrl, fileSize) =>
                    handleFileChange(variant.id, fileName, fileUrl, fileSize)
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
                onChange={(value) => handleVariantChange(variant.id, value)}
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
    </main>
  );
}
