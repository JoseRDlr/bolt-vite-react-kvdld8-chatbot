const CACHE_PREFIX = 'chatbot_cache_';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

export function getCachedResponse(input: string): string | null {
  const cacheKey = CACHE_PREFIX + input.toLowerCase().trim();
  const cachedItem = localStorage.getItem(cacheKey);
  
  if (cachedItem) {
    const { value, timestamp } = JSON.parse(cachedItem);
    if (Date.now() - timestamp < CACHE_EXPIRATION) {
      return value;
    } else {
      localStorage.removeItem(cacheKey);
    }
  }
  
  return null;
}

export function setCachedResponse(input: string, response: string): void {
  const cacheKey = CACHE_PREFIX + input.toLowerCase().trim();
  const cacheItem = JSON.stringify({
    value: response,
    timestamp: Date.now()
  });
  
  localStorage.setItem(cacheKey, cacheItem);
}