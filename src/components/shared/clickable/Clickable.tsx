"use client";

import IconRenderer from "./icon-renderer/IconRenderer";

import { CollectionTabConfig, ProfileCtaConfig } from "./types/clickableConfig";
import { ClickableType, IClickable } from "@/lib/types/clickable";

import styles from "./clickable.module.scss";

interface ClickableProps {
  payload: IClickable;
  config: CollectionTabConfig | ProfileCtaConfig;
}

export default function Clickable({ payload, config }: ClickableProps) {
  switch (config.clickableType) {
    case ClickableType.CollectionTab:
      return (
        <CollectionTabClickable
          payload={payload}
          config={config as CollectionTabConfig}
        />
      );
    case ClickableType.ProfileCTA:
      return null;
    default:
      return null;
  }
}

interface CollectionTabClickableProps extends Omit<ClickableProps, "config"> {
  config: CollectionTabConfig;
}

function CollectionTabClickable({
  payload,
  config,
}: CollectionTabClickableProps) {
  return (
    <div
      ref={config.ref}
      className={`${styles["collection-tab-clickable"]} ${
        config.active ? styles["active"] : ""
      }`}
      onClick={() =>
        config.tabClick({
          id: config.tabId,
          displayElement: {
            content: payload.content,
            iconConfig: payload.iconConfig,
          },
        })
      }
    >
      <IconRenderer config={payload.iconConfig} />
      <p>{payload.content}</p>
    </div>
  );
}
