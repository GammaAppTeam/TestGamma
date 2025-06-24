
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ToolImageProps {
  toolUrl?: string;
  toolName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ToolImage = ({ toolUrl, toolName, size = "md", className = "" }: ToolImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  useEffect(() => {
    const extractToolImage = async () => {
      if (!toolUrl) {
        setLoading(false);
        return;
      }

      try {
        // Try to get the domain from the URL
        const url = new URL(toolUrl);
        const domain = url.hostname;
        
        // Try favicon first
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        
        // Test if the favicon loads
        const img = new Image();
        img.onload = () => {
          setImageUrl(faviconUrl);
          setLoading(false);
        };
        img.onerror = () => {
          // Fallback to a generic icon service
          const fallbackUrl = `https://api.faviconkit.com/${domain}/64`;
          const fallbackImg = new Image();
          fallbackImg.onload = () => {
            setImageUrl(fallbackUrl);
            setLoading(false);
          };
          fallbackImg.onerror = () => {
            setLoading(false);
          };
          fallbackImg.src = fallbackUrl;
        };
        img.src = faviconUrl;
      } catch (error) {
        console.error("Error extracting tool image:", error);
        setLoading(false);
      }
    };

    extractToolImage();
  }, [toolUrl]);

  const getToolIcon = (name: string) => {
    const firstLetter = name.charAt(0).toUpperCase();
    const colors = [
      'bg-indigo-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
      'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500',
      'bg-teal-500', 'bg-cyan-500'
    ];
    const colorIndex = name.charCodeAt(0) % colors.length;
    return { letter: firstLetter, bgColor: colors[colorIndex] };
  };

  const { letter, bgColor } = getToolIcon(toolName);

  if (loading) {
    return (
      <Avatar className={`${sizeClasses[size]} ${className}`}>
        <AvatarFallback className="bg-gray-200 animate-pulse">
          <div className="w-full h-full"></div>
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {imageUrl ? (
        <AvatarImage 
          src={imageUrl} 
          alt={`${toolName} icon`}
          className="object-cover"
        />
      ) : null}
      <AvatarFallback className={`${bgColor} text-white font-bold ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm'}`}>
        {letter}
      </AvatarFallback>
    </Avatar>
  );
};

export default ToolImage;
