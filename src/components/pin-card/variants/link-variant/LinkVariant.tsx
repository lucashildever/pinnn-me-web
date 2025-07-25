"use client";

import { useState, useEffect } from "react";
import { LinkVariantPayload } from "@/types/cardTypes";
import Image from "next/image";

import darkArrowIcon from "@/assets/icons/dark-arrow-45.svg";
import darkLinkIcon from "@/assets/icons/dark-link.svg";
import darkInstagramIcon from "@/assets/icons/social/dark-instagram.svg";
import darkXIcon from "@/assets/icons/social/dark-x.svg";
import darkPinterestIcon from "@/assets/icons/social/dark-pinterest.svg";
import darkTiktok from "@/assets/icons/social/dark-tiktok.svg";

import styles from "./link-variant.module.scss";
import { IconType } from "@/lib/types/clickable";
import { PredefinedIcon } from "@/lib/types/predefinedIcon";

interface LinkProps {
  caption: string;
  LinkVariantPayload: LinkVariantPayload;
}

const extractDomain = (url: string): string => {
  try {
    const { hostname } = new URL(url);
    return hostname.startsWith("www.") ? hostname.slice(4) : hostname;
  } catch (error) {
    console.error("Error while extracting domain:", error);
    return "invalid domain";
  }
};

export default function LinkVariant({
  caption,
  LinkVariantPayload,
}: LinkProps) {
  const [variantIcon, setVariantIcon] = useState<string>(darkLinkIcon);
  const [isCustomIcon, setIsCustomIcon] = useState<boolean>(false);

  useEffect(() => {
    const { iconType, customIconSrc } = LinkVariantPayload;
    customIconSrc && setIsCustomIcon(true);

    if (isCustomIcon) {
      setVariantIcon(customIconSrc || darkLinkIcon);
    } else {
      switch (iconType) {
        case PredefinedIcon.X:
          setVariantIcon(darkXIcon);
          break;
        case PredefinedIcon.INSTAGRAM:
          setVariantIcon(darkInstagramIcon);
          break;
        case PredefinedIcon.TIKTOK:
          setVariantIcon(darkTiktok);
          break;
        case PredefinedIcon.PINTEREST:
          setVariantIcon(darkPinterestIcon);
          break;
        default:
          setVariantIcon(darkLinkIcon);
      }
    }
  }, []);

  return (
    <a
      href="/"
      target="_blank"
      rel="noopener noreferrer"
      className={styles["link"]}
    >
      <div className={styles["img-and-info"]}>
        <div
          className={`${styles["link-icon-conainer"]} ${
            isCustomIcon ? styles["custom"] : ""
          }`}
        >
          <Image
            src={variantIcon}
            alt="link icon"
            className={styles["link-icon"]}
          />
        </div>
        <div className={styles["link-info"]}>
          <p>{caption}</p>
          <span>{extractDomain(LinkVariantPayload.url)}</span>
        </div>
      </div>
      <Image
        src={darkArrowIcon}
        alt="arrow icon"
        className={styles["arrow-icon"]}
      />
    </a>
  );
}
