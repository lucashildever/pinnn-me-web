import { IPagination } from "@/lib/types/pagination";
import { ICollectionTab } from "../../collections/tabs-display/types/collectionTab";
import { IPin } from "../../collections/pins-display/pin/types/pin";

export interface IMural {
  name: string;
  displayName: string;
  description: string;
  collectionTabs: ICollectionTab[];
  mainCollectionPins?: {
    data: IPin[];
    pagination: IPagination;
  };
}
