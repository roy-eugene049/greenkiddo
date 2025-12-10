interface AvatarProps {
  avatar?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-lg',
  md: 'w-10 h-10 text-xl',
  lg: 'w-12 h-12 text-2xl',
  xl: 'w-24 h-24 text-4xl'
};

export const Avatar = ({ avatar, name, size = 'md', className = '' }: AvatarProps) => {
  // If avatar URL is provided, use it
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
        onError={(e) => {
          // Fallback if image fails to load
          const target = e.target as HTMLImageElement;
          target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
        }}
      />
    );
  }
  
  // Fallback to dicebear
  const fallbackUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
  return (
    <img
      src={fallbackUrl}
      alt={name}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
    />
  );
};

