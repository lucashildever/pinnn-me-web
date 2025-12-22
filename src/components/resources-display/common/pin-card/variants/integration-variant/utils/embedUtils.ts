import { IntegrationPlatform } from '@/components/resources-display/types/integration-platform';

type EmbedUrlGenerator = (url: string) => string | null;

/**
 * Transforms a Spotify URL into an embed URL
 * Supports: tracks, albums, playlists, artists, episodes, shows
 *
 * @example
 * // Input: https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh
 * // Output: https://open.spotify.com/embed/track/4iV5W9uYEdYUVa79Axb7Rh
 */
function getSpotifyEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);

    if (!urlObj.hostname.includes('spotify.com')) {
      return null;
    }

    // Handle intl subdomain: open.spotify.com/intl-pt/track/xxx → open.spotify.com/embed/track/xxx
    const pathParts = urlObj.pathname.split('/').filter(Boolean);

    // Remove 'intl-xx' segment if present
    const filteredParts = pathParts.filter((part) => !part.startsWith('intl-'));

    if (filteredParts.length < 2) {
      return null;
    }

    const [type, id] = filteredParts;
    const validTypes = [
      'track',
      'album',
      'playlist',
      'artist',
      'episode',
      'show',
    ];

    if (!validTypes.includes(type)) {
      return null;
    }

    return `https://open.spotify.com/embed/${type}/${id}`;
  } catch {
    return null;
  }
}

/**
 * Transforms a Twitch URL into an embed URL
 * Supports: channels and videos
 *
 * @example
 * // Input: https://twitch.tv/jonvlogs
 * // Output: https://player.twitch.tv/?channel=jonvlogs&parent=yourdomain.com
 *
 * // Input: https://twitch.tv/videos/123456
 * // Output: https://player.twitch.tv/?video=123456&parent=yourdomain.com
 */
function getTwitchEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);

    if (!urlObj.hostname.includes('twitch.tv')) {
      return null;
    }

    const pathParts = urlObj.pathname.split('/').filter(Boolean);

    if (pathParts.length === 0) {
      return null;
    }

    // Get the parent domain for Twitch's security requirement
    const parent =
      typeof window !== 'undefined' ? window.location.hostname : 'localhost';

    // Check if it's a video URL: twitch.tv/videos/123456
    if (pathParts[0] === 'videos' && pathParts[1]) {
      return `https://player.twitch.tv/?video=${pathParts[1]}&parent=${parent}`;
    }

    // Otherwise it's a channel: twitch.tv/channelname
    const channel = pathParts[0];
    return `https://player.twitch.tv/?channel=${channel}&parent=${parent}`;
  } catch {
    return null;
  }
}

/**
 * Transforms a YouTube URL into an embed URL
 * Supports: watch URLs, short URLs (youtu.be), shorts, and already embedded URLs
 *
 * @example
 * // Input: https://youtube.com/watch?v=dQw4w9WgXcQ
 * // Output: https://www.youtube.com/embed/dQw4w9WgXcQ
 *
 * // Input: https://youtube.com/shorts/abc123
 * // Output: https://www.youtube.com/embed/abc123
 */
function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    let videoId: string | null = null;

    if (urlObj.hostname.includes('youtube.com')) {
      // Regular watch URL: youtube.com/watch?v=xxx
      videoId = urlObj.searchParams.get('v');

      // Shorts URL: youtube.com/shorts/xxx
      if (!videoId && urlObj.pathname.startsWith('/shorts/')) {
        videoId = urlObj.pathname.split('/shorts/')[1]?.split('?')[0];
      }
    } else if (urlObj.hostname === 'youtu.be') {
      // Short URL: youtu.be/xxx
      videoId = urlObj.pathname.slice(1).split('?')[0];
    }

    if (!videoId) {
      return null;
    }

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

/**
 * Transforms an Instagram URL into an embed URL
 * Supports: posts (p), reels, and tv
 *
 * @example
 * // Input: https://www.instagram.com/p/ABC123/
 * // Output: https://www.instagram.com/p/ABC123/embed/
 *
 * // Input: https://www.instagram.com/reel/XYZ789/
 * // Output: https://www.instagram.com/reel/XYZ789/embed/
 */
function getInstagramEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);

    if (!urlObj.hostname.includes('instagram.com')) {
      return null;
    }

    const pathParts = urlObj.pathname.split('/').filter(Boolean);

    // Valid content types: p (post), reel, tv
    const validTypes = ['p', 'reel', 'tv'];
    const typeIndex = pathParts.findIndex((part) => validTypes.includes(part));

    if (typeIndex === -1 || !pathParts[typeIndex + 1]) {
      return null;
    }

    const type = pathParts[typeIndex];
    const id = pathParts[typeIndex + 1];

    return `https://www.instagram.com/${type}/${id}/embed/`;
  } catch {
    return null;
  }
}

/**
 * Transforms a TikTok URL into an embed URL
 * Supports: video URLs
 *
 * @example
 * // Input: https://www.tiktok.com/@username/video/7123456789
 * // Output: https://www.tiktok.com/embed/v2/7123456789
 */
function getTikTokEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);

    if (!urlObj.hostname.includes('tiktok.com')) {
      return null;
    }

    // Handle short URLs (vm.tiktok.com) - these need backend resolution
    if (urlObj.hostname === 'vm.tiktok.com') {
      return null;
    }

    const pathParts = urlObj.pathname.split('/').filter(Boolean);

    // Find video ID: @username/video/123456789
    const videoIndex = pathParts.indexOf('video');
    if (videoIndex === -1 || !pathParts[videoIndex + 1]) {
      return null;
    }

    const videoId = pathParts[videoIndex + 1];
    return `https://www.tiktok.com/embed/v2/${videoId}`;
  } catch {
    return null;
  }
}

/**
 * Transforms a Twitter/X URL into an embed URL
 * Supports: tweets, posts
 *
 * @example
 * // Input: https://twitter.com/user/status/123456789
 * // Output: https://platform.twitter.com/embed/Tweet.html?id=123456789
 */
function getTwitterEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);

    if (
      !urlObj.hostname.includes('twitter.com') &&
      !urlObj.hostname.includes('x.com')
    ) {
      return null;
    }

    const pathParts = urlObj.pathname.split('/').filter(Boolean);

    // Find status ID: username/status/123456789
    const statusIndex = pathParts.indexOf('status');
    if (statusIndex === -1 || !pathParts[statusIndex + 1]) {
      return null;
    }

    const tweetId = pathParts[statusIndex + 1];
    return `https://platform.twitter.com/embed/Tweet.html?id=${tweetId}`;
  } catch {
    return null;
  }
}

/**
 * Transforms a Vimeo URL into an embed URL
 * Supports: video URLs
 *
 * @example
 * // Input: https://vimeo.com/123456789
 * // Output: https://player.vimeo.com/video/123456789
 */
function getVimeoEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);

    if (!urlObj.hostname.includes('vimeo.com')) {
      return null;
    }

    const pathParts = urlObj.pathname.split('/').filter(Boolean);

    // Get video ID (first numeric segment)
    const videoId = pathParts.find((part) => /^\d+$/.test(part));

    if (!videoId) {
      return null;
    }

    return `https://player.vimeo.com/video/${videoId}`;
  } catch {
    return null;
  }
}

/**
 * Transforms a SoundCloud URL into an embed URL
 * Supports: tracks, playlists, artists
 *
 * @example
 * // Input: https://soundcloud.com/artist/track-name
 * // Output: https://w.soundcloud.com/player/?url=https://soundcloud.com/artist/track-name
 */
function getSoundCloudEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);

    if (!urlObj.hostname.includes('soundcloud.com')) {
      return null;
    }

    const pathParts = urlObj.pathname.split('/').filter(Boolean);

    // Need at least artist/track or artist
    if (pathParts.length === 0) {
      return null;
    }

    // Use the full URL in the player widget
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
  } catch {
    return null;
  }
}

/**
 * Transforms a Pinterest URL into an embed URL
 * Supports: pins
 *
 * @example
 * // Input: https://pinterest.com/pin/123456789/
 * // Output: https://assets.pinterest.com/ext/embed.html?id=123456789
 */
function getPinterestEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);

    if (
      !urlObj.hostname.includes('pinterest.com') &&
      !urlObj.hostname.includes('pin.it')
    ) {
      return null;
    }

    // Short URL (pin.it) - can't embed directly
    if (urlObj.hostname.includes('pin.it')) {
      return null;
    }

    const pathParts = urlObj.pathname.split('/').filter(Boolean);

    // Find pin ID: /pin/123456789/
    const pinIndex = pathParts.indexOf('pin');
    if (pinIndex === -1 || !pathParts[pinIndex + 1]) {
      return null;
    }

    const pinId = pathParts[pinIndex + 1];
    return `https://assets.pinterest.com/ext/embed.html?id=${pinId}`;
  } catch {
    return null;
  }
}

/**
 * Transforms a Facebook URL into an embed URL
 * Supports: posts, videos
 *
 * @example
 * // Input: https://www.facebook.com/user/posts/123456789
 * // Output: https://www.facebook.com/plugins/post.php?href=...
 */
function getFacebookEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);

    if (
      !urlObj.hostname.includes('facebook.com') &&
      !urlObj.hostname.includes('fb.watch')
    ) {
      return null;
    }

    // Short video URL (fb.watch) - can't embed directly
    if (urlObj.hostname.includes('fb.watch')) {
      return null;
    }

    const pathParts = urlObj.pathname.split('/').filter(Boolean);

    // Check if it's a video
    if (pathParts.includes('videos') || pathParts.includes('watch')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
    }

    // Default to post embed
    if (
      pathParts.includes('posts') ||
      pathParts.includes('photo.php') ||
      pathParts.includes('permalink.php')
    ) {
      return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true`;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Transforms a Google Maps URL into an embed URL
 * Supports: place URLs, search URLs
 *
 * @example
 * // Input: https://www.google.com/maps/place/...
 * // Output: https://www.google.com/maps/embed?pb=...
 */
function getGoogleMapsEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);

    if (
      !urlObj.hostname.includes('google.com') &&
      !urlObj.hostname.includes('goo.gl')
    ) {
      return null;
    }

    // Check if it's a maps URL
    if (!urlObj.pathname.includes('/maps')) {
      return null;
    }

    // For place URLs, extract place data
    // The safest approach is to use the URL as-is in an embed
    // Google Maps requires API key for proper embeds, so we use the simple embed
    const placeMatch = urlObj.pathname.match(/\/place\/([^/]+)/);
    if (placeMatch) {
      const placeName = placeMatch[1];
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d0!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s!2s${encodeURIComponent(placeName)}!5e0!3m2!1sen!2s!4v0`;
    }

    // For search or other URLs, we can't easily embed without API
    return null;
  } catch {
    return null;
  }
}

// Registry of embed URL generators by platform
const embedGenerators: Partial<Record<IntegrationPlatform, EmbedUrlGenerator>> =
  {
    spotify: getSpotifyEmbedUrl,
    youtube: getYouTubeEmbedUrl,
    twitch: getTwitchEmbedUrl,
    instagram: getInstagramEmbedUrl,
    tiktok: getTikTokEmbedUrl,
    twitter: getTwitterEmbedUrl,
    vimeo: getVimeoEmbedUrl,
    soundcloud: getSoundCloudEmbedUrl,
    pinterest: getPinterestEmbedUrl,
    facebook: getFacebookEmbedUrl,
    'google-maps': getGoogleMapsEmbedUrl,
    // linkedin: No native embed support - uses fallback
    // custom: Uses fallback (link only)
  };

/**
 * Gets the embed URL for a given platform and URL
 * Returns null if the platform is not supported or URL is invalid
 */
export function getEmbedUrl(
  platform: IntegrationPlatform,
  url: string,
): string | null {
  const generator = embedGenerators[platform];

  if (!generator) {
    return null;
  }

  return generator(url);
}

/**
 * Checks if a platform has native iframe embed support
 */
export function hasNativeEmbedSupport(platform: IntegrationPlatform): boolean {
  return platform in embedGenerators;
}

// Export individual generators for direct use if needed
export {
  getSpotifyEmbedUrl,
  getYouTubeEmbedUrl,
  getTwitchEmbedUrl,
  getInstagramEmbedUrl,
  getTikTokEmbedUrl,
  getTwitterEmbedUrl,
  getVimeoEmbedUrl,
  getSoundCloudEmbedUrl,
  getPinterestEmbedUrl,
  getFacebookEmbedUrl,
  getGoogleMapsEmbedUrl,
};
