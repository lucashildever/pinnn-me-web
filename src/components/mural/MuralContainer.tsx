'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useAppDispatch } from '@/lib/state/hooks';
import { setMuralId } from '@/lib/state/slices/muralSlice';

import TabsDisplay from '../tabs-display/TabsDisplay';
import ResourcesDisplay from '../resources-display/ResourcesDisplay';
import Profile from './profile/Profile';

import {
  ActiveTabData,
  CollectionTab,
} from '../tabs-display/types/collectionTab';
import { TabsProps } from './types/tabs';

import styles from './mural-container.module.scss';
import { MuralAppearance } from './profile/types/appearance';
import {
  CallToActionData,
  GetResourcesResponseData,
} from '@/lib/api-client/types/response';

interface MuralContainerProps {
  muralId: string;
  displayName: string;
  description: string;
  collections: CollectionTab[];
  paramCollectionId: string | undefined;
  mainCollectionResources?: GetResourcesResponseData;
  appearance: MuralAppearance;
  callToActions?: CallToActionData[];
}

export default function MuralContainer({
  muralId,
  displayName,
  description,
  collections,
  paramCollectionId,
  mainCollectionResources,
  appearance,
  callToActions,
}: MuralContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  if (!muralId) {
    throw new Error('MuralId is required');
  }

  useEffect(() => {
    if (muralId) {
      dispatch(setMuralId(muralId));
    }
  }, [muralId, dispatch]);

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
    const mainCollection = collections.find((c) => c.isMain);

    if (mainCollection && tabData.id === mainCollection.id) {
      // Remove coll param when switching to main collection
      params.delete('coll');
    } else {
      params.set('coll', tabData.id);
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
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
      <Profile
        muralName={displayName}
        bio={description}
        appearance={appearance}
        callToActions={callToActions}
      />
      <TabsDisplay {...tabsProps} />
      <ResourcesDisplay
        key={activeTabData.id}
        mainCollectionResources={
          activeTabData.id === collections.find((c) => c.isMain)?.id
            ? mainCollectionResources
            : undefined
        }
        currentCollectionId={activeTabData.id}
      />
    </div>
  );
}
