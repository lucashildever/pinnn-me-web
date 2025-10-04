import Profile from '../Profile';

import TabsDisplay from '@/components/tabs-display/TabsDisplay';

import { TabsProps } from '../../types/tabs';

import styles from './profile-overlay.module.scss';

interface ProfileOverlayProps {
  tabsProps: TabsProps;
  displayName: string;
  description: string;
}

export default function ProfileOverlay({
  tabsProps,
  displayName,
  description,
}: ProfileOverlayProps) {
  return (
    <div className={styles['profile-overlay']}>
      <Profile muralName={displayName} bio={description} minimal />
      <TabsDisplay {...tabsProps} />
    </div>
  );
}
