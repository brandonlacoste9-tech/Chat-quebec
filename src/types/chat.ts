export type MessageRole = "user" | "assistant" | "system";

export type AgentType =
  | "general"
  | "immigration"
  | "fiscalite"
  | "cegep"
  | "randonnee";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  time: string;
  streaming?: boolean;
  feedback?: "up" | "down" | null;
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  agent: AgentType;
  createdAt: Date;
  updatedAt?: Date;
}

export type AIModel =
  | "claude-sonnet-4"
  | "gpt-4o"
  | "gemini-pro"
  | "mistral-local";

export interface UserProfile {
  id: string;
  displayName?: string;
  profession?: string;
  interests?: string[];
  localContext?: {
    city: string;
    favoriteTeam?: string;
  };
  accentPreference: "montreal" | "quebec" | "gaspesie";
}
