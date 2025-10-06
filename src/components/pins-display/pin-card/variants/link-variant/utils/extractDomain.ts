export const extractDomain = (url: string): string => {
  try {
    const { hostname } = new URL(url);
    return hostname.startsWith('www.') ? hostname.slice(4) : hostname;
  } catch (error) {
    console.error('Error while extracting domain:', error);
    return 'invalid domain';
  }
};
