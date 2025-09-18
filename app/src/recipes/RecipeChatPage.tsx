import type { AuthUser } from "wasp/auth";
import type { ElaboratedRecipe } from "wasp/entities";

import { useState, useRef, useEffect } from "react";
import { chatWithRecipeAgent, getUserRecipes, useQuery } from "wasp/client/operations";

import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { Sheet, SheetContent } from "../components/ui/sheet";

import { RecipeCard } from "./components/RecipeCard";
import { ChatMessage } from "./components/ChatMessage";
import { RecipeDetailView } from "./components/RecipeDetailView";

import { Send, Menu } from "lucide-react";

export type RecipeMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export function RecipeChatPage({ user }: { user: AuthUser }) {
  const [messages, setMessages] = useState<RecipeMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<ElaboratedRecipe | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [displayRecipeIds, setDisplayRecipeIds] = useState<string[] | undefined>(undefined);
  
  // Use Wasp's useQuery to fetch user recipes, filtered by displayRecipeIds when available
  const { data: recipes = [], isLoading: recipesLoading } = useQuery(getUserRecipes, {
    savedOnly: false,
    favoritesOnly: false,
    recipeIds: displayRecipeIds,
  });
  
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-select first recipe when recipes are loaded
  useEffect(() => {
    if (recipes.length > 0 && !selectedRecipe) {
      setSelectedRecipe(recipes[0]);
    }
  }, [recipes, selectedRecipe]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    
    // Add user message to UI
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userMessage },
    ]);
    
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatWithRecipeAgent({
        message: userMessage,
        resourceId: user.id,
        threadId: 'recipe-session-1', // Use consistent thread ID for this session
      });

      let content = response.text;

      if (response.recipesCreated && response.recipesCreated > 0) {
        // Clear display filter to show all recipes including newly created ones
        setDisplayRecipeIds(undefined);
      }
      
      // If displayRecipeIds were returned, update the filter
      if (response.displayRecipeIds && response.displayRecipeIds.length > 0) {
        setDisplayRecipeIds(response.displayRecipeIds);
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { 
          role: "assistant", 
          content: "I apologize, but I encountered an error processing your request. Please try again." 
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">
          {displayRecipeIds ? 'Filtered Recipes' : 'Recently Generated Recipes'}
        </h3>
        {displayRecipeIds && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">
              Showing {displayRecipeIds.length} filtered recipe{displayRecipeIds.length !== 1 ? 's' : ''}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDisplayRecipeIds(undefined)}
              className="mt-2 text-xs"
            >
              Show All Recipes
            </Button>
          </div>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {recipes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No recipes generated yet. Start chatting to create some!
            </p>
          ) : (
            recipes.map((recipe) => (
              <RecipeCard
                key={`${recipe.id}`}
                recipe={recipe}
                isSelected={selectedRecipe?.id === recipe.id}
                onClick={() => {
                  setSelectedRecipe(recipe);
                  setIsMobileSidebarOpen(false);
                }}
                onRecipeUpdated={async (updatedRecipe) => {
                  if (selectedRecipe?.id === updatedRecipe.id) {
                    setSelectedRecipe(updatedRecipe);
                  }
                }}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 border-r bg-card">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-2 p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="font-semibold text-lg">Recipe Assistant</h2>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col h-1/2">
          <div className="p-4 border-b bg-card/50">
            <h2 className="font-semibold text-lg hidden md:block">Recipe Assistant Chat</h2>
          </div>
          
          <ScrollArea className="flex-1" ref={chatScrollRef}>
            <div className="p-4 space-y-2">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-2">
                    Welcome to your Recipe Assistant!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ask me about recipes, ingredients, or cooking techniques.
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <ChatMessage 
                    key={index} 
                    message={message} 
                    userName={user.identities.email?.id || "You"}
                  />
                ))
              )}
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="animate-pulse">●</div>
                  <div className="animate-pulse animation-delay-200">●</div>
                  <div className="animate-pulse animation-delay-400">●</div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t bg-card/50">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                placeholder="Ask about recipes, ingredients, or cooking..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !input.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Recipe Detail Section */}
        <div className="flex-1 bg-card/30">
          {selectedRecipe ? (
            <RecipeDetailView 
              recipe={selectedRecipe}
              onViewFullRecipe={() => {
                // TODO: Implement full recipe view
                console.log("View full recipe:", selectedRecipe.title);
              }}
              onViewCalendar={() => {
                // TODO: Implement calendar view
                console.log("View calendar");
              }}
              onRecipeUpdated={async (updatedRecipe) => {
                // Update the selected recipe with the new data
                setSelectedRecipe(updatedRecipe);
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Select a recipe from the sidebar to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
