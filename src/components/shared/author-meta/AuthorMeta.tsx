import styles from "./author-meta.module.scss";

import Image from "next/image";
import verifiedIcon from "/public/assets/icons/verified.svg";

interface AuthorMetaProps {
  username: string;
  from: 'profile' | 'pin' | 'minimal-profile',
  isBadge?: boolean; // mudar isso
  // hasBadge? -> adicionar
}

export default function AuthorMeta({
  username,
  from,
  isBadge = false,
}: AuthorMetaProps) {
  return (
    <div className={styles['author-meta']}>
      <Image
            className={`${styles["icon"]} ${isBadge ? styles["badge"] : ""}`}
            src={verifiedIcon}
            alt="Verified icon"
          />
    </div>
  )

  if (from === 'profile') {
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
  } else if (from === 'pin' || from === 'minimal-profile') {
    return (
      <span className={isBadge ? styles["badge"] : styles["bio"]}> // mudar classnamessss
        {isBadge ? <span>{username}</span> : <h1>{username}</h1>}
        <Image
          className={`${styles["icon"]} ${isBadge ? styles["badge"] : ""}`}
          src={verifiedIcon}
          alt="Verified icon"
        />
      </span>
    );
  } else {
    return 'invalid from data'
  }
}
