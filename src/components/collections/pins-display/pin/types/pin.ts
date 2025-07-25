import { Card } from "../../pin-card/types/card";

export interface Pin {
  id: string;
  order: string;
  description: string;
  cards: Card[];
}
