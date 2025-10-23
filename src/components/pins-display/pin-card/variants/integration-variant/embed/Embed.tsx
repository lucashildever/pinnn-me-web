import { EmbedConfig } from '../types/embed';
import styles from './embed.module.scss';

interface EmbedProps {
  config: EmbedConfig;
}

export default function Embed({ config }: EmbedProps) {
  if (!config.html) {
    return <div>Embed indisponível</div>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: config.html }}
      className={`
          ${styles['embed-container']} 
          ${styles[config.platform]}
        `}
    />
  );
}
