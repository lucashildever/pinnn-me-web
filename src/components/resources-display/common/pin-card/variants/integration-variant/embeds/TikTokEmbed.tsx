import styles from './tiktok-embed.module.scss';

interface TikTokEmbedProps {
  embedUrl: string;
}

export default function TikTokEmbed({ embedUrl }: TikTokEmbedProps) {
  return (
    <div className={styles['tiktok-container']}>
      <iframe
        className={styles['tiktok-embed']}
        src={embedUrl}
        width="100%"
        height="100%"
        allowFullScreen
        scrolling="no"
        allow="encrypted-media"
        loading="lazy"
      />
    </div>
  );
}
