import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import type { ElaboratedRecipe } from "wasp/entities";
import { CheckCircle2, XCircle } from "lucide-react";

interface RecipeCardProps {
  recipe: ElaboratedRecipe;
  isSelected?: boolean;
  onClick: () => void;
  hasAcceptedRecipe?: boolean;
  hasRejectedRecipe?: boolean;
}

export function RecipeCard({ 
  recipe, 
  isSelected, 
  onClick, 
  hasAcceptedRecipe, 
  hasRejectedRecipe 
}: RecipeCardProps) {
  // Cast JSON fields to arrays since they're stored as JSON in the database
  const ingredients = recipe.ingredients as string[];
  const instructions = recipe.instructions as string[];
  const ingredientCount = ingredients.length;
  const instructionCount = instructions.length;

  return (
    <Card 
      className={`
        cursor-pointer transition-all duration-200 hover:shadow-md mb-3
        ${isSelected ? 'border-primary shadow-md bg-accent/5' : 'hover:border-gray-300'}
      `}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm line-clamp-2 flex-1">
            {recipe.title}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            {hasAcceptedRecipe && (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            )}
            {hasRejectedRecipe && (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Badge variant="secondary" className="text-xs">
            {ingredientCount} ingredients
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {instructionCount} steps
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          Created {recipe.dateCreated}
        </p>
      </CardContent>
    </Card>
  );
}
