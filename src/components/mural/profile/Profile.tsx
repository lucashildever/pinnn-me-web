import Image from "next/image";

import UsernameWithIcon from "@/components/shared/username-with-icon/UsernameWithIcon";
import Clickable from "@/components/shared/clickable/Clickable";

import { ClickableType, IconType } from "@/lib/types/clickable";
import { PredefinedIcon } from "@/lib/types/predefinedIcon";

import styles from "./profile.module.scss";

import profilePic from "/public/assets/temp/pf.png";
import coverPic from "/public/assets/temp/cp.png";

interface ProfileProps {
  muralName: string;
  bio: string;
}

export default function Profile({ muralName, bio }: ProfileProps) {
  return (
    <div className={styles.profile}>
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
            <Clickable
              payload={{
                content: "Cta name",
                iconConfig: {
                  type: IconType.PREDEFINED,
                  icon: PredefinedIcon.MESSAGE,
                },
              }}
              config={{
                clickableType: ClickableType.MURAL_CTA,
                link: "https://www.google.com/",
              }}
            />
            <div className={styles["right-buttons"]}>
              {/* <Clickable
                payload={{
                  iconConfig: {
                    type: IconType.PREDEFINED,
                    icon: PredefinedIcon.THEME,
                  },
                }}
                config={{ clickableType: ClickableType.MURAL_THEME }}
              /> */}
              <Clickable
                payload={{
                  iconConfig: {
                    type: IconType.PREDEFINED,
                    icon: PredefinedIcon.OPTIONS,
                  },
                }}
                config={{ clickableType: ClickableType.MURAL_OPTIONS }}
              />
            </div>
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
