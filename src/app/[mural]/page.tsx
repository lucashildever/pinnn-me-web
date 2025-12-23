import React from 'react';
import { Metadata } from 'next';

import MuralContainer from '@/components/mural/MuralContainer';
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
    getMainCollectionResources: !paramCollectionId,
  };

  const result = await apiClient.mural.get(muralRequest);

  if (!result.success) {
    if (result.error === 'not-found') {
      return <h1>{result.message}</h1>;
    }

    return <h1>{result.message}</h1>;
  }

  return (
    <MuralContainer
      muralId={result.data.id}
      displayName={result.data.displayName}
      description={result.data.description}
      collections={result.data.collections}
      appearance={result.data.appearance}
      paramCollectionId={paramCollectionId}
      mainCollectionResources={result.data.mainCollectionResources}
    />
  );
}
