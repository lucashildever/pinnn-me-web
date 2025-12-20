import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';
import CompactVariant from '../common/CompactVariant';

interface LinkVariantProps {
  iconConfig: IconConfig;
  content: string;
}

export default function LinkVariant({ content, iconConfig }: LinkVariantProps) {
  return (
    <CompactVariant
      content={content}
      srcMeta="link.com"
      variantType="link"
      iconConfig={iconConfig}
    />
  );
}
