import { PlatformSettings } from '../types/admin';

const STORAGE_KEY_SETTINGS = 'greenkiddo_platform_settings';

// Default platform settings
const defaultSettings: PlatformSettings = {
  siteName: 'GreenKiddo',
  siteDescription: 'Sustainable Learning Platform for Kids',
  contactEmail: 'contact@greenkiddo.com',
  supportEmail: 'support@greenkiddo.com',
  socialLinks: {},
  features: {
    enableForum: true,
    enableBlog: true,
    enableCertificates: true,
    enableBadges: true,
    enableReviews: true,
    enableNotifications: true,
  },
  email: {
    fromName: 'GreenKiddo',
    fromEmail: 'noreply@greenkiddo.com',
  },
  notifications: {
    emailOnSignup: true,
    emailOnEnrollment: true,
    emailOnCompletion: true,
    emailOnAchievement: true,
    emailWeeklyDigest: false,
  },
  maintenance: {
    maintenanceMode: false,
  },
};

/**
 * Get platform settings
 */
export const getPlatformSettings = async (): Promise<PlatformSettings> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
  if (stored) {
    return { ...defaultSettings, ...JSON.parse(stored) };
  }
  
  return defaultSettings;
};

/**
 * Update platform settings
 */
export const updatePlatformSettings = async (updates: Partial<PlatformSettings>): Promise<PlatformSettings> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const current = await getPlatformSettings();
  const updated = { ...current, ...updates };
  
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
  
  return updated;
};

/**
 * Reset platform settings to defaults
 */
export const resetPlatformSettings = async (): Promise<PlatformSettings> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(defaultSettings));
  
  return defaultSettings;
};

