import styles from './text-variant.module.scss';

interface TextVariantProps {
  content: string;
}

export default function TextVariant({ content }: TextVariantProps) {
  return <p className={styles['text-variant']}>{content}</p>;
}
