import Icon from '@/components/shared/icon-renderer/icon/Icon';
import styles from './share-history.module.scss';

export default function ShareHistory() {
  return (
    <div className={styles['share-history']}>
      <div className={styles['current-mural-pic']}></div>
      <Icon iconName="repeat" />
    </div>
  );
}
