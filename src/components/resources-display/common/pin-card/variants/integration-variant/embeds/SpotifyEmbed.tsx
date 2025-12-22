import styles from './spotify-embed.module.scss';

interface SpotifyEmbedProps {
  embedUrl: string;
}

export default function SpotifyEmbed({ embedUrl }: SpotifyEmbedProps) {
  return (
    <iframe
      className={styles['spotify-embed']}
      src={embedUrl}
      width="100%"
      height="152"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
