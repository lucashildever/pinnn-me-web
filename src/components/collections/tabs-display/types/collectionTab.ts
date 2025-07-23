import { IClickable } from "@/lib/types/clickable";

export interface ICollectionTab {
  id: string;
  order: string;
  isMain: boolean;
  displayElement: IClickable;
}

export type ActiveTabData = Omit<ICollectionTab, "order" | "isMain">;
