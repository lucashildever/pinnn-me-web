import React from 'react';
import OptionsButton from '../options-button/OptionsButton';
import styles from './group-resource.module.scss';
import { PinGroupResource, SharedPinGroupResource } from '../../types/resource';
import SharedPin from '../../shared-pin/SharedPin';
import { SharedPin as SharedPinType } from '../../shared-pin/types/shared-pin';
import Pin from '../../pin/Pin';
import ShareHistory from '../share-history/ShareHistory';
import PinSkeleton from '@/components/shared/skeletons/pin-skeleton/PinSkeleton';

interface GroupResourceProps {
  data: PinGroupResource | SharedPinGroupResource;
}

export default function GroupResource({ data }: GroupResourceProps) {
  const [resourceData, setResourceData] = React.useState<
    PinGroupResource | SharedPinGroupResource | null
  >(null);

  React.useEffect(() => {
    if (data) {
      setResourceData(data);
    }
  }, [data]);

  if (!resourceData) return <PinSkeleton />;

  const isSharedGroup = resourceData.type === 'shared-pin-group';
  const sharedPinsList = isSharedGroup
    ? (resourceData as SharedPinGroupResource).fromShared.pins.data
    : [];

  return (
    <div className={styles['group-resource']}>
      {/* <OptionsButton /> no MVP não precisa */}
      {isSharedGroup ? (
        <>
          {resourceData.meta.history.length > 0 && (
            <ShareHistory
              shareHistory={resourceData.meta.history}
              style={{
                marginLeft: '11px',
                marginBottom: '-7px',
              }}
            />
          )}
          <div className={styles['line-with-group-name']}>
            <span className={styles['group-name']}>
              {resourceData.meta.groupName}
            </span>
          </div>
        </>
      ) : (
        <div className={styles['group-info']}>
          <div className={styles['initial-line']}>
            <span className={styles['head']}></span>
            <span className={styles['line']}></span>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
          >
            <span className={styles['group-name']}>
              {resourceData.meta.groupName}
            </span>
          </div>
        </div>
      )}

      {resourceData.pins.data.map((pin, index) => {
        const hasMoreStandardPins = index < resourceData.pins.data.length - 1;
        const showLine = hasMoreStandardPins;

        return (
          <React.Fragment key={pin.id}>
            {pin.meta.sharedPinId != null ? (
              <SharedPin data={pin as SharedPinType} />
            ) : (
              <Pin variants={pin.variants} />
            )}
            {showLine && <div className={styles['pin-line']} />}
          </React.Fragment>
        );
      })}

      {isSharedGroup && sharedPinsList.length > 0 && (
        <div className={styles['line-with-divider']}>
          <div className={styles['divider']} />
        </div>
      )}

      {isSharedGroup &&
        sharedPinsList.map((pin, index) => {
          const isLast = index === sharedPinsList.length - 1;
          return (
            <React.Fragment key={pin.id}>
              {'fromShared' in pin ? (
                <SharedPin data={pin as SharedPinType} />
              ) : (
                <Pin variants={pin.variants} />
              )}
              {!isLast && <div className={styles['pin-line']} />}
            </React.Fragment>
          );
        })}
    </div>
  );
}
