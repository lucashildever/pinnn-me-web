import PinCard from '../common/pin-card/PinCard';
import { SharedPin as SharedPinType } from './types/shared-pin';

interface SharedPinProps {
  data: SharedPinType;
  isPinned?: boolean;
}

export default function SharedPin({ data, isPinned }: SharedPinProps) {
  return (
    <PinCard
      variants={data.variants.data || []}
      variantsFromSharedPin={data.fromShared?.variants?.data || []}
      shareHistory={data.meta.history || []}
      ownerPreview={data.meta.ownerPreview}
      isPinned={isPinned}
    />
  );
}
