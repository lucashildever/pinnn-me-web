'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import TabsDisplay from '../tabs-display/TabsDisplay';
import ResourcesDisplay from '../resources-display/ResourcesDisplay';
import Profile from './profile/Profile';

import {
  ActiveTabData,
  CollectionTab,
} from '../tabs-display/types/collectionTab';
import { TabsProps } from './types/tabs';

import styles from './mural.module.scss';

interface MuralContainerProps {
  displayName: string;
  description: string;
  collections: CollectionTab[];
  paramCollectionId: string | undefined;
  mainCollectionResources?: any;
  // mainCollectionResources?: Pin[]; => mudar tipo DEPOIS
}

export default function MuralContainer({
  displayName,
  description,
  collections,
  paramCollectionId,
  mainCollectionResources,
}: MuralContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getTargetTab = (
    paramId: string | undefined,
    colls: CollectionTab[],
  ): ActiveTabData => {
    let targetCollection =
      paramId !== undefined ? colls.find((c) => c.id === paramId) : undefined;

    if (!targetCollection) {
      targetCollection = colls.find((c) => c.isMain) || colls[0];
    }

    return {
      id: targetCollection.id,
      displayElement: targetCollection.displayElement,
    };
  };

  const [activeTabData, setActiveTabData] = useState<ActiveTabData>(() =>
    getTargetTab(paramCollectionId, collections),
  );

  const handleTabChange = (tabData: ActiveTabData) => {
    setActiveTabData(tabData);

    const params = new URLSearchParams(searchParams.toString());
    params.set('coll', tabData.id);

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    setActiveTabData(getTargetTab(paramCollectionId, collections));
  }, [paramCollectionId, collections]);

  const tabsProps: TabsProps = {
    // needs to be here because it's shared across multiple components
    collectionTabs: collections,
    activeTabData: activeTabData,
    handleTabChange: handleTabChange,
  };

  return (
    <div className={styles['mural-container']}>
      <Profile muralName={displayName} bio={description} />
      <TabsDisplay {...tabsProps} />
      <ResourcesDisplay
        mainCollectionResources={
          activeTabData.id === collections.find((c) => c.isMain)?.id
            ? mainCollectionResources
            : undefined
        }
        currentCollectionId={activeTabData.id}
        muralName={displayName}
      />
    </div>
  );
}
