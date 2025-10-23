import Embed from './embed/Embed';

import { EmbedConfig } from './types/embed';

import styles from './integration-variant.module.scss';

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
    twttr?: {
      widgets: {
        load: () => void;
      };
    };
  }
}

interface IntegrationVariantProps {
  embedConfig: EmbedConfig;
  caption: string;
}

export default function IntegrationVariant({
  embedConfig,
  caption,
}: IntegrationVariantProps) {
  return (
    <div className={styles['integration-variant']}>
      <p>{caption}</p>
      <Embed config={embedConfig} />
    </div>
  );
}
