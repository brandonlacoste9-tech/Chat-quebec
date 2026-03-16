'use client';

import React, { useRef, useEffect } from 'react';
import { useChatStore } from '@/lib/store';
import { MessageBubble } from './MessageBubble';

export const ChatArea = () => {
    const {
        conversations,
        activeConvId,
        updateMessage
    } = useChatStore();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const activeConv = React.useMemo(() => conversations.find(c => c.id === activeConvId), [conversations, activeConvId]);
    const messages = React.useMemo(() => activeConv?.messages || [], [activeConv]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFeedback = (messageId: string, type: 'up' | 'down') => {
        if (activeConvId) {
            updateMessage(activeConvId, messageId, { feedback: type });
        }
    };

    return (
        <div className="w-full max-w-[700px] mx-auto p-[36px_21px_100px] relative">
            <div className="space-y-0 w-full">
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                    />
                ))}
                <div ref={messagesEndRef} className="h-[20px]" />
            </div>
        </div>
    );
};
