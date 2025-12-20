import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';
import CompactVariant from '../common/CompactVariant';

interface DownloadVariantProps {
  iconConfig: IconConfig;
  content: string;
  //srcMeta: string;
}

export default function DownloadVariant({
  content,
  iconConfig,
}: DownloadVariantProps) {
  return (
    <CompactVariant
      content={content}
      srcMeta="file_name.ext"
      variantType="download"
      iconConfig={iconConfig}
    />
  );
}
