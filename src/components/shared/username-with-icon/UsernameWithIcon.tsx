import styles from "./username-with-icon.module.scss";

import Image from "next/image";
import verifiedIcon from "/public/assets/icons/verified.svg";

interface UsernameWithIconProps {
  username: string;
  size: "small" | "medium" | "large";
  isBadge?: boolean;
}

export default function UsernameWithIcon({
  username,
  size,
  isBadge = false,
}: UsernameWithIconProps) {
  switch (size) {
    case "small":
      return (
        <span className={isBadge ? styles["badge"] : styles["bio"]}>
          {isBadge ? <span>{username}</span> : <h1>{username}</h1>}
          <Image
            className={`${styles["icon"]} ${isBadge ? styles["badge"] : ""}`}
            src={verifiedIcon}
            alt="Verified icon"
          />
        </span>
      );
    case "medium":
      return (
        <span className={isBadge ? styles["badge"] : styles["bio"]}>
          {isBadge ? <span>{username}</span> : <h1>{username}</h1>}
          <Image
            className={`${styles["icon"]} ${isBadge ? styles["badge"] : ""}`}
            src={verifiedIcon}
            alt="Verified icon"
          />
        </span>
      );
    case "medium":
      return (
        <span className={isBadge ? styles["badge"] : styles["bio"]}>
          {isBadge ? <span>{username}</span> : <h1>{username}</h1>}
          <Image
            className={`${styles["icon"]} ${isBadge ? styles["badge"] : ""}`}
            src={verifiedIcon}
            alt="Verified icon"
          />
        </span>
      );
  }
}
