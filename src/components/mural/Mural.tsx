"use client";

import styles from "./mural.module.scss";

export default function MuralContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles["mural-container"]}>{children}</div>;
}
