'use client';

import PinAuthor from '../../shared/pin-author/PinAuthor';
// import PinCard from '../pin-card/PinCard';

// import { Card } from '@/components/pins-display/pin-card/types/card';

import styles from './pin.module.scss';

interface PinProps {
  muralName: string;
  description: string;
  cards: any[];
  // cards: Card[];
}

export default function Pin({ muralName, description, cards }: PinProps) {
  return (
    // <div className={styles['pin']}>
    //   <PinAuthor muralName={muralName} />
    //   <p className={styles['pin-description']}>{description} </p>
    //   {cards.map((card, index) => {
    //     return (
    //       <PinCard
    //         key={index}
    //         caption={card.caption}
    //         notFirstCard={index !== 0}
    //         cardConfig={card.cardConfig}
    //       />
    //     );
    //   })}
    // </div>
    <div>Pin</div>
  );
}
