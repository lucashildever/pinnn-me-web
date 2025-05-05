import ImageVariant from "./variants/image-variant/ImageVariant";
import LinkVariant from "./variants/link-variant/LinkVariant";

import {
  CardVariant,
  CardPayload,
  ImageVariantPayload,
  LinkVariantPayload,
} from "@/types/cardTypes";

import styles from "./pin-card.module.scss";

interface PinCardProps {
  caption: string;
  cardPayload: CardPayload;
}

export default function PinCard({
  caption,
  cardPayload: { notFirstCard = false, variantType, variantPayload },
}: PinCardProps) {
  switch (variantType) {
    case CardVariant.Image:
      return (
        <>
          {notFirstCard && <span className={styles["pin-line"]} />}
          <ImageVariant
            caption={caption}
            imageVariantPayload={variantPayload as ImageVariantPayload}
          />
        </>
      );
    case CardVariant.Link:
      return (
        <>
          {notFirstCard && <span className={styles["pin-line"]} />}
          <LinkVariant
            caption={caption}
            LinkVariantPayload={variantPayload as LinkVariantPayload}
          />
        </>
      );
    default:
      return <>invalid variant</>;
  }
}
