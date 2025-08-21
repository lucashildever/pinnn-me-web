import ImageVariant from "./variants/image-variant/ImageVariant";
import LinkVariant from "./variants/link-variant/LinkVariant";

import {
  CardPayload,
  ImageVariantPayload,
  LinkVariantPayload,
} from "@/types/cardTypes";
import { CardVariant } from "../pins-display/pin-card/types/cardVariant";

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
    case CardVariant.IMAGE:
      return (
        <>
          {notFirstCard && <span className={styles["pin-line"]} />}
          <ImageVariant
            caption={caption}
            imageVariantPayload={variantPayload as ImageVariantPayload}
          />
        </>
      );
    case CardVariant.LINK:
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
