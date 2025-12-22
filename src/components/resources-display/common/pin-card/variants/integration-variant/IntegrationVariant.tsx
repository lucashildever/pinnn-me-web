import { IntegrationConfig } from '@/components/resources-display/pin/types/variant';
import { getEmbedUrl } from './utils/embedUtils';
import SpotifyEmbed from './embeds/SpotifyEmbed';
import TwitchEmbed from './embeds/TwitchEmbed';
import YouTubeEmbed from './embeds/YouTubeEmbed';
import InstagramEmbed from './embeds/InstagramEmbed';
import TikTokEmbed from './embeds/TikTokEmbed';
import TwitterEmbed from './embeds/TwitterEmbed';
import VimeoEmbed from './embeds/VimeoEmbed';
import SoundCloudEmbed from './embeds/SoundCloudEmbed';
import PinterestEmbed from './embeds/PinterestEmbed';
import FacebookEmbed from './embeds/FacebookEmbed';
import GoogleMapsEmbed from './embeds/GoogleMapsEmbed';
import UnsupportedEmbed from './embeds/UnsupportedEmbed';

interface IntegrationVariantProps {
  data: IntegrationConfig['embedConfig'];
}

export default function IntegrationVariant({ data }: IntegrationVariantProps) {
  const { platform, url, html } = data;

  // If backend provides HTML, use it directly (future feature)
  if (html) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  // Try to generate embed URL for the platform
  const embedUrl = getEmbedUrl(platform, url);

  // If no embed URL could be generated, show fallback
  if (!embedUrl) {
    return <UnsupportedEmbed platform={platform} url={url} />;
  }

  // Render platform-specific embed component
  switch (platform) {
    case 'spotify':
      return <SpotifyEmbed embedUrl={embedUrl} />;
    case 'twitch':
      return <TwitchEmbed embedUrl={embedUrl} />;
    case 'youtube':
      return <YouTubeEmbed embedUrl={embedUrl} />;
    case 'instagram':
      return <InstagramEmbed embedUrl={embedUrl} />;
    case 'tiktok':
      return <TikTokEmbed embedUrl={embedUrl} />;
    case 'twitter':
      return <TwitterEmbed embedUrl={embedUrl} />;
    case 'vimeo':
      return <VimeoEmbed embedUrl={embedUrl} />;
    case 'soundcloud':
      return <SoundCloudEmbed embedUrl={embedUrl} />;
    case 'pinterest':
      return <PinterestEmbed embedUrl={embedUrl} />;
    case 'facebook':
      return <FacebookEmbed embedUrl={embedUrl} />;
    case 'google-maps':
      return <GoogleMapsEmbed embedUrl={embedUrl} />;
    default:
      // linkedin, custom, and others fall through to UnsupportedEmbed
      return <UnsupportedEmbed platform={platform} url={url} />;
  }
}
