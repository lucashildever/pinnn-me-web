import { CollectionTab } from "@/components/tabs-display/types/collectionTab";
import { Card } from "@/components/pins-display/pin-card/types/card";
import { Pin } from "@/components/pins-display/pin/types/pin";

export interface FetcherOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
  token?: string;
  queryParams?: Record<string, string | boolean>;
}

// Mural
export interface CreateMuralRequest {
  name: string;
  displayName: string;
  description?: string;
}

export interface MuralRequest {
  muralName: string;
  getMainCollectionPins: boolean;
}

// Collections
export interface CreateCollectionRequest extends Omit<CollectionTab, "order"> {
  muralId: string;
}

// Pins
export interface CreatePinRequest extends Omit<Pin, "id" | "order" | "cards"> {
  cards: CreateCardRequest;
}

export interface CreateCardRequest extends Omit<Card, "id"> {}
