"use client";

import { useEffect, useState } from "react";

import TabsDisplay from "./tabs-display/TabsDisplay";
import PinsDispay from "./pins-display/PinsDisplay";

import {
  ActiveTabData,
  ICollectionTab,
} from "./tabs-display/types/collectionTab";

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
  const [activeTabData, setActiveTabData] = useState<ActiveTabData>({
    id: collectionTabs[0]?.id || "",
    displayElement: {
      content: "",
      iconConfig: {
        type: "none",
      },
    },
  });

  useEffect(() => {
    if (paramCollectionId !== undefined) {
      const tabExists = collectionTabs.some(
        (tab) => tab.id === paramCollectionId
      );

      if (tabExists) {
        setActiveTabData((prevState) => ({
          ...prevState,
          id: paramCollectionId,
        }));
      } else {
        setActiveTabData((prevState) => ({
          ...prevState,
          id: collectionTabs[0]?.id || "",
        }));
      }
    }
  }, [paramCollectionId, collectionTabs]);

  return (
    <>
      <TabsDisplay
        collectionTabs={collectionTabs}
        activeTabData={activeTabData}
        handleTabChange={(tabData: ActiveTabData) => {
          setActiveTabData(tabData);
        }}
      />
      <PinsDispay
        mainCollectionPins={mainCollectionPins}
        currentCollectionId={activeTabData.id}
        badgeName={badgeName}
      />
    </>
  );
}
