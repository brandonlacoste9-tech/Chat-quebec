import { create } from "zustand";
import { Message, Conversation, AgentType } from "@/types/chat";

const buildConversationTitle = (content: string): string => {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (!normalized) return "Nouvelle discussion";
  return normalized.length > 48 ? `${normalized.slice(0, 48)}...` : normalized;
};

interface ChatStore {
  conversations: Conversation[];
  activeConvId: string | null;
  activeAgent: AgentType;
  isStreaming: boolean;
  sidebarOpen: boolean;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setActiveConvId: (id: string | null) => void;
  setActiveAgent: (agent: AgentType) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  toggleSidebar: () => void;
  setConversationTitle: (id: string, title: string) => void;

  addConversation: (conv: Conversation) => void;
  deleteConversation: (id: string) => void;
  addMessage: (convId: string, message: Message) => void;
  updateMessage: (
    convId: string,
    messageId: string,
    updates: Partial<Message>,
  ) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  activeConvId: null,
  activeAgent: "general",
  isStreaming: false,
  sidebarOpen: true,

  setConversations: (conversations) => set({ conversations }),
  setActiveConvId: (activeConvId) => set({ activeConvId }),
  setActiveAgent: (activeAgent) => set({ activeAgent }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setConversationTitle: (id, title) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === id
          ? { ...conversation, title, updatedAt: new Date() }
          : conversation,
      ),
    })),

  addConversation: (conv) =>
    set((state) => ({
      conversations: [conv, ...state.conversations],
      activeConvId: conv.id,
    })),

  deleteConversation: (id) =>
    set((state) => {
      const newConversations = state.conversations.filter((c) => c.id !== id);
      let nextActiveId = state.activeConvId;
      if (state.activeConvId === id) {
        nextActiveId =
          newConversations.length > 0 ? newConversations[0].id : null;
      }
      return { conversations: newConversations, activeConvId: nextActiveId };
    }),

  addMessage: (convId, message) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === convId
          ? {
              ...c,
              title:
                message.role === "user" && c.messages.length === 0
                  ? buildConversationTitle(message.content)
                  : c.title,
              messages: [...c.messages, message],
              updatedAt: new Date(),
            }
          : c,
      ),
    })),

  updateMessage: (convId, messageId, updates) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === convId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, ...updates } : m,
              ),
            }
          : c,
      ),
    })),
}));
