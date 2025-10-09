export enum WorkflowId {
  GenerateCompleteRecipes = 'generateCompleteRecipes',
}

export enum WorkflowStepId {
  GenerateElaboratedRecipesStep = 'generateElaboratedRecipesStep',
  GenerateRecipeThumbnailsStep = 'generateRecipeThumbnailsStep',
  SaveRecipesToDatabaseStep = 'saveRecipesToDatabaseStep',
}

export const printWorkflowStepStatus = (stepId: WorkflowStepId) => {
  const record: Record<WorkflowStepId, string> = {
    [WorkflowStepId.GenerateElaboratedRecipesStep]: '📝 Generating recipe details...',
    [WorkflowStepId.GenerateRecipeThumbnailsStep]: '🎨 Generating recipe images...',
    [WorkflowStepId.SaveRecipesToDatabaseStep]: '💾 Saving recipes...',
  };
  return record[stepId];
}