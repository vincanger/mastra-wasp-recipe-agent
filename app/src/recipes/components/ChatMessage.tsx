import { Avatar } from "../../components/ui/avatar";
import { cn } from "../../lib/utils";
import type { RecipeMessage } from "../RecipeChatPage";

interface ChatMessageProps {
  message: RecipeMessage;
  userName?: string;
}

export function ChatMessage({ message, userName = "You" }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div 
      className={cn(
        "flex gap-3 mb-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="flex-shrink-0 h-8 w-8">
        <div className={cn(
          "w-full h-full flex items-center justify-center text-xs font-medium",
          isUser ? "bg-primary/70 text-primary-foreground" : "bg-secondary/70 text-secondary-foreground"
        )}>
          {isUser ? userName.charAt(0).toUpperCase() : "AI"}
        </div>
      </Avatar>
      
      <div 
        className={cn(
          "flex-1 px-4 py-2 rounded-lg max-w-[80%]",
          isUser 
            ? "bg-primary/70 text-primary-foreground ml-auto" 
            : "bg-secondary/70 text-secondary-foreground"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
