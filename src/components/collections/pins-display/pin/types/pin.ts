import { ICard } from "../../pin-card/types/card";

export interface IPin {
  id: string;
  order: string;
  description: string;
  cards: ICard[];
}
