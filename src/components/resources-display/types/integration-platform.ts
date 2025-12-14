export type IntegrationPlatform = (typeof SUPPORTED_PLATFORMS)[number];

export const SUPPORTED_PLATFORMS = [
  'youtube',
  'instagram',
  'tiktok',
  'twitter',
  'spotify',
  'pinterest',
  'twitch',
  'vimeo',
  'soundcloud',
  'facebook',
  'linkedin',
  'google-maps',
  'custom',
] as const;
