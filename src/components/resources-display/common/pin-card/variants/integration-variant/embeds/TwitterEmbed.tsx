import styles from './twitter-embed.module.scss';

interface TwitterEmbedProps {
  embedUrl: string;
}

export default function TwitterEmbed({ embedUrl }: TwitterEmbedProps) {
  return (
    <div className={styles['twitter-container']}>
      <iframe
        className={styles['twitter-embed']}
        src={embedUrl}
        width="100%"
        height="100%"
        scrolling="no"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
