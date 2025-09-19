import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';
import type { ElaboratedRecipe } from 'wasp/entities';
import { toggleFavoriteRecipe } from 'wasp/client/operations';
import { Clock, Users, ChefHat, Calendar, Heart, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface RecipeDetailViewProps {
  recipe: ElaboratedRecipe;
  onViewFullRecipe?: () => void;
  onViewCalendar?: () => void;
  onRecipeUpdated?: (updatedRecipe: ElaboratedRecipe) => void;
}

export function RecipeDetailView({ recipe, onViewFullRecipe, onViewCalendar, onRecipeUpdated }: RecipeDetailViewProps) {
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Cast JSON fields to arrays since they're stored as JSON in the database
  const recipeIngredients = recipe.ingredients as string[];
  const recipeInstructions = recipe.instructions as string[];

  const handleToggleFavorite = async () => {
    setIsTogglingFavorite(true);
    try {
      const result = await toggleFavoriteRecipe({
        recipeId: recipe.id,
      });

      onRecipeUpdated?.(result);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // You could add a toast notification here
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <div className='h-full flex flex-col'>
      <div className='flex-1 overflow-hidden'>
        <ScrollArea className='h-full'>
          <div className='p-6'>
            <div className='mb-6'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold mb-3'>{recipe.title}</h2>
                <div className='flex justify-center'>
                  <Button variant={recipe.isFavorite ? 'default' : 'outline'} onClick={handleToggleFavorite} disabled={isTogglingFavorite} className='flex items-center gap-2'>
                    {isTogglingFavorite ? <Loader2 className='h-4 w-4 animate-spin' /> : <Heart className={`h-4 w-4 ${recipe.isFavorite ? 'fill-current' : ''}`} />}
                    {recipe.isFavorite ? 'Favorited' : 'Favorite'}
                  </Button>
                </div>
              </div>
              <div className='flex flex-wrap gap-4 text-sm text-muted-foreground mb-4'>
                <div className='flex items-center gap-1'>
                  <Calendar className='w-4 h-4' />
                  <span>Created {recipe.dateCreated}</span>
                </div>
                {/* These fields would come from the enhanced recipe data in the future */}
                <div className='flex items-center gap-1'>
                  <Users className='w-4 h-4' />
                  <span>4 servings</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Clock className='w-4 h-4' />
                  <span>30 min prep</span>
                </div>
                <div className='flex items-center gap-1'>
                  <ChefHat className='w-4 h-4' />
                  <span>45 min cook</span>
                </div>
              </div>
            </div>

            <Card className='mb-6'>
              <CardHeader>
                <CardTitle className='text-lg'>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2'>
                  {recipeIngredients.map((ingredient, index) => (
                    <li key={index} className='flex items-start'>
                      <span className='text-primary mr-2'>•</span>
                      <span className='text-sm'>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className='space-y-4'>
                  {recipeInstructions.map((instruction, index) => (
                    <li key={index} className='flex'>
                      <span className='font-semibold text-primary mr-3 flex-shrink-0'>{index + 1}.</span>
                      <span className='text-sm'>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
