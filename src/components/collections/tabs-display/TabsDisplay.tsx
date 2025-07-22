"use client";

import { useRef } from "react";

import Clickable from "@/components/shared/clickable/Clickable";

import { ClickableType } from "@/lib/types/clickable";
import { ICollectionTab } from "./types/collectionTab";

import styles from "./tabs-display.module.scss";

interface TabsDisplayProps {
  handleTabChange: (tabId: string) => void;
  collectionTabs: ICollectionTab[];
  activeTabId: string;
}

export default function TabsDisplay({
  collectionTabs,
  activeTabId,
  handleTabChange,
}: TabsDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    isDragging.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    containerRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    hasMoved.current = true;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startX.current;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
    }
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
    }
  };

  const handleTabClick = (tabId: string) => {
    // Only execute the click if there is no movement
    if (!hasMoved.current) {
      console.log("clickable click");
      handleTabChange(tabId);
    }
    // Reset after a small delay
    setTimeout(() => {
      hasMoved.current = false;
    }, 10);
  };

  return (
    <div
      className={styles["tabs-display"]}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {collectionTabs.map((col, index) => {
        return (
          <Clickable
            key={index}
            payload={{
              content: col.displayElement.content,
              iconConfig: col.displayElement.iconConfig,
            }}
            config={{
              clickableType: ClickableType.CollectionTab,
              active: activeTabId === col.id,
            }}
            onClick={() => handleTabClick(col.id)}
          />
        );
      })}
    </div>
  );
}
