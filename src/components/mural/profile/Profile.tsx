'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from 'motion/react';
import Image from 'next/image';

import AuthorMeta from '@/components/shared/author-meta/AuthorMeta';
import Clickable from '@/components/shared/clickable/Clickable';
import profPicPlaceholder from '/public/assets/prof-placeholder.jpg';
import coverPicPlaceholder from '/public/assets/cov-placeholder.png';
import verifiedIcon from '/public/assets/icons/predefined/blue-gradient-verified.svg';
import { MuralAppearance } from './types/appearance';
import { CallToActionData } from '@/lib/api-client/types/response';

import styles from './profile.module.scss';

// Scroll distance (px) over which the header reaches its compact state
const COLLAPSE_DISTANCE = 180;
// Target height of the compact header
const COMPACT_HEIGHT = 64;
// Top gap applied only while the header is maximized (fades with the collapse)
const TOP_GAP = 15;
// Extra top gap applied only to the cover/banner so it doesn't push the info down.
// Total cover top gap = TOP_GAP + COVER_TOP_GAP = 18px.
const COVER_TOP_GAP = 3;

const PIC_EXPANDED = 87;
const PIC_COMPACT = 40;
const PIC_BORDER_EXPANDED = 6;
const PIC_BORDER_COMPACT = 3;
// Half of the pic sits over the cover (cover bottom = 15 + 3 + 90 = 108)
const PIC_EXPANDED_TOP = 62;
const PIC_COMPACT_TOP = 11;
const PIC_COMPACT_LEFT = 16;

interface ProfileProps {
  muralName: string;
  bio?: string;
  appearance: MuralAppearance;
  callToActions?: CallToActionData[];
}

export default function Profile({
  muralName,
  bio,
  appearance,
  callToActions,
}: ProfileProps) {
  const profileCta = callToActions?.find(
    (cta) => cta.config.type === 'profile',
  );

  const profileRef = useRef<HTMLElement>(null);
  const imgCoverRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [headerWidth, setHeaderWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      const imgHeight = imgCoverRef.current?.offsetHeight ?? 0;
      const infoHeight = infoRef.current?.offsetHeight ?? 0;
      const totalHeight = imgHeight + infoHeight;
      setCollapsedHeight(totalHeight);
      setHeaderWidth(profileRef.current?.offsetWidth ?? 0);
    };

    measure();
    window.addEventListener('resize', measure);

    const observer = new ResizeObserver(measure);
    if (imgCoverRef.current) observer.observe(imgCoverRef.current);
    if (infoRef.current) observer.observe(infoRef.current);

    return () => {
      window.removeEventListener('resize', measure);
      observer.disconnect();
    };
  }, []);

  const scrollY = useMotionValue(0);

  useEffect(() => {
    const update = () => scrollY.set(window.scrollY);

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [scrollY]);

  const smoothScrollY = useSpring(scrollY, {
    stiffness: 140,
    damping: 24,
    mass: 0.5,
  });

  const progress = useTransform(
    smoothScrollY,
    [0, COLLAPSE_DISTANCE],
    [0, 1],
    { clamp: true },
  );

  const headerHeight: MotionValue<number> = useTransform(
    progress,
    [0, 1],
    [collapsedHeight, COMPACT_HEIGHT],
    { clamp: true },
  );
  const topPadding: MotionValue<number> = useTransform(
    progress,
    [0, 1],
    [TOP_GAP, 0],
    { clamp: true },
  );
  const coverTopGap: MotionValue<number> = useTransform(
    progress,
    [0, 1],
    [COVER_TOP_GAP, 0],
    { clamp: true },
  );
  const coverOpacity = useTransform(progress, [0, 1], [1, 0], {
    clamp: true,
  });
  const coverRadius = useTransform(progress, [0, 1], [14, 0], { clamp: true });
  const infoOpacity = useTransform(progress, [0, 0.5], [1, 0], {
    clamp: true,
  });
  const ctaOpacity = useTransform(progress, [0, 0.45], [1, 0], {
    clamp: true,
  });
  const ctaVisibility = useTransform(ctaOpacity, (opacity) =>
    opacity > 0.05 ? 'visible' : 'hidden',
  );
  const usernameOpacity = useTransform(progress, [0.75, 1], [0, 1], {
    clamp: true,
  });

  const picExpandedLeft = Math.max((headerWidth - PIC_EXPANDED) / 2, 0);
  const picTop = useTransform(
    progress,
    [0, 1],
    [PIC_EXPANDED_TOP, PIC_COMPACT_TOP],
    { clamp: true },
  );
  const picLeft = useTransform(
    progress,
    [0, 1],
    [picExpandedLeft, PIC_COMPACT_LEFT],
    { clamp: true },
  );
  const picSize = useTransform(
    progress,
    [0, 1],
    [PIC_EXPANDED, PIC_COMPACT],
    { clamp: true },
  );
  const picBorder = useTransform(
    progress,
    [0, 1],
    [PIC_BORDER_EXPANDED, PIC_BORDER_COMPACT],
    { clamp: true },
  );

  const headerStyle: MotionStyle = {
    paddingTop: topPadding,
    ...(collapsedHeight > 0 ? { height: headerHeight } : {}),
  };

  return (
    <motion.header ref={profileRef} className={styles['profile']} style={headerStyle}>
      <div ref={imgCoverRef} className={styles['profile-img-n-cover']}>
        <motion.div
          className={styles['profile-cover']}
          style={{
            opacity: coverOpacity,
            borderRadius: coverRadius,
            top: coverTopGap,
          }}
        >
          <Image
            src={appearance.coverImageUrl || coverPicPlaceholder}
            alt="profile cover"
            className={styles['cover-image']}
            style={{ objectFit: 'cover' }}
            fill
          />
        </motion.div>

        <div className={styles['cover-buttons']}>
          <motion.div
            className={styles['cover-cta-slot']}
            style={{ opacity: ctaOpacity, visibility: ctaVisibility }}
          >
            {profileCta && (
              <Clickable
                payload={{
                  content: profileCta.content,
                  iconConfig: profileCta.iconConfig,
                }}
                config={{
                  clickableType: 'call-to-action',
                  link: profileCta.config.link,
                }}
              />
            )}
          </motion.div>
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
      </div>

      <motion.div
        ref={infoRef}
        className={styles['profile-info']}
        style={{ opacity: infoOpacity }}
      >
        <AuthorMeta size="large" muralName={muralName} hasBadge />
        <p>{bio}</p>
      </motion.div>

      <motion.div
        className={styles['pf-pic-container']}
        style={{
          top: picTop,
          left: picLeft,
          width: picSize,
          height: picSize,
          borderWidth: picBorder,
        }}
      >
        <Image
          src={appearance.profileImageUrl || profPicPlaceholder}
          alt="user profile picture"
          style={{ objectFit: 'cover' }}
          fill
        />
      </motion.div>

      <motion.div
        className={styles['profile-compact-username']}
        style={{ opacity: usernameOpacity }}
      >
        <span className={styles['compact-username']}>{muralName}</span>
        <Image
          className={styles['badge-icon']}
          src={verifiedIcon}
          alt="Verified icon"
        />
      </motion.div>
    </motion.header>
  );
}