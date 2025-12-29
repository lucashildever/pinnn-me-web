'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Theme, EmojiClickData } from 'emoji-picker-react';
import { iconLibrary } from '@/components/shared/icon-renderer/icon/utils/iconLibrary';
import {
  IconConfig,
  AppIcon,
  RESERVED_ICONS,
} from '@/components/shared/icon-renderer/icon/types/app-icon';
import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';
import styles from './icon-selector.module.scss';

// Lazy load emoji picker
const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => (
    <div className={styles['emoji-loading']}>
      <IconRenderer
        config={{ type: 'predefined', icon: 'loading' }}
        renderedSize={8}
      />
    </div>
  ),
});

type TabType = 'icons' | 'emojis';

interface IconSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (config: IconConfig) => void;
}

export default function IconSelector({
  isOpen,
  onClose,
  onSelect,
}: IconSelectorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('icons');

  if (!isOpen) return null;

  const getAvailableIconsByCategory = () => {
    const categorizedIcons: Record<string, { key: string; label: string }[]> =
      {};

    Object.entries(iconLibrary).forEach(([category, icons]) => {
      const availableIcons = Object.entries(icons)
        .filter(([iconKey]) => !RESERVED_ICONS.includes(iconKey as AppIcon))
        .map(([iconKey, iconData]) => ({
          key: iconKey,
          label: iconData.label,
        }));

      if (availableIcons.length > 0) {
        categorizedIcons[category] = availableIcons;
      }
    });

    return categorizedIcons;
  };

  const handleIconSelect = (iconKey: string) => {
    onSelect({ type: 'predefined', icon: iconKey as AppIcon });
    onClose();
  };

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    onSelect({ type: 'emoji', unicode: emojiData.emoji });
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const categorizedIcons = getAvailableIconsByCategory();

  // Format category name for display
  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div
      className={styles['icon-selector-overlay']}
      onClick={handleOverlayClick}
    >
      <div className={styles['icon-selector-modal']}>
        <div className={styles['modal-header']}>
          <span className={styles['modal-title']}>Select icon</span>
          <button
            type="button"
            className={styles['close-button']}
            onClick={onClose}
          >
            <IconRenderer
              config={{ type: 'predefined', icon: 'close' }}
              renderedSize={5}
            />
          </button>
        </div>

        <div className={styles['tabs']}>
          <button
            type="button"
            className={`${styles['tab']} ${activeTab === 'icons' ? styles['active'] : ''}`}
            onClick={() => setActiveTab('icons')}
          >
            Icons
          </button>
          <button
            type="button"
            className={`${styles['tab']} ${activeTab === 'emojis' ? styles['active'] : ''}`}
            onClick={() => setActiveTab('emojis')}
          >
            Emojis
          </button>
        </div>

        {activeTab === 'icons' ? (
          <div className={styles['tab-content']}>
            {Object.entries(categorizedIcons).map(([category, icons]) => (
              <div key={category} className={styles['category']}>
                <div className={styles['category-title']}>
                  {formatCategoryName(category)}
                </div>
                <div className={styles['icons-grid']}>
                  {icons.map((icon) => (
                    <button
                      key={icon.key}
                      type="button"
                      className={styles['icon-button']}
                      onClick={() => handleIconSelect(icon.key)}
                      title={icon.label}
                    >
                      <IconRenderer
                        config={{
                          type: 'predefined',
                          icon: icon.key as AppIcon,
                        }}
                        renderedSize={6}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles['emoji-tab-content']}>
            <EmojiPicker
              onEmojiClick={handleEmojiSelect}
              theme={Theme.DARK}
              width="100%"
              height={350}
              searchPlaceHolder="Search emoji..."
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
