import AuthorMeta from "../author-meta/AuthorMeta";
import Image from "next/image";

import styles from "./pin-author.module.scss";
import userPic from "/public/assets/temp/pf.png";

export default function PinAuthor({ username }: { username: string }) {
  return (
    <div className={styles["user-badge"]}> // mudar classname
      <div className={styles["user-img"]}>
        <Image
          src={userPic}
          alt="User profile picture"
          style={{ objectFit: "cover", height: "100%", width: "100%" }}
        />
      </div>
      <AuthorMeta from='pin' username={username} isBadge />
    </div>
  );
}
