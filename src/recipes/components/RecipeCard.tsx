import type { Recipe } from 'wasp/entities';

import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Heart } from 'lucide-react';
import { toggleFavoriteRecipe } from 'wasp/client/operations';
import { useState, useCallback, useMemo, memo } from 'react';
import { RecipeThumbnail } from './RecipeThumbnail';

interface RecipeCardProps {
  recipe: Recipe;
  isSelected?: boolean;
  onClick: () => void;
  onRecipeUpdated?: (updatedRecipe: Recipe) => void;
}

export const RecipeCard = memo(function RecipeCard({ recipe, isSelected, onClick, onRecipeUpdated }: RecipeCardProps) {
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Memoize expensive calculations
  const ingredientCount = useMemo(() => (recipe.ingredients as string[]).length, [recipe.ingredients]);
  const instructionCount = useMemo(() => (recipe.instructions as string[]).length, [recipe.instructions]);

  const handleToggleFavorite = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTogglingFavorite(true);
    try {
      const result = await toggleFavoriteRecipe({ recipeId: recipe.id });
      onRecipeUpdated?.(result);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  }, [recipe.id, onRecipeUpdated]);

  return (
    <Card
      className={`
        cursor-pointer transition-all duration-200 hover:shadow-lg mb-3 overflow-hidden relative
        ${isSelected ? 'border-primary shadow-md ring-2 ring-primary/20' : 'hover:border-gray-300'}
      `}
      onClick={onClick}
    >
      {/* Background Image */}
      {recipe.thumbnailUrl && (
        <div className='absolute inset-0 z-0'>
          <RecipeThumbnail src={recipe.thumbnailUrl} alt={`${recipe.title} background`} className='w-full h-full object-cover' fallbackClassName='w-full h-full bg-gray-100' />
          {/* Overlay for better text readability */}
          <div className='absolute inset-0 bg-white/35 backdrop-blur-[0.5px]' />
        </div>
      )}

      <CardContent className='p-4 relative z-10'>
        <div className='flex flex-col gap-3'>
          {/* Title with background for better readability */}
          <div className='flex items-start justify-between gap-2'>
            <h3 className='font-semibold text-sm line-clamp-2 flex-0 bg-white/90 dark:bg-gray-900/95 backdrop-blur-sm px-2 py-1 rounded shadow-sm border'>{recipe.title}</h3>
          </div>

          {/* Badges with enhanced background */}
          <div className='flex gap-2'>
            <Badge className='text-xs bg-primary/90 backdrop-blur-sm shadow-sm'>{ingredientCount} ingredients</Badge>
            <Badge className='text-xs bg-primary/90 backdrop-blur-sm shadow-sm'>{instructionCount} steps</Badge>
          </div>

          {/* Bottom row with enhanced backgrounds */}
          <div className='flex items-center justify-end gap-2'>
            <button
              onClick={handleToggleFavorite}
              disabled={isTogglingFavorite}
              className='p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white/95 transition-colors disabled:opacity-50 shadow-sm'
              aria-label={recipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 transition-colors ${recipe.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
