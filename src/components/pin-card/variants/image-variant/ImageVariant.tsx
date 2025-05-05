import { ImageVariantPayload } from "@/types/cardTypes";
import Image from "next/image";

import styles from "./image-variant.module.scss";

interface ImageVariantProps {
  caption: string;
  imageVariantPayload: ImageVariantPayload;
}

export default function ImageVariant({
  caption,
  imageVariantPayload,
}: ImageVariantProps) {
  return (
    <div className={styles["image-card"]}>
      <p>{caption}</p>
      <div className={styles["image-variant-container"]}>
        <Image
          src={imageVariantPayload.imageSrc}
          alt="card image"
          className={styles["image"]}
          fill
        />
      </div>
    </div>
  );
}
