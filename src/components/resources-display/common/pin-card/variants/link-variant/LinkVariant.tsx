'use client';

import { useState } from 'react';
import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';
import CompactVariant from '../common/CompactVariant';
import ExternalLinkModal from '@/components/shared/modal/external-link-modal/ExternalLinkModal';

interface LinkVariantProps {
  iconConfig: IconConfig;
  content: string;
  link: string;
}

export default function LinkVariant({
  content,
  iconConfig,
  link,
}: LinkVariantProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <CompactVariant
        content={content}
        srcMeta={link}
        variantType="link"
        iconConfig={iconConfig}
        onClick={handleClick}
      />
      <ExternalLinkModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        link={link}
      />
    </>
  );
}
