import Image from 'next/image';
import { motion } from 'motion/react';

import AuthorMeta from '../shared/author-meta/AuthorMeta';

import styles from './loading-screen.module.scss';

import muralPic from '/public/assets/temp/pf.jpg';

interface LoadingScreenProps {
  isLoading: boolean;
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  // TODO
  // impedir scroll quando estiver no loading

  return (
    <div className={styles['loading-screen']}>
      <span className={styles['mural-img-container']}>
        <Image src={muralPic} fill alt="mural image" quality={70} />
      </span>
      <div className={styles['loading-info']}>
        <span>Pinnn.Me</span>
        <AuthorMeta muralName="Mural N." from="loading-screen" hasBadge />
      </div>

      <div className={styles['loading-bar']}>
        <motion.span
          initial={{ width: '10%' }}
          animate={{ width: '100%' }}
          className={styles['progress']}
          transition={{ duration: 2 }}
        ></motion.span>
      </div>
    </div>
  );
}
