'use client';

import Link from 'next/link';
import { PackageOpen, Plus } from 'lucide-react';

import { useAppSelector } from '@/lib/state/hooks';
import { selectIsAuthenticated } from '@/lib/state/slices/authSlice';

import styles from './empty-collection-state.module.scss';

export default function EmptyCollectionState() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <div className={styles['empty-state']}>
      <div className={styles['empty-state-icon']}>
        <PackageOpen aria-hidden="true" />
      </div>

      <p className={styles['empty-state-title']}>
        Nenhum pin encontrado nesta coleção
      </p>
      <p className={styles['empty-state-description']}>
        Os pins que você adicionar vão aparecer aqui.
      </p>

      {isAuthenticated && (
        <Link href="/create/resource" className={styles['empty-state-cta']}>
          <Plus aria-hidden="true" />
          <span>Criar pin</span>
        </Link>
      )}
    </div>
  );
}
