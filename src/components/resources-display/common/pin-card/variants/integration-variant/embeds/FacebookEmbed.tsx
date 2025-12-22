import styles from './facebook-embed.module.scss';

interface FacebookEmbedProps {
  embedUrl: string;
}

export default function FacebookEmbed({ embedUrl }: FacebookEmbedProps) {
  return (
    <div className={styles['facebook-container']}>
      <iframe
        className={styles['facebook-embed']}
        src={embedUrl}
        width="100%"
        height="100%"
        scrolling="no"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        loading="lazy"
      />
    </div>
  );
}
