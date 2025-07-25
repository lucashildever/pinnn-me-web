"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import TabsDisplay from "./tabs-display/TabsDisplay";
import PinsDispay from "./pins-display/PinsDisplay";

import {
  ActiveTabData,
  CollectionTab,
} from "./tabs-display/types/collectionTab";
import { IconType } from "@/lib/types/clickable";

interface CollectionsProps {
  collectionTabs: CollectionTab[];
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeTabData, setActiveTabData] = useState<ActiveTabData>({
    id: collectionTabs[0]?.id || "",
    displayElement: {
      content: "",
      iconConfig: {
        type: IconType.NONE,
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
    console.log("tabDataaa", activeTabData);
  }, [activeTabData]);

  useEffect(() => {
    if (paramCollectionId !== undefined) {
      const collection =
        collectionTabs.find((coll) => (coll.id = paramCollectionId)) ||
        collectionTabs[0];

      setActiveTabData({
        id: collection.id,
        displayElement: collection.displayElement,
      });
    } else {
      const mainCollection =
        collectionTabs.find((col) => col.isMain) || collectionTabs[0];

      setActiveTabData({
        id: mainCollection.id,
        displayElement: mainCollection.displayElement,
      });
    }
  }, [paramCollectionId, collectionTabs]);

  return (
    <>
      <TabsDisplay
        collectionTabs={collectionTabs}
        activeTabData={activeTabData}
        handleTabChange={handleTabChange}
      />
      <PinsDispay
        mainCollectionPins={mainCollectionPins}
        currentCollectionId={activeTabData.id}
        badgeName={badgeName}
      />
    </>
  );
}
