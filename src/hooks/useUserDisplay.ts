import { useUser } from '@clerk/clerk-react';
import { getDisplayName, getDisplayAvatar } from '../services/userPreferences';

/**
 * Custom hook to get the user's display name and avatar based on their preferences
 */
export const useUserDisplay = () => {
  const { user } = useUser();
  
  if (!user) {
    return {
      displayName: 'User',
      displayAvatar: { type: 'url' as const, value: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User' }
    };
  }

  const realName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  const displayName = getDisplayName(user.id, realName);
  const displayAvatar = getDisplayAvatar(user.id, user.imageUrl);

  return {
    displayName,
    displayAvatar,
    userId: user.id,
    realName
  };
};

