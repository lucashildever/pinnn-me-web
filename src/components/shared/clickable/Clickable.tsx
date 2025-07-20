"use client";

import IconRenderer from "./icon-renderer/IconRenderer";

import { CollectionTabConfig, ProfileCtaConfig } from "./types/clickableConfig";
import { IClickable } from "@/lib/types/clickable";

import styles from "./clickable.module.scss";

interface ClickableProps {
  payload: IClickable;
  config: CollectionTabConfig | ProfileCtaConfig;
  onClick?: () => void;
}

export default function Clickable({
  payload,
  config,
  onClick,
}: ClickableProps) {
  switch (config.clickableType) {
    case "collectionTab":
      return (
        <div
          className={`${styles["collection-tab-clickable"]} ${
            config.active ? styles["active"] : ""
          }`}
          onClick={onClick}
        >
          <IconRenderer config={payload.iconConfig} />
          <p>{payload.content}</p>
        </div>
      );
    case "profileCTA":
      return;
    default:
      return;
  }
}
