export enum ToolId {
  RunGenerateCompleteRecipes = 'runGenerateCompleteRecipes',
  GetUserRecipes = 'getUserRecipes',
  GenerateRecipeThumbnail = 'generateRecipeThumbnail',
}

// Global state to store current user ID for tool execution
let currentUserId: string | null = null;

export const setUserIdForToolUse = (userId: string) => {
  currentUserId = userId;
};

export const getCurrentUserId = () => {
  if (!currentUserId) {
    throw new Error("User ID not available - make sure setCurrentUserId was called");
  }
  return currentUserId;
};
