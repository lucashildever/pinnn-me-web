import { IntegrationPlatform } from '@/components/resources-display/types/integration-platform';
import styles from './unsupported-embed.module.scss';

interface UnsupportedEmbedProps {
  platform: IntegrationPlatform;
  url: string;
}

export default function UnsupportedEmbed({
  platform,
  url,
}: UnsupportedEmbedProps) {
  return (
    <div className={styles['unsupported-embed']}>
      <span className={styles['platform-label']}>{platform}</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles['link']}
      >
        Abrir link
      </a>
    </div>
  );
}
