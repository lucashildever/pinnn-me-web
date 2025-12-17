import PinCard from '../common/pin-card/PinCard';
import { PinMeta } from '../common/pin-card/types/pin';
import { PaginatedVariants } from '../common/pin-card/types/variant';

interface SharedPinProps {
  data: {
    variants: PaginatedVariants;
    fromShared: {
      variants: PaginatedVariants;
    };
    meta: PinMeta;
  };
}

export default function SharedPin({ data }: SharedPinProps) {
  console.log('data sharedPin ->', data);
  return (
    <PinCard
      variants={data.variants.data || []}
      variantsFromSharedPin={data.fromShared.variants.data || []}
      shareHistory={data.meta.history || []}
    />
  );
}
