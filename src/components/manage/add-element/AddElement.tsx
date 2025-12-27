'use client';

import { useState } from 'react';
import { motion, LayoutGroup } from 'motion/react';
import styles from './add-element.module.scss';
import Modal from '@/components/shared/modal/Modal';
import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';
import { AppIcon } from '@/components/shared/icon-renderer/icon/types/app-icon';
import {
  IntegrationPlatform,
  SUPPORTED_PLATFORMS,
} from '@/components/resources-display/types/integration-platform';

export type BasicVariantOption =
  | 'title'
  | 'text'
  | 'image'
  | 'video'
  | 'link'
  | 'download';

export type IntegrationVariantOption = {
  type: 'integration';
  platform: IntegrationPlatform;
};

export type VariantSelection = BasicVariantOption | IntegrationVariantOption;

interface BasicVariantConfig {
  type: BasicVariantOption;
  label: string;
  description: string;
  icon: AppIcon;
}

interface IntegrationConfig {
  platform: IntegrationPlatform;
  label: string;
  description: string;
}

interface AddElementProps {
  label: string;
  onSelect?: (variant: VariantSelection) => void;
}

type SectionType = 'basics' | 'apps' | null;

const COLLAPSED_VISIBLE_COUNT = 3;

const basicVariants: BasicVariantConfig[] = [
  { type: 'title', label: 'Title', description: 'Large text', icon: 'title' },
  {
    type: 'text',
    label: 'Text',
    description: 'Plain paragraph',
    icon: 'text',
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Upload or embed',
    icon: 'image',
  },
  {
    type: 'video',
    label: 'Video',
    description: 'Embed video content',
    icon: 'video',
  },
  {
    type: 'link',
    label: 'Link',
    description: 'External URL',
    icon: 'link',
  },
  {
    type: 'download',
    label: 'Download',
    description: 'File attachment',
    icon: 'fileDown',
  },
];

const platformLabels: Record<
  IntegrationPlatform,
  { label: string; description: string }
> = {
  youtube: { label: 'YouTube', description: 'Embed videos' },
  instagram: { label: 'Instagram', description: 'Posts & reels' },
  tiktok: { label: 'TikTok', description: 'Short videos' },
  twitter: { label: 'Twitter/X', description: 'Tweets & posts' },
  spotify: { label: 'Spotify', description: 'Music & podcasts' },
  pinterest: { label: 'Pinterest', description: 'Pins & boards' },
  twitch: { label: 'Twitch', description: 'Live streams' },
  vimeo: { label: 'Vimeo', description: 'Video hosting' },
  soundcloud: { label: 'SoundCloud', description: 'Audio tracks' },
  facebook: { label: 'Facebook', description: 'Posts & videos' },
  linkedin: { label: 'LinkedIn', description: 'Professional posts' },
  'google-maps': { label: 'Google Maps', description: 'Location embed' },
  custom: { label: 'Custom Embed', description: 'Any iframe' },
};

const integrationVariants: IntegrationConfig[] = SUPPORTED_PLATFORMS.map(
  (platform) => ({
    platform,
    ...platformLabels[platform],
  }),
);

export default function AddElement({ label, onSelect }: AddElementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<SectionType>('basics');
  const [basicsScrolled, setBasicsScrolled] = useState(false);
  const [basicsScrolledEnd, setBasicsScrolledEnd] = useState(false);
  const [appsScrolled, setAppsScrolled] = useState(false);
  const [appsScrolledEnd, setAppsScrolledEnd] = useState(false);

  const handleClose = () => setIsOpen(false);

  const handleOpen = () => {
    setExpandedSection('basics');
    setBasicsScrolled(false);
    setBasicsScrolledEnd(false);
    setAppsScrolled(false);
    setAppsScrolledEnd(false);
    setIsOpen(true);
  };

  const handleBasicClick = (variant: BasicVariantOption) => {
    onSelect?.(variant);
    setIsOpen(false);
  };

  const handleIntegrationClick = (platform: IntegrationPlatform) => {
    onSelect?.({ type: 'integration', platform });
    setIsOpen(false);
  };

  const toggleSection = (section: SectionType) => {
    setExpandedSection((prev) => (prev === section ? null : section));
    setBasicsScrolled(false);
    setBasicsScrolledEnd(false);
    setAppsScrolled(false);
    setAppsScrolledEnd(false);
  };

  const handleBasicsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setBasicsScrolled(scrollTop > 0);
    setBasicsScrolledEnd(scrollTop + clientHeight >= scrollHeight - 5);
  };

  const handleAppsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setAppsScrolled(scrollTop > 0);
    setAppsScrolledEnd(scrollTop + clientHeight >= scrollHeight - 5);
  };

  const basicsOverflowCount = basicVariants.length - COLLAPSED_VISIBLE_COUNT;
  const appsOverflowCount =
    integrationVariants.length - COLLAPSED_VISIBLE_COUNT;

  return (
    <>
      <button className={styles['add-element-button']} onClick={handleOpen}>
        <IconRenderer
          config={{ type: 'predefined', icon: 'plus' }}
          renderedSize={4}
          style={{ opacity: 0.3, transform: 'scale(1.5)' }}
        />
        {label}
      </button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className={styles['dropdown']}>
          <div className={styles['modal-header']}>
            <h2 className={styles['modal-title']}>Add Content</h2>
            <button
              className={styles['close-button']}
              onClick={handleClose}
              type="button"
              aria-label="Fechar"
            >
              <IconRenderer
                config={{ type: 'predefined', icon: 'close' }}
                renderedSize={7}
                style={{ opacity: 0.5 }}
              />
            </button>
          </div>

          <LayoutGroup>
            {/* Basics Section */}
            <div className={styles['section']}>
              <button
                className={styles['dropdown-header']}
                onClick={() => toggleSection('basics')}
              >
                Basics
              </button>

              <motion.div
                layout
                className={
                  expandedSection === 'basics'
                    ? styles['section-content-expanded']
                    : styles['section-collapsed']
                }
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {expandedSection === 'basics' ? (
                  <div
                    className={`${styles['scroll-wrapper']} ${basicsScrolled ? styles['scrolled'] : ''} ${basicsScrolledEnd ? styles['scrolled-end'] : ''}`}
                  >
                    <div
                      className={styles['section-scroll']}
                      onScroll={handleBasicsScroll}
                    >
                      {basicVariants.map((option) => (
                        <motion.button
                          key={option.type}
                          layout
                          className={styles['dropdown-item']}
                          onClick={() => handleBasicClick(option.type)}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className={styles['icon-container']}>
                            <IconRenderer
                              config={{ type: 'predefined', icon: option.icon }}
                              renderedSize={8}
                            />
                          </div>
                          <div className={styles['text-container']}>
                            <span className={styles['item-label']}>
                              {option.label}
                            </span>
                            <span className={styles['item-description']}>
                              {option.description}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {basicVariants
                      .slice(0, COLLAPSED_VISIBLE_COUNT)
                      .map((option) => (
                        <motion.button
                          key={option.type}
                          layout
                          className={styles['icon-container']}
                          onClick={() => handleBasicClick(option.type)}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.15 }}
                        >
                          <IconRenderer
                            config={{ type: 'predefined', icon: option.icon }}
                            renderedSize={8}
                          />
                        </motion.button>
                      ))}
                    {basicsOverflowCount > 0 && (
                      <motion.button
                        layout
                        className={styles['overflow-button']}
                        onClick={() => toggleSection('basics')}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15 }}
                      >
                        +{basicsOverflowCount}
                      </motion.button>
                    )}
                  </>
                )}
              </motion.div>
            </div>

            {/* Apps Section */}
            <div className={styles['section']}>
              <button
                className={styles['dropdown-header']}
                onClick={() => toggleSection('apps')}
              >
                Apps
              </button>

              <motion.div
                layout
                className={
                  expandedSection === 'apps'
                    ? styles['section-content-expanded']
                    : styles['section-collapsed']
                }
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {expandedSection === 'apps' ? (
                  <div
                    className={`${styles['scroll-wrapper']} ${appsScrolled ? styles['scrolled'] : ''} ${appsScrolledEnd ? styles['scrolled-end'] : ''}`}
                  >
                    <div
                      className={styles['section-scroll']}
                      onScroll={handleAppsScroll}
                    >
                      {integrationVariants.map((option) => (
                        <motion.button
                          key={option.platform}
                          layout
                          className={styles['dropdown-item']}
                          onClick={() =>
                            handleIntegrationClick(option.platform)
                          }
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className={styles['icon-container']}>
                            <IconRenderer
                              config={{ type: 'predefined', icon: 'puzzle' }}
                              renderedSize={8}
                            />
                          </div>
                          <div className={styles['text-container']}>
                            <span className={styles['item-label']}>
                              {option.label}
                            </span>
                            <span className={styles['item-description']}>
                              {option.description}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {integrationVariants
                      .slice(0, COLLAPSED_VISIBLE_COUNT)
                      .map((option) => (
                        <motion.button
                          key={option.platform}
                          layout
                          className={styles['icon-container']}
                          onClick={() =>
                            handleIntegrationClick(option.platform)
                          }
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.15 }}
                        >
                          <IconRenderer
                            config={{ type: 'predefined', icon: 'puzzle' }}
                            renderedSize={8}
                          />
                        </motion.button>
                      ))}
                    {appsOverflowCount > 0 && (
                      <motion.button
                        layout
                        className={styles['overflow-button']}
                        onClick={() => toggleSection('apps')}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15 }}
                      >
                        +{appsOverflowCount}
                      </motion.button>
                    )}
                  </>
                )}
              </motion.div>
            </div>
          </LayoutGroup>
        </div>
      </Modal>
    </>
  );
}
