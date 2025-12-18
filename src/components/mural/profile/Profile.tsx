'use client';

import { CSSProperties } from 'react';
import Image from 'next/image';

import AuthorMeta from '@/components/shared/author-meta/AuthorMeta';
import Clickable from '@/components/shared/clickable/Clickable';

import styles from './profile.module.scss';

import profilePic from '/public/assets/temp/pf.jpg';
import coverPic from '/public/assets/temp/cp.jpg';

interface ProfileProps {
  muralName: string;
  style?: CSSProperties;
  bio?: string;
}

export default function Profile({ muralName, bio, style }: ProfileProps) {
  return (
    <div
      className={`${styles['profile']} ${styles['pf-overlay']}`}
      style={style}
    >
      <div className={styles['profile-img-n-cover']}>
        <div className={styles['pf-pic-container']}>
          <Image
            src={profilePic}
            alt="user profile picture"
            style={{ objectFit: 'cover' }}
            fill
          />
        </div>
        <div className={styles['profile-cover']}>
          <div className={styles['cover-buttons']}>
            <Clickable
              payload={{
                content: 'Cta name',
                iconConfig: {
                  type: 'predefined',
                  icon: 'message',
                },
              }}
              config={{
                clickableType: 'call-to-action',
                link: 'https://www.google.com/',
              }}
            />
            <div className={styles['right-buttons']}>
              <Clickable
                payload={{
                  iconConfig: {
                    type: 'predefined',
                    icon: 'options',
                  },
                }}
                config={{ clickableType: 'mural-options' }}
              />
            </div>
          </div>
          <Image
            src={coverPic}
            alt="profile cover"
            className={styles['cover-image']}
            style={{ objectFit: 'cover' }}
            fill
          />
        </div>
      </div>
      <div className={styles['profile-info']}>
        <AuthorMeta size="large" muralName={muralName} hasBadge />
        <p>{bio}</p>
      </div>
    </div>
  );
}
