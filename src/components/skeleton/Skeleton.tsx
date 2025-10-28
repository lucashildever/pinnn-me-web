'use client';

import styles from './skeleton.module.scss';

interface SkeletonProps {
  from: 'profile' | 'pin' | 'tabs';
}

export default function Skeleton({ from }: SkeletonProps) {
  switch (from) {
    case 'profile':
      return <ProfileSkeleton />;
    case 'tabs':
      return <TabsSkeleton />;
    case 'pin':
      return <PinSkeleton />;
    default:
      return 'invalida skeleton'; // lançar erro
  }
}

const ProfileSkeleton = () => {
  return (
    <div className={styles['profile-skeleton']}>
      <div className={styles['cover-img']}>
        <div className={styles['loading-glint']}></div>
        <div className={styles['profile-pic']}></div>
      </div>
      <div className={styles['mural-name']}></div>
      <div className={styles['mural-desc']}></div>
    </div>
  );
};

const TabsSkeleton = () => {
  return (
    <div className={styles['tabs-skeleton']}>
      <div className={styles['tab']}></div>
      <div className={styles['tab']}></div>
      <div className={styles['tab']}></div>
    </div>
  );
};

const PinSkeleton = () => {
  return (
    <div className={styles['pin-skeleton']}>
      <div className={styles['author-meta']}>
        <div className={styles['pic']}></div>
        <div className={styles['mural-name']}></div>
      </div>
      <div className={styles['description-container']}>
        <div className={styles['pin-description']}></div>
      </div>
      <div className={styles['pin-card']}></div>
    </div>
  );
};
