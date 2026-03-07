'use client';

import React, { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useChatStore } from '@/lib/store';
import { MessageBubble } from './MessageBubble';
import { AgentType } from '@/types/chat';

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
        <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a] relative">
            {/* Header Area */}
            <header className="h-[60px] border-b border-white/5 px-6 flex items-center justify-between bg-[#0a0a0a]/80 backdrop-blur-xl z-20 sticky top-0">
                <div className="flex items-center gap-4 min-w-0">

                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <span className="text-xl shrink-0">{currentAgent.emoji}</span>
                        <h2 className="text-sm font-bold text-white truncate uppercase tracking-widest leading-none">
                            {currentAgent.name}
                        </h2>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] text-white/20 font-bold uppercase tracking-widest border border-white/5 px-3 py-1.5 rounded-full shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-qblue-bright animate-pulse" />
                        Souverain-1-Pro
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto pt-6 pb-12 scrollbar-thin">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 max-w-[800px] mx-auto text-center animate-in fade-in duration-500">
                        <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center border border-white/5 mb-8 shadow-2xl">
                            <span className="text-3xl text-white">⚜️</span>
                        </div>

                        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                            Bonjour! Comment puis-je vous aider?
                        </h1>

                        <p className="text-white/40 text-[16px] max-w-[480px] mb-12 font-medium">
                            {currentAgent.desc}. Posez-moi vos questions sur le Québec ou ses services publics.
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
                                    className="p-4 text-left text-[14px] text-white/60 font-medium bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:text-white transition-all group shadow-sm flex items-center justify-between"
                                >
                                    <span>{s}</span>
                                    <Sparkles size={14} className="text-qblue opacity-40 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-[800px] mx-auto px-4 sm:px-6 space-y-10 pb-8 mt-4">
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
