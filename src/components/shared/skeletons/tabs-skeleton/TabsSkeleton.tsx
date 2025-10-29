import styles from './tabs-skeleton.module.scss';

export default function TabsSkeleton() {
  return (
    <div className={styles['tabs-skeleton']}>
      <div className={styles['tab']}></div>
      <div className={styles['tab']}></div>
      <div className={styles['tab']}></div>
    </div>
  );
}
