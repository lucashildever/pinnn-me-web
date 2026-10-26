'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Clickable from '@/components/shared/clickable/Clickable';

import { TabClick } from '@/components/shared/clickable/types/clickableConfig';
import type { Clickable as ClickableData } from '@/components/shared/clickable/types/clickable';
import { ActiveTabData, CollectionTab } from './types/collectionTab';

import { useTabsDragger } from './utils/useTabsDragger';

import styles from './tabs-display.module.scss';

// How much of the active tab may stay visible before the overlay shows up
// (i.e. the overlay appears when 80% of the tab is out of view).
const OVERLAY_VISIBLE_RATIO = 0.2;

// Tolerance for the subpixel rounding of scrollLeft/scrollWidth.
const SCROLL_EDGE_TOLERANCE = 1;

// Must match the opacity transition of .collection-tab-overlay.
const OVERLAY_FADE_DURATION_MS = 350;

type OverlayPosition = 'left' | 'right';

interface OverlayRequest {
  position: OverlayPosition;
  tabId: string;
  displayElement: ClickableData;
}

interface OverlayTabState extends OverlayRequest {
  visible: boolean;
}

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
  const [overlayTab, setOverlayTabState] = useState<OverlayTabState>({
    visible: false,
    position: 'left',
    tabId: activeTabData.id,
    displayElement: activeTabData.displayElement,
  });
  const [hideFades, setHideFades] = useState({ left: true, right: false });

  const activeTabRef = useRef<HTMLDivElement>(null);
  const overlayTabRef = useRef(overlayTab);
  const activeTabIdRef = useRef(activeTabData.id);
  const pendingOverlayRef = useRef<OverlayRequest | null>(null);
  const fadeOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFadingOutRef = useRef(false);

  // Keeps the ref in sync with the state so the callbacks below never read a
  // stale overlay.
  const setOverlayTab = useCallback((next: OverlayTabState) => {
    overlayTabRef.current = next;
    setOverlayTabState(next);
  }, []);

  const clearFadeOutTimeout = useCallback(() => {
    if (fadeOutTimeoutRef.current !== null) {
      clearTimeout(fadeOutTimeoutRef.current);
      fadeOutTimeoutRef.current = null;
    }
  }, []);

  // Fades the current overlay out, keeping its (frozen) content on screen.
  // Only once it is fully gone the queued request may be applied.
  const hideOverlay = useCallback(() => {
    const current = overlayTabRef.current;

    if (!current.visible) {
      return;
    }

    setOverlayTab({ ...current, visible: false });
    isFadingOutRef.current = true;

    clearFadeOutTimeout();

    fadeOutTimeoutRef.current = setTimeout(() => {
      fadeOutTimeoutRef.current = null;
      isFadingOutRef.current = false;

      const pending = pendingOverlayRef.current;
      pendingOverlayRef.current = null;

      if (pending && pending.tabId === activeTabIdRef.current) {
        setOverlayTab({ ...pending, visible: true });
      }
    }, OVERLAY_FADE_DURATION_MS);
  }, [clearFadeOutTimeout, setOverlayTab]);

  const requestOverlay = useCallback(
    (request: OverlayRequest | null) => {
      const current = overlayTabRef.current;

      if (!request) {
        pendingOverlayRef.current = null;
        hideOverlay();
        return;
      }

      // Already showing exactly this overlay: only its content may have
      // changed (e.g. the active tab was renamed), which needs no fade.
      if (
        current.visible &&
        current.tabId === request.tabId &&
        current.position === request.position
      ) {
        pendingOverlayRef.current = null;

        if (current.displayElement !== request.displayElement) {
          setOverlayTab({ ...request, visible: true });
        }

        return;
      }

      // Either an overlay is on screen or still fading out: wait for it to be
      // gone before swapping the content/side, so both are never shown at
      // once and the visible one keeps its own data until it disappears.
      if (current.visible || isFadingOutRef.current) {
        pendingOverlayRef.current = request;
        hideOverlay();
        return;
      }

      setOverlayTab({ ...request, visible: true });
    },
    [hideOverlay, setOverlayTab],
  );

  // Switching tabs invalidates the overlay content: hide it right away (with
  // the old data) and let the observer of the new tab request it again.
  useEffect(() => {
    activeTabIdRef.current = activeTabData.id;
    pendingOverlayRef.current = null;
    hideOverlay();
  }, [activeTabData.id, hideOverlay]);

  useEffect(() => {
    return () => {
      clearFadeOutTimeout();
    };
  }, [clearFadeOutTimeout]);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const observedTabId = activeTabData.id;

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
            if (observedTabId !== activeTabIdRef.current) {
              return;
            }

            // More than 20% of the active tab is still visible: hide it.
            if (entry.intersectionRatio > OVERLAY_VISIBLE_RATIO) {
              requestOverlay(null);

              return;
            }

            // 20% or less of the active tab is visible: reveal the overlay
            // on the side the tab is leaving. This also covers a tab that is
            // already (fully) out of view when it becomes active — e.g. a
            // reload with a far-away tab selected — where the threshold is
            // never crossed.
            const containerRect = containerRef.current!.getBoundingClientRect();
            const targetRect = entry.target.getBoundingClientRect();

            const request = {
              tabId: observedTabId,
              displayElement: activeTabData.displayElement,
            };

            if (targetRect.left < containerRect.left) {
              requestOverlay({ ...request, position: 'left' });
            } else if (targetRect.right > containerRect.right) {
              requestOverlay({ ...request, position: 'right' });
            }
          });
        },
        {
          root: containerRef.current,
          threshold: [0, OVERLAY_VISIBLE_RATIO, 1],
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
  }, [activeTabData, containerRef, requestOverlay]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const updateFadeVisibility = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const isAtStart = scrollLeft <= SCROLL_EDGE_TOLERANCE;
      const isAtEnd =
        scrollLeft + clientWidth >= scrollWidth - SCROLL_EDGE_TOLERANCE;

      setHideFades((prev) =>
        prev.left === isAtStart && prev.right === isAtEnd
          ? prev
          : { left: isAtStart, right: isAtEnd },
      );
    };

    updateFadeVisibility();

    container.addEventListener('scroll', updateFadeVisibility, {
      passive: true,
    });
    window.addEventListener('resize', updateFadeVisibility);

    return () => {
      container.removeEventListener('scroll', updateFadeVisibility);
      window.removeEventListener('resize', updateFadeVisibility);
    };
  }, [collectionTabs, containerRef]);

  const handleTabClick = (tabData: ActiveTabData) => {
    // Only execute the click if there is no movement
    if (!hasMoved.current) {
      handleTabChange(tabData);
    }
    // Reset after a small delay
    setTimeout(() => {
      hasMoved.current = false;
    }, 10);
  };

  const tabsDisplayClassName = [
    styles['tabs-display'],
    hideFades.left ? styles['hide-left-fade'] : '',
    hideFades.right ? styles['hide-right-fade'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={tabsDisplayClassName} {...dragEvents} style={style}>
      <Clickable
        payload={overlayTab.displayElement}
        config={{
          clickableType: 'collection-tab-overlay',
          displayConfig: {
            visible: overlayTab.visible,
            position: overlayTab.position,
          },
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
