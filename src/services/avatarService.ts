// Service to fetch random avatars from Random User API
// API: https://randomuser.me/api/

export interface RandomUserAvatar {
  id: string;
  url: string;
  thumbnail: string;
  name: string;
}

// Cache for avatars to avoid refetching
let avatarCache: RandomUserAvatar[] = [];
const AVATAR_CACHE_SIZE = 24; // Number of avatars to fetch at once

/**
 * Fetches random avatars from the Random User API
 * @param count Number of avatars to fetch (default: 24)
 * @returns Promise with array of avatar objects
 */
export const fetchRandomAvatars = async (count: number = AVATAR_CACHE_SIZE): Promise<RandomUserAvatar[]> => {
  try {
    const response = await fetch(`https://randomuser.me/api/?results=${count}&inc=picture,name&noinfo`);
    const data = await response.json();
    
    return data.results.map((user: any, index: number) => ({
      id: `avatar-${Date.now()}-${index}`,
      url: user.picture.large,
      thumbnail: user.picture.thumbnail,
      name: `${user.name.first} ${user.name.last}`
    }));
  } catch (error) {
    console.error('Error fetching random avatars:', error);
    // Return fallback avatars if API fails
    return generateFallbackAvatars(count);
  }
};

/**
 * Generates fallback avatars using DiceBear API if Random User API fails
 */
const generateFallbackAvatars = (count: number): RandomUserAvatar[] => {
  const styles = ['avataaars', 'personas', 'big-smile', 'bottts', 'lorelei'];
  return Array.from({ length: count }, (_, index) => ({
    id: `fallback-${index}`,
    url: `https://api.dicebear.com/7.x/${styles[index % styles.length]}/svg?seed=${Date.now()}-${index}`,
    thumbnail: `https://api.dicebear.com/7.x/${styles[index % styles.length]}/svg?seed=${Date.now()}-${index}`,
    name: `Avatar ${index + 1}`
  }));
};

/**
 * Gets cached avatars or fetches new ones if cache is empty
 */
export const getAvatarOptions = async (): Promise<RandomUserAvatar[]> => {
  if (avatarCache.length === 0) {
    avatarCache = await fetchRandomAvatars();
  }
  return avatarCache;
};

/**
 * Refreshes the avatar cache with new random avatars
 */
export const refreshAvatarCache = async (): Promise<RandomUserAvatar[]> => {
  avatarCache = await fetchRandomAvatars();
  return avatarCache;
};

