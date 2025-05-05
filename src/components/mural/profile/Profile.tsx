import UsernameWithIcon from "@/components/shared/username-with-icon/UsernameWithIcon";
import Collections from "@/components/collections/Collections";
import Image from "next/image";
import Button from "../../shared/button/Button";
import { ButtonTypes } from "@/types/buttonTypes";

import coverPic from "@/assets/temp/cp.png";
import profilePic from "@/assets/temp/pf.png";

import styles from "./profile.module.scss";

export default function Profile({ username }: { username: string }) {
  return (
    <div className={styles.profile}>
      {/* transform also this into a header component 
      to use as the header of groups/shared murals */}
      <div className={styles["profile-img-n-cover"]}>
        <div className={styles["pf-pic-container"]}>
          <Image
            src={profilePic}
            alt="user profile picture"
            style={{ objectFit: "cover" }}
            fill
          />
        </div>
        <div className={styles["profile-cover"]}>
          <div className={styles["cover-buttons"]}>
            <Button text="Message" buttonType={ButtonTypes.MESSAGE} />
            <Button text="Ok" buttonType={ButtonTypes.ONLY_TEXT} />
          </div>
          <Image
            src={coverPic}
            alt="profile cover"
            className={styles["cover-image"]}
            style={{ objectFit: "cover" }}
            fill
          />
        </div>
      </div>
      <div className={styles["profile-info"]}>
        <UsernameWithIcon username={username} />
        <p>Product Designer & Web Developer</p>
      </div>
      <Collections />
    </div>
  );
}
