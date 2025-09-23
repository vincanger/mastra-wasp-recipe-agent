import { useState, useEffect, memo } from 'react';
import { ImageOff } from 'lucide-react';

interface RecipeThumbnailProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export const RecipeThumbnail = memo(function RecipeThumbnail({ src, alt, className = '', fallbackClassName = '' }: RecipeThumbnailProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${fallbackClassName}`}>
        <ImageOff className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-300`}
        onError={() => {
          setImageError(true);
        }}
      />
    </div>
  );
});
