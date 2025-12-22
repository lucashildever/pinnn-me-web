import styles from './vimeo-embed.module.scss';

interface VimeoEmbedProps {
  embedUrl: string;
}

export default function VimeoEmbed({ embedUrl }: VimeoEmbedProps) {
  return (
    <div className={styles['vimeo-container']}>
      <iframe
        className={styles['vimeo-embed']}
        src={embedUrl}
        width="100%"
        height="100%"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
