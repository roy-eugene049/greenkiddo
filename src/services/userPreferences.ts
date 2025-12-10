// Eco Champion Name Generator - Creates millions of unique, creative eco names
const ecoPrefixes = [
  'Eco', 'Green', 'Earth', 'Nature', 'Climate', 'Planet', 'Solar', 'Wind', 'Ocean', 'Forest',
  'Sustainable', 'Renewable', 'Clean', 'Pure', 'Fresh', 'Wild', 'Organic', 'Natural', 'Eco-Friendly',
  'Bio', 'Eco', 'Geo', 'Hydro', 'Terra', 'Flora', 'Fauna', 'Aqua', 'Aero', 'Terra'
];

const ecoDescriptors = [
  'Warrior', 'Champion', 'Guardian', 'Protector', 'Hero', 'Defender', 'Advocate', 'Ambassador',
  'Explorer', 'Navigator', 'Pioneer', 'Trailblazer', 'Innovator', 'Visionary', 'Leader', 'Master',
  'Sage', 'Guru', 'Mentor', 'Teacher', 'Educator', 'Scholar', 'Expert', 'Specialist',
  'Enthusiast', 'Lover', 'Friend', 'Companion', 'Ally', 'Partner', 'Supporter', 'Helper',
  'Crusader', 'Catalyst', 'Sentinel', 'Watchman', 'Keeper', 'Warden', 'Steward', 'Caretaker',
  'Custodian', 'Nomad', 'Wanderer', 'Traveler', 'Adventurer', 'Seeker', 'Discoverer', 'Voyager',
  'Star', 'Beacon', 'Light', 'Torch', 'Flame', 'Spark', 'Glow', 'Radiance',
  'Force', 'Power', 'Energy', 'Strength', 'Might', 'Vigor', 'Dynamo', 'Engine',
  'Savior', 'Redeemer', 'Healer', 'Restorer', 'Reviver', 'Renewer', 'Regenerator', 'Revitalizer',
  'Builder', 'Creator', 'Maker', 'Craftsman', 'Artisan', 'Designer', 'Architect', 'Planner',
  'Fighter', 'Battler', 'Combatant', 'Soldier', 'Knight', 'Paladin', 'Gladiator', 'Guardian'
];

const ecoSuffixes = [
  'of Earth', 'of Nature', 'of the Planet', 'of the Forest', 'of the Ocean', 'of the Sky',
  'of Renewal', 'of Hope', 'of Change', 'of Tomorrow', 'of the Future', 'of Sustainability',
  'the Green', 'the Pure', 'the Clean', 'the Fresh', 'the Wild', 'the Natural',
  'the Wise', 'the Bold', 'the Bright', 'the Strong', 'the Brave', 'the Noble'
];

const ecoModifiers = [
  'Super', 'Ultra', 'Mega', 'Hyper', 'Pro', 'Elite', 'Prime', 'Alpha', 'Omega',
  'Golden', 'Silver', 'Crystal', 'Diamond', 'Platinum', 'Emerald', 'Sapphire', 'Ruby',
  'Ancient', 'Eternal', 'Timeless', 'Infinite', 'Boundless', 'Limitless', 'Endless'
];

/**
 * Generates a random, creative eco champion name by combining different elements
 * This allows for millions of unique combinations
 */
export const generateRandomEcoName = (): string => {
  const useModifier = Math.random() < 0.3; // 30% chance of using a modifier
  const useSuffix = Math.random() < 0.4; // 40% chance of using a suffix
  
  const prefix = ecoPrefixes[Math.floor(Math.random() * ecoPrefixes.length)];
  const descriptor = ecoDescriptors[Math.floor(Math.random() * ecoDescriptors.length)];
  
  let name = `${prefix} ${descriptor}`;
  
  if (useModifier) {
    const modifier = ecoModifiers[Math.floor(Math.random() * ecoModifiers.length)];
    name = `${modifier} ${name}`;
  }
  
  if (useSuffix) {
    const suffix = ecoSuffixes[Math.floor(Math.random() * ecoSuffixes.length)];
    name = `${name} ${suffix}`;
  }
  
  return name;
};

// Keep the old function for backward compatibility but use the generator
export const getRandomEcoName = (): string => {
  return generateRandomEcoName();
};

// Calculate total possible combinations (for reference)
// Prefixes: 30, Descriptors: ~100, Modifiers: 17, Suffixes: 12
// Base combinations: 30 * 100 = 3,000
// With modifiers (30% chance): 3,000 * (1 + 0.3*17) = 18,300
// With suffixes (40% chance): 18,300 * (1 + 0.4*12) = 106,140
// Total: Over 100,000+ unique combinations, and with variations in structure, millions are possible

// Avatar Options - Now using Random User API
// This will be populated dynamically when avatars are fetched
export interface AvatarOption {
  id: string;
  url: string;
  thumbnail: string;
  name: string;
}

// This will be set when avatars are loaded (exported as mutable for dynamic updates)
let avatarOptions: AvatarOption[] = [];

// Function to update avatar options
export const setAvatarOptions = (options: AvatarOption[]): void => {
  avatarOptions = options;
};

// Function to get avatar options
export const getAvatarOptionsList = (): AvatarOption[] => {
  return avatarOptions;
};

export interface UserPreferences {
  useEcoName: boolean;
  selectedEcoName: string | null;
  selectedAvatar: string | null; // avatar ID or URL
  selectedAvatarUrl?: string | null; // full URL for custom avatars
}

const STORAGE_KEY_PREFIX = 'greenkiddo_prefs_';

// Get user preferences from localStorage
export const getUserPreferences = (userId: string): UserPreferences => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading user preferences:', error);
  }
  
  return {
    useEcoName: false,
    selectedEcoName: null,
    selectedAvatar: null
  };
};

// Save user preferences to localStorage
export const saveUserPreferences = (userId: string, preferences: UserPreferences): void => {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
};

// Get display name based on preferences
export const getDisplayName = (
  userId: string,
  realName: string
): string => {
  const prefs = getUserPreferences(userId);
  if (prefs.useEcoName && prefs.selectedEcoName) {
    return prefs.selectedEcoName;
  }
  return realName;
};

// Get display avatar based on preferences
export const getDisplayAvatar = (
  userId: string,
  defaultAvatarUrl?: string | null
): { type: 'url'; value: string } => {
  const prefs = getUserPreferences(userId);
  
  // Check if user has selected a custom avatar URL
  if (prefs.selectedAvatarUrl) {
    return { type: 'url', value: prefs.selectedAvatarUrl };
  }
  
  // Check if user has selected an avatar from the options
  if (prefs.selectedAvatar) {
    const avatar = avatarOptions.find(a => a.id === prefs.selectedAvatar);
    if (avatar) {
      return { type: 'url', value: avatar.url };
    }
    // If avatar not found in cache but we have a URL stored, use it
    if (prefs.selectedAvatarUrl) {
      return { type: 'url', value: prefs.selectedAvatarUrl };
    }
  }
  
  // Use account avatar if available
  if (defaultAvatarUrl) {
    return { type: 'url', value: defaultAvatarUrl };
  }
  
  // Default fallback to dicebear
  return { type: 'url', value: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}` };
};

