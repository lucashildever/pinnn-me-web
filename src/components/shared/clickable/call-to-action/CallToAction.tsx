'use client';

import { useState } from 'react';
import IconRenderer from '../../icon-renderer/IconRenderer';
import { CallToActionConfig } from '../types/clickableConfig';
import { Clickable as IClickable } from '@/components/shared/clickable/types/clickable';
import ExternalLinkModal from '../../modal/external-link-modal/ExternalLinkModal';
import styles from '../clickable.module.scss';

interface CallToActionProps {
  payload: IClickable;
  config: CallToActionConfig;
  style?: React.CSSProperties;
}

export function CallToAction({ payload, config, style }: CallToActionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        style={style}
        className={styles['profile-cta']}
        onClick={handleClick}
        type="button"
      >
        {payload?.iconConfig && (
          <IconRenderer
            config={payload.iconConfig}
            renderedSize={payload.iconConfig.type === 'emoji' ? 5 : 7}
            style={{
              marginRight: '4px',
            }}
          />
        )}
        {payload?.content && <p>{payload.content}</p>}
      </button>
      <ExternalLinkModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        link={config.link}
      />
    </>
  );
}
