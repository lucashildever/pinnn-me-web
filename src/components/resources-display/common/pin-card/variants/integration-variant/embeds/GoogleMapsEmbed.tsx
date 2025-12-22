import styles from './google-maps-embed.module.scss';

interface GoogleMapsEmbedProps {
  embedUrl: string;
}

export default function GoogleMapsEmbed({ embedUrl }: GoogleMapsEmbedProps) {
  return (
    <div className={styles['google-maps-container']}>
      <iframe
        className={styles['google-maps-embed']}
        src={embedUrl}
        width="100%"
        height="100%"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        loading="lazy"
      />
    </div>
  );
}
