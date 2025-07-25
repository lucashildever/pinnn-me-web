import PinCard from "../pin-card/PinCard";
import UserBadge from "../shared/user-badge/UserBadge";
import { CardData } from "@/types/cardTypes";

import styles from "./pin.module.scss";

interface PinProps {
  username: string;
  description: string;
  cards: CardData[];
}

export default function Pin({ username, description, cards }: PinProps) {
  return (
    <div className={styles["pin"]}>
      <UserBadge username={username} />
      <p className={styles["pin-description"]}>{description} </p>
      {cards.map((card, index) => {
        const { caption, variantType, variantPayload } = card;
        return (
          <PinCard
            key={index}
            caption={caption}
            cardPayload={{
              notFirstCard: index !== 0,
              variantType: variantType,
              variantPayload: variantPayload,
            }}
          />
        );
      })}
    </div>
  );
}
