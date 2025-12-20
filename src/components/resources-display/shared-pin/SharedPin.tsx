import PinCard from '../common/pin-card/PinCard';
import { SharedPin as SharedPinType } from './types/shared-pin';

interface SharedPinProps {
  data: SharedPinType;
}

export default function SharedPin({ data }: SharedPinProps) {
  return (
    <PinCard
      variants={data.variants.data || []}
      variantsFromSharedPin={data.fromShared?.variants?.data || []}
      shareHistory={data.meta.history || []}
    />
  );
}
