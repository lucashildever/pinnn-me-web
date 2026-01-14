import PinCard from '../common/pin-card/PinCard';
import { PaginatedVariants } from './types/variant';

interface PinProps {
  variants: PaginatedVariants;
  isPinned?: boolean;
}

export default function Pin({ variants, isPinned }: PinProps) {
  return <PinCard variants={variants.data} isPinned={isPinned} />;
}
