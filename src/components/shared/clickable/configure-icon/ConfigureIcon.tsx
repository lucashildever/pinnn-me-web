import Image from "next/image";
import Twemoji from "react-twemoji";

import { IconConfig } from "@/lib/types/clickable";

import tempCustomImg from "@/assets/temp/cp.png";

import styles from "../clickable.module.scss";

interface ConfigureIconProps {
  config: IconConfig;
}

export default function ConfigureIcon({ config }: ConfigureIconProps) {
  switch (config.type) {
    case "predefined":
      return;
    case "custom":
      return (
        <span className={styles["custom-icon"]}>
          <Image alt="tab icon" src={tempCustomImg} fill />
        </span>
      );
    case "emoji":
      // consertar depois -> Twemoji can't parse string child when noWrapper is set. Skipping child "📝"
      return (
        <span className={styles["emoji-icon"]}>
          <Twemoji noWrapper={true}>{config.unicode}</Twemoji>
        </span>
      );
    case "none":
      return;
  }
}
