import styles from './twitch-embed.module.scss';

interface TwitchEmbedProps {
  embedUrl: string;
}

export default function TwitchEmbed({ embedUrl }: TwitchEmbedProps) {
  return (
    <iframe
      className={styles['twitch-embed']}
      src={embedUrl}
      width="100%"
      height="378"
      allowFullScreen
      allow="autoplay; fullscreen"
      loading="lazy"
    />
  );
}
