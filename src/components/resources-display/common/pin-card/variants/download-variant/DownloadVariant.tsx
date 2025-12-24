'use client';

import { useState } from 'react';
import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';
import CompactVariant from '../common/CompactVariant';
import DownloadModal from '@/components/shared/modal/download-modal/DownloadModal';

interface DownloadVariantProps {
  iconConfig: IconConfig;
  content: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

export default function DownloadVariant({
  content,
  iconConfig,
  fileUrl,
  fileName,
  fileSize,
}: DownloadVariantProps) {
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
        srcMeta={fileName}
        variantType="download"
        iconConfig={iconConfig}
        onClick={handleClick}
      />
      <DownloadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        fileUrl={fileUrl}
        fileName={fileName}
        fileSize={fileSize}
      />
    </>
  );
}
