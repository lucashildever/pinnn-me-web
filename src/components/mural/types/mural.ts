import { Pagination } from "@/lib/types/pagination";
import { CollectionTab } from "../../collections/tabs-display/types/collectionTab";
import { Pin } from "../../collections/pins-display/pin/types/pin";

export interface Mural {
  name: string;
  displayName: string;
  description: string;
  collectionTabs: CollectionTab[];
  mainCollectionPins?: {
    data: Pin[];
    pagination: Pagination;
  };
}
