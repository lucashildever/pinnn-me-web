import styles from './pinterest-embed.module.scss';

interface PinterestEmbedProps {
  embedUrl: string;
}

export default function PinterestEmbed({ embedUrl }: PinterestEmbedProps) {
  return (
    <div className={styles['pinterest-container']}>
      <iframe
        className={styles['pinterest-embed']}
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
