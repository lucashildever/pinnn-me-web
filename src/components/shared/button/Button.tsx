import styles from "./button.module.scss";
import messageIcon from "@/assets/icons/MessageIcon.svg";
import Image from "next/image";
import { ButtonTypes } from "@/types/buttonTypes";

interface ButtonProps {
  buttonType: ButtonTypes;
  text?: string;
}

export default function Button({ buttonType, text }: ButtonProps) {
  return (
    <button className={styles["base-button"]}>
      {!(buttonType === ButtonTypes.ONLY_TEXT) && (
        <Image
          alt="button icon"
          src={messageIcon}
          className={styles["button-icon"]}
        ></Image>
      )}
      <span className={styles["button-text"]}>{text}</span>
    </button>
  );
}
