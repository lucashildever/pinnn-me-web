import styles from './image-variant.module.scss';
import Image from 'next/image';
import tempImage from '/public/assets/temp/cp.jpg';

interface ImageVariantProps {
  src: string;
}

export default function ImageVariant({ src }: ImageVariantProps) {
  return (
    <div className={styles['img-variant-container']}>
      <Image src={tempImage} alt="Pin Image" className={styles.image} />
    </div>
  );
}
