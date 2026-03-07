'use client';

import React, { useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChatStore } from '@/lib/store';
import { Message } from '@/types/chat';

export default function Home() {
  const {
    activeConvId,
    conversations,
    addConversation,
    addMessage,
    updateMessage,
    setIsStreaming,
    activeAgent
  } = useChatStore();

  // Initialize first conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      const id = Math.random().toString(36).substr(2, 9);
      addConversation({
        id,
        title: "Nouvelle conversation",
        messages: [],
        agent: 'general',
        createdAt: new Date(),
      });
    }
  }, [conversations.length, addConversation]);

  const handleSend = useCallback(async (text: string) => {
    if (!activeConvId) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' }),
    };

    addMessage(activeConvId, userMsg);

    // Create assistant message placeholder
    const assistantId = Math.random().toString(36).substr(2, 9);
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      time: new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' }),
      streaming: true,
    };

    addMessage(activeConvId, assistantMsg);
    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...(conversations.find(c => c.id === activeConvId)?.messages || []), userMsg],
          agent: activeAgent
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                fullContent += data.text;
                updateMessage(activeConvId, assistantId, { content: fullContent });
              } catch (e) {
                console.error('Error parsing SSE data', e);
              }
            }
          }
        }
      }

      updateMessage(activeConvId, assistantId, { content: fullContent, streaming: false });
    } catch (error) {
      console.error('Streaming error:', error);
      updateMessage(activeConvId, assistantId, {
        content: "Désolé, une erreur s'est produite lors de la génération de la réponse. Vérifie ta connexion.",
        streaming: false
      });
    } finally {
      setIsStreaming(false);
    }
  }, [activeConvId, addMessage, updateMessage, setIsStreaming, conversations, activeAgent]);

  const handleStop = useCallback(() => {
    setIsStreaming(false);
    // In a real app, abort the fetch request
  }, [setIsStreaming]);

  return (
    <main className="flex h-screen bg-bg overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <ChatArea />
        <ChatInput onSend={handleSend} onStop={handleStop} />
      </div>
    </main>
  );
}
