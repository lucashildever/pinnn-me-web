import styles from './instagram-embed.module.scss';

interface InstagramEmbedProps {
  embedUrl: string;
}

export default function InstagramEmbed({ embedUrl }: InstagramEmbedProps) {
  return (
    <div className={styles['instagram-container']}>
      <iframe
        className={styles['instagram-embed']}
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
