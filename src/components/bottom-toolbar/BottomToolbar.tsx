'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  FolderPlus,
  Paperclip,
  Plus,
  Settings,
  Sparkles,
  TrendingUp,
  UserRound,
} from 'lucide-react';

import { useAuth } from '@/components/providers/auth-provider/AuthProvider';
import { useUserMurals } from '@/components/mural/utils/useUserMurals';

import styles from './bottom-toolbar.module.scss';

export default function BottomToolbar() {
  const { user } = useAuth();
  const { data } = useUserMurals(!!user);
  const pathname = usePathname();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const createMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isCreateOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        createMenuRef.current &&
        !createMenuRef.current.contains(event.target as Node)
      ) {
        setIsCreateOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCreateOpen]);

  useEffect(() => {
    setIsCreateOpen(false);
  }, [pathname]);

  if (!user) {
    return null;
  }

  const activeMural = data?.murals.find(
    (mural) => mural.id === data.activeMuralId,
  );
  const muralHref = activeMural ? `/${activeMural.name}` : '/dashboard';

  const isHome = pathname === '/dashboard';
  const isInsights = pathname === '/insights';
  const isSettings = pathname === '/settings';
  const isMuralPage =
    pathname.split('/').filter(Boolean).length === 1 &&
    !isHome &&
    !isInsights &&
    !isSettings;

  return (
    <nav className={styles['toolbar']} aria-label="Navegação inferior">
      <ToolbarLink
        href="/dashboard"
        icon={<Sparkles />}
        label="Início"
        isActive={isHome}
      />

      <ToolbarLink
        href={muralHref}
        icon={<UserRound />}
        label="Meu mural"
        isActive={isMuralPage}
      />

      <div ref={createMenuRef} className={styles['toolbar-create-wrapper']}>
        {isCreateOpen && (
          <div className={styles['create-menu']} role="menu" aria-label="Criar">
            <div className={styles['create-menu-card']}>
              <p className={styles['create-menu-title']}>Criar</p>

              <Link
                href="/create/resource"
                role="menuitem"
                className={styles['create-menu-item']}
                onClick={() => setIsCreateOpen(false)}
              >
                <Paperclip />
                <span>Anexo</span>
              </Link>

              <Link
                href="/create/collection"
                role="menuitem"
                className={styles['create-menu-item']}
                onClick={() => setIsCreateOpen(false)}
              >
                <FolderPlus />
                <span>Collection</span>
              </Link>
            </div>
          </div>
        )}

        <button
          type="button"
          className={`${styles['toolbar-button']} ${styles['toolbar-button-primary']}`}
          aria-label="Criar"
          aria-haspopup="menu"
          aria-expanded={isCreateOpen}
          onClick={() => setIsCreateOpen((open) => !open)}
        >
          <Plus />
        </button>
      </div>

      <ToolbarLink
        href="/insights"
        icon={<TrendingUp />}
        label="Insights"
        isActive={isInsights}
      />

      <ToolbarLink
        href="/settings"
        icon={<Settings />}
        label="Configurações"
        isActive={isSettings}
      />
    </nav>
  );
}

interface ToolbarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

function ToolbarLink({ href, icon, label, isActive }: ToolbarLinkProps) {
  return (
    <Link
      href={href}
      className={`${styles['toolbar-button']} ${isActive ? styles['toolbar-button-active'] : ''}`}
      aria-label={label}
      title={label}
    >
      {icon}
    </Link>
  );
}