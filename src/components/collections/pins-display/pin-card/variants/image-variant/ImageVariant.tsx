import Image from "next/image";

import pinTempImage from "@/assets/temp/pin-image-dgg.png";

import styles from "./image-variant.module.scss";

interface ImageVariantProps {
  caption: string;
  //src: string; - add when implement image hosting
}

export default function ImageVariant({ caption }: ImageVariantProps) {
  return (
    <div className={styles["image-card"]}>
      <p>{caption}</p>
      <div className={styles["image-variant-container"]}>
        <Image
          src={pinTempImage}
          alt="card image"
          className={styles["image"]}
          fill
        />
      </div>
    </div>
  );
}
