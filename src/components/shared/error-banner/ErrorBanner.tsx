import styles from './error-banner.module.scss';

interface ErrorBannerProps {
  message: string;
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className={styles['error-banner']} role="alert">
      {message}
    </div>
  );
}
