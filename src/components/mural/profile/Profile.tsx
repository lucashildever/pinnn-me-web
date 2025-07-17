import UsernameWithIcon from "@/components/shared/username-with-icon/UsernameWithIcon";
import Image from "next/image";

import coverPic from "@/assets/temp/cp.png";
import profilePic from "@/assets/temp/pf.png";

import styles from "./profile.module.scss";

interface ProfileProps {
  muralName: string;
  bio: string;
}

export default function Profile({ muralName, bio }: ProfileProps) {
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
            {/* <Button
              buttonType={ButtonType.PREDEFINED}
              icon={PredefinedButton.MESSAGE}
              content={"Message"}
            /> */}
            {/* <Button text="Message" buttonType={ButtonType.MESSAGE} />
            <Button text="Ok" buttonType={ButtonType.ONLY_TEXT} /> */}
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
        <UsernameWithIcon username={muralName} />
        <p>{bio}</p>
      </div>
    </div>
  );
}
