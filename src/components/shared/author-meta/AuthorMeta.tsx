import styles from './author-meta.module.scss';

import Image from 'next/image';
import verifiedIcon from '/public/assets/icons/grey-verified.svg';

interface AuthorMetaProps {
  muralName: string;
  hasBadge: boolean;
  from: 'profile' | 'pin' | 'minimal-profile' | 'loading-screen';
}

export default function AuthorMeta({
  muralName,
  hasBadge,
  from,
}: AuthorMetaProps) {
  return (
    <div className={styles[`author-meta-${from}`]}>
      <h1 className={styles['author-name']}>{muralName}</h1>
      {hasBadge ? (
        <Image
          className={styles['badge-icon']}
          src={verifiedIcon}
          alt="Verified icon"
        />
      ) : null}
    </div>
  );
}
