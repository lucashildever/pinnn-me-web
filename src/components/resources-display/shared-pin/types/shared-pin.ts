import { Pin } from '../../pin/types/pin';
import { PaginatedVariants } from '../../pin/types/variant';
import { Pagination } from '@/lib/types/pagination';

export interface SharedPin extends Pin {
  fromShared: {
    variants: PaginatedVariants;
  };
}

export interface SharedPinsData {
  data: SharedPin[];
  pagination: Pagination;
}
