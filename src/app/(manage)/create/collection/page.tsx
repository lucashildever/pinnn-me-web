'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import AuthGuard from '@/components/auth-guard';
import EditorHeader from '../../_components/editor-header/EditorHeader';
import DisplayElement from '@/components/shared/clickable/display-element/DisplayElement';
import IconSelector from '@/components/shared/icon-selector/IconSelector';
import { apiClient } from '@/lib/api-client/apiClient';
import { useUserMurals } from '@/components/mural/utils/useUserMurals';
import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';

import styles from './create-collection.module.scss';

const CONTENT_MAX = 15;
const DEFAULT_ICON: IconConfig = { type: 'predefined', icon: 'link' };

export default function CreateCollectionPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: muralsData } = useUserMurals();

  const [content, setContent] = useState('');
  const [iconConfig, setIconConfig] = useState<IconConfig>(DEFAULT_ICON);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const muralId =
    muralsData?.activeMuralId ?? muralsData?.murals[0]?.id ?? '';
  const trimmedContent = content.trim();
  const isContentValid =
    trimmedContent.length > 0 && trimmedContent.length <= CONTENT_MAX;
  const hasErrors = !isContentValid || !muralId;

  const createMutation = useMutation({
    mutationFn: async () => {
      const result = await apiClient.collection.create({
        muralId,
        isMain: false,
        displayElement: { content: trimmedContent, iconConfig },
      });

      if (!result.success) {
        throw new Error(
          result.message || 'Não foi possível criar a collection',
        );
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', muralId] });
      router.back();
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!hasErrors) {
      createMutation.mutate();
    }
  };

  return (
    <AuthGuard>
      <div className={styles['page-container']}>
        <EditorHeader
          title="Criar collection"
          onPublish={() => {
            setErrorMessage(null);
            if (!hasErrors) {
              createMutation.mutate();
            }
          }}
          isPublishing={createMutation.isPending}
          hasErrors={hasErrors}
        />

        <form className={styles['form']} onSubmit={handleSubmit}>
          <div className={styles['field']}>
            <label>Aparência da aba</label>
            <button
              type="button"
              className={styles['icon-button']}
              onClick={() => setIsIconSelectorOpen(true)}
            >
              <DisplayElement
                iconConfig={iconConfig}
                label={trimmedContent || 'Nome da aba'}
              />
            </button>
            <p className={styles['helper-txt']}>
              Escolha o ícone que representa esta collection no mural.
            </p>
          </div>

          <div className={styles['field']}>
            <label htmlFor="collection-content">Nome da aba</label>
            <input
              id="collection-content"
              type="text"
              placeholder="Links"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={CONTENT_MAX}
              required
            />
            <p className={styles['helper-txt']}>
              {content.length}/{CONTENT_MAX} caracteres
            </p>
          </div>

          {!muralId && (
            <p className={styles['error-txt']} role="alert">
              Nenhum mural ativo encontrado.
            </p>
          )}

          <button
            type="submit"
            className={styles['submit-button']}
            disabled={hasErrors || createMutation.isPending}
          >
            {createMutation.isPending ? 'Criando...' : 'Criar collection'}
          </button>

          {errorMessage && (
            <p className={styles['error-txt']} role="alert">
              {errorMessage}
            </p>
          )}
        </form>

        <IconSelector
          isOpen={isIconSelectorOpen}
          onClose={() => setIsIconSelectorOpen(false)}
          onSelect={(config) => setIconConfig(config)}
        />
      </div>
    </AuthGuard>
  );
}
