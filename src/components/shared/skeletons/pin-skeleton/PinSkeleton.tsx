import styles from './pin-skeleton.module.scss';

export default function PinSkeleton() {
  return (
    <div className={styles['pin-skeleton']}>
      <div className={styles['author-meta']}>
        <div className={styles['pic']} />
        <div className={styles['mural-name']} />
      </div>
      <div className={styles['description-container']}>
        <div className={styles['pin-description']} />
      </div>
      <div className={styles['pin-card']} />
    </div>
  );
}
