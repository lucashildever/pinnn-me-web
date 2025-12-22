import styles from './author-meta.module.scss';

import Image from 'next/image';
import verifiedIcon from '/public/assets/icons/predefined/blue-gradient-verified.svg';
import React from 'react';

interface AuthorMetaProps {
  muralName: string;
  hasBadge: boolean;
  size: 'small' | 'large';
  style?: React.CSSProperties;
}

export default function AuthorMeta({
  muralName,
  hasBadge,
  size,
  style,
}: AuthorMetaProps) {
  return (
    <div className={styles[`author-meta-${size}`]} style={style}>
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
