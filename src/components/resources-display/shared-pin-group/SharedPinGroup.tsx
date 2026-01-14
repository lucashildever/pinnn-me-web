import { SharedPinGroupResource } from '../types/resource';
import GroupResource from '../common/group-resource/GroupResource';

interface SharedPinGroupProps {
  data: SharedPinGroupResource;
  isPinned?: boolean;
}

export default function SharedPinGroup({
  data,
  isPinned,
}: SharedPinGroupProps) {
  return <GroupResource data={data} isPinned={isPinned} />;
}
