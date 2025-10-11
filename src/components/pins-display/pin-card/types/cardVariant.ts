const VARIANT_TYPES = {
  link: 'link',
  image: 'image',
  download: 'download',
  integration: 'integration',
} as const;

export type CardVariant = (typeof VARIANT_TYPES)[keyof typeof VARIANT_TYPES];
