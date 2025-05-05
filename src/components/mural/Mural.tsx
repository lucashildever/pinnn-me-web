import styles from "./mural.module.scss";

export default function Mural({ children }: { children: React.ReactNode }) {
  return <div className={styles["mural"]}>{children}</div>;
}
