import { PinGroupResource } from '../types/resource';
import GroupResource from '../common/group-resource/GroupResource';

interface PinGroupProps {
  data: PinGroupResource;
}

export default function PinGroup({ data }: PinGroupProps) {
  return <GroupResource data={data} />;
}
