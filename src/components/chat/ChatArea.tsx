'use client';

import React, { useRef, useEffect } from 'react';
import { Menu, Zap, Sparkles, MessageCircle } from 'lucide-react';
import { useChatStore } from '@/lib/store';
import { MessageBubble } from './MessageBubble';
import { AgentType } from '@/types/chat';
import { cn } from '@/lib/utils';

const AGENTS: Record<AgentType, { name: string; emoji: string; desc: string }> = {
    general: { name: "Assistant Québec AI", emoji: "⚜️", desc: "Assistant général fier d'être Québécois" },
    immigration: { name: "Expert Immigration", emoji: "🏛️", desc: "Conseiller spécialisé PEQ & CSQ" },
    fiscalite: { name: "Fiscaliste Québec", emoji: "💰", desc: "Expert Revenu Québec & Fiscalité locale" },
    cegep: { name: "Prof de Cégep", emoji: "📚", desc: "Pédagogie et aide à la réussite collégiale" },
    randonnee: { name: "Guide SEPAQ", emoji: "🌲", desc: "Expert plein air et sentiers du Québec" },
};

export const ChatArea = () => {
    const {
        conversations,
        activeConvId,
        activeAgent,
        sidebarOpen,
        toggleSidebar,
        updateMessage
    } = useChatStore();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const activeConv = React.useMemo(() => conversations.find(c => c.id === activeConvId), [conversations, activeConvId]);
    const messages = React.useMemo(() => activeConv?.messages || [], [activeConv]);
    const currentAgent = AGENTS[activeAgent];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFeedback = (messageId: string, type: 'up' | 'down') => {
        if (activeConvId) {
            updateMessage(activeConvId, messageId, { feedback: type });
        }
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden">
            {/* Minimal Header */}
            <header className="h-[64px] border-b border-border px-6 flex items-center gap-4 bg-surface-2 z-20 shrink-0">
                {!sidebarOpen && (
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 text-text-dim hover:text-text hover:bg-surface-3 rounded-xl transition-all"
                    >
                        <Menu size={20} />
                    </button>
                )}

                <div className="flex items-center gap-2">
                    <span className="text-xl shrink-0">{currentAgent.emoji}</span>
                    <h2 className="text-[14px] font-bold text-text tracking-tight uppercase">
                        {currentAgent.name}
                    </h2>
                </div>

                <div className="ml-auto flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 text-[10px] text-text-dim font-bold tracking-widest uppercase bg-surface-3 px-3 py-1.5 rounded-full border border-border">
                        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                        <span>SOUVERAIN-1-PRO</span>
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto pt-4 pb-12 scrollbar-thin">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 max-w-[800px] mx-auto text-center animate-in fade-in duration-700">
                        <div className="w-16 h-16 bg-qblue rounded-2xl flex items-center justify-center shadow-xl mb-8 group transition-transform hover:scale-105">
                            <span className="text-3xl">⚜️</span>
                        </div>

                        <h1 className="font-sans text-3xl font-black text-white mb-4 tracking-tight leading-tight uppercase underline decoration-qblue decoration-4 underline-offset-8 decoration-dotted">
                            Bonjour! Comment puis-je vous aider aujourd&apos;hui?
                        </h1>

                        <p className="text-text-dim text-[16px] max-w-[480px] mb-12 font-medium">
                            {currentAgent.desc}. Posez-moi vos questions sur le Québec, sa culture ou ses services publics.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full px-4">
                            {[
                                "C'est quoi le processus de CSQ?",
                                "Explique-moi le CÉLIAPP en détail",
                                "Meilleurs sentiers SEPAQ en hiver",
                                "Comment fonctionne le R-Score?",
                            ].map((s, i) => (
                                <button
                                    key={i}
                                    className="p-5 text-left text-[14px] text-text-dim font-bold bg-surface-2 border border-border rounded-xl hover:bg-surface-3 hover:border-qblue/40 hover:text-text-bright transition-all group shadow-sm flex items-center justify-between"
                                >
                                    <span>{s}</span>
                                    <Sparkles size={16} className="text-qblue opacity-40 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-[850px] mx-auto px-4 sm:px-6 space-y-8 pb-12">
                        {messages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                agentName={currentAgent.name}
                                onFeedback={(type) => handleFeedback(msg.id, type)}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
        </div>
    );
};
