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
import { VariantSelection } from '@/components/manage/add-element/AddElement';
import { apiClient } from '@/lib/api-client/apiClient';

interface EditableVariant {
  id: string;
  type: 'title' | 'text' | 'image' | 'video';
  content: string;
  src?: string;
  isUploading?: boolean;
}

export default function CreateResourcePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [variants, setVariants] = useState<EditableVariant[]>([]);

  // Auth guard - redirect to login if not authenticated
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

    const type = selection as 'title' | 'text' | 'image' | 'video';
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
                  canMoveUp={!isFirst}
                  canMoveDown={!isLast}
                  onChange={(value) => handleVariantChange(variant.id, value)}
                  onMoveUp={() => handleMoveUp(variant.id)}
                  onMoveDown={() => handleMoveDown(variant.id)}
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
                  canMoveUp={!isFirst}
                  canMoveDown={!isLast}
                  onFileSelect={(file) => handleImageUpload(variant.id, file)}
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
                  canMoveUp={!isFirst}
                  canMoveDown={!isLast}
                  onFileSelect={(file) => handleVideoUpload(variant.id, file)}
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
                canMoveUp={!isFirst}
                canMoveDown={!isLast}
                onChange={(value) => handleVariantChange(variant.id, value)}
                onMoveUp={() => handleMoveUp(variant.id)}
                onMoveDown={() => handleMoveDown(variant.id)}
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
