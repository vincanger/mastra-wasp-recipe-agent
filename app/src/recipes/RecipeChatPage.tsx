import type { AuthUser } from 'wasp/auth';
import type { Recipe } from 'wasp/entities';
import type { FinishReason } from './streaming/useTextStream';
import type { ToolCallStatus } from './streaming/chatStreaming';

import { useState, useRef, useEffect, useCallback } from 'react';
import { getUserRecipes, useQuery } from 'wasp/client/operations';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Sheet, SheetContent } from '../components/ui/sheet';
import { RecipeCard } from './components/RecipeCard';
import { ChatMessage } from './components/ChatMessage';
import { RecipeDetailView } from './components/RecipeDetailView';

import { Send, Menu, GripVertical, ChevronUp, ChevronDown, MessageCircle } from 'lucide-react';
import { useTextStream } from './streaming/useTextStream';
import { v4 as uuidv4 } from 'uuid';

export type RecipeMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolCallStatus?: ToolCallStatus;
  recipeIds?: string[];
  finishReason?: FinishReason;
};

export function RecipeChatPage({ user }: { user: AuthUser }) {
  const [messages, setMessages] = useState<RecipeMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [displayRecipeIds, setDisplayRecipeIds] = useState<string[]>([]);
  const [chatHeight, setChatHeight] = useState(33); // Percentage of total height for chat section
  const [isDragging, setIsDragging] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);

  // Use Wasp's useQuery to fetch user recipes, filtered by displayRecipeIds when available
  const { data: recipes = [], isLoading: isRecipesLoading, refetch: refetchRecipes } = useQuery(getUserRecipes, {
    savedOnly: false,
    favoritesOnly: false,
    recipeIds: displayRecipeIds,
  });

  const { response, sendMessage } = useTextStream({ path: '/api/recipes/stream-chat', metadata: { threadId: 'recipe-session-1' }, setIsLoading });

  useEffect(() => {
    if (response.content.trim().length > 0) {
      setMessages((prevMessages) => {
        const currentMessage = prevMessages.find((message) => message.id === response.id);
        if (currentMessage) {
          return prevMessages.map((message) => (message.id === response.id ? response : message));
        }
        return [...prevMessages, { id: response.id, role: 'assistant', content: response.content }];
      });
    }
    if (response.finishReason === 'stop') {
      setDisplayRecipeIds(response.recipeIds || []);
      refetchRecipes();
    }
  }, [response]);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatScrollRef.current) {
      const viewport = chatScrollRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [messages]);

  // Auto-select first recipe when recipes are (re)loaded
  useEffect(() => {
    if (recipes.length > 0) {
      setSelectedRecipe(recipes[0]);
    }
  }, [recipes]);

  const handleRecipeClick = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsMobileSidebarOpen(false);
  }, []);

  const handleRecipeUpdated = useCallback(
    async (updatedRecipe: Recipe) => {
      if (selectedRecipe?.id === updatedRecipe.id) {
        setSelectedRecipe(updatedRecipe);
      }
    },
    [selectedRecipe?.id]
  );

  // Toggle chat collapsed state
  const toggleChatCollapsed = useCallback(() => {
    setIsChatCollapsed((prev) => !prev);
  }, []);

  // Handle dragging for resizable divider
  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const container = document.querySelector('.main-content-container');
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const percentage = Math.min(Math.max((relativeY / rect.height) * 100, 20), 80); // Clamp between 20% and 80%

      setChatHeight(percentage);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();

    // Add user message to UI
    setMessages((prevMessages) => [...prevMessages, { id: uuidv4(), role: 'user', content: userMessage }]);

    setInput('');
    setIsLoading(true);

    sendMessage({ message: userMessage });

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const Sidebar = () => (
    <div className='flex flex-col h-full'>
      {displayRecipeIds.length > 0 && (
        <div className='p-4 mt-2 border-b'>
          <p className='text-sm text-muted-foreground'>
            Showing {displayRecipeIds.length} filtered recipe{displayRecipeIds.length !== 1 ? 's' : ''}
          </p>
          <Button variant='outline' size='sm' onClick={() => setDisplayRecipeIds([])} className='mt-2 text-xs'>
            Show All Recipes
          </Button>
        </div>
      )}

      <ScrollArea className='flex-1'>
        <div className='p-4'>
          {recipes.length === 0 ? (
            <p className='text-sm text-muted-foreground text-center py-8'>No recipes generated yet. Start chatting to create some!</p>
          ) : (
            recipes.map((recipe) => <RecipeCard key={`${recipe.id}`} recipe={recipe} isSelected={selectedRecipe?.id === recipe.id} onClick={() => handleRecipeClick(recipe)} onRecipeUpdated={handleRecipeUpdated} />)
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className='flex h-[calc(100dvh-5rem)] bg-background'>
      {/* Desktop Sidebar */}
      <div className='hidden md:block w-80 border-r bg-card'>
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side='left' className='w-80 p-0'>
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col main-content-container'>
        {/* Mobile Header */}
        <div className='md:hidden flex items-center gap-2 p-4 border-b'>
          <Button variant='ghost' size='icon' onClick={() => setIsMobileSidebarOpen(true)}>
            <Menu className='h-5 w-5' />
          </Button>
          <h2 className='font-semibold text-lg'>Recipe Assistant</h2>
        </div>

        {/* Chat Section */}
        {!isChatCollapsed && (
          <div className='flex flex-col min-h-0 relative bg-gray-100 dark:bg-gray-900' style={{ height: `${chatHeight}%` }}>
            <ScrollArea className='flex-1' ref={chatScrollRef}>
              <div className='p-4 space-y-2 pb-20'>
                {messages.length === 0 ? (
                  <div className='text-center py-12'>
                    <p className='text-muted-foreground mb-2'>Welcome to your Recipe Assistant!</p>
                    <p className='text-sm text-muted-foreground'>Ask me about recipes, ingredients, or cooking techniques.</p>
                  </div>
                ) : (
                  messages.map((message, index) => <ChatMessage key={index} message={message} userName={user.identities.email?.id || 'You'} />)
                )}
                {isLoading && (
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <div className='animate-pulse'>●</div>
                    <div className='animate-pulse animation-delay-200'>●</div>
                    <div className='animate-pulse animation-delay-400'>●</div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Floating Input Box */}
            <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4'>
              <div className='bg-background/95 backdrop-blur-sm border rounded-full shadow-lg p-2'>
                <div className='flex gap-2 items-center'>
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder='Ask about recipes, ingredients, or cooking...'
                    disabled={isLoading}
                    className='flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0'
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size='icon' className='rounded-full h-8 w-8 shrink-0'>
                    <Send className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resizable Divider (only when chat is not collapsed) */}
        {!isChatCollapsed && (
          <div className={`h-1 bg-border hover:bg-primary/50 cursor-row-resize flex items-center justify-center group transition-colors ${isDragging ? 'bg-primary/70' : ''}`} onMouseDown={handleMouseDown}>
            <div className='bg-muted-foreground/30 group-hover:bg-primary/70 h-0.5 w-8 rounded-full transition-colors'>
              <GripVertical className='h-3 w-3 text-muted-foreground/50 group-hover:text-primary/70 mx-auto -mt-1 transition-colors' />
            </div>
          </div>
        )}

        {/* Recipe Detail Section */}
        <div className='min-h-0 flex-1 relative' style={{ height: isChatCollapsed ? '100%' : `${100 - chatHeight}%` }}>
          {selectedRecipe ? (
            <RecipeDetailView
              recipe={selectedRecipe}
              onViewFullRecipe={() => {
                // TODO: Implement full recipe view
                console.log('View full recipe:', selectedRecipe.title);
              }}
              onViewCalendar={() => {
                // TODO: Implement calendar view
                console.log('View calendar');
              }}
              onRecipeUpdated={async (updatedRecipe) => {
                // Update the selected recipe with the new data
                setSelectedRecipe(updatedRecipe);
              }}
            />
          ) : (
            <div className='flex items-center justify-center h-full text-muted-foreground'>
              <p>Select a recipe from the sidebar to view details</p>
            </div>
          )}

          {/* Floating Toggle Button */}
          {selectedRecipe && (
            <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20'>
              <Button
                onClick={toggleChatCollapsed}
                variant='default'
                size='sm'
                className='bg-primary/95 hover:bg-primary text-primary-foreground border shadow-lg hover:shadow-xl transition-all duration-200 rounded-full px-4 py-2'
              >
                {isChatCollapsed ? (
                  <>
                    <MessageCircle className='h-4 w-4 mr-2' />
                    <span className='text-sm font-medium'>Show Chat</span>
                    <ChevronDown className='h-4 w-4 ml-2' />
                  </>
                ) : (
                  <>
                    <MessageCircle className='h-4 w-4 mr-2' />
                    <span className='text-sm font-medium'>Hide Chat</span>
                    <ChevronUp className='h-4 w-4 ml-2' />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
