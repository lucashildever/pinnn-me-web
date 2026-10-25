'use client';

import { useEffect, useRef, useState } from 'react';

import Clickable from '@/components/shared/clickable/Clickable';

import {
  OverlayTabDisplayConfig,
  TabClick,
} from '@/components/shared/clickable/types/clickableConfig';
import { ActiveTabData, CollectionTab } from './types/collectionTab';

import { useTabsDragger } from './utils/useTabsDragger';

import styles from './tabs-display.module.scss';

interface TabsDisplayProps {
  handleTabChange: TabClick;
  collectionTabs: CollectionTab[];
  activeTabData: ActiveTabData;
  style?: React.CSSProperties;
}

export default function TabsDisplay({
  collectionTabs,
  activeTabData,
  handleTabChange,
  style,
}: TabsDisplayProps) {
  const { containerRef, dragEvents, hasMoved } = useTabsDragger();
  const [overlayTabDisplayConfig, setOverlayTabDisplayConfig] =
    useState<OverlayTabDisplayConfig>({
      visible: false,
      position: 'left',
    });
  const [hideFades, setHideFades] = useState({ left: false, right: false });

  const activeTabRef = useRef<HTMLDivElement>(null);
  const activeTabIndex = collectionTabs.findIndex(
    (tab) => tab.id === activeTabData.id,
  );
  const isFirstTab = activeTabIndex === 0;
  const isLastTab = activeTabIndex === collectionTabs.length - 1;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateFades = () => {
      const isAtStart = container.scrollLeft <= 0;
      const isAtEnd =
        Math.ceil(container.scrollLeft + container.clientWidth) >=
        container.scrollWidth;

      setHideFades({
        left: isAtStart && isFirstTab,
        right: isAtEnd && isLastTab,
      });
    };

    updateFades();
    container.addEventListener('scroll', updateFades);
    window.addEventListener('resize', updateFades);

    return () => {
      container.removeEventListener('scroll', updateFades);
      window.removeEventListener('resize', updateFades);
    };
  }, [containerRef, activeTabData.id, isFirstTab, isLastTab, collectionTabs.length]);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      if (!containerRef.current || !activeTabRef.current) {
        const missingElements = {
          container: !!containerRef.current,
          activeTab: !!activeTabRef.current,
        };

        console.error(
          'IntersectionObserver could not be configured. Missing elements:',
          missingElements,
        );

        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio < 1 && entry.isIntersecting) {
              const containerRect =
                containerRef.current!.getBoundingClientRect();
              const targetRect = entry.target.getBoundingClientRect();

              if (targetRect.left < containerRect.left) {
                setOverlayTabDisplayConfig({
                  visible: true,
                  position: 'left',
                });
              } else if (targetRect.right > containerRect.right) {
                setOverlayTabDisplayConfig({
                  visible: true,
                  position: 'right',
                });
              }
            }

            if (entry.intersectionRatio === 1) {
              setOverlayTabDisplayConfig((prevState) => ({
                ...prevState,
                visible: false,
              }));
            }
          });
        },
        {
          root: containerRef.current,
          threshold: [0, 1],
          rootMargin: '0px',
        },
      );

      observer.observe(activeTabRef.current);
    };

    const timeoutId = setTimeout(setupObserver, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [activeTabData.id]);

  const handleTabClick = (tabData: ActiveTabData) => {
    if (!hasMoved.current) {
      handleTabChange(tabData);
    }
    setTimeout(() => {
      hasMoved.current = false;
    }, 10);
  };

  const fadeClasses = [
    hideFades.left ? styles['hide-left-fade'] : '',
    hideFades.right ? styles['hide-right-fade'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`${styles['tabs-display']} ${fadeClasses}`}
      {...dragEvents}
      style={style}
    >
      <Clickable
        payload={activeTabData.displayElement}
        config={{
          clickableType: 'collection-tab-overlay',
          displayConfig: overlayTabDisplayConfig,
        }}
      />
      <div className={styles['tabs-container']} ref={containerRef}>
        {collectionTabs.map((col, index) => {
          const isActive = activeTabData.id === col.id;
          return (
            <Clickable
              key={index}
              payload={col.displayElement}
              config={{
                clickableType: 'collection-tab',
                tabId: col.id,
                active: isActive,
                tabClick: handleTabClick,
                ref: isActive ? activeTabRef : undefined,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
