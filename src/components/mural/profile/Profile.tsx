'use client';

import { CSSProperties } from 'react';
import Image from 'next/image';

import AuthorMeta from '@/components/shared/author-meta/AuthorMeta';
import Clickable from '@/components/shared/clickable/Clickable';

import styles from './profile.module.scss';

import profilePic from '/public/assets/temp/pf.jpg';
import coverPic from '/public/assets/temp/cp.jpg';

// TODO -  atualizar props para receber dados de forma consistente nas variações do profile
interface ProfileProps {
  muralName: string;
  style?: CSSProperties;
  bio?: string;
  minimal?: boolean;
}

export default function Profile({
  muralName,
  bio,
  style,
  minimal,
}: ProfileProps) {
  if (minimal) {
    return (
      <div className={styles['minimal-profile']}>
        <div className={styles['minimal-pf-info']}>
          <div className={styles['minimal-pf-pic-container']}>
            <Image
              src={profilePic}
              alt="user profile picture"
              style={{ objectFit: 'cover' }}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <AuthorMeta from="minimal-profile" muralName={muralName} hasBadge />
        </div>
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
          // estilizar com scss para aproveitar os mixins
          style={{
            boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.185)',
          }}
        />
      </div>
    );
  }
  return (
    <div
      className={`${styles['extended-profile']} ${styles['pf-overlay']}`}
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
        <AuthorMeta from="profile" muralName={muralName} hasBadge />
        <p>{bio}</p>
      </div>
    </div>
  );
}
