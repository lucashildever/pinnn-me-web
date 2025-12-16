import React, { useEffect, useRef } from 'react';

import PinSkeleton from '../shared/skeletons/pin-skeleton/PinSkeleton';

import { useResources } from './utils/useResources';
import Pin from './pin/Pin';
import SharedPin from './shared-pin/SharedPin';
import SharedPinGroup from './shared-pin-group/SharedPinGroup';
import PinGroup from './pin-group/PinGroup';

import { Resource } from './types/resource';

interface ResourcesDisplayProps {
  currentCollectionId: string;
  mainCollectionResources: Resource[];
  muralName: string;
}

export default function ResourcesDisplay({
  currentCollectionId,
  mainCollectionResources,
  muralName,
}: ResourcesDisplayProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  if (!currentCollectionId) {
    return <div>ID da coleção não encontrado</div>;
  }

  const {
    resources,
    error,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useResources(currentCollectionId, mainCollectionResources);

  useEffect(() => {
    console.log('resources ->', resources);
  }, [resources]);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log('fetch next page');
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (isLoading) {
    return <PinSkeleton />;
  }

  if (isError) {
    return (
      <div>Erro ao carregar pins: {error?.message || 'Erro desconhecido'}</div>
    );
  }

  if (!resources || resources.length === 0) {
    return <p>Nenhum pin encontrado nesta coleção</p>;
  }

  return (
    <>
      {resources.map((resource: Resource, index: number) => {
        switch (resource.type) {
          case 'pin':
            return (
              <React.Fragment key={`${resource.id}-${index}`}>
                <Pin variants={resource.pins.data[0].variants} />
              </React.Fragment>
            );
          case 'shared-pin':
            return (
              <React.Fragment key={`${resource.id}-${index}`}>
                <SharedPin data={resource.pins.data[0]} />
              </React.Fragment>
            );
          case 'pin-group':
            return (
              <React.Fragment key={`${resource.id}-${index}`}>
                <PinGroup />
              </React.Fragment>
            );
          case 'shared-pin-group':
            return (
              <React.Fragment key={`${resource.id}-${index}`}>
                <SharedPinGroup />
              </React.Fragment>
            );
          default:
            return 'invalid resource type';
        }
      })}

      {hasNextPage ? (
        <div
          ref={observerRef}
          style={{
            height: '20px',
            margin: '16px 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '14px',
            color: '#666',
          }}
        >
          {isFetchingNextPage && <PinSkeleton />}
        </div>
      ) : (
        <div
          style={{
            padding: '20px',
            margin: '16px 0',
            textAlign: 'center',
            fontSize: '14px',
            color: '#888',
            borderTop: '1px solid #eee',
          }}
        >
          🎉 Você chegou ao final! Não há mais pins para mostrar.
        </div>
      )}
    </>
  );
}
