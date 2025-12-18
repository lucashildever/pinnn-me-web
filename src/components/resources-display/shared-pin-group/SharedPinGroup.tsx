import { SharedPinGroupResource } from '../types/resource';
import GroupResource from '../common/group-resource/GroupResource';

interface SharedPinGroupProps {
  data: SharedPinGroupResource;
}

export default function SharedPinGroup({ data }: SharedPinGroupProps) {
  return <GroupResource data={data} />;
}
