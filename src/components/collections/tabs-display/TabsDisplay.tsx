"use client";

import Clickable from "@/components/shared/clickable/Clickable";

import { ActiveTabData, ICollectionTab } from "./types/collectionTab";
import { ClickableType } from "@/lib/types/clickable";
import { TabClick } from "@/components/shared/clickable/types/clickableConfig";

import { useTabsDragger } from "./utils/useTabsDragger";

import styles from "./tabs-display.module.scss";
import { useEffect, useRef } from "react";

interface TabsDisplayProps {
  handleTabChange: TabClick;
  collectionTabs: ICollectionTab[];
  activeTabData: ActiveTabData;
}

export default function TabsDisplay({
  collectionTabs,
  activeTabData,
  handleTabChange,
}: TabsDisplayProps) {
  const { containerRef, dragEvents, hasMoved } = useTabsDragger();

  const activeTabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      if (!containerRef.current || !activeTabRef.current) {
        console.log("Observer não configurado - elementos não encontrados:", {
          container: !!containerRef.current,
          activeTab: !!activeTabRef.current,
        }); // TODO - Lançar um erro aqui ou tratar corretamente
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Detects when it starts to go off container and side
            if (entry.intersectionRatio < 1 && entry.isIntersecting) {
              const containerRect =
                containerRef.current!.getBoundingClientRect();
              const targetRect = entry.target.getBoundingClientRect();

              if (targetRect.left < containerRect.left) {
                console.log("Tab ativa saiu pela esquerda");
              } else if (targetRect.right > containerRect.right) {
                console.log("Tab ativa saiu pela direita");
              }
            }

            // Detects when it's 100% visible
            if (entry.intersectionRatio === 1) {
              console.log("Tab voltou a ficar 100% visível");
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
    <div className={styles["tabs-display"]} ref={containerRef} {...dragEvents}>
      {collectionTabs.map((col, index) => {
        const isActive = activeTabData.id === col.id;
        return (
          <Clickable
            key={index}
            payload={col.displayElement}
            config={{
              clickableType: ClickableType.CollectionTab,
              tabId: col.id,
              active: isActive,
              tabClick: handleTabClick,
              ref: isActive ? activeTabRef : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
