'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';
import styles from './editor-header.module.scss';
import Divider from '@/components/shared/divider/divider';

interface EditorHeaderProps {
  onPublish?: () => void;
  isPublishing?: boolean;
  hasErrors?: boolean;
  title?: string;
  onBack?: () => void;
  errorBanner?: ReactNode;
}

export default function EditorHeader({
  onPublish,
  isPublishing,
  hasErrors,
  title = 'Create Resource',
  onBack,
  errorBanner,
}: EditorHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  return (
    <div className={styles['header-container']}>
      <div className={styles['top-row']}>
        <button
          type="button"
          onClick={handleBack}
          className={styles['back-button']}
        >
          <IconRenderer
            config={{
              type: 'predefined',
              icon: 'chevronLeft',
            }}
            strokeWidth={2}
            renderedSize={6}
          />
          <p>Voltar</p>
        </button>

        <button
          type="button"
          onClick={onPublish}
          disabled={hasErrors || isPublishing}
          className={`${styles['publish-button']} ${hasErrors || isPublishing ? styles['disabled'] : ''}`}
        >
          {isPublishing ? 'Publicando...' : 'Publicar'}
          <IconRenderer
            config={{
              type: 'predefined',
              icon: 'check',
            }}
            strokeWidth={2}
            renderedSize={6}
          />
        </button>
      </div>

      <Divider />

      {errorBanner}

      <div className={styles['title-section']}>
        <h1 className={styles['main-title']}>{title}</h1>
        <p className={styles['sub-text']}>Need help?</p>
      </div>
    </div>
  );
}
