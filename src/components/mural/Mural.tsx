'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import TabsDisplay from '../tabs-display/TabsDisplay';
import PinsDisplay from '../pins-display/PinsDisplay';
import Profile from './profile/Profile';

import {
  ActiveTabData,
  CollectionTab,
} from '../tabs-display/types/collectionTab';
import { Pin } from '../pins-display/pin/types/pin';

import styles from './mural.module.scss';
import ProfileMeasurer from './profile-measurer/ProfileMeasurer';
import { TabsProps } from './types/tabs';
import ProfileOverlay from './profile/profile-overlay/ProfileOverlay';

interface MuralContainerProps {
  displayName: string;
  description: string;
  collections: CollectionTab[];
  paramCollectionId: string | undefined;
  mainCollectinoPins?: Pin[];
}

export default function MuralContainer({
  displayName,
  description,
  collections,
  paramCollectionId,
  mainCollectinoPins,
}: MuralContainerProps) {
  // const router = useRouter();
  // const pathname = usePathname();
  const searchParams = useSearchParams();

  //// TABS SELECTION
  const [activeTabData, setActiveTabData] = useState<ActiveTabData>({
    id: collections[0]?.id || '',
    displayElement: {
      content: '',
      iconConfig: {
        type: 'none',
      },
    },
  });

  const handleTabChange = (tabData: ActiveTabData) => {
    setActiveTabData(tabData);

    const params = new URLSearchParams(searchParams.toString());

    //params.set("coll", tabData.id);

    //router.push(`${pathname}?${params.toString()}`, { scroll: false });
    // TALVEZ TENHA UM BUG AQUI
  };

  useEffect(() => {
    if (paramCollectionId !== undefined) {
      const collection =
        collections.find((coll) => (coll.id = paramCollectionId)) ||
        collections[0];

      setActiveTabData({
        id: collection.id,
        displayElement: collection.displayElement,
      });
    } else {
      const mainCollection =
        collections.find((col) => col.isMain) || collections[0];

      setActiveTabData({
        id: mainCollection.id,
        displayElement: mainCollection.displayElement,
      });
    }
  }, [paramCollectionId, collections]);
  ///////

  /// new
  const [minimalProfileHeight, setMinimalProfileHeight] = useState<number>(20);
  const [showProfileOverlay, setShowProfileOverlay] = useState<boolean>(false);

  const tabsDisplayRef = useRef<HTMLDivElement>(null);
  const minimalProfileRef = useRef<HTMLDivElement | null>(null);

  // 2) Medir a altura do "Profile minimal" usando um elemento sempre montado (measurer)
  useEffect(() => {
    const el = minimalProfileRef.current;
    if (!el) return;

    const measure = () => {
      // getBoundingClientRect/offsetHeight; arredondamos para evitar floats estranhos
      const h = Math.round(
        el.getBoundingClientRect().height || el.offsetHeight || 0,
      );
      if (h && h !== minimalProfileHeight) {
        setMinimalProfileHeight(h);
      }
    };

    // Medição imediata (no próximo frame para garantir que CSS/fontes carreguem)
    requestAnimationFrame(measure);

    // Atualiza automaticamente se o tamanho do Profile mudar (ex.: fonts, conteúdo dinâmico)
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => requestAnimationFrame(measure));
      ro.observe(el);
      return () => ro.disconnect();
    }

    // Fallback: recalcula no resize da janela
    const onResize = () => requestAnimationFrame(measure);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = tabsDisplayRef.current;
    if (!el) return;

    // Fallback: se não há IntersectionObserver (IE antigo), volta ao scroll listener
    if (typeof IntersectionObserver === 'undefined') {
      const onScroll = () => {
        const rect = el.getBoundingClientRect();
        setShowProfileOverlay(rect.top <= minimalProfileHeight);
      };

      window.addEventListener('scroll', onScroll, { passive: true });

      onScroll();

      return () => window.removeEventListener('scroll', onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowProfileOverlay(!entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: `-${minimalProfileHeight * 2.5}px 0px 0px 0px`,
        threshold: 0,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [minimalProfileHeight]);

  const tabsProps: TabsProps = {
    collectionTabs: collections,
    activeTabData: activeTabData,
    handleTabChange: handleTabChange,
  };

  return (
    <div className={styles['mural-container']}>
      <Profile muralName={displayName} bio={description} />

      <ProfileMeasurer ref={minimalProfileRef}>
        <Profile minimal muralName={displayName} bio={description} />
      </ProfileMeasurer>

      {showProfileOverlay && (
        <ProfileOverlay
          tabsProps={tabsProps}
          displayName={displayName}
          description={description}
        />
      )}

      <TabsDisplay ref={tabsDisplayRef} {...tabsProps} />

      <PinsDisplay
        mainCollectionPins={mainCollectinoPins}
        currentCollectionId={activeTabData.id}
        muralName={displayName}
      />
    </div>
  );
}
