import { PinsData } from '../pin/types/pin';
import { SharedPinsData } from '../shared-pin/types/shared-pin';
import { HistoryEntry } from './history-entry';

export type Resource =
  | PinResource
  | SharedPinResource
  | PinGroupResource
  | SharedPinGroupResource;

export type ResourceType =
  | 'pin'
  | 'shared-pin'
  | 'pin-group'
  | 'shared-pin-group';

interface BaseResource {
  id: string;
  type: ResourceType;
  order: string;
  pins: PinsData | SharedPinsData;
  isPinned?: boolean;
}

export interface PinResource extends BaseResource {
  type: 'pin';
  pins: PinsData;
}

export interface SharedPinResource extends BaseResource {
  type: 'shared-pin';
  pins: SharedPinsData;
}

export interface PinGroupResource extends BaseResource {
  type: 'pin-group';
  meta: ResourceMeta;
}

export interface SharedPinGroupResource extends BaseResource {
  type: 'shared-pin-group';
  meta: ResourceMeta;
  fromShared: {
    pins: PinsData | SharedPinsData;
  };
}

export interface ResourceMeta {
  firstResourceId: string | null;
  groupName: string;
  history: HistoryEntry[];
  inheritedPinsTotal: number;
  sharedResourceId: string | null;
}
