"use client";

import Clickable from "@/components/shared/clickable/Clickable";

import { ActiveTabData, ICollectionTab } from "./types/collectionTab";
import { ClickableType } from "@/lib/types/clickable";
import { TabClick } from "@/components/shared/clickable/types/clickableConfig";

import { useTabsDragger } from "./utils/useTabsDragger";

import styles from "./tabs-display.module.scss";

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
        return (
          <Clickable
            key={index}
            payload={col.displayElement}
            config={{
              clickableType: ClickableType.CollectionTab,
              tabId: col.id,
              active: activeTabData.id === col.id,
              tabClick: handleTabClick,
            }}
          />
        );
      })}
    </div>
  );
}
