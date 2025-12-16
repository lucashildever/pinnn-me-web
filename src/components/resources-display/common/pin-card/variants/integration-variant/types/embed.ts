export type IntegrationPlatform =
  | 'youtube'
  | 'instagram'
  | 'tiktok'
  | 'twitter'
  | 'spotify'
  | 'pinterest'
  | 'twitch'
  | 'vimeo'
  | 'soundcloud'
  | 'facebook'
  | 'linkedin'
  | 'google-maps'
  | 'custom';

export interface EmbedConfig {
  platform: IntegrationPlatform;
  url: string;
  html: string;
}
