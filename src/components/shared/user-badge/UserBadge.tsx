import UsernameWithIcon from "../username-with-icon/UsernameWithIcon";
import Image from "next/image";

import styles from "./user-badge.module.scss";
import userPic from "/public/assets/temp/pf.png";

export default function UserBadge({ username }: { username: string }) {
  return (
    <div className={styles["user-badge"]}>
      <div className={styles["user-img"]}>
        <Image
          src={userPic}
          alt="User profile picture"
          style={{ objectFit: "cover", height: "100%", width: "100%" }}
        />
      </div>
      <UsernameWithIcon username={username} isBadge />
    </div>
  );
}
