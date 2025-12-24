'use client';

import Modal from '../Modal';
import IconRenderer from '../../icon-renderer/IconRenderer';
import { AppIcon } from '../../icon-renderer/icon/types/app-icon';
import styles from '../modal.module.scss';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon: AppIcon;
  title: string;
  description: string;
  secondaryText: string;
  confirmText: string;
  confirmIcon: AppIcon;
  confirmIconSize?: number;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  icon,
  title,
  description,
  secondaryText,
  confirmText,
  confirmIcon,
  confirmIconSize = 7,
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles['modal-header']}>
        <div className={styles['icon-box']}>
          <IconRenderer
            config={{ type: 'predefined', icon }}
            renderedSize={10}
          />
        </div>
        <button
          className={styles['close-button']}
          onClick={onClose}
          type="button"
          aria-label="Fechar"
        >
          <IconRenderer
            config={{ type: 'predefined', icon: 'close' }}
            renderedSize={7}
            style={{
              opacity: 0.5,
            }}
          />
        </button>
      </div>

      <div className={styles['modal-body']}>
        <h2 className={styles['modal-title']}>{title}</h2>
        <p className={styles['modal-description']}>{description}</p>
        <p className={styles['modal-link']}>{secondaryText}</p>
      </div>

      <div className={styles['modal-actions']}>
        <button
          className={`${styles['modal-button']} ${styles['cancel']}`}
          onClick={onClose}
          type="button"
        >
          <span>Cancelar</span>
          <IconRenderer
            config={{ type: 'predefined', icon: 'close' }}
            renderedSize={7}
            style={{
              opacity: 0.5,
              transform: 'scale(0.9) translateX(-2px)',
            }}
          />
        </button>
        <button
          className={`${styles['modal-button']} ${styles['confirm']}`}
          onClick={onConfirm}
          type="button"
        >
          <span>{confirmText}</span>
          <IconRenderer
            config={{ type: 'predefined', icon: confirmIcon }}
            renderedSize={confirmIconSize}
            style={{
              opacity: 0.5,
              transform: 'scale(0.9) translateX(-2px)',
            }}
          />
        </button>
      </div>
    </Modal>
  );
}
