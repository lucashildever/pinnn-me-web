import PinCard from '../common/pin-card/PinCard';
import { PaginatedVariants } from './types/variant';

interface PinProps {
  variants: PaginatedVariants;
}

export default function Pin({ variants }: PinProps) {
  return <PinCard variants={variants.data} />;
}
