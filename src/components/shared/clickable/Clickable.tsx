"use client";

import IconRenderer from "./icon-renderer/IconRenderer";

import { ClickableConfig, CollectionTabConfig } from "./types/clickableConfig";
import { ClickableType, IClickable } from "@/lib/types/clickable";

import styles from "./clickable.module.scss";

interface ClickableProps {
  payload: IClickable;
  config: ClickableConfig;
}

export default function Clickable({ payload, config }: ClickableProps) {
  switch (config.clickableType) {
    case ClickableType.CollectionTab:
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
    case ClickableType.CollectionTabOverlay:
      return (
        <div
          className={`
            ${styles["selected-coll-tab-overlay"]} 
            ${styles[config.displayConfig.visible ? "visible" : ""]}
            ${styles[config.displayConfig.position]}
          `}
        >
          <IconRenderer config={payload.iconConfig} />
          <p>{payload.content}</p>
        </div>
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
