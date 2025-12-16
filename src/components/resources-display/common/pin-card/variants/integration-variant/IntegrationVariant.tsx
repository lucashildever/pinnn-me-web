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

interface IntegrationVariantProps {}

export default function IntegrationVariant({}: IntegrationVariantProps) {
  return (
    <p>IntegrationVariant</p>
    // <div className={styles['integration-variant']}>
    //   <p>{caption}</p>
    //   <Embed config={embedConfig} />
    // </div>
  );
}
