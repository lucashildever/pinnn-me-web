'use client';

import ConfirmationModal from '../common/ConfirmationModal';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function DownloadModal({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileSize,
}: DownloadModalProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDownload}
      icon="download"
      title="Baixar arquivo?"
      description={`Tamanho do arquivo: ${formatFileSize(fileSize)}`}
      secondaryText={fileName}
      confirmText="Baixar"
      confirmIcon="download"
      confirmIconSize={6}
    />
  );
}
