import { EmbedConfig } from '../types/embed';

interface EmbedProps {
  config: EmbedConfig;
}

export default function Embed({ config }: EmbedProps) {
  if (!config.html) {
    return <div>Embed indisponível</div>;
  }

  return <div dangerouslySetInnerHTML={{ __html: config.html }} />;
}
