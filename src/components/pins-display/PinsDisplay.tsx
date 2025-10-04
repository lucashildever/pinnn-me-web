import React, { useEffect, useRef } from 'react';

import Divider from '@/components/shared/divider/divider';
import Pin from '@/components/pins-display/pin/Pin';

import { Pin as IPin } from './pin/types/pin';
import { usePins } from './utils/usePins';

interface PinsDisplayProps {
  currentCollectionId: string;
  mainCollectionPins: IPin[] | undefined;
  muralName: string;
}

export default function PinsDisplay({
  currentCollectionId,
  mainCollectionPins,
  muralName,
}: PinsDisplayProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  if (!currentCollectionId) {
    return <div>ID da coleção não encontrado</div>;
  }

  const {
    pins,
    error,
    isError,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePins(currentCollectionId, mainCollectionPins);

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
    return <div>Carregando pins...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar pins: {(error as Error).message}</div>;
  }

  if (!pins || pins.length === 0) {
    return <p>Nenhum pin encontrado nesta coleção</p>;
  }

  return (
    <>
      {pins.map((pin: IPin, index: number) => (
        <React.Fragment key={`${pin.id}-${index}`}>
          <Pin
            muralName={muralName}
            description={pin.description}
            cards={pin.cards}
          />
          <Divider />
        </React.Fragment>
      ))}

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
          {isFetchingNextPage && (
            <div>
              {/* TODO - add loading component */}
              <p>loading more pins</p>
            </div>
          )}
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
