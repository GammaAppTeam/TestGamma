
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  showDropdown?: boolean;
  showPresence?: boolean;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name, 
  size = 'md', 
  showName = false, 
  showDropdown = false,
  showPresence = false,
  className
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getBackgroundColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-red-500'
    ];
    const firstLetter = name.charAt(0).toUpperCase();
    const index = firstLetter.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className={cn("flex items-center gap-2 relative", className)}>
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} ${getBackgroundColor(name)}`}>
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
          <AvatarFallback className={`${getBackgroundColor(name)} text-white text-xs font-medium`}>
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        {showPresence && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>
      {showName && (
        <span className="text-sm text-gray-700 font-medium" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
          {name}
        </span>
      )}
      {showDropdown && (
        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </div>
  );
};

export default UserAvatar;
