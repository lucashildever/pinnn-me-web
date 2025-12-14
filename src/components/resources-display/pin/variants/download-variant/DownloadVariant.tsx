import CompactCard from '../common/CompactCard';
import { IconConfig } from '@/lib/types/clickable';

interface LinkVariantProps {
  iconConfig: IconConfig;
  caption: string;
  meta: string;
}

export default function DownloadVariant({
  iconConfig,
  caption,
  meta,
}: LinkVariantProps) {
  return (
    <CompactCard
      variantType={'download'}
      iconConfig={iconConfig}
      caption={caption}
      meta={meta}
    />
  );
}
