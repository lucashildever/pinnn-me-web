import styles from './soundcloud-embed.module.scss';

interface SoundCloudEmbedProps {
  embedUrl: string;
}

export default function SoundCloudEmbed({ embedUrl }: SoundCloudEmbedProps) {
  return (
    <iframe
      className={styles['soundcloud-embed']}
      src={embedUrl}
      width="100%"
      height="166"
      scrolling="no"
      allow="autoplay"
      loading="lazy"
    />
  );
}
