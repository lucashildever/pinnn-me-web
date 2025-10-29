import styles from './profile-skeleton.module.scss';

export default function ProfileSkeleton() {
  return (
    <div className={styles['profile-skeleton']}>
      <div className={styles['cover-img']}></div>
      <div className={styles['profile-img']}></div>
      <div className={styles['profile-info']}>
        <div className={styles['mural-name']}></div>
        <div className={styles['mural-desc']}></div>
      </div>
    </div>
  );
}
