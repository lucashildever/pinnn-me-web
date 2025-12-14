'use client';

import CompactCard from '../common/CompactCard';

import { CardVariant } from '../../../pin-card/types/cardVariant';
import { IconConfig } from '@/lib/types/clickable';

interface LinkVariantProps {
  iconConfig: IconConfig;
  caption: string;
  meta: string;
}

export default function LinkVariant({
  iconConfig,
  caption,
  meta,
}: LinkVariantProps) {
  return (
    <CompactCard
      variantType={'link'}
      iconConfig={iconConfig}
      caption={caption}
      meta={meta}
    />
  );
}
