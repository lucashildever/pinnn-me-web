'use client';

import ConfirmationModal from '../common/ConfirmationModal';

interface ExternalLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: string;
}

export default function ExternalLinkModal({
  isOpen,
  onClose,
  link,
}: ExternalLinkModalProps) {
  const handleProceed = () => {
    window.open(link, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const displayLink =
    link && link.length > 35 ? `${link.substring(0, 35)}...` : link || '';

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleProceed}
      icon="link"
      title="Abrir link?"
      description="Isso levará você para um site externo. Deseja continuar?"
      secondaryText={displayLink}
      confirmText="Continuar"
      confirmIcon="arrowUpRight"
    />
  );
}
