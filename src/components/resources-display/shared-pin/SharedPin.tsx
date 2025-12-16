import PinCard from '../common/pin-card/PinCard';
import { PaginatedVariants } from '../common/pin-card/types/variant';

interface SharedPinProps {
  data: {
    variants: PaginatedVariants;
    fromShared?: {
      variants: PaginatedVariants;
    };
  };
}

export default function SharedPin({ data }: SharedPinProps) {
  return (
    <PinCard
      variants={data.variants?.data || []}
      variantsFromSharedPin={data.fromShared?.variants?.data || []}
    />
  );
}
