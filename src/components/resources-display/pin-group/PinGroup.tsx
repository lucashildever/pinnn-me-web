import { PinGroupResource } from '../types/resource';
import GroupResource from '../common/group-resource/GroupResource';

interface PinGroupProps {
  data: PinGroupResource;
  isPinned?: boolean;
}

export default function PinGroup({ data, isPinned }: PinGroupProps) {
  return <GroupResource data={data} isPinned={isPinned} />;
}
