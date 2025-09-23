import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import type { ElaboratedRecipe } from 'wasp/entities';
import { toggleFavoriteRecipe } from 'wasp/client/operations';
import { Clock, Users, ChefHat, Calendar, Heart, Loader2, Expand } from 'lucide-react';
import { useState } from 'react';
import { RecipeThumbnail } from './RecipeThumbnail';

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
      {/* Scrollable Content */}
      <div className='flex-1 overflow-hidden'>
        <ScrollArea className='h-full'>
          {/* Hero Header Section */}
          <div className='relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'>
            {recipe.thumbnailUrl && (
              <>
                {/* Background Image */}
                <div className='absolute inset-0'>
                  <RecipeThumbnail
                    src={recipe.thumbnailUrl}
                    alt={`${recipe.title} background`}
                    className='w-full h-full object-cover'
                    fallbackClassName='w-full h-full bg-gray-200'
                  />
                  {/* Overlay for better text readability */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20 pointer-events-none' />
                </div>
                
                {/* Expand Button Overlay */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className='absolute top-4 right-4 z-20 bg-black/30 hover:bg-black/60 text-white border border-white/30 backdrop-blur-sm transition-all duration-200 pointer-events-auto'
                      style={{ zIndex: 20 }}
                    >
                      <Expand className='h-4 w-4' />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='max-w-4xl w-full p-0 overflow-hidden'>
                    <DialogHeader className='p-6 pb-0'>
                      <DialogTitle className='text-xl font-bold'>{recipe.title}</DialogTitle>
                    </DialogHeader>
                    <div className='flex justify-center p-6 pt-2'>
                      <RecipeThumbnail
                        src={recipe.thumbnailUrl}
                        alt={`${recipe.title} full size`}
                        className='max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg'
                        fallbackClassName='w-96 h-96 rounded-lg'
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
            
            {/* Hero Content */}
            <div className='relative z-10 p-6 min-h-[280px] flex flex-col justify-end'>
              <div className='bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border'>
                {/* Title and Favorite Button */}
                <div className='flex items-start justify-between mb-4'>
                  <h1 className='text-3xl font-bold text-gray-900 dark:text-white leading-tight flex-1 mr-4'>
                    {recipe.title}
                  </h1>
                  <Button 
                    variant={recipe.isFavorite ? 'default' : 'outline'} 
                    onClick={handleToggleFavorite} 
                    disabled={isTogglingFavorite} 
                    className='flex items-center gap-2 shrink-0'
                  >
                    {isTogglingFavorite ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Heart className={`h-4 w-4 ${recipe.isFavorite ? 'fill-current' : ''}`} />
                    )}
                    {recipe.isFavorite ? 'Favorited' : 'Favorite'}
                  </Button>
                </div>
                
                {/* Recipe Stats */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                  <div className='flex items-center gap-2 text-gray-600 dark:text-gray-300'>
                    <Calendar className='w-4 h-4 text-primary' />
                    <span>Created {recipe.dateCreated}</span>
                  </div>
                  <div className='flex items-center gap-2 text-gray-600 dark:text-gray-300'>
                    <Users className='w-4 h-4 text-primary' />
                    <span>4 servings</span>
                  </div>
                  <div className='flex items-center gap-2 text-gray-600 dark:text-gray-300'>
                    <Clock className='w-4 h-4 text-primary' />
                    <span>30 min prep</span>
                  </div>
                  <div className='flex items-center gap-2 text-gray-600 dark:text-gray-300'>
                    <ChefHat className='w-4 h-4 text-primary' />
                    <span>45 min cook</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className='p-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Ingredients Column */}
              <Card>
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

              {/* Instructions Column */}
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
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
