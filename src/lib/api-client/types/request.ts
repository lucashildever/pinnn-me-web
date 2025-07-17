import { ICollectionTab } from "@/components/collections/tabs-display/types/collectionTab";
import { ICard } from "@/components/collections/pins-display/pin-card/types/card";
import { IPin } from "@/components/collections/pins-display/pin/types/pin";

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
export interface CreateCollectionRequest extends Omit<ICollectionTab, "order"> {
  muralId: string;
}

// Pins
export interface CreatePinRequest extends Omit<IPin, "id" | "order" | "cards"> {
  cards: CreateCardRequest;
}

export interface CreateCardRequest extends Omit<ICard, "id"> {}
