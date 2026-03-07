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
            {/* Minimal Centered Header */}
            <header className="h-[64px] border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl z-20 sticky top-0 w-full flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <span className="text-xl shrink-0">{currentAgent.emoji}</span>
                    <h2 className="text-[13px] font-black text-white tracking-[0.25em] uppercase text-center">
                        {currentAgent.name}
                    </h2>
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto pt-6 pb-12 scrollbar-thin">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 max-w-[800px] mx-auto text-center animate-in fade-in duration-700">
                        <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center border border-white/5 mb-8 shadow-2xl transition-transform hover:scale-110">
                            <span className="text-3xl text-white">⚜️</span>
                        </div>

                        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight uppercase">
                            Comment puis-je vous aider?
                        </h1>

                        <p className="text-white/40 text-[15px] max-w-[500px] mb-12 font-medium">
                            {currentAgent.desc}. Posez-moi vos questions.
                        </p>

                        <div className="flex flex-col gap-3 w-full max-w-[400px] px-4 self-center">
                            {[
                                "Processus de CSQ?",
                                "Explique-moi le CÉLIAPP",
                                "Meilleurs sentiers SEPAQ",
                                "Le R-Score?",
                            ].map((s, i) => (
                                <button
                                    key={i}
                                    className="w-full p-4.5 text-center text-[13px] text-white/50 font-bold bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:text-white transition-all group flex items-center justify-center gap-2"
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
