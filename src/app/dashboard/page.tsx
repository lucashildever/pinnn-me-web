'use client';

import Link from 'next/link';

import { useUserMurals } from '@/components/mural/utils/useUserMurals';
import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';

import styles from './dashboard.module.scss';

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useUserMurals();

  const murals = data?.murals ?? [];
  const hasMurals = !isLoading && !isError && murals.length > 0;

  return (
    <div className={styles['dashboard']}>
      {isLoading && (
        <p className={styles['status-txt']}>Carregando seus murais...</p>
      )}

      {isError && (
        <div className={styles['status-txt']}>
          <p>Não foi possível carregar seus murais.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className={styles['retry-button']}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {hasMurals && (
        <>
          <h1 className={styles['dashboard-title']}>Seus murais</h1>

          <ul className={styles['mural-grid']}>
            {murals.map((mural) => (
              <li key={mural.id}>
                <Link href={`/${mural.name}`} className={styles['mural-card']}>
                  <span className={styles['mural-card-info']}>
                    <span className={styles['mural-card-display-name']}>
                      {mural.displayName}
                    </span>
                    <span className={styles['mural-card-name']}>
                      /{mural.name}
                    </span>
                  </span>

                  {mural.isActive && (
                    <span className={styles['active-badge']}>Ativo</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <Link href="/create/mural" className={styles['create-button']}>
        <IconRenderer
          config={{ type: 'predefined', icon: 'plus' }}
          renderedSize={5}
        />
        Criar novo mural
      </Link>
    </div>
  );
}
