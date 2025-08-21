import { Pagination } from "@/lib/types/pagination";
import { CollectionTab } from "../../tabs-display/types/collectionTab";
import { Pin } from "../../pins-display/pin/types/pin";

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
