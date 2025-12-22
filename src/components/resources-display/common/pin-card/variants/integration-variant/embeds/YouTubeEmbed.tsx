import styles from './youtube-embed.module.scss';

interface YouTubeEmbedProps {
  embedUrl: string;
}

export default function YouTubeEmbed({ embedUrl }: YouTubeEmbedProps) {
  return (
    <div className={styles['youtube-container']}>
      <iframe
        className={styles['youtube-embed']}
        src={embedUrl}
        width="100%"
        height="100%"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
