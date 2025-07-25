"use client";

import { useEffect, useRef, useState } from "react";

import Clickable from "@/components/shared/clickable/Clickable";

import {
  OverlayTabDisplayConfig,
  TabClick,
} from "@/components/shared/clickable/types/clickableConfig";
import { ActiveTabData, CollectionTab } from "./types/collectionTab";
import { ClickableType } from "@/lib/types/clickable";

import { useTabsDragger } from "./utils/useTabsDragger";

import styles from "./tabs-display.module.scss";

interface TabsDisplayProps {
  handleTabChange: TabClick;
  collectionTabs: CollectionTab[];
  activeTabData: ActiveTabData;
}

export default function TabsDisplay({
  collectionTabs,
  activeTabData,
  handleTabChange,
}: TabsDisplayProps) {
  const { containerRef, dragEvents, hasMoved } = useTabsDragger();
  const [overlayTabDisplayConfig, setOverlayTabDisplayConfig] =
    useState<OverlayTabDisplayConfig>({
      visible: false,
      position: "left",
    });

  const activeTabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      if (!containerRef.current || !activeTabRef.current) {
        const missingElements = {
          container: !!containerRef.current,
          activeTab: !!activeTabRef.current,
        };

        console.error(
          "IntersectionObserver could not be configured. Missing elements:",
          missingElements
        );

        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Detects when it starts to go off container
            if (entry.intersectionRatio < 1 && entry.isIntersecting) {
              const containerRect =
                containerRef.current!.getBoundingClientRect();
              const targetRect = entry.target.getBoundingClientRect();

              if (targetRect.left < containerRect.left) {
                setOverlayTabDisplayConfig({
                  visible: true,
                  position: "left",
                });
              } else if (targetRect.right > containerRect.right) {
                setOverlayTabDisplayConfig({
                  visible: true,
                  position: "right",
                });
              }
            }

            // Detects when it's 100% visible
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
          rootMargin: "0px",
        }
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
    // Only execute the click if there is no movement
    if (!hasMoved.current) {
      handleTabChange(tabData);
    }
    // Reset after a small delay
    setTimeout(() => {
      hasMoved.current = false;
    }, 10);
  };

  return (
    <div className={styles["tabs-display"]} {...dragEvents}>
      {/* <Clickable
        payload={activeTabData.displayElement}
        config={{
          clickableType: ClickableType.CollectionTabOverlay,
          displayConfig: overlayTabDisplayConfig,
        }}
      /> */}
      <div className={styles["tabs-container"]} ref={containerRef}>
        {collectionTabs.map((col, index) => {
          const isActive = activeTabData.id === col.id;
          return (
            <Clickable
              key={index}
              payload={col.displayElement}
              config={{
                clickableType: ClickableType.COLLECTION_TAB,
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
