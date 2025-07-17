import React from "react";
import { usePins } from "./utils/usePins";
import Divider from "@/components/shared/divider/divider";
import Pin from "@/components/collections/pins-display/pin/Pin";
import { IPin } from "./pin/types/pin";

interface PinsDisplayProps {
  currentCollectionId: string;
  mainCollectionPins: IPin[] | null;
  badgeName: string;
}

export default function PinsDisplay({
  currentCollectionId,
  mainCollectionPins,
  badgeName,
}: PinsDisplayProps) {
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
            username={badgeName}
            description={pin.description}
            cards={pin.cards}
          />
          <Divider />
        </React.Fragment>
      ))}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          style={{
            padding: "12px 24px",
            marginTop: "16px",
            backgroundColor: isFetchingNextPage ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isFetchingNextPage ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {isFetchingNextPage ? "Carregando mais..." : "Carregar mais pins"}
        </button>
      )}
    </>
  );
}
