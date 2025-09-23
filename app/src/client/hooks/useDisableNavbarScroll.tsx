import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useDisableNavbarScroll = () => {
  const location = useLocation();

  return useMemo(() => {
    // Add paths where you want to disable the navbar scroll behavior
    const disableScrollPaths = [
      '/recipes', // RecipeChatPage route
    ];
    
    return disableScrollPaths.includes(location.pathname);
  }, [location]);
};
