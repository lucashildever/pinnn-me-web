"use client";

import UserBadge from "../../../shared/user-badge/UserBadge";
import PinCard from "../pin-card/PinCard";

import { ICard } from "@/components/collections/pins-display/pin-card/types/card";

import styles from "./pin.module.scss";

interface PinProps {
  username: string;
  description: string;
  cards: ICard[];
}

export default function Pin({ username, description, cards }: PinProps) {
  return (
    <div className={styles["pin"]}>
      <UserBadge username={username} />
      <p className={styles["pin-description"]}>{description} </p>
      {cards.map((card, index) => {
        return (
          <PinCard
            key={index}
            caption={card.caption}
            notFirstCard={index !== 0}
            cardConfig={card.cardConfig}
          />
        );
      })}
    </div>
  );
}
