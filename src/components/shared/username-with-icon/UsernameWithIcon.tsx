import styles from "./username-with-icon.module.scss";

import Image from "next/image";
import verifiedIcon from "/public/assets/icons/verified.svg";

interface UsernameWithIconProps {
  username: string;
  isBadge?: boolean;
}

export default function UsernameWithIcon({
  username,
  isBadge = false,
}: UsernameWithIconProps) {
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
