import styles from './skeleton.module.scss';

interface SkeletonProps {
  from: 'mural' | 'pin';
}

export default function Skeleton({ from }: SkeletonProps) {
  switch (from) {
    case 'mural':
      return <ProfileSkeleton />;
    default:
      return 'invalida skeleton'; // lançar erro
  }
}

function ProfileSkeleton() {
  return (
    <div className={styles['profile-skeleton']}>
      <div className={styles['profile-pic']}></div>
    </div>
  );
}
