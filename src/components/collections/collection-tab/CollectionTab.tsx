"use client";

import styles from "./collection-tab.module.scss";

interface CollectionTabProps {
  content: string;
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}

export default function CollectionTab({
  content,
  isActive,
  setIsActive,
}: CollectionTabProps) {
  return (
    <button
      className={`${styles["collection-tab"]} ${
        isActive ? styles["active"] : ""
      }`}
      onClick={() => setIsActive(!isActive)}
    >
      {content}
    </button>
  );
}
