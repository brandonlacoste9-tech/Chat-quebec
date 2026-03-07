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
        <div className="flex-1 flex flex-col w-full bg-[#0a0a0a]">
            {/* Perfectly Centered Minimal Header */}
            <header className="h-[64px] border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl z-20 sticky top-0 w-full flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <span className="text-xl shrink-0">{currentAgent.emoji}</span>
                    <h2 className="text-[13px] font-bold text-white tracking-[0.3em] uppercase text-center">
                        {currentAgent.name}
                    </h2>
                </div>
            </header>

            {/* Scroll Area with Centering Constraint */}
            <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col items-center pt-20 pb-20">
                <div className="w-full max-w-[800px] px-6">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-1000">
                            <div className="w-20 h-20 bg-[#1a1a1a] rounded-[24px] flex items-center justify-center border border-white/5 mb-10 shadow-2xl transition-transform hover:rotate-6">
                                <span className="text-4xl">⚜️</span>
                            </div>

                            <h1 className="text-5xl font-black text-white mb-6 tracking-tighter uppercase leading-[1.1]">
                                Comment puis-je vous aider?
                            </h1>

                            <p className="text-white/30 text-[17px] max-w-[500px] mb-14 font-medium leading-relaxed leading-normal">
                                {currentAgent.desc}. Posez-moi vos questions sur le Québec.
                            </p>

                            <div className="flex flex-col gap-4 w-full max-w-[420px]">
                                {[
                                    "C'est quoi le processus de CSQ?",
                                    "Explique-moi le CÉLIAPP en détail",
                                    "Meilleurs sentiers SEPAQ en hiver",
                                    "Comment fonctionne le R-Score?",
                                ].map((s, i) => (
                                    <button
                                        key={i}
                                        className="w-full p-5 text-center text-[14px] text-white/40 font-bold bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/10 hover:text-white transition-all group flex items-center justify-center gap-3"
                                    >
                                        <span>{s}</span>
                                        <Sparkles size={16} className="text-qblue opacity-40 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-12 pb-12 w-full">
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
        </div>
    );
};
