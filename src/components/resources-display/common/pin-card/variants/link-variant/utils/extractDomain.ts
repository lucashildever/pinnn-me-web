export const extractDomain = (url: string): string => {
  try {
    let processedUrl = url.trim();

    if (!processedUrl.match(/^https?:\/\//i)) {
      processedUrl = `https://${processedUrl}`;
    }

    const { hostname } = new URL(processedUrl);

    return hostname.startsWith('www.') ? hostname.slice(4) : hostname;
  } catch (error) {
    console.error('Error while extracting domain:', error);
    return 'invalid domain';
  }
};
