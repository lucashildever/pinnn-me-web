"use client";

import { useParams } from "next/navigation";
import Profile from "@/components/mural/profile/Profile";
import Mural from "@/components/mural/Mural";
import Pin from "@/components/pin/Pin";

import { CardVariant, IconType } from "@/types/cardTypes";
import { PinData } from "@/types/pinTypes";

import styles from "./user-mural.module.scss";
import tempImg from "@/assets/temp/pin-image-dgg.png";

export default function UserMural() {
  const { user } = useParams();

  const pinsData: PinData[] = [
    {
      description: "My Instagram",
      cardsData: [
        {
          caption: "6🌽 on instagram",
          variantType: CardVariant.Link,
          variantPayload: {
            iconType: IconType.Instagram,
            url: "https://www.isntagram.com",
          },
        },
      ],
    },
    {
      description: "My latest work",
      cardsData: [
        {
          caption: "Illustration",
          variantType: CardVariant.Image,
          variantPayload: { imageSrc: tempImg.src },
        },
      ],
    },

    {
      description: "My Social Media:",
      cardsData: [
        {
          caption: "Follow me on TikTok",
          variantType: CardVariant.Link,
          variantPayload: {
            iconType: IconType.TikTok,
            url: "https://www.instagram.com",
          },
        },
        {
          caption: "More work on my pinterest",
          variantType: CardVariant.Link,
          variantPayload: {
            iconType: IconType.Pinterest,
            url: "https://www.pinterest.com",
          },
        },
        {
          caption: "Follow me on X",
          variantType: CardVariant.Link,
          variantPayload: {
            iconType: IconType.X,
            url: "https://x.com",
          },
        },
        {
          caption: "Subscribe to my YT chanel",
          variantType: CardVariant.Link,
          variantPayload: {
            iconType: IconType.Youtube,
            url: "https://youtube.com",
          },
        },
      ],
    },
  ];

  return (
    <Mural>
      <div className={styles["user-mural-content"]}>
        <Profile username={user as string} />
        {pinsData.map((pin, index) => {
          return (
            <Pin
              key={index}
              username={user as string}
              description={pin.description}
              cards={pin.cardsData}
            />
          );
        })}
      </div>
    </Mural>
  );
}
