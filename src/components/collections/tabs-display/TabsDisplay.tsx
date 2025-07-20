"use client";

import { ClickableType } from "@/lib/types/clickable";
import styles from "./tabs-display.module.scss";

import { ICollectionTab } from "./types/collectionTab";
import Clickable from "@/components/shared/clickable/Clickable";

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
  return (
    <div className={styles["tabs-display"]}>
      {collectionTabs.map((col, index) => {
        return (
          <Clickable
            key={col.id || index}
            payload={{
              content: col.displayElement.content,
              iconConfig: col.displayElement.iconConfig,
            }}
            config={{
              clickableType: ClickableType.CollectionTab,
              active: activeTabId === col.id,
            }}
            onClick={() => handleTabChange(col.id)}
          />
        );
      })}
    </div>
  );
}
