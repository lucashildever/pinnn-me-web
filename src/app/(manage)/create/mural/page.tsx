'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import AuthGuard from '@/components/auth-guard';
import EditorHeader from '../../_components/editor-header/EditorHeader';
import { apiClient } from '@/lib/api-client/apiClient';
import { userMuralsQueryKey } from '@/components/mural/utils/useUserMurals';

import styles from './create-mural.module.scss';

const NAME_PATTERN = /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/;
const NAME_MIN = 3;
const NAME_MAX = 15;
const DISPLAY_NAME_MIN = 3;
const DISPLAY_NAME_MAX = 20;
const DESCRIPTION_MAX = 500;

export default function CreateMuralPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isNameValid =
    name.length >= NAME_MIN &&
    name.length <= NAME_MAX &&
    NAME_PATTERN.test(name);
  const isDisplayNameValid =
    displayName.length >= DISPLAY_NAME_MIN &&
    displayName.length <= DISPLAY_NAME_MAX;
  const hasErrors = !isNameValid || !isDisplayNameValid;

  const createMutation = useMutation({
    mutationFn: async () => {
      const result = await apiClient.mural.create({
        name,
        displayName,
        description: description.trim() || undefined,
      });

      if (!result.success) {
        throw new Error(result.message || 'Não foi possível criar o mural');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userMuralsQueryKey });
      router.push('/dashboard');
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
          title="Criar mural"
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
            <label htmlFor="mural-name">Endereço do mural</label>
            <input
              id="mural-name"
              type="text"
              placeholder="meu-mural"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={NAME_MIN}
              maxLength={NAME_MAX}
              required
            />
            {name && !isNameValid ? (
              <p className={styles['error-txt']} role="alert">
                Use de {NAME_MIN} a {NAME_MAX} caracteres: apenas letras,
                números e hífens (sem começar ou terminar com hífen).
              </p>
            ) : (
              <p className={styles['helper-txt']}>
                Letras, números e hífens ({NAME_MIN} a {NAME_MAX} caracteres).
              </p>
            )}
          </div>

          <div className={styles['field']}>
            <label htmlFor="mural-display-name">Nome de exibição</label>
            <input
              id="mural-display-name"
              type="text"
              placeholder="Meu mural"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              minLength={DISPLAY_NAME_MIN}
              maxLength={DISPLAY_NAME_MAX}
              required
            />
            {displayName && !isDisplayNameValid ? (
              <p className={styles['error-txt']} role="alert">
                Use de {DISPLAY_NAME_MIN} a {DISPLAY_NAME_MAX} caracteres.
              </p>
            ) : (
              <p className={styles['helper-txt']}>
                Como o mural aparece para quem visita ({DISPLAY_NAME_MIN} a{' '}
                {DISPLAY_NAME_MAX} caracteres).
              </p>
            )}
          </div>

          <div className={styles['field']}>
            <label htmlFor="mural-description">Descrição (opcional)</label>
            <textarea
              id="mural-description"
              placeholder="Conte em uma frase do que se trata o mural"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={DESCRIPTION_MAX}
              rows={4}
            />
            <p className={styles['helper-txt']}>
              {description.length}/{DESCRIPTION_MAX} caracteres
            </p>
          </div>

          <button
            type="submit"
            className={styles['submit-button']}
            disabled={hasErrors || createMutation.isPending}
          >
            {createMutation.isPending ? 'Criando...' : 'Criar mural'}
          </button>

          {errorMessage && (
            <p className={styles['error-txt']} role="alert">
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </AuthGuard>
  );
}
