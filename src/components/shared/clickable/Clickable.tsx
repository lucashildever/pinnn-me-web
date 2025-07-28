"use client";

import IconRenderer from "./icon-renderer/IconRenderer";

import { ClickableConfig, CollectionTabConfig } from "./types/clickableConfig";
import { ClickableType, Clickable as IClickable } from "@/lib/types/clickable";

import styles from "./clickable.module.scss";

interface ClickableProps {
  payload: IClickable;
  config: ClickableConfig;
}

export default function Clickable({ payload, config }: ClickableProps) {
  switch (config.clickableType) {
    case ClickableType.COLLECTION_TAB:
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
    case ClickableType.COLLECTION_TAB_OVERLAY:
      return (
        <div
          className={`
            ${styles["collection-tab-overlay"]} 
            ${styles[config.displayConfig.visible ? "visible" : ""]}
            ${styles[config.displayConfig.position]}
          `}
        >
          <IconRenderer config={payload.iconConfig} />
          <p>{payload.content}</p>
        </div>
      );
    case ClickableType.MURAL_CTA:
      return (
        <a
          className={styles["profile-cta"]}
          href={config.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconRenderer config={payload.iconConfig} />
          <p>{payload.content}</p>
        </a>
      );
    case ClickableType.MURAL_OPTIONS:
      return (
        <div className={styles[`${config.clickableType}-button-clickable`]}>
          <IconRenderer config={payload.iconConfig} />
        </div>
      );
    case ClickableType.MURAL_THEME:
      console.log("payload", payload);
      console.log("config", config);

      return (
        <div className={styles[`${config.clickableType}-button-clickable`]}>
          <IconRenderer config={payload.iconConfig} />
        </div>
      );
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
