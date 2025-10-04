import React from 'react';
import { Metadata } from 'next';

import MuralContainer from '@/components/mural/Mural';
//import Collections from "@/components/collections/Collections";
import Profile from '@/components/mural/profile/Profile';

import { MuralRequest } from '@/lib/api-client/types/request';
import { apiClient } from '@/lib/api-client/apiClient';

interface Params {
  params: {
    mural: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { mural } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'; // update this for production
  const url = `${baseUrl}/${mural}`;

  return {
    title: `${mural} Mural`,
    alternates: {
      canonical: url,
    },
    description: `Check ${mural} mural.`,
  };
}

interface MuralProps {
  params: {
    mural: string;
  };
  searchParams?: {
    coll: string;
    pin: string;
  };
}

export default async function Mural({ params, searchParams }: MuralProps) {
  const { mural } = await params;

  const resolvedSearchParams = await searchParams;
  const paramCollectionId = resolvedSearchParams?.coll;

  const muralRequest: MuralRequest = {
    muralName: mural,
    getMainCollectionPins: !paramCollectionId,
  };

  const result = await apiClient.mural.get(muralRequest);

  if (!result.success) {
    if (result.error === 'NOT_FOUND') {
      return <h1>{result.message}</h1>;
    }

    return <h1>{result.message}</h1>;
  }

  return (
    <MuralContainer
      displayName={result.data.displayName}
      description={result.data.description}
      collections={result.data.collections}
      paramCollectionId={paramCollectionId}
      mainCollectinoPins={result.data.mainCollectionPins?.data}
    />
    // <MuralContainer>
    //   <Profile
    //     muralName={result.data.displayName}
    //     bio={result.data.description}
    //   />
    //   <Collections
    //     collectionTabs={result.data.collections}
    //     paramCollectionId={paramCollectionId}
    //     mainCollectionPins={result.data.mainCollectionPins?.data}
    //     badgeName={result.data.displayName}
    //   />
    // </MuralContainer>
  );
}
