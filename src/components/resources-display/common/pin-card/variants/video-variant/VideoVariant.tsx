import styles from './video-variant.module.scss';

interface VideoVariantProps {
  src: string;
}

export default function VideoVariant({ src }: VideoVariantProps) {
  return (
    <div className={styles.container}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src="/assets/temp/video.mp4"
        className={styles.video}
        controls={false}
        autoPlay
        muted
        loop
      />
    </div>
  );
}
