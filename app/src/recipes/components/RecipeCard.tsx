import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import type { ElaboratedRecipe } from 'wasp/entities';
import { CheckCircle2, XCircle, Heart } from 'lucide-react';
import { toggleFavoriteRecipe } from 'wasp/client/operations';
import { useState } from 'react';

interface RecipeCardProps {
  recipe: ElaboratedRecipe;
  isSelected?: boolean;
  onClick: () => void;
  onRecipeUpdated?: (updatedRecipe: ElaboratedRecipe) => void;
}

export function RecipeCard({ recipe, isSelected, onClick, onRecipeUpdated }: RecipeCardProps) {
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Cast JSON fields to arrays since they're stored as JSON in the database
  const ingredients = recipe.ingredients as string[];
  const instructions = recipe.instructions as string[];
  const ingredientCount = ingredients.length;
  const instructionCount = instructions.length;

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking heart

    setIsTogglingFavorite(true);
    try {
      const result = await toggleFavoriteRecipe({
        recipeId: recipe.id,
      });

      onRecipeUpdated?.(result);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <Card
      className={`
        cursor-pointer transition-all duration-200 hover:shadow-md mb-3
        ${isSelected ? 'border-primary shadow-md bg-accent/5' : 'hover:border-gray-300'}
      `}
      onClick={onClick}
    >
      <CardContent className='p-4'>
        <div className='flex items-start justify-between gap-2'>
          <h3 className='font-semibold text-sm line-clamp-2 flex-1'>{recipe.title}</h3>
        </div>

        <div className='flex gap-2 mt-3'>
          <Badge className='text-xs'>{ingredientCount} ingredients</Badge>
          <Badge variant='secondary' className='text-xs'>
            {instructionCount} steps
          </Badge>
        </div>

        <div className='flex items-center justify-between gap-2 mt-2'>
          <p className='text-xs text-muted-foreground'>Created {recipe.dateCreated}</p>
          <button
            onClick={handleToggleFavorite}
            disabled={isTogglingFavorite}
            className='p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50'
            aria-label={recipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 transition-colors ${recipe.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
