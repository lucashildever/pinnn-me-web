export const isValidUrl = (url: string): boolean => {
  if (!url.trim()) return false;
  try {
    let processedUrl = url.trim();
    if (!processedUrl.match(/^https?:\/\//i)) {
      processedUrl = `https://${processedUrl}`;
    }
    const parsed = new URL(processedUrl);
    return /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(
      parsed.hostname,
    );
  } catch {
    return false;
  }
};
