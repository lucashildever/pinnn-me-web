import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';
import styles from './compact-variant.module.scss';
import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';

interface CompactVariantProps {
  variantType: 'link' | 'download';
  content: string;
  srcMeta: string;
  iconConfig: IconConfig;
}

export default function CompactVariant({
  content,
  srcMeta,
  variantType,
  iconConfig,
}: CompactVariantProps) {
  return (
    <div className={styles['compact-variant']}>
      <div className={styles['preview']}>
        {iconConfig.type === 'none' && variantType === 'link' ? (
          <IconRenderer
            config={{ type: 'predefined', icon: 'link' }}
            renderedSize={12}
          />
        ) : iconConfig.type === 'none' && variantType === 'download' ? (
          <IconRenderer
            config={{ type: 'predefined', icon: 'fileDown' }}
            renderedSize={12}
          />
        ) : (
          <IconRenderer config={iconConfig} renderedSize={23} />
        )}
      </div>
      <div className={styles['info']}>
        <p>{content}</p>
        <span>{srcMeta}</span>
      </div>
      <div className={styles['compact-card-icon']}>
        <IconRenderer
          config={{
            type: 'predefined',
            icon: variantType === 'link' ? 'arrowUpRight' : 'download',
          }}
          renderedSize={8}
          style={{
            transform: `translateX(-12px) scale(${variantType === 'download' ? 0.95 : 1.13})`,
            opacity: 0.85,
          }}
        />
      </div>
    </div>
  );
}
