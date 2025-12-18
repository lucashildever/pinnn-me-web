import AuthorMeta from '../author-meta/AuthorMeta';
import Image from 'next/image';

import styles from './pin-author.module.scss';
import muralPfPic from '/public/assets/temp/pf.jpg';

export default function PinAuthor({ muralName }: { muralName: string }) {
  return (
    <div className={styles['pin-author']}>
      <div className={styles['mural-img']}>
        <Image
          src={muralPfPic}
          alt="Mural profile picture"
          style={{ objectFit: 'cover', height: '100%', width: '100%' }}
        />
      </div>
      <AuthorMeta size="small" muralName={muralName} hasBadge />
    </div>
  );
}
