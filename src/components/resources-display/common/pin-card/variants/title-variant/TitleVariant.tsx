import styles from './title-variant.module.scss';

interface TitleVariantProps {
  content: string;
}

export default function TitleVariant({ content }: TitleVariantProps) {
  return <h2 className={styles['title-variant']}>{content}</h2>;
}
