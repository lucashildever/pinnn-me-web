"use client";

import { useEffect, useState } from "react";
import TabsDisplay from "./tabs-display/TabsDisplay";
import { ICollectionTab } from "./tabs-display/types/collectionTab";
import PinsDispay from "./pins-display/PinsDisplay";

interface CollectionsProps {
  collectionTabs: ICollectionTab[];
  mainCollectionPins?: any;
  paramCollectionId: string | undefined;
  badgeName: string;
}

export default function Collections({
  collectionTabs,
  paramCollectionId,
  mainCollectionPins,
  badgeName,
}: CollectionsProps) {
  const [activeTabId, setActiveTabId] = useState<string>(
    collectionTabs[0]?.id || ""
  );

  useEffect(() => {
    if (paramCollectionId !== undefined) {
      const tabExists = collectionTabs.some(
        (tab) => tab.id === paramCollectionId
      );

      if (tabExists) {
        setActiveTabId(paramCollectionId);
      } else {
        setActiveTabId(collectionTabs[0]?.id || "");
      }
    }
  }, [paramCollectionId, collectionTabs]);

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
  };

  return (
    <>
      <TabsDisplay
        collectionTabs={collectionTabs}
        onTabChange={handleTabChange}
        activeTabId={activeTabId}
      />
      <PinsDispay
        mainCollectionPins={mainCollectionPins}
        currentCollectionId={activeTabId}
        badgeName={badgeName}
      />
    </>
  );
}
