'use client';

import { IconConfig } from '@/lib/types/clickable';

import CompactCard from '../common/CompactCard';
import { CardVariant } from '../../types/cardVariant';

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
      variantType={CardVariant.LINK}
      iconConfig={iconConfig}
      caption={caption}
      meta={meta}
    />
  );
}
