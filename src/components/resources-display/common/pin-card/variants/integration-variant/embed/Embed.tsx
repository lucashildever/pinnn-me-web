import { EmbedConfig } from '../types/embed';
import styles from './embed.module.scss';

interface EmbedProps {
  config: EmbedConfig;
}

export default function Embed({ config }: EmbedProps) {
  if (!config.html) {
    // TODO - create a component for this later
    return <div>Embed unavailable</div>;
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
